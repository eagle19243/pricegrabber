from ..factory.validation import Validator
from ..factory.database import Database


class Store(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()

        self.collection_name = 'store'  # collection name

        self.fields = {
            'name': 'string'
        }

        self.create_required_fields = ['name']

        # Fields optional for CREATE
        self.create_optional_fields = []

    def create(self, name):
        store = {'name': name}
        res = self.find_one(store)

        if not res:
            # Validator will throw error if invalid
            self.validator.validate(store, self.fields, self.create_required_fields,
                                    self.create_optional_fields)
            res = self.db.insert(store, self.collection_name)

        return res

    def find(self, store):  # find all
        return self.db.find(store, self.collection_name)

    def find_one(self, store):  # find a store
        return self.db.find_one(store, self.collection_name)
