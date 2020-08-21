#!/usr/bin/env bash
celery -A server.celery.celery worker -B -l INFO --logfile="/tmp/pricegrabber.log"