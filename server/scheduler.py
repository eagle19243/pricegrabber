from celery.task import PeriodicTask
from datetime import datetime, timedelta
from .models.configuration import Configuration
from .scraper import Scraper


class Scheduler(PeriodicTask):
    """
    Scheduler class to run scraper periodically
    """
    run_every = timedelta(seconds=10)

    def __init__(self):
        self.configuration_model = Configuration()

    def run(self):
        config = self.configuration_model.find_one()

        if config:
            if 'last_run_time' in config and 'interval' in config:
                interval = config['interval']
                last_run_time = config['last_run_time']
                delta = datetime.now() - last_run_time
                if delta.seconds > interval * 60 * 60:
                    self.app.tasks['server.scraper.Scraper'].apply_async()
            else:
                self.app.tasks['server.scraper.Scraper'].apply_async()
        else:
            interval = 2
            new_config = {'interval': interval}
            self.configuration_model.create(new_config)
            self.app.tasks['server.scraper.Scraper'].apply_async()



