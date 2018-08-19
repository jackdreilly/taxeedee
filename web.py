from flask import Flask, request, jsonify, session
import os
import json
import sys
from google.protobuf import json_format
sys.path.append('server')
from taxeedee_service import client as db_client

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

client = db_client.Client(_client_addr())
app = Flask(__name__, static_url_path='', static_folder=_static_folder())
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

@app.route('/')
def root():
    return app.send_static_file('insta.html')


@app.route('/posts', methods=['GET'])
def posts():
    print client.get_posts()
    post_jsons = json.loads(_to_json(client.get_posts()))
    star_session = StarSession(session)
    print(post_jsons)
    for post in post_jsons['posts']:
        post['starred'] = star_session.already_starred(post['id'])
    return json.dumps(post_jsons)


@app.route('/comments', methods=['GET'])
def comments():
    return _to_json(client.get_comments())


@app.route('/add_comment', methods=['POST'])
def add_comment():
    client.add_comment(
        name=request.json['name'],
        comment=request.json['comment'],
    )
    return _to_json(client.get_comments())


@app.route('/add_post_comment', methods=['POST'])
def add_post_comment():
    client.add_post_comment(
        name=request.json['name'],
        post_id=request.json['post_id'],
        comment=request.json['comment'],
    )
    post = client.get_post(post_id=request.json['post_id'])
    return _to_json(post)


@app.route('/star_post', methods=['POST'])
def star_post():
    post_id = request.json['post_id']
    star_session = StarSession(session)
    if not star_session.already_starred(post_id):
      star_session.star_post(post_id)
      client.star_post(post_id=post_id)
    post = client.get_post(post_id=request.json['post_id'])
    return _to_json(post)


def _host():
    return '0.0.0.0'


def _port():
    return os.environ.get('PORT', 5000)

if __name__ == "__main__":
    app.config.update(ENV='development')
    app.run(debug=False, host=_host(), port=_port())
