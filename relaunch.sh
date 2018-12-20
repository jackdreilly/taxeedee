export PROJECT_ID=taxeedee-212808
gcloud beta builds submit
docker-compose pull
docker-compose up -d --no-deps tweb
docker image prune -f
