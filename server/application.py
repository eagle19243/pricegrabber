"""application.py -- top-level web application for pricegrabber.
"""
import logging.config
from celery import Celery
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from .util import load_config, JSONEncoder
from .web import get_app

# Init config
config = load_config()

# Init logging
logging_conf = config['LOGGING']
if logging_conf:
    logging.config.dictConfig(logging_conf)

# Init Celery app
celery_conf = config['CELERY']
celery = Celery(celery_conf['queue_name'], backend=celery_conf['backend'], broker=celery_conf['broker'])
celery.conf.update(celery_conf)

# Init Flask app
APP = get_app(config)
APP.celery = celery

# Init Database
flask_bcrypt = Bcrypt(APP)
jwt = JWTManager(APP)
APP.json_encoder = JSONEncoder
