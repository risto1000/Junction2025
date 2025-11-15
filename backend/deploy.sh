#!/bin/bash

# Set your Google Cloud project ID
PROJECT_ID="gen-lang-client-0044988466"
REGION="europe-north1"
SERVICE_NAME="junction2025-backend"
INSTANCE_NAME="junction2025db"
INSTANCE_CONNECTION_NAME="${PROJECT_ID}:${REGION}:${INSTANCE_NAME}"
SERVICE_ACCOUNT="junction2025-app-runner@${PROJECT_ID}.iam.gserviceaccount.com"

echo "Deploying to Cloud Run..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"
echo "Instance: $INSTANCE_CONNECTION_NAME"
echo ""

# Build and deploy to Cloud Run
# Note: Using root Dockerfile for full-stack deployment
gcloud run deploy $SERVICE_NAME \
  --source ../ \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --add-cloudsql-instances $INSTANCE_CONNECTION_NAME \
  --set-env-vars DB_NAME=junction2025,DB_USER=root,INSTANCE_CONNECTION_NAME=$INSTANCE_CONNECTION_NAME,NODE_ENV=production \
  --set-secrets DB_PASS=junction2025-db-password:latest \
  --service-account $SERVICE_ACCOUNT \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300
  