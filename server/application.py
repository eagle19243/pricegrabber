"""application.py -- top-level web application for pricegrabber.
"""
import logging.config
from .util import load_config
from .web import get_app

# Init config
config = load_config()

# Init logging
logging_conf = config['LOGGING']
if logging_conf:
    logging.config.dictConfig(logging_conf)

APP = get_app()
