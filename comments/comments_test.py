import os
import tempfile

import pytest

import comments


class Tf:
    tf = None

def setup():
    tf = tempfile.NamedTemporaryFile()
    Tf.tf = tf
    filename = tf.name
    os.environ['COMMENTS_DB_PATH'] = filename
    return comments.CommentsClient()

def teardown():
    Tf.tf.close()

@pytest.fixture
def client():
    return comments.CommentsClient()

def test_empty(client):
    assert len(client.comments()) == 0
    assert len(client.stars()) == 0

def test_stars(client):
    client.add_star('a')
    assert client.stars()['a'] == 1
    client.add_star('a')
    assert client.stars()['a'] == 2
    client.add_star('b')
    assert client.stars()['b'] == 1
    assert 'a' in client.stars()
    assert 'b' in client.stars()

def test_comments(client):
    client.add_comment('a', {'name': 'jacko', 'comment': 'my comment'})
    assert len(client.comments()['a']) == 1    
    client.add_comment('a', {'name': 'jacko', 'comment': 'my comment'})
    client.add_comment('b', {'name': 'jacko', 'comment': 'my comment'})
    assert 'a' in  client.comments()
    assert 'b' in client.comments()
    assert len(client.comments()['a']) == 2
    assert len(client.comments()['b']) == 1
    assert len(client.guestbook_comments()) == 0    
    client.add_guestbook_comment({'name': 'jacko', 'comment': 'my comment'})
    assert len(client.guestbook_comments()) == 1    
    client.add_guestbook_comment({'name': 'jacko', 'comment': 'my comment'})
    assert len(client.guestbook_comments()) == 2
    client = comments.CommentsClient()
    assert len(client.guestbook_comments()) == 2
