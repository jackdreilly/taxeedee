import requests
import json

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
    for comment in guestbook:
        print comment

migrate()
    