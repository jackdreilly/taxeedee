from taxeedee_service.client import Client
import glob
import parse_post

def main(client = None, filename=None):
  c = client
  if c is None:
    c = Client()
  if filename is None:
    c.clear_db()
    for filename in glob.glob('posts/*html'):
      c.add_post(**parse_post.parse_post(filename))
  else:
    c.add_post(**parse_post.parse_post(filename))

if __name__ == '__main__':
  main()