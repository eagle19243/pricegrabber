#!/usr/bin/env bash
celery -A server.celery.celery worker -B -l INFO --logfile="~/pricegrabber.log" --concurrency=1