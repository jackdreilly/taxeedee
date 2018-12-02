import requests
import json

import sys
sys.path.append('../')
sys.path.append('./')

from comments.comments import CommentsClient

ROOT = 'migrate'
POSTS_JSON = '%s/%s' % (ROOT, 'posts.json')
GUESTBOOK_JSON = '%s/%s' % (ROOT, 'guestbook.json')


def download():
    with open(POSTS_JSON, 'w') as fn:
        fn.write(requests.get('http://taxeedee.com/posts').text)
    with open(GUESTBOOK_JSON, 'w') as fn:
        fn.write(requests.get('http://taxeedee.com/comments').text)


def from_disk():
    with open(POSTS_JSON, 'r') as fn:
        posts = json.load(fn)
    with open(GUESTBOOK_JSON, 'r') as fn:
        guestbook = json.load(fn)
    return posts, guestbook


def migrate():
    comments_client = CommentsClient()
    posts, guestbook = from_disk()
    for comment in guestbook['comments']:
        comments_client.add_guestbook_comment(
            comment, timestamp=comment['timestamp'])
    for post in posts['posts']:
        post_id = post['title']
        for comment in post['comments']:
            comments_client.add_comment(
                post_id, comment, timestamp=comment['timestamp'])
        for _ in range(post.get('stars', 0)):
            comments_client.add_star(post_id)

def timestamps():
    posts, guestbook = from_disk()
    ts = {
        post['title']: post['timestamp']
        for post in posts['posts']
    }
    import admin_utils
    import parse_post
    for filename in admin_utils.post_paths():
        print filename
        post = parse_post.parse_post(filename)
        if not post.timestamp:
            print 'skipping'
            continue
        try:
            timestamp = ts[post.title]
        except:
            print 'failure', post.title
            continue
        with open(filename,'r') as fn:
            x = fn.read()
        with open(filename, 'w') as fn:
            fn.write('%s\n' % timestamp)
            fn.write(x)


def main():
    if 'download' in sys.argv:
        download()
    if 'migrate' in sys.argv:
        migrate()
    if 'timestamps' in sys.argv:
        timestamps()

if __name__ == '__main__':
    main()
