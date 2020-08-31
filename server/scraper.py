import re
import requests
import json
import base64
import time
from datetime import datetime, date
from concurrent.futures import ThreadPoolExecutor, as_completed
from lxml import html
from lxml.etree import ParserError
from urllib3.exceptions import ProtocolError
from selenium import webdriver
from selenium.common.exceptions import JavascriptException
from pyvirtualdisplay import Display
from celery import Task
from celery.utils.log import get_task_logger
from .models.product import Product
from .models.configuration import Configuration


class Scraper(Task):
    """Product Scraper class
    """
    data_sitekey = '6Lf9EoAUAAAAAAChZdbR6VtPSdDY1hB8celOhyeT'
    api_url = 'http://2captcha.com/'
    api_key = 'e2ff41d9044dee2a63eebd2dea8dada3'
    start_url = 'https://www.skroutz.gr/s/7504732/Apple-iPhone-6s-128GB.html'

    def __init__(self):
        display = Display(visible=0, size=(1024, 768))
        display.start()
        options = webdriver.ChromeOptions()
        options.add_argument('--disable-extensions')
        options.add_argument('--headless')
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')
        options.add_argument('--ignore-certificate-errors')
        self.driver = webdriver.Chrome(chrome_options=options)
        # self.driver = webdriver.Chrome()

        self.pool = ThreadPoolExecutor(max_workers=8)
        self.product_model = Product()
        self.configuration_model = Configuration()
        self.logger = get_task_logger('pricegrabber.scraper')
        self.session = requests.Session()
        self.bypass_started = False

    def run(self):
        self.logger.info('scraping started')
        self.driver.get(self.start_url)

        config = self.configuration_model.find_one()
        self.configuration_model.update(config['_id'], {'last_run_time': datetime.now()})

        products = self.product_model.find({})
        futures = {}

        for product in products:
            url = product['url']
            url = url.strip()
            future = self.pool.submit(self.fetch, url)
            futures[future] = product

        for future in as_completed(futures):
            product = futures[future]
            data = future.result()

            if data is None:
                continue

            try:
                product.pop('created', None)
                product.pop('updated', None)

                if not data['is_errored']:
                    product['name'] = data['name']
                    product['review_count'] = data['review']['count']
                    product['review_rating'] = data['review']['rating']
                    product['is_errored'] = data['is_errored']
                    product['error'] = ''
                    product['is_updated'] = True
                    today = str(date.today())

                    if 'price' not in product:
                        product['price'] = {}

                    product['price'][today] = data['price']

                    if 'competitors' in product:
                        for shop, price in data['competitors'].items():
                            if shop in product['competitors']:
                                product['competitors'][shop][today] = price
                                keys = product['competitors'][shop].keys()
                                if len(keys) > 7:
                                    product['competitors'][shop].pop(keys[0])
                            else:
                                product['competitors'][shop] = {}
                                product['competitors'][shop][today] = price
                    else:
                        product['competitors'] = {}
                        for shop, price in data['competitors'].items():
                            product['competitors'][shop] = {}
                            product['competitors'][shop][today] = price
                    self.logger.info('updated %s', product['url'])
                else:
                    product['is_errored'] = data['is_errored']
                    product['error'] = data['error']
                    product['is_updated'] = False
                    self.logger.info('errored %s', product['url'])

                self.product_model.update(product.pop('_id'), product)
            except KeyError:
                self.logger.error('KeyError in processing product %s', product['url'])
                pass
            except ValueError:
                self.logger.error('Validation failed while saving product %s', product['url'])
        return True

    def fetch(self, url):
        regex = r'https:\/\/www.skroutz.gr\/.*\.html'

        if not re.match(regex, url) or url.count('?') > 1:
            return {
                'is_errored': True,
                'error': 'Invalid URL'
            }

        content = self.get_content(url)

        if not content:
            if not self.bypass_started:
                self.bypass(url)
                content = self.get_content(url)
                if not content:
                    return None
            else:
                return None

        try:
            tree = html.fromstring(content)
            detail = tree.xpath('//script[@type="application/json"]')[0]
            detail_base64 = detail.text_content()[4:-3]
            data = json.loads(base64.b64decode(detail_base64).decode('utf-8'))

            name = data['full_name']
            price = data['price_min_unformatted']
            review = {
                'rating': data['reviews_data']['reviews_score'],
                'count': data['reviews_data']['reviews_count']
            }
            shops = data['shops']
            competitors = {}

            for product_id, product in data['product_cards'].items():
                competitor_name = shops[str(product['shop_id'])]['name']
                competitor_price = product['raw_price']
                competitors[competitor_name] = competitor_price

            return {
                'name': name,
                'price': price,
                'review': review,
                'competitors': competitors,
                'is_errored': not data['has_products'],
                'error': '' if data['has_products'] else 'Product does not exist'
            }
        except KeyError:
            self.logger.error('KeyError in fetching product %s', url)
            return None
        except IndexError:
            self.logger.error('Detail does not exist %s', url)
            return None
        except ParserError:
            self.logger.error('Parser error %s', url)
            return None

    def bypass(self, page_url):
        self.bypass_started = True
        self.logger.info('Bypassing %s', page_url)

        try:
            self.driver.get(page_url)
            data = {
                'method': 'userrecaptcha',
                'googlekey': self.data_sitekey,
                'key': self.api_key,
                'pageurl': page_url,
                'json': 1
            }
            url = self.api_url + 'in.php'
            response = self.session.post(url, data=data)
            request_id = response.json()['request']
            url = self.api_url + 'res.php?key=' + self.api_key + '&action=get&id=' + request_id + '&json=1'

            status = 0
            while not status:
                res = requests.get(url)
                if res.json()['status'] == 0:
                    time.sleep(3)
                else:
                    answer = res.json()['request']
                    script = 'document.getElementById("g-recaptcha-response").innerHTML="' + answer + '";'
                    script += 'document.getElementById("g-recap-data").value = "' + answer + '";'
                    self.driver.execute_script(script)
                    self.driver.find_element_by_id('recap-form').submit()
                    status = 1
        except JavascriptException:
            self.logger.error('Javascript error')
            pass

        self.bypass_started = False
        self.logger.info('Bypassed %s', page_url)

    def get_content(self, url):
        try:
            script = 'const url = "%s";' % url + '''
                        function getContent(url) {
                            return new Promise((resolve) => {
                                const xhr = new XMLHttpRequest();
                                xhr.open('GET', url, true);
                                xhr.onreadystatechange = function() {
                                    if (this.readyState === XMLHttpRequest.DONE) {
                                        console.log(this.status);
                                        if (this.status === 200) {
                                            resolve(xhr.responseText)
                                        } else {
                                            resolve(null);
                                        }
                                    } 
                                }
                                xhr.send();
                            })
                        }
                        const content = await getContent(url);
                        return content;
                    '''
            content = self.driver.execute_script(script)
            return content
        except ProtocolError:
            self.logger.error('Protocol error %s', url)
            return None

