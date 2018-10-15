export PROJECT_ID=taxeedee-212808
cd backend
docker-compose down -t 1
cd ../
gcloud builds submit --config cloudbuild.yaml
gcloud container images add-tag gcr.io/$PROJECT_ID/taxeedee_html:latest gcr.io/$PROJECT_ID/taxeedee_html:working -q
docker-compose pull
docker-compose up tweb