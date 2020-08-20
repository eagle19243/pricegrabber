import requests
import json
import base64
import logging
from datetime import datetime, date
from concurrent.futures import ThreadPoolExecutor, as_completed
from lxml import html
from .models.product import Product
from .models.configuration import Configuration


class Scraper:
    """Product Scraper class
    """

    def __init__(self):
        self.pool = ThreadPoolExecutor(max_workers=8)
        self.product_model = Product()
        self.configuration_model = Configuration()
        self.logger = logging.getLogger('pricegrabber.scraper')
        self.headers = {
            'authority': 'www.skroutz.gr',
            'cache-control': 'max-age=0',
            'sec-ch-ua': '"Google Chrome"; v="83"',
            'sec-ch-ua-mobile': '?0',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                          'Chrome/83.0.4103.97 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,'
                      'application/signed-exchange;v=b3;q=0.9',
            'sec-fetch-site': 'none',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'sec-fetch-dest': 'document',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'cookie': '_helmet_couch'
                      '=eyJzZXNzaW9uX2lkIjoiNjgzNzhmMmNmNjI5OTcxNjI5NzU2ZWNmMTM5MzE5MmIiLCJidWNrZXRfaWQiOiJmNTk1ZGRhYy00ZmVhLTQ5NmYtODNkNS00OWQzODgzMWFhYTAiLCJsYXN0X3NlZW4iOjE1OTEyNjgwNTUsInZvbCI6MSwiX2NzcmZfdG9rZW4iOiI1a3Yxb3FKTmhXTCs1YUxzdjYzRFk3TlNXeGs5TlhXYmZhM0UzSmtEL0NBPSJ9--22dfbfe582c0f3a7485e20d9d3932b32fbfb721b',
            'if-none-match': 'W/"e6fb8187391e99a90270c2351f9d17cd"',
        }
        self.session = requests.Session()
        self.session.head('http://www.skroutz.gr')

    def run(self):
        self.logger.info('scraping started')

        config = self.configuration_model.find_one()
        self.configuration_model.update(config['_id'], {'last_run_time': datetime.now()})

        products = self.product_model.find({})
        futures = {}

        for product in products:
            url = product['url']
            future = self.pool.submit(self.fetch, url)
            futures[future] = product

        for future in as_completed(futures):
            product = futures[future]
            data = future.result()

            if data is None:
                continue

            self.logger.info('scraped %s', product['url'])

            try:
                product['name'] = data['name']
                product['review_count'] = data['review']['count']
                product['review_rating'] = data['review']['rating']
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

                product.pop('created')
                product.pop('updated')
                self.product_model.update(product.pop('_id'), product)
            except KeyError:
                self.logger.error('KeyError in processing product %s', product['url'])
                pass
            except ValueError:
                self.logger.error('Validation failed while saving product %s', product['url'])

    def fetch(self, url):
        try:
            response = self.session.get(url, headers=self.headers)
            tree = html.fromstring(response.content)
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
                'competitors': competitors
            }
        except KeyError:
            self.logger.error('KeyError in fetching product %s', url)
            return None
        except IndexError:
            self.logger.error('Detail does not exist %s', url)
            return None
        except ValueError:
            self.logger.error('Invalid URL %s', url)
            return None


