#!/bin/bash
# Alternative: Create a migration endpoint that can be called
# This script creates a temporary migration endpoint

echo "To run the migration, use one of these methods:"
echo ""
echo "METHOD 1: Cloud Console SQL Editor (Recommended)"
echo "1. Visit: https://console.cloud.google.com/sql/instances/junction2025db/databases?project=gen-lang-client-0044988466"
echo "2. Click on database 'junction2025'"
echo "3. Use SQL Editor and run:"
echo "   ALTER TABLE users ADD COLUMN voice_profile_id VARCHAR(255) NULL;"
echo ""
echo "METHOD 2: Use Cloud SQL Proxy"
echo "1. Download: https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud-sql-proxy"
echo "2. chmod +x cloud-sql-proxy"
echo "3. ./cloud-sql-proxy gen-lang-client-0044988466:europe-north1:junction2025db"
echo "4. In another terminal: mysql -h 127.0.0.1 -u root -p junction2025"
echo "5. Run: ALTER TABLE users ADD COLUMN voice_profile_id VARCHAR(255) NULL;"

