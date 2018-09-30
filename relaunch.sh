export PROJECT_ID=taxeedee-212808
gcloud container images add-tag gcr.io/$PROJECT_ID/taxeedee_html:latest gcr.io/$PROJECT_ID/taxeedee_html:working -q
gcloud container images add-tag gcr.io/$PROJECT_ID/taxeedee_db:latest gcr.io/$PROJECT_ID/taxeedee_db:working -q
PROJECT_ID=taxeedee-212808 docker-compose pull
PROJECT_ID=taxeedee-212808 docker-compose up -d --no-deps tweb server
docker image prune -f
