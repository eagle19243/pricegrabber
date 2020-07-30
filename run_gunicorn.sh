#!/usr/bin/env bash
# Initialize options for gunicorn
OPTS=(
  --env FLASK_APP=pricegrabber
  --env FLASK_ENV=development
  --workers 2
  --access-logfile -
  --error-logfile -
  --log-level debug
  -b 0.0.0.0:8093
  --reload
)

#Run gunicorn
gunicorn "${OPTS[@]}" server.application:APP
