from flask import Flask, request, jsonify
import os
import sys
from google.protobuf import json_format
sys.path.append('server')
from taxeedee_service import client as db_client


def _to_json(proto):
    return json_format.MessageToJson(proto, including_default_value_fields=True)


def _client_addr():
    return os.environ.get('CLIENT_ADDR', 'localhost:50051')


def _static_folder():
    return os.environ.get('STATIC_FOLDER', 'html/dist/')

client = db_client.Client(_client_addr())
app = Flask(__name__, static_url_path='', static_folder=_static_folder())


@app.route('/')
def root():
    return app.send_static_file('insta.html')


@app.route('/posts', methods=['GET'])
def posts():
    print client.get_posts()
    return _to_json(client.get_posts())


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
    client.star_post(post_id=request.json['post_id'])
    post = client.get_post(post_id=request.json['post_id'])
    return _to_json(post)


def _host():
    return '0.0.0.0'


def _port():
    return os.environ.get('PORT', 5000)

if __name__ == "__main__":
    app.config.update(ENV='development')
    app.run(debug=False, host=_host(), port=_port())
