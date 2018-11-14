import glob
import parse_post

def post_paths():
    return glob.glob('posts/*html')


def parsed_posts():
    return [parse_post.parse_post(filename) for filename in post_paths()]
