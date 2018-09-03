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
    parsed = parse_post.parse_post(filename)
    print parsed
    c.add_post(**parsed)

if __name__ == '__main__':
  main()