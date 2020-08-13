from ..factory.validation import Validator
from ..factory.database import Database


class User(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()

        self.collection_name = 'user'  # collection name

        self.fields = {
            'email': 'string',
            'password': 'string'
        }

        self.create_required_fields = ['email', 'password']
        self.create_optional_fields = []
        self.update_required_fields = []
        self.update_optional_fields = ['email', 'password']

    def create(self, user):
        # Validator will throw error if invalid
        self.validator.validate(user, self.fields, self.create_required_fields, self.create_optional_fields)
        res = self.db.insert(user, self.collection_name)
        return res

    def find(self, user):  # find all
        return self.db.find(user, self.collection_name)

    def find_by_id(self, id):
        return self.db.find_by_id(id, self.collection_name)

    def find_by_email(self, email):
        return self.db.find_one({'email': email}, self.collection_name)

    def update(self, id, user):
        self.validator.validate(user, self.fields, self.update_required_fields, self.update_optional_fields)
        return self.db.update(id, user,self.collection_name)

    def delete(self, id):
        return self.db.delete(id, self.collection_name)
