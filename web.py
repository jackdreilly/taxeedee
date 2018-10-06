from flask import Flask, request, jsonify, session, render_template, redirect, url_for
import os
import json
import sys
import admin_utils
from google.protobuf import json_format
sys.path.append('server')
from taxeedee_service import client as db_client

import time
import random


class Latency(object):

    def __init__(self, app):
        self.app = app

        if not self.is_enabled():
            return

        # a tuple range, or int, in seconds
        self.latency_pre = app.config.get('FAKE_LATENCY_BEFORE', None)
        self.latency_post = app.config.get('FAKE_LATENCY_AFTER', None)

        app.before_request(self.before_request)
        app.after_request(self.after_request)

    def is_enabled(self):
        # Only fake latency in debug mode. Adding latency on production is just
        # dumb!
        return self.app.debug

    def is_enabled_request(self):
        # Ability to enable/disable latency based on the request context
        # Override this to selectively enable latency based on request.url
        return True

    def before_request(self):
        if self.latency_pre and self.is_enabled_request():
            self.apply_latency(self.latency_pre)

    def after_request(self, response):
        if self.latency_post and self.is_enabled_request():
            self.apply_latency(self.latency_post)
        return response

    def apply_latency(self, amount):
        if isinstance(amount, tuple):
            amount = random.uniform(amount[0], amount[1])
        time.sleep(amount)


class Username(object):
    """docstring for Username"""

    def __init__(self, session):
        super(Username, self).__init__()
        self.session = session

    def update_name(self, name):
        self.session['name'] = name

    def has_name(self):
        return 'name' in self.session

    def name(self):
        return self.session['name']


class StarSession(object):
    """Limits stars to one per session per post"""

    def __init__(self, session):
        super(StarSession, self).__init__()
        self.session = session
        if 'stars' not in self.session:
            self.session['stars'] = json.dumps([])

    def already_starred(self, post_id):
        return post_id in set(json.loads(self.session['stars']))

    def star_post(self, post_id):
        posts = set(json.loads(self.session['stars']))
        posts.add(post_id)
        self.session['stars'] = json.dumps(list(posts))


def _to_json(proto):
    return json_format.MessageToJson(proto, including_default_value_fields=True)


def _client_addr():
    return os.environ.get('CLIENT_ADDR', 'localhost:50051')


def _static_folder():
    return os.environ.get('STATIC_FOLDER', 'html/dist/')
import os
os.environ["CLIENT_ADDR"] = _client_addr()
client = db_client.Client()
username = Username(session)
app = Flask(__name__, static_url_path='', static_folder=_static_folder())
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route('/')
@app.route('/about')
@app.route('/guestbook')
@app.route('/post/<id>')
def root(*args, **kwargs):
    return app.send_static_file('index.html')


@app.route('/myname', methods=['GET'])
def myname():
    if username.has_name():
        return jsonify({'name': username.name()})
    return jsonify({})


@app.route('/posts', methods=['GET'])
def posts():
    post_jsons = json.loads(_to_json(client.get_posts()))
    if 'id' in request.args:
        post_id = request.args['id']
        single_post = {'posts': []}
        for post in post_jsons['posts']:
            if post['id'] == post_id:
                single_post['posts'].append(post)
        post_jsons = single_post
    star_session = StarSession(session)
    for post in post_jsons['posts']:
        post['starred'] = star_session.already_starred(post['id'])
    return json.dumps(post_jsons)


@app.route('/comments', methods=['GET'])
def comments():
    return _to_json(client.get_comments())


@app.route('/clear_db', methods=['GET'])
def clear_db():
    admin_utils.clear_db(client)
    return redirect('/')


@app.route('/add_post')
def add_post():
    if 'path' in request.args:
        admin_utils.add_post(client=client, path=request.args.get('path'))
        return redirect('/')
    return render_template('add_post.html', paths=admin_utils.post_paths())


@app.route('/add_comment', methods=['POST'])
def add_comment():
    username.update_name(request.get_json()['name'])
    client.add_comment(
        name=request.get_json()['name'],
        comment=request.get_json()['comment'],
    )
    send_email('new guestbook comment', 'http://taxeedee.com/guestbook')
    return _to_json(client.get_comments())


@app.route('/add_post_comment', methods=['POST'])
def add_post_comment():
    username.update_name(request.get_json()['name'])
    client.add_post_comment(
        name=request.get_json()['name'],
        post_id=request.get_json()['post_id'],
        comment=request.get_json()['comment'],
    )
    post = client.get_post(post_id=request.get_json()['post_id'])
    send_email('new guestbook comment', 'http://taxeedee.com/post/%s' %
               request.get_json()['post_id'])
    return _to_json(post)


@app.route('/star_post', methods=['POST'])
def star_post():
    post_id = request.get_json()['post_id']
    star_session = StarSession(session)
    if not star_session.already_starred(post_id):
        star_session.star_post(post_id)
        client.star_post(post_id=post_id)
    post = client.get_post(post_id=request.get_json()['post_id'])
    return _to_json(post)


@app.route('/modify_content')
def _modify_content():
    print admin_utils.modify_content(client)
    return redirect('/')

from metrics.metrics import MetricsClient
metrics_client = MetricsClient()


@app.route('/api/metrics/v1/photo_clicked', methods=["POST"])
def photo_clicked():
    metrics_client.photo_clicked(
        request.get_json()['post_id'], request.get_json()['photo'])
    return 'ok'


@app.route('/api/metrics/v1/post_expanded', methods=["POST"])
def post_expanded():
    metrics_client.post_expanded(request.get_json()['post_id'])
    return 'ok'


@app.route('/api/metrics/v1/comments_expanded', methods=["POST"])
def comments_expanded():
    metrics_client.comments_expanded(request.get_json()['post_id'])
    return 'ok'


@app.route('/api/metrics/v1/post_clicked', methods=["POST"])
def post_clicked():
    metrics_client.post_clicked(request.get_json()['post_id'])
    return 'ok'


def _host():
    return '0.0.0.0'


def _port():
    return os.environ.get('PORT', 5000)

app.config.update(
    FAKE_LATENCY_BEFORE=0.03,
    FAKE_LATENCY_AFTER=(0.05, .06)
)

Latency(app)

from flask_mail import Mail, Message

app.config.update(
    DEBUG=True,
    # EMAIL SETTINGS
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_USERNAME='taxeedeetravels@gmail.com',
    MAIL_PASSWORD=os.environ['EMAIL_PASSWORD'],
)
mail = Mail(app)

from threading import Thread


def send_email(title, body):
    if 'DEV' in os.environ.get('TAXEEDEE_ENV', 'DEV'):
        return
    def helper(flask_app, title, body):
        with flask_app.app_context():
            msg = Message(
                title,
                sender='taxeedeetravels+alerts@gmail.com',
                recipients=['taxeedeetravels+alerts@gmail.com'])
            msg.body = body
            mail.send(msg)
    thr = Thread(target=helper, args=[app, title, body])
    thr.start()


if __name__ == "__main__":
    app.run(debug=False, host=_host(), port=_port())
