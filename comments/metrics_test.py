import os
import tempfile

import pytest

import metrics

class Tf:
    tf = None

def setup():
    tf = tempfile.NamedTemporaryFile()
    Tf.tf = tf
    filename = tf.name
    os.environ['COMMENTS_DB_PATH'] = filename
    return metrics.MetricsClient()

def teardown():
    Tf.tf.close()

@pytest.fixture
def client():
    return metrics.MetricsClient()

def test_empty(client):
    assert len(client.dump()) == 0

def test_photo_clicked(client):
    client.photo_clicked('a', 'aa')
    client.photo_clicked('a', 'aa')    
    client.photo_clicked('a', 'bb')    
    client.photo_clicked('b', 'aa')
    dump = client.dump()
    assert 'a' in dump
    assert 'b' in dump
    assert len(dump['a']['photo_clicked']) == 2
    assert dump['a']['photo_clicked']['aa'] == 2
    assert dump['a']['photo_clicked']['bb'] == 1
    assert dump['b']['photo_clicked']['aa'] == 1

def test_post_clicked(client):
    client.post_clicked('a')
    client.post_clicked('b')    
    client.post_clicked('a')        
    dump = client.dump()
    assert dump['a']['post_clicked'] == 2
    assert dump['b']['post_clicked'] == 1

def test_post_expanded(client):
    client.post_expanded('a')
    client.post_expanded('b')    
    client.post_expanded('a')        
    dump = client.dump()
    assert dump['a']['post_expanded'] == 2
    assert dump['b']['post_expanded'] == 1    

def test_comments_expanded(client):
    client.comments_expanded('a')
    client.comments_expanded('b')    
    client.comments_expanded('a')        
    dump = client.dump()
    assert dump['a']['comments_expanded'] == 2
    assert dump['b']['comments_expanded'] == 1

def test_combined(client):
    client.comments_expanded('a')    

    dump = client.dump()['a']
    assert len(dump['photo_clicked']) == 0
    assert dump['post_clicked'] == 0    
    assert dump['post_expanded'] == 0    
    assert dump['comments_expanded'] == 1

    client.comments_expanded('a')

    client.post_expanded('a')        

    client.post_clicked('a')            
    client.post_clicked('a')            
    client.post_clicked('a')

    client.photo_clicked('a','aa')
    client.photo_clicked('a','aa')    
    client.photo_clicked('a','bb')
    client.photo_clicked('a','bb')        
    client.photo_clicked('a','bb')            

    dump = client.dump()['a']

    assert len(dump['photo_clicked']) == 2
    assert dump['post_clicked'] == 3    
    assert dump['post_expanded'] == 1    
    assert dump['comments_expanded'] == 2