export PROJECT_ID=taxeedee-212808
cd backend
docker-compose down -t 1
cd ../
gcloud builds submit --config cloudbuild.yaml
docker-compose pull
docker-compose up --no-deps tweb
