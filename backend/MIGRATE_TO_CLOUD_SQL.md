# Migrating Data to Google Cloud SQL

This guide explains how to migrate all hardcoded data from the frontend to your Google Cloud SQL database.

## Prerequisites

1. **Cloud SQL Instance**: `gen-lang-client-0044988466:europe-north1:junction2025db`
2. **Database**: `junction2025` (must exist in Cloud SQL)
3. **Cloud SQL Auth Proxy**: Running locally (for local migration)
4. **Authentication**: gcloud CLI authenticated with Application Default Credentials

## Quick Start

### Option 1: Automated Script (Recommended)

1. **Start Cloud SQL Auth Proxy** (in a separate terminal):
   ```bash
   cd backend
   ./setup-local-dev.sh
   ```

2. **Run the migration script**:
   ```bash
   cd backend
   ./migrate-to-cloud-sql.sh
   ```

   The script will:
   - ✅ Check if Cloud SQL Auth Proxy is running
   - ✅ Fetch database password from Secret Manager
   - ✅ Create tables if they don't exist
   - ✅ Seed all users, events, and RSVPs
   - ✅ Preserve your local .env file

### Option 2: Manual Migration

1. **Start Cloud SQL Auth Proxy**:
   ```bash
   cd backend
   ./setup-local-dev.sh
   ```

2. **Set environment variables**:
   ```bash
   export DB_HOST=127.0.0.1
   export DB_PORT=3306
   export DB_USER=root
   export DB_PASS=$(gcloud secrets versions access latest --secret="junction2025-db-password")
   export DB_NAME=junction2025
   ```

3. **Run the seed script**:
   ```bash
   cd backend
   npm run seed
   ```

## What Gets Migrated

The migration script will create:

- **12 Users**:
  - 2 users teaching skills (Jari Koskinen, Mirka Lahti)
  - 10 attendee users (Alice, Bob, Charlie, etc.)

- **5 Events**:
  - Morning Duck Walk
  - Intro to Chair Repair
  - Intergenerational Story Circle
  - Cycling Mentorship Coffee
  - Weekend Knitting Circle

- **11 RSVPs**:
  - All participant relationships between users and events

## Verification

After migration, verify the data:

1. **Check users**:
   ```bash
   curl http://localhost:8080/api/users/1
   ```

2. **Check events**:
   ```bash
   curl http://localhost:8080/api/events
   ```

3. **Check database directly** (if you have MySQL client):
   ```bash
   mysql -h 127.0.0.1 -P 3306 -u root -p${DB_PASS} junction2025
   ```
   Then run:
   ```sql
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM events;
   SELECT COUNT(*) FROM rsvps;
   ```

## Troubleshooting

### Cloud SQL Auth Proxy Not Running

**Error**: `Cloud SQL Auth Proxy is not listening on port 3306`

**Solution**:
```bash
cd backend
./setup-local-dev.sh
```

### Cannot Fetch Password from Secret Manager

**Error**: `Could not fetch from Secret Manager`

**Solution**: Set the password manually:
```bash
export DB_PASS='Kanakissa1!'
./migrate-to-cloud-sql.sh
```

### Database Does Not Exist

**Error**: `Unknown database 'junction2025'`

**Solution**: Create the database in Cloud SQL Console:
1. Go to [Cloud SQL Console](https://console.cloud.google.com/sql)
2. Select instance: `junction2025db`
3. Go to "Databases" tab
4. Click "CREATE DATABASE"
5. Name: `junction2025`

### Tables Already Exist

**Note**: The seed script will skip if data already exists. To re-seed:
1. Clear the database tables (or drop and recreate)
2. Run the migration again

## Production Deployment

After migrating data locally, when you deploy to Cloud Run:

1. **Tables are created automatically** on server startup (via `initTables()`)
2. **Data persists** in Cloud SQL
3. **No additional migration needed** - the data is already in Cloud SQL

## Next Steps

1. ✅ Data migrated to Cloud SQL
2. ✅ Tables created automatically
3. ✅ Frontend configured to use database
4. 🚀 Deploy to Cloud Run (data is already in Cloud SQL)

## Environment Variables Reference

For Cloud SQL connection via proxy (local):
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=<from Secret Manager>
DB_NAME=junction2025
```

For Cloud Run (production):
```env
INSTANCE_CONNECTION_NAME=gen-lang-client-0044988466:europe-north1:junction2025db
DB_USER=root
DB_PASS=<from Secret Manager>
DB_NAME=junction2025
```

