"""application.py -- top-level web application for pricegrabber.
"""
import logging.config
from celery import Celery
from .util import load_config

# Init config
config = load_config()
logging_conf = config.get('LOGGING')
if logging_conf:
    logging.config.dictConfig(logging_conf)

# Init Celery app
celery_conf = config['CELERY']
celery = Celery(celery_conf['queue_name'], backend=celery_conf['backend_url'],
                broker=celery_conf['broker_url'])
celery.conf.update(celery_conf)

# Init Flask app
from .web import get_app
APP = get_app(config)
APP.celery = celery
