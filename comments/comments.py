import sqlite3
import os
from collections import defaultdict
import json


def create_tables(conn):
    try:
        tables = [x for x, in list(c.execute("SELECT name FROM sqlite_master WHERE type='table'"))]
        print tables
        if 'comments' in tables:
            return
        c.execute('''CREATE TABLE comments
                (item_id text, comment text, ts timestamp DEFAULT CURRENT_TIMESTAMP)''')

        c.execute('''CREATE TABLE stars
                (item_id text, ts timestamp DEFAULT CURRENT_TIMESTAMP)''')
    except Exception as e:
        print e

class CommentsClient(object):

    def __init__(self):
        create_tables(self._cursor())

    def _cursor(self):
        db_path = os.environ.get('COMMENTS_DB_PATH', 'example.db')
        return sqlite3.connect(db_path, isolation_level=None).cursor()
    
    def comments(self):
        cursor = self._cursor()
        comments = list(cursor.execute('select * from comments order by ts desc'))
        grouped = defaultdict(list)
        for item_id, comment, ts in comments:
            comment = json.loads(comment)
            comment['timestamp'] = ts
            grouped[item_id].append(comment)
        return dict(grouped)

    def guestbook_comments(self):
        for item_id, comment in self.comments().items():
            if item_id == 'guestbook':
                return comment
        return []

    def add_guestbook_comment(self, comment):
        return self.add_comment('guestbook', comment)

    def add_comment(self, item_id, comment):
        cursor = self._cursor()
        cursor.execute('insert into comments(item_id, comment) values (?, ?)', (item_id, json.dumps(comment)))

    def add_star(self, item_id):
        cursor = self._cursor()
        cursor.execute('insert into stars(item_id) values (?)', (item_id,))

    def stars(self):
        cursor = self._cursor()
        return dict(list(cursor.execute('select item_id, count(*) from stars group by 1')))