import posts
import tempfile
import os
import comments

def test():
    with tempfile.NamedTemporaryFile() as tf:
        filename = tf.name
        os.environ['COMMENTS_DB_PATH'] = filename
        comments_client = comments.CommentsClient()
        for _ in range(4):
            comments_client.add_star('post_a')
        for _ in range(6):
            comments_client.add_star('post_b')            
        for _ in range(2):
            comments_client.add_comment('post_b', {'name': 'Jack', 'comment': 'comment'})
        _posts = {
            'post_a': {
                'payload': 'a',
                'id': 'post_a',
            },
            'post_b': {
                'payload': 'b',
                'id': 'post_b',                
            },
        }
        posts_client = posts.Posts(_posts, comments_client)
        full_posts = posts_client.full_posts()
        full_posts = {x['id']: x for x in full_posts}
        assert len(full_posts) == 2
        assert 'post_a' in full_posts
        assert 'post_b' in full_posts
        assert full_posts['post_a']['stars'] == 4
        assert full_posts['post_b']['stars'] == 6
        assert len(full_posts['post_b']['comments']) == 2
        assert len(full_posts['post_a']['comments']) == 0