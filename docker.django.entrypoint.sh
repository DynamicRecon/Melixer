#!/usr/bin/sh

python manage.py collectstatic --noinput
python manage.py migrate --noinput

gunicorn --bind 0.0.0.0:3443 --workers 3 --timeout 120 --access-logfile - --error-logfile - backend.wsgi:application