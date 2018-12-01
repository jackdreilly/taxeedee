import requests
import json

import sys
sys.path.append('../')

from comments.comments import CommentsClient
from comments.posts import Posts


def download():
    with open('posts.json', 'w') as fn:
        fn.write(requests.get('http://taxeedee.com/posts').text)
    with open('guestbook.json', 'w') as fn:
        fn.write(requests.get('http://taxeedee.com/comments').text)
    with open('metrics.json', 'w') as fn:
        fn.write(requests.get('http://taxeedee.com/metrics.json').text)    

def from_disk():
    with open('posts.json', 'r') as fn:
        posts = json.load(fn)
    with open('guestbook.json', 'r') as fn:
        guestbook = json.load(fn)
    with open('metrics.json', 'r') as fn:
        metrics = json.load(fn)
    return posts, guestbook, metrics

def migrate():
    comments_client = CommentsClient()
    posts, guestbook, metrics = from_disk()
    for comment in guestbook['comments']:
        comments_client.add_guestbook_comment(comment, timestamp=comment['timestamp'])
    for post in posts['posts']:
        post_id = post['id']
        for comment in post['comments']:
            comments_client.add_comment(post_id, comment, timestamp=comment['timestamp'])
    for metric in metrics:
        print metric

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'download':
        download()
    else:
        migrate()