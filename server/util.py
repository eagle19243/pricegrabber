"""SPN Utility methods.
"""
import logging
import os
import json
import datetime
import yaml
from bson.objectid import ObjectId


def load_config():
    """Load conf file defined by ENV var GOOGLE_SHEETS_WEB_CONF.
    If not available load ./conf.yaml
    """
    config = {}
    try:
        cfg_file = os.environ.get('PRICE_GRABBER_CONF')
        if not cfg_file:
            cfg_file = os.getcwd() + '/config.yml'
            logging.warning('using default configuration from %s', cfg_file)
        with open(cfg_file, 'rt') as cfg:
            config = yaml.safe_load(cfg.read())
            logging.debug('config=%s', config)
    except IOError:
        logging.error('Error loading configuration', exc_info=1)
    return config


class JSONEncoder(json.JSONEncoder):
    """extend json-encoder class"""

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, set):
            return list(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)
