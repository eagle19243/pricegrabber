"""Flask web app to handle back-end requests of the React web UI.
"""
import os
import datetime
import csv
import codecs
from datetime import date
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, send_from_directory
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models.user import User
from .models.product import Product
from .models.competitor import Competitor
from .models.store import Store
from .models.configuration import Configuration
from .util import load_config, JSONEncoder

config = load_config()

APP = Flask(__name__, static_folder='../build')
APP.config['JWT_SECRET_KEY'] = config['SECRET_KEY']
APP.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
APP.config.from_mapping(
    SECRET_KEY=config['SECRET_KEY'],
)
APP.config.update(config)
flask_bcrypt = Bcrypt(APP)
jwt = JWTManager(APP)
APP.json_encoder = JSONEncoder

user_model = User()
product_model = Product()
competitor_model = Competitor()
store_model = Store()
configuration_model = Configuration()


def get_app():
    return APP


@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({
        'success': False,
        'message': 'Missing Authorization Header'
    }), 401


@APP.route('/', defaults={'path': ''})
@APP.route('/<path:path>')
def index(path):
    if path != "" and os.path.exists(os.path.join(APP.static_folder, path)):
        return send_from_directory(APP.static_folder, path)
    else:
        return send_from_directory(APP.static_folder, 'index.html')


@APP.route('/auth', methods=['POST'])
def login():
    """auth endpoint
    """
    data = request.get_json()
    email = data['email']
    password = data['password']

    user = user_model.find_by_email(email)

    if user and flask_bcrypt.check_password_hash(user['password'], password):
        del user['password']
        access_token = create_access_token(identity=data)
        return jsonify({
            'success': True,
            'data': access_token
        }), 200
    else:
        return jsonify({
            'success': False,
            'message': 'Invalid email or password'
        }), 401


@APP.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    data['password'] = flask_bcrypt.generate_password_hash(data['password'])
    user_id = user_model.create(data)
    return jsonify({
        'success': True,
        'data': user_id
    })


@APP.route('/user', methods=['POST'])
@jwt_required
def auth_user():
    current_user = get_jwt_identity()
    return jsonify({
        'success': True,
        'data': current_user
    })


@APP.route('/product/add', methods=['POST'])
@jwt_required
def add_product():
    data = request.get_json()
    data['is_errored'] = True
    product_id = product_model.create(data)
    return jsonify({
        'success': True,
        'data': product_id,
        'message': 'Product added successfully'
    })


@APP.route('/product/update', methods=['POST'])
@jwt_required
def update_product():
    data = request.get_json()
    product_id = data['productId']
    product = data['product']
    success = product_model.update(product_id, product)
    message = 'Update successful' if success else 'Update failed'
    return jsonify({
        'success': success,
        'message': message
    })


@APP.route('/product/get', methods=['POST'])
@jwt_required
def get_product():
    data = request.get_json()
    product_id = data['productId']
    filter_errored = data['filterErrored']
    filter_updated = data['filterUpdated']

    if product_id:
        data = product_model.find_by_id(product_id)
    else:
        query = {
            'is_errored': True if filter_errored else {'$in': [True, False, None]},
            'is_updated': True if filter_updated else {'$in': [True, False, None]}
        }

        data = product_model.find(query)
    return jsonify({
        'success': True,
        'data': data
    })


@APP.route('/product/get_count', methods=['POST'])
@jwt_required
def get_product_count():
    data = product_model.find({})

    return jsonify({
        'success': True,
        'data': len(data)
    })


@APP.route('/product/remove', methods=['POST'])
@jwt_required
def remove_product():
    data = request.get_json()
    success = product_model.delete(data['productId'])
    message = 'Remove successful' if success else 'Remove failed'
    return jsonify({
        'success': success,
        'message': message
    })


@APP.route('/competitor/add', methods=['POST'])
@jwt_required
def add_competitor():
    data = request.get_json()
    id = competitor_model.create(data)
    return jsonify({
        'success': True,
        'data': id,
        'message': 'Competitor added successfully'
    })


