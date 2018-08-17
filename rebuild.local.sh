#!/usr/bin/env bash
export PROJECT_ID=taxeedee-212808
cd backend
docker-compose down -t 1
docker-compose up -d
cd ../
virtualenv /tmp/env
source /tmp/env/bin/activate
pip install -r requirements.txt
mkdir /tmp/web
sh rebuild.html.sh
STATIC_FOLDER=html/html FLASK_DEBUG=1 FLASK_ENV=debug FLASK_APP=web.py flask run
