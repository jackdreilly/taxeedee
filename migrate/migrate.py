import requests
import json

import sys
sys.path.append('../')
sys.path.append('./')

from comments.comments import CommentsClient
from comments.metrics import MetricsClient

ROOT = 'migrate'
POSTS_JSON = '%s/%s' % (ROOT, 'posts.json')
GUESTBOOK_JSON = '%s/%s' % (ROOT, 'guestbook.json')
METRICS_JSON = '%s/%s' % (ROOT, 'metrics.json')


def download():
    with open(POSTS_JSON, 'w') as fn:
        fn.write(requests.get('http://taxeedee.com/posts').text)
    with open(GUESTBOOK_JSON, 'w') as fn:
        fn.write(requests.get('http://taxeedee.com/comments').text)
    with open(METRICS_JSON, 'w') as fn:
        fn.write(requests.get('http://taxeedee.com/metrics.json').text)


def from_disk():
    with open(POSTS_JSON, 'r') as fn:
        posts = json.load(fn)
    with open(GUESTBOOK_JSON, 'r') as fn:
        guestbook = json.load(fn)
    with open(METRICS_JSON, 'r') as fn:
        metrics = json.load(fn)
    return posts, guestbook, metrics


def migrate():
    comments_client = CommentsClient()
    metrics_client = MetricsClient()
    posts, guestbook, metrics = from_disk()
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
    for key, _metric in metrics:
        metric = _metric['metrics']
        post_id = _metric['post']['title']
        for photo in metric.get('photo_clicked', []):
            for _ in range(photo['views']):
                metrics_client.photo_clicked(post_id, photo['url'])
        for _ in range(metric.get('post_clicked', 0)):
            metrics_client.post_clicked(post_id)
        for _ in range(metric.get('post_expanded', 0)):
            metrics_client.post_expanded(post_id)
        for _ in range(metric.get('comments_expanded', 0)):
            metrics_client.comments_expanded(post_id)


def main():
    if 'download' in sys.argv:
        download()
    if 'migrate' in sys.argv:
        migrate()

if __name__ == '__main__':
    main()
