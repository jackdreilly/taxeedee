export PROJECT_ID=taxeedee-212808
gcloud builds submit
docker-compose pull
docker-compose up -d --no-deps tweb
docker image prune -f
