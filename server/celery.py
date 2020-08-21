from celery import Celery
from .scheduler import Scheduler
from .scraper import Scraper
from .util import load_config

config = load_config()

# Init celery app
celery_conf = config['CELERY']
celery = Celery(celery_conf['queue_name'], backend=celery_conf['backend_url'], broker=celery_conf['broker_url'])
celery.conf.update(celery_conf)
celery.register_task(Scheduler())
celery.register_task(Scraper())
