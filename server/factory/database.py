from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from ..util import load_config


class Database(object):
    def __init__(self):
        config = load_config()
        self.client = MongoClient(config['DB']['url'])
        self.db = self.client[config['DB']['name']]

    def insert(self, element, collection_name):
        element['created'] = datetime.now()
        element['updated'] = datetime.now()
        inserted = self.db[collection_name].insert_one(element)  # insert data to db
        return str(inserted.inserted_id)

    def find(self, criteria, collection_name, projection=None, sort=None, limit=0, cursor=False):  # find all from db

        if '_id' in criteria:
            criteria['_id'] = ObjectId(criteria['_id'])

        found = self.db[collection_name].find(filter=criteria, projection=projection, limit=limit, sort=sort)

        if cursor:
            return found

        found = list(found)

        for i in range(len(found)):  # to serialize object id need to convert string
            if '_id' in found[i]:
                found[i]['_id'] = str(found[i]['_id'])

        return found

    def find_one(self, criteria, collection_name):
        found = self.find(criteria, collection_name)

        if len(found) > 0:
            return found[0]
        else:
            return None

    def find_by_id(self, id, collection_name):
        found = self.db[collection_name].find_one({'_id': ObjectId(id)})

        if found is None:
            return not found

        if '_id' in found:
            found['_id'] = str(found['_id'])

        return found

    def update(self, id, element, collection_name):
        criteria = {'_id': ObjectId(id)}

        element['updated'] = datetime.now()
        set_obj = {'$set': element}  # update value

        updated = self.db[collection_name].update_one(criteria, set_obj)
        if updated.matched_count == 1:
            return True
        return False

    def delete(self, id, collection_name):
        deleted = self.db[collection_name].delete_one({'_id': ObjectId(id)})
        return bool(deleted.deleted_count)