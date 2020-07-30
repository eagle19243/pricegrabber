#!/usr/bin/env bash
celery -A server.application.CELERY worker -l warn
