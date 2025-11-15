#!/bin/bash
# Script to migrate data to Google Cloud SQL

set -e

echo "=== Migrating Data to Google Cloud SQL ==="
echo ""

# Cloud SQL instance details
INSTANCE_CONNECTION_NAME="gen-lang-client-0044988466:europe-north1:junction2025db"
DB_NAME="junction2025"
DB_USER="root"

# Check if we're using local proxy or direct connection
USE_PROXY=true

# Check if cloud_sql_proxy is running
if ! pgrep -f "cloud_sql_proxy" > /dev/null; then
    echo "⚠️  Cloud SQL Auth Proxy is not running"
    echo ""
    echo "Starting Cloud SQL Auth Proxy..."
    echo "   Run this in a separate terminal:"
    echo "   ./setup-local-dev.sh"
    echo ""
    read -p "Press Enter when the proxy is running, or Ctrl+C to exit..."
fi

# Check if proxy is listening
if ! nc -z 127.0.0.1 3306 2>/dev/null; then
    echo "❌ Cloud SQL Auth Proxy is not listening on port 3306"
    echo "   Please start it first with: ./setup-local-dev.sh"
    exit 1
fi

echo "✅ Cloud SQL Auth Proxy is running"
echo ""

# Get password from Secret Manager or use environment variable
if [ -z "$DB_PASS" ]; then
    echo "Fetching database password from Secret Manager..."
    if command -v gcloud &> /dev/null; then
        DB_PASS=$(gcloud secrets versions access latest --secret="junction2025-db-password" 2>/dev/null || echo "")
        if [ -z "$DB_PASS" ]; then
            echo "⚠️  Could not fetch from Secret Manager"
            echo "   Please set DB_PASS environment variable:"
            echo "   export DB_PASS='your_password'"
            exit 1
        fi
    else
        echo "❌ gcloud CLI not found"
        echo "   Please set DB_PASS environment variable:"
        echo "   export DB_PASS='your_password'"
        exit 1
    fi
fi

echo "✅ Database credentials ready"
echo ""

# Create .env file for Cloud SQL connection
echo "Creating temporary .env file for Cloud SQL..."
cat > .env.cloudsql << EOF
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}
DB_NAME=${DB_NAME}
EOF

echo "✅ Environment file created"
echo ""

# Run the seed script with Cloud SQL environment
echo "🌱 Running seed script against Cloud SQL..."
echo "   Instance: ${INSTANCE_CONNECTION_NAME}"
echo "   Database: ${DB_NAME}"
echo ""

# Backup current .env if it exists
if [ -f .env ]; then
    cp .env .env.backup
    echo "📦 Backed up existing .env to .env.backup"
fi

# Use Cloud SQL .env
cp .env.cloudsql .env

# Run seed script
npm run seed

# Restore original .env if backup exists
if [ -f .env.backup ]; then
    mv .env.backup .env
    echo "📦 Restored original .env file"
fi

# Clean up
rm -f .env.cloudsql

echo ""
echo "✅ Migration to Cloud SQL completed!"
echo ""
echo "📊 Verify the migration:"
echo "   curl http://localhost:8080/api/users/1"
echo "   curl http://localhost:8080/api/events"
echo ""

