from taxeedee_service import taxeedee_pb2
from taxeedee_service.client import Client
import glob
import parse_post

def post_paths():
  return glob.glob('posts/*html')

def _or_default_client(client):
  return client if client is not None else Client()

def clear_db(client = None):
  _or_default_client(client).clear_db()

def add_post(path, client = None):
  _or_default_client(client).add_post(**parse_post.parse_post(path))

def parsed_posts():
  return [parse_post.parse_post(filename) for filename in post_paths()]

def add_all_posts(client=None):
  client = _or_default_client(client)
  for path in post_paths():
    add_post(client, path)

def modify_content(client=None):
  client = _or_default_client(client)
  title_to_post = {post.title: post for post in client.get_posts().posts}
  title_to_new = {post['title']: post for post in parsed_posts()}
  count = 0
  for title, new_post in title_to_new.iteritems():
    if title in title_to_post:
      post = title_to_post[title]
      post.structured_content.CopyFrom(new_post['structured_content'])
      post.photo.url = new_post['url']
      client.update_post(post)
      print 'updated post', post.id, post.title
      count+=1
  return 'modified %d posts' % count