@APP.route('/competitor/update', methods=['POST'])
@jwt_required
def update_competitor():
    data = request.get_json()
    id = data['competitorId']
    competitor = data['competitor']
    success = competitor_model.update(id, competitor)
    message = 'Update successful' if success else 'Update failed'
    return jsonify({
        'success': success,
        'message': message
    })


@APP.route('/competitor/get', methods=['POST'])
@jwt_required
def get_competitor():
    data = request.get_json()
    id = data['competitorId']
    products = product_model.find({})
    today = str(date.today())

    if id:
        competitor = competitor_model.find_by_id(id)
        data = competitor
        data['num_products'] = {}
        data['positions'] = {}
        product_counts = {}

        for store_name in competitor['store_names']:
            for product in products:
                if 'competitors' not in product:
                    continue
                if store_name not in product['competitors']:
                    continue

                if today in product['competitors'][store_name]:
                    prices = []
                    for key in product['competitors'].keys():
                        if today in product['competitors'][key]:
                            prices.append(product['competitors'][key][today])
                    prices.sort()
                    position = prices.index(product['competitors'][store_name][today])

                    if str(position) in data['positions']:
                        data['positions'][str(position)] = data['positions'][str(position)] + 1
                    else:
                        data['positions'][str(position)] = 1

                for key in product['competitors'][store_name].keys():
                    if key in product_counts.keys():
                        product_counts[key] = product_counts[key] + 1
                    else:
                        product_counts[key] = 1
        for key in sorted(product_counts)[-7:]:
            data['num_products'][key] = product_counts[key]
    else:
        competitors = competitor_model.find({})
        data = []
        for competitor in competitors:
            competitor['num_products'] = 0

            for store_name in competitor['store_names']:
                for product in products:
                    if 'competitors' not in product:
                        continue
                    if store_name not in product['competitors']:
                        continue
                    if today in product['competitors'][store_name].keys():
                        competitor['num_products'] = competitor['num_products'] + 1
            data.append(competitor)
        
    return jsonify({
        'success': True,
        'data': data
    })


@APP.route('/competitor/remove', methods=['POST'])
@jwt_required
def remove_competitor():
    data = request.get_json()
    success = competitor_model.delete(data['competitorId'])
    message = 'Remove successful' if success else 'Remove failed'
    return jsonify({
        'success': success,
        'message': message
    })


@APP.route('/store/get', methods=['POST'])
@jwt_required
def get_all_store_names():
    data = store_model.find({})
    return jsonify({
        'success': True,
        'data': data
    })


@APP.route('/configuration/get', methods=['POST'])
@jwt_required
def get_configuration():
    configuration = configuration_model.find_one()

    return jsonify({
        'success': True,
        'data': configuration
    })


@APP.route('/configuration/update', methods=['POST'])
@jwt_required
def update_configuration():
    data = request.get_json()
    configuration = configuration_model.find_one()
    success = configuration_model.update(configuration['_id'], data)
    message = 'Update successful' if success else 'Update failed'
    return jsonify({
        'success': success,
        'message': message
    })


@APP.route('/tool/import_mass_products', methods=['POST'])
@jwt_required
def import_mass_products():
    file = request.files.get('file')
    stream = codecs.iterdecode(file.stream, 'utf-8')
    reader = csv.reader(stream, dialect=csv.excel)

    row_num = 0
    for row in reader:
        row_num = row_num + 1

        try:
            code = row[0]
            url = row[1]
            cost = float(row[2])
            profit = float(row[3])

            products = product_model.find({
                'code': code
            })

            if products and len(products):
                product_model.update(products[0]['_id'], {
                    'code': code,
                    'url': url,
                    'cost': cost,
                    'profit': profit
                })
            else:
                product_model.create({
                    'code': code,
                    'url': url,
                    'cost': cost,
                    'profit': profit,
                    'is_errored': True
                })
        except ValueError:
            return jsonify({
                'success': False,
                'data': row_num,
                'message': 'Invalid value in row %s' % row_num
            })

    return jsonify({
        'success': True,
        'data': 'products',
        'message': 'Product added successfully'
    })
