#!/bin/sh
export PROJECT_ID=taxeedee-212808
gcloud alpha builds submit ./ --config cloudbuild.yaml