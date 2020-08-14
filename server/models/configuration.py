from ..factory.validation import Validator
from ..factory.database import Database


class Configuration(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()

        self.collection_name = 'configuration'  # collection name

        self.fields = {
            'interval': 'int',
            'last_run_time': 'datetime'
        }

        self.create_required_fields = []
        self.create_optional_fields = ['interval', 'last_run_time']
        self.update_required_fields = []
        self.update_optional_fields = ['interval', 'last_run_time']

    def create(self, config):
        # Validator will throw error if invalid
        self.validator.validate(config, self.fields, self.create_required_fields, self.create_optional_fields)
        res = self.db.insert(config, self.collection_name)
        return res

    def find(self, config):  # find all
        return self.db.find(config, self.collection_name)

    def find_one(self):
        return self.db.find_one({}, self.collection_name)

    def find_by_id(self, id):
        return self.db.find_by_id(id, self.collection_name)

    def update(self, id, config):
        self.validator.validate(config, self.fields, self.update_required_fields, self.update_optional_fields)
        return self.db.update(id, config, self.collection_name)

    def delete(self, id):
        return self.db.delete(id, self.collection_name)
