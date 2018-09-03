import glob
import parse_post
from taxeedee_service import taxeedee_pb2
from taxeedee_service.client import Client

def modify_content(client=None):
  if client is None:
    client = Client()
  title_to_post = {post.title: post for post in client.get_posts().posts}
  title_to_new = {post['title']: post for post in [parse_post.parse_post(filename) for filename in glob.glob('posts/*html')]}
  count = 0
  for title, new_post in title_to_new.iteritems():
    if title in title_to_post:
      post = title_to_post[title]
      if type(new_post['content']) is str:
        post.content = new_post['content']
      else:
        post.structured_content.CopyFrom(new_post['content'])
      post.photo.url = new_post['url']
      client.update_post(post)
      print 'updated post', post.id, post.title
      count+=1
  return 'modified %d posts' % count
