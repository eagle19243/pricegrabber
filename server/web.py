"""Flask web app to handle back-end requests of the React web UI.
"""
import os
import datetime
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, send_from_directory
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity
from .models.user import User
from .models.product import Product
from .models.configuration import Configuration
from .util import load_config, JSONEncoder
from .scheduler import Scheduler

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
configuration_model = Configuration()
scheduler = Scheduler()


def get_app():
    scheduler.run()
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
    product_id = product_model.create(data)
    return jsonify({
        'success': True,
        'data': product_id
    })


@APP.route('/product/update', methods=['POST'])
@jwt_required
def update_product():
    data = request.get_json()
    product_id = data['productId']
    product = data['product']
    success = product_model.update(product_id, product)
    return jsonify({
        'success': success
    })


@APP.route('/product/get', methods=['POST'])
@jwt_required
def get_product():
    data = request.get_json()
    product_id = data['productId']

    if product_id:
        data = product_model.find_by_id(product_id)
    else:
        data = product_model.find({})
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
    return jsonify({
        'success': success
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

    return jsonify({
        'success': True,
        'data': success
    })