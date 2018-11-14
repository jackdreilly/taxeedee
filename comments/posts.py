import admin_utils
import comments
from google.protobuf.json_format import MessageToDict

class Posts(object):

    def __init__(self):
        self._posts = {v.id: MessageToDict(v) for v in admin_utils.parsed_posts()}
    
    def posts(self):
        return self._posts
    
    def post(self, post_id):
        for post in self.full_posts():
            if post['id'] == post_id:
                return post

    def full_posts(self):
        posts = self.posts()
        c = comments.CommentsClient()
        cs = c.comments()
        stars = c.stars()
        full_posts = []
        for item_id, post in posts.iteritems():
            post = dict(post)
            post['stars'] = stars.get(item_id, 0)
            post['comments'] = cs.get(item_id, [])
            full_posts.append(post)
        return sorted(full_posts, key = lambda x : x.get('timestamp',0), reverse = True)


def main():
    c = comments.CommentsClient()
    c.add_star('Life in India: Traffic')
    c.add_star('Life in India: Traffic')
    c.add_star('Life in India: Traffic')
    c.add_star('Life in India: Traffic')
    c.add_comment('Life in India: Traffic', {'name': 'Jack', 'comment': 'comment'})
    c.add_comment('Life in India: Traffic', {'name': 'Jack', 'comment': 'comment'})
    print c.stars().get('Life in India: Traffic')
    post = Posts().full_posts()[-1]
    print post['stars'], post['comments']



