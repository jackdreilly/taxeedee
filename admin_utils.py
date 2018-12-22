import glob
import parse_post
from google.protobuf.json_format import MessageToDict


def post_paths():
    return glob.glob('posts/*html')


def parsed_posts():
    posts = [parse_post.parse_post(filename) for filename in post_paths()]
    return [post for post in posts if is_active(post)]

def is_active(post):
    return (str(post.timestamp))


def json_posts():
    return {
        v.id: MessageToDict(
            v,
            including_default_value_fields=True,
            preserving_proto_field_name=True
        )
        for v in parsed_posts()
    }

def add_post_timestamp(filename, timestamp):
    with open(filename, 'r') as fn:
        x = fn.read()
    with open(filename,'w') as fn:
        fn.write(timestamp)
        fn.write('\n')
        fn.write(x)
