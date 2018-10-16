from taxeedee_service.client import Client
import json
from metrics import MetricsClient
from google.protobuf import json_format
from flask import render_template


def _to_json(proto):
    return json_format.MessageToJson(proto, including_default_value_fields=True)


def post_metrics(client, metrics_client):
    post_metrics = metrics_client.dump()
    posts = client.get_posts()
    posts = json.loads(_to_json(posts))
    posts = posts['posts']
    post_id_to_post = {post['id']: post for post in posts}
    post_id_to_metric = {str(post['_id']): dict(post) for post in post_metrics}
    joined = {post_id: {'post': post, 'metrics': post_id_to_metric.get(
        post_id, None)} for post_id, post in post_id_to_post.iteritems()}
    return sorted(joined.items(), key=lambda a: a[1]['post']['timestamp'], reverse=True)


def render_report(client, metrics_client):
    return render_template('metrics_report.html', posts=post_metrics(client, metrics_client))
