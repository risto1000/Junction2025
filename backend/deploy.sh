#!/bin/bash

# Set your Google Cloud project ID
PROJECT_ID="apprenticeshipcircle"
REGION="europe-north1"
SERVICE_NAME="apprentice-circles-backend"
INSTANCE_NAME="junction2025db"

# Build and deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --add-cloudsql-instances $PROJECT_ID:$REGION:$INSTANCE_NAME \
  --set-env-vars DB_NAME=apprentice_circles,DB_USER=postgres,NODE_ENV=production \
  --set-secrets DB_PASSWORD=db-password:latest,CLOUD_SQL_CONNECTION_NAME=cloud-sql-connection:latest \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10