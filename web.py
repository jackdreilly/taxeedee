from flask import Flask, request, jsonify, session, render_template, redirect, url_for
import os
import json
import sys
import admin_utils
import time
import random

from comments.comments import CommentsClient
from comments.posts import Posts
from comments.metrics import MetricsClient

comments_client = CommentsClient()
metrics_client = MetricsClient()

def create_posts_client():
    jsoned_posts = admin_utils.json_posts()
    return Posts(jsoned_posts, comments_client)

posts_client = create_posts_client()

def get_posts_client():
    if os.environ.get('TAXEEDEE_ENV', 'DEV') == 'DEV':
        return create_posts_client()
    return posts_client

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


def _static_folder():
    return os.environ.get('STATIC_FOLDER', 'html/dist/')

import os

username = Username(session)
app = Flask(__name__, static_url_path='', static_folder=_static_folder())
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route('/')
@app.route('/about')
@app.route('/guestbook')
@app.route('/map')
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
    post_jsons = {'posts': get_posts_client().full_posts()}
    print type(post_jsons.items()[0][1])
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
    return jsonify({'comments': comments_client.guestbook_comments()})


@app.route('/add_comment', methods=['POST'])
def add_comment():
    username.update_name(request.get_json()['name'])
    comments_client.add_guestbook_comment(dict(
        name=request.get_json()['name'],
        comment=request.get_json()['comment'],
    ))
    send_email('new guestbook comment', 'http://taxeedee.com/guestbook')
    return jsonify({'comments':comments_client.guestbook_comments()})


@app.route('/add_post_comment', methods=['POST'])
def add_post_comment():
    username.update_name(request.get_json()['name'])
    post_id = request.get_json()['post_id']
    comments_client.add_comment(
        post_id,
        dict(
            name=request.get_json()['name'],
            comment=request.get_json()['comment'],
        ))
    post = get_posts_client().post(post_id)
    send_email('new comment', 'http://taxeedee.com/post/%s \n%s\n%s' %
               (post_id, request.get_json()[
                'name'], request.get_json()['comment']),
               post_id=post_id)
    return jsonify(post)


@app.route('/star_post', methods=['POST'])
def star_post():
    post_id = request.get_json()['post_id']
    star_session = StarSession(session)
    if not star_session.already_starred(post_id):
        star_session.star_post(post_id)
        comments_client.add_star(post_id)
    post = get_posts_client().post(post_id)
    send_email('new star', 'http://taxeedee.com/post/%s' %
               request.get_json()['post_id'],
               post_id=request.get_json()['post_id'])
    return jsonify(post)


@app.route('/api/metrics/v1/photo_clicked', methods=["POST"])
def photo_clicked():
    metrics_client.photo_clicked(
        request.get_json()['post_id'], request.get_json()['photo'])
    send_email('photo clicked', 'http://taxeedee.com/post/%s \n%s' %
               (request.get_json()['post_id'], request.get_json()['photo']),
               post_id=request.get_json()['post_id'])
    return 'ok'


@app.route('/api/metrics/v1/post_expanded', methods=["POST"])
def post_expanded():
    metrics_client.post_expanded(request.get_json()['post_id'])
    send_email('post expanded', 'http://taxeedee.com/post/%s' %
               request.get_json()['post_id'],
               post_id=request.get_json()['post_id'])
    return 'ok'


@app.route('/api/metrics/v1/comments_expanded', methods=["POST"])
def comments_expanded():
    metrics_client.comments_expanded(request.get_json()['post_id'])
    send_email('comment expanded', 'http://taxeedee.com/post/%s' %
               request.get_json()['post_id'],
               post_id=request.get_json()['post_id'])
    return 'ok'


@app.route('/api/metrics/v1/post_clicked', methods=["POST"])
def post_clicked():
    metrics_client.post_clicked(request.get_json()['post_id'])
    return 'ok'


@app.route('/metrics')
def metrics():
    return render_template(
        'metrics_report.html', 
        posts=metrics_client.post_metrics(get_posts_client().full_posts())
    )


import get_timeline


timeline_cache = {}


@app.route('/timeline.json')
def timeline_json():
    if 'timeline' not in timeline_cache:
        print 'building cache'
        timeline_cache['timeline'] = jsonify({
            'timeline': get_timeline.get_timeline(),
        })
        print timeline_cache
    else:
        print 'skipping cache'
        pass
    return timeline_cache['timeline']


def _host():
    return '0.0.0.0'


def _port():
    return os.environ.get('PORT', 5000)

from flask_mail import Mail, Message

email_password = None if os.environ.get(
    "TAXEEDEE_ENV", "DEV") == "DEV" else os.environ['EMAIL_PASSWORD']

app.config.update(
    DEBUG=True,
    # EMAIL SETTINGS
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_USERNAME='taxeedeetravels@gmail.com',
    MAIL_PASSWORD=email_password,
)
mail = Mail(app)

from threading import Thread


def send_email(title, body, post_id=None):
    if 'DEV' in os.environ.get('TAXEEDEE_ENV', 'DEV'):
        return

    def helper(flask_app, title, body, post_id):
        with flask_app.app_context():
            title = '%s %s' % (title, get_posts_client().post(
                post_id)['title']) if post_id else title
            msg = Message(
                title,
                sender='taxeedeetravels+alerts@gmail.com',
                recipients=['taxeedeetravels+alerts@gmail.com'])
            msg.body = body
            mail.send(msg)
    thr = Thread(target=helper, args=[app, title, body, post_id])
    thr.start()


if __name__ == "__main__":
    app.run(debug=False, host=_host(), port=_port())
