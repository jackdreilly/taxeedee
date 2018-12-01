class Posts(object):

    def __init__(self, posts, comments_client):
        self._posts = posts
        self.comments_client = comments_client
    
    def posts(self):
        return self._posts
    
    def post(self, post_id):
        for post in self.full_posts():
            if post['id'] == post_id:
                return post

    def full_posts(self):
        posts = self.posts()
        cs = self.comments_client.comments()
        stars = self.comments_client.stars()
        full_posts = []
        for item_id, post in posts.iteritems():
            post = dict(post)
            post['stars'] = stars.get(item_id, 0)
            post['comments'] = cs.get(item_id, [])
            full_posts.append(post)
        return sorted(full_posts, key = lambda x : x['timestamp'], reverse = True)