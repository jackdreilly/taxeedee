import sqlite3
import os


def create_tables(c):
    try:
        tables = [x for x, in list(
            c.execute("SELECT name FROM sqlite_master WHERE type='table'"))]
        if 'post_clicked' in tables:
            return
        c.execute('''CREATE TABLE photo_clicked
                (post_id text, photo text, ts timestamp DEFAULT CURRENT_TIMESTAMP)''')
        c.execute('''CREATE TABLE post_clicked
                (post_id text, ts timestamp DEFAULT CURRENT_TIMESTAMP)''')
        c.execute('''CREATE TABLE post_expanded
                (post_id text, ts timestamp DEFAULT CURRENT_TIMESTAMP)''')
        c.execute('''CREATE TABLE comments_expanded
                (post_id text, ts timestamp DEFAULT CURRENT_TIMESTAMP)''')
    except Exception as e:
        print e


class MetricsClient(object):

    def __init__(self):
        create_tables(self._cursor())

    def _cursor(self):
        db_path = os.environ.get('COMMENTS_DB_PATH', 'example.db')
        return sqlite3.connect(db_path, isolation_level=None).cursor()

    def photo_clicked(self, post_id, photo):
        self._cursor().execute(
            'insert into photo_clicked(post_id, photo) values (?, ?)', (post_id, photo))

    def post_clicked(self, post_id):
        self._cursor().execute('insert into post_clicked(post_id) values (?)', (post_id))

    def post_expanded(self, post_id):
        self._cursor().execute('insert into post_expanded(post_id) values (?)', (post_id))

    def comments_expanded(self, post_id):
        self._cursor().execute('insert into comments_expanded(post_id) values (?)', (post_id))

    def post_metrics(self, posts):
        post_metrics = self.dump()
        joined = {
            post_id: {
                'post': post,
                'metrics': post_metrics.get(post_id, None),
            }
            for post_id, post in posts.iteritems()
        }
        print joined.values()[0]['post'].keys()
        return sorted(joined.items(), key=lambda a: a[1]['post']['timestamp'], reverse=True)

    def dump(self):
        cursor = self._cursor()
        photo_clicked = list(cursor.execute(
            'select post_id, photo, count(*) from photo_clicked group by 1, 2'))
        post_clicked = list(cursor.execute(
            'select post_id, count(*) from post_clicked group by 1'))
        post_expanded = list(cursor.execute(
            'select post_id, count(*) from post_expanded group by 1'))
        comments_expanded = list(cursor.execute(
            'select post_id, count(*) from comments_expanded group by 1'))
        combined = {
            'post_clicked': {x[0]: x[1] for x in post_clicked},
            'post_expanded': {x[0]: x[1] for x in post_expanded},
            'comments_expanded': {x[0]: x[1] for x in comments_expanded},
        }

        def photo_clicks(post_id):
            def photo(photo_tuple):
                post_id, url, clicks = photo_tuple
                return {
                    'url': url,
                    'clicks': clicks,
                }
            l = [photo(x) for x in photo_clicked if x[0] == post_id]
            return {ll['url']: ll['clicks'] for ll in l}

        def post_clicks(post_id):
            return combined['post_clicked'].get(post_id, 0)

        def post_expandeds(post_id):
            return combined['post_expanded'].get(post_id, 0)

        def comments_expandeds(post_id):
            return combined['comments_expanded'].get(post_id, 0)

        def lookup(post_id):
            return {
                'id': post_id,
                'photo_clicked': photo_clicks(post_id),
                'post_clicked': post_clicks(post_id),
                'post_expanded': post_expandeds(post_id),
                'comments_expanded': comments_expandeds(post_id),
            }
        post_ids = set([k for item in combined.itervalues()
                        for k in item] + [x[0] for x in photo_clicked])
        return {post_id: lookup(post_id) for post_id in post_ids}
