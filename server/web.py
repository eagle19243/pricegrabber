"""Flask web app to handle back-end requests of the React web UI.
"""
import datetime
from celery.result import AsyncResult
from celery.exceptions import CeleryError
from flask import Flask, request, jsonify, redirect, send_from_directory
from .scraper import Scraper

APP = Flask(__name__, static_folder='../build', static_url_path='/')


def get_app(config):
    """Utility method to set APP configuration. Its used by application.py.
    """
    APP.config['JWT_SECRET_KEY'] = config['SECRET_KEY']
    APP.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
    APP.config.from_mapping(
        SECRET_KEY=config['SECRET_KEY'],
    )
    APP.config.update(CELERYD_HIJACK_ROOT_LOGGER=False)
    APP.config.update(config)

    return APP


# Flask default route to catch all unhandled URLs
# https://stackoverflow.com/questions/13678397/python-flask-default-route-possible
@APP.route('/', defaults={'path': ''})
@APP.route('/<path:path>')
def index(path=None):
    return jsonify({})
