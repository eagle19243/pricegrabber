import atexit
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from .models.configuration import Configuration
from .scraper import Scraper


class Scheduler:
    """
    Scheduler class to run scraper periodically
    """

    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.scraper = Scraper()
        self.configuration_model = Configuration()
        self.scheduler.start()

    def __del__(self):
        self.scheduler.shutdown()

    def run(self):
        config = self.configuration_model.find_one()
        interval = config['interval'] if config else 2
        self.save_interval(interval)
        self.scheduler.add_job(func=self.scraper.run, trigger='interval', hours=interval,
                               next_run_time=datetime.now(), id=__name__)

    def reschedule(self, interval):
        self.scheduler.reschedule_job(__name__, trigger='interval', hours=interval)
        self.save_interval(interval)

    def save_interval(self, interval):
        config = self.configuration_model.find_one()
        new_config = {'interval': interval}

        if config:
            self.configuration_model.update(config['_id'], new_config)
        else:
            self.configuration_model.create(new_config)
