from taxeedee_service.client import Client
import glob
import parse_post

def main():
  c = Client()
  c.clear_db()
  for filename in glob.glob('posts/*html'):
    c.add_post(**parse_post.parse_post(filename))

if __name__ == '__main__':
  main()