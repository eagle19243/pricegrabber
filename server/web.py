"""Flask web app to handle back-end requests of the React web UI.
"""
import datetime
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, send_from_directory
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity
from .models.user import User
from .util import load_config, JSONEncoder

config = load_config()

APP = Flask(__name__, static_folder='../build', static_url_path='/')
APP.config['JWT_SECRET_KEY'] = config['SECRET_KEY']
APP.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
APP.config.from_mapping(
    SECRET_KEY=config['SECRET_KEY'],
)
APP.config.update(CELERYD_HIJACK_ROOT_LOGGER=False)
APP.config.update(config)
flask_bcrypt = Bcrypt(APP)
jwt = JWTManager(APP)
APP.json_encoder = JSONEncoder

user_model = User()


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
def index(path=None):
    print('index')
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
            'message': 'invalid email or password'
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



