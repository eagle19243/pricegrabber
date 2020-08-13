from ..factory.validation import Validator
from ..factory.database import Database


class Product(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()

        self.collection_name = 'product'  # collection name

        self.fields = {
            'name': 'string',
            'code': 'string',
            'url': 'string',
            'cost': 'float',
            'profit': 'float',
            'price': 'array',
            'last_updated': 'datetime',
            'review_count': 'int',
            'review_rating': 'float',
            'competition': 'array'
        }

        self.create_required_fields = ['code', 'url', 'cost', 'profit']

        # Fields optional for CREATE
        self.create_optional_fields = []

        # Fields required for UPDATE
        self.update_required_fields = []

        # Fields optional for UPDATE
        self.update_optional_fields = ['code', 'url', 'cost', 'profit']

    def create(self, product):
        # Validator will throw error if invalid
        self.validator.validate(product, self.fields, self.create_required_fields, self.create_optional_fields)
        res = self.db.insert(product, self.collection_name)
        return res

    def find(self, product):  # find all
        return self.db.find(product, self.collection_name)

    def find_by_id(self, id):
        return self.db.find_by_id(id, self.collection_name)

    def update(self, id, product):
        self.validator.validate(product, self.fields, self.update_required_fields, self.update_optional_fields)
        return self.db.update(id, product,self.collection_name)

    def delete(self, id):
        return self.db.delete(id, self.collection_name)
