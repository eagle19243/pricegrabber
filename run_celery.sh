#!/usr/bin/env bash
celery -A pricegrabber.application.CELERY worker -l warn
