#!/bin/sh
git push
REPO=gcr.io/$PROJECT_ID/taxeedee_html
docker build ./ --tag $REPO
docker push $REPO