import os
import tempfile
tf = tempfile.NamedTemporaryFile()
filename = tf.name
print filename
os.environ['COMMENTS_DB_PATH'] = filename
import comments
import unittest

client = comments.CommentsClient()

print client.comments()
print client.stars()
client.add_star('a')
print client.stars()
client.add_star('a')
print client.stars()
client.add_star('b')
print client.stars()

client.add_comment('a', {'name': 'jacko', 'comment': 'my comment'})
client.add_comment('a', {'name': 'jacko', 'comment': 'my comment'})
client.add_comment('b', {'name': 'jacko', 'comment': 'my comment'})
print client.comments()
client.add_guestbook_comment({'name': 'jacko', 'comment': 'my comment'})
client.add_guestbook_comment({'name': 'jacko', 'comment': 'my comment'})
print client.guestbook_comments()
client = comments.CommentsClient()
print client.guestbook_comments()
tf.close()