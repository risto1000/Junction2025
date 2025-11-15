#!/bin/bash

# Set your Google Cloud project ID
PROJECT_ID="gen-lang-client-0044988466"
REGION="europe-north1"
SERVICE_NAME="generations-connect-backend"

# Build and deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --add-cloudsql-instances $PROJECT_ID:$REGION:your-instance-name \
  --set-env-vars DB_NAME=generations_connect,DB_USER=postgres \
  --set-secrets DB_PASSWORD=db-password:latest,CLOUD_SQL_CONNECTION_NAME=cloud-sql-connection:latest