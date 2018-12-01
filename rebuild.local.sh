#!/usr/bin/env bash
export PROJECT_ID=taxeedee-212808
cd backend
docker-compose pull server
docker-compose up -d
cd ../
virtualenv env
source env/bin/activate
pip install -r requirements.txt
# sh rebuild.html.sh
export MONGO_PORT=27019
EMAIL_PASSWORD=junk MONGO_PORT=27019 STATIC_FOLDER=html/build FLASK_DEBUG=1 FLASK_ENV=debug FLASK_APP=web.py flask run --host 0.0.0.0 --port 5000
