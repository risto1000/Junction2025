#!/bin/bash
# Script to connect to Cloud SQL database

CONNECTION_NAME="gen-lang-client-0044988466:europe-north1:junction2025db"
PROXY_PATH="/tmp/cloud-sql-proxy"
SOCKET_DIR="/tmp/cloudsql"

# Create socket directory
mkdir -p $SOCKET_DIR

echo "Starting Cloud SQL Proxy..."
echo "Connection: $CONNECTION_NAME"
echo ""
echo "Option 1: Using Unix socket (default)"
echo "  mysql -S $SOCKET_DIR/$CONNECTION_NAME -u root -p junction2025"
echo ""
echo "Option 2: Using TCP (if you prefer)"
echo "  In another terminal, run:"
echo "  mysql -h 127.0.0.1 -P 3306 -u root -p junction2025"
echo ""
echo "Then run the migration:"
echo "  ALTER TABLE users ADD COLUMN voice_profile_id VARCHAR(255) NULL;"
echo ""
echo "Press Ctrl+C to stop the proxy"
echo ""

# Use TCP port for easier connection
$PROXY_PATH -instances=$CONNECTION_NAME=tcp:3306
