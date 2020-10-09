from ..factory.validation import Validator
from ..factory.database import Database


class Competitor(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()

        self.collection_name = 'competitor'  # collection name

        self.fields = {
            'url': 'string',
            'logo': 'string',
            'store_names': 'array',
            'is_excluded': 'bool',
            'shipping_payment_info': 'string',
            'skroutz_url': 'url'
        }

        self.create_required_fields = ['url', 'store_names']

        # Fields optional for CREATE
        self.create_optional_fields = ['is_excluded', 'shipping_payment_info', 'skroutz_url', 'logo']

        # Fields required for UPDATE
        self.update_required_fields = []

        # Fields optional for UPDATE
        self.update_optional_fields = ['url', 'store_names', 'is_excluded', 'shipping_payment_info', 'skroutz_url',
                                       'logo']

    def create(self, competitor):
        # Validator will throw error if invalid
        self.validator.validate(competitor, self.fields, self.create_required_fields, self.create_optional_fields)
        res = self.db.insert(competitor, self.collection_name)
        return res

    def create_if_not_exist(self, name, url, logo):
        res = self.db.find_one({'store_names': name}, self.collection_name)

        if not res:
            competitor = {
                'store_names': [name],
                'url': url,
                'logo': logo,
                'is_excluded': False
            }
            # Validator will throw error if invalid
            self.validator.validate(competitor, self.fields, self.create_required_fields, self.create_optional_fields)
            res = self.db.insert(competitor, self.collection_name)

        return res

    def find(self, competitor):  # find all
        return self.db.find(competitor, self.collection_name)

    def find_by_id(self, id):
        return self.db.find_by_id(id, self.collection_name)

    def update(self, id, competitor):
        self.validator.validate(competitor, self.fields, self.update_required_fields, self.update_optional_fields)
        return self.db.update(id, competitor, self.collection_name)

    def delete(self, id):
        return self.db.delete(id, self.collection_name)
