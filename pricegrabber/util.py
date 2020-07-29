"""SPN Utility methods.
"""
import logging
import os
import yaml


def load_config():
    """Load conf file defined by ENV var GOOGLE_SHEETS_WEB_CONF.
    If not available load ./conf.yaml
    """
    config = {}
    try:
        cfg_file = os.environ.get('PRICE_GRABBER_CONF')
        if not cfg_file:
            cfg_file = os.getcwd() + '/config.yaml'
            logging.warning('using default configuration from %s', cfg_file)
        with open(cfg_file, 'rt') as cfg:
            config = yaml.safe_load(cfg.read())
            logging.debug('config=%s', config)
    except IOError:
        logging.error('Error loading configuration', exc_info=1)
    return config
