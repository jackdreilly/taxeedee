import pymongo
from bson.objectid import ObjectId
import os


def _increment(db, id_value, sub_field, amount=1):
    return db.update_one({'_id': ObjectId(id_value)}, {"$inc": {sub_field: int(amount)}}, True)


def _mongo_port():
    return int(os.environ.get('MONGO_PORT', 27017))


def _mongo_host():
    return os.environ.get('MONGO_HOST', 'localhost')


class MetricsClient(object):
    """docstring for MetricsClient"""

    def __init__(self, mongo_host=None, mongo_port=None):
        super(MetricsClient, self).__init__()
        mongo_host = mongo_host or _mongo_host()
        mongo_port = mongo_port or _mongo_port()
        self.client = pymongo.MongoClient(mongo_host, mongo_port)
        self.db = self.client.metrics.posts

    def photo_clicked(self, post_id, photo):
        x = self.db.find_one(
            {'_id': ObjectId(post_id), 'photo_clicked.url': photo})
        if not x:
            self.db.update_one({'_id': ObjectId(post_id)}, {'$addToSet': {
                               'photo_clicked': {'url': photo, 'views': 0}}}, upsert=True)
        self.db.find_one_and_update({'_id': ObjectId(post_id), 'photo_clicked.url': photo}, {
            "$inc": {'photo_clicked.$.views': 1}}, upsert=True)

    def post_clicked(self, post_id):
        _increment(self.db, post_id, 'post_clicked')

    def post_expanded(self, post_id):
        _increment(self.db, post_id, 'post_expanded')

    def comments_expanded(self, post_id):
        _increment(self.db, post_id, 'comments_expanded')
