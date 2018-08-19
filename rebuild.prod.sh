export PROJECT_ID=taxeedee-212808
docker-compose down
gcloud builds submit --config cloudbuild.yaml
docker pull gcr.io/$PROJECT_ID/taxeedee_html
docker-compose up
