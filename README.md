# Price Grabber

## Overview
This is web application to scrape the products from www.skroutz.gr.

## Requirement
Python 3.5+

## Installation

### MongoDB
The application uses mongodb to store the products.

```
$ sudo apt update
$ sudo apt install -y mongodb
```
[Learn more](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04)

### Download

```
$ git clone https://github.com/Eagle19243/pricegrabber.git
```

### Virtual Environment
Create and populate development virtualenv.

```
$ virtualenv ~/venv/pricegrabber
$ . ~/venv/pricegrabber/bin/activate
$ pip install -r requirement.txt
```

## Configuration
The application configuration is stored in a YAML file. Create a YAML file(or just make a copy of config.yml.example and rename it to config.yml) and pass its path to the app through environment variable `PRICE_GRABBER_CONF`:

```
$ cat config.yml

DB:
  url: mongodb://127.0.0.1:27017/
  name: pricegrabber
  user: ""
  password: ""

LOGGING:
  version: 1
  disable_existing_loggers: false
  handlers:
    console:
      class: logging.StreamHandler
      formatter: default
    worker:
      class: logging.FileHandler
      formatter: default
      filename: /tmp/pricegrabber.log
  formatters:
    default:
      format: "%(asctime)s %(levelname)s %(thread)d %(name)s %(message)s"
      datefmt: "%Y-%m-%d %H:%M:%S"
  root:
    level: WARN
  loggers:
    pricegrabber.worker:
      handlers: [worker]
      level: WARN
    pricegrabber.web:
      handlers: [console]
      level: WARN

SECRET_KEY: pricegrabber

$ pwd
/home/root/pricegrabber/config.yml
$ export PRICE_GRABBER_CONF=/home/root/pricegrabber/config.yml
```

## Building Frontend
This project uses React for frontend. To build all required files for production, follow the steps below:
```
$ npm install
$ npm run build
```

## Run
Run gunicorn server with:
```
$ . run_gunicorn.sh
```

Open your browser and navigate to [http://127.0.0.1:8093/](http://127.0.0.1:8093/).

