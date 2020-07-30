import time
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait


class Scraper:
    """Product Scraper class
    """

    def __init__(self):
        self.driver = webdriver.Chrome()
        self.driver.wait = WebDriverWait(self.driver, 5)

    def run(self):
        url = 'https://www.skroutz.gr/s/22517083/Huawei-P40-Lite-E-64GB-Midnight-Black.html'
        self.driver.get(url)
