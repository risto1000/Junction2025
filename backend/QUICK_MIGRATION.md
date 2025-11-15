# Quick Migration Guide - Cloud SQL

## One-Command Migration

```bash
cd backend
npm run seed:cloud
```

This will:
1. ✅ Check Cloud SQL Auth Proxy is running
2. ✅ Fetch password from Secret Manager
3. ✅ Create tables if needed
4. ✅ Seed all data to Cloud SQL
5. ✅ Preserve your local .env

## Prerequisites

1. **Start Cloud SQL Auth Proxy** (in separate terminal):
   ```bash
   cd backend
   ./setup-local-dev.sh
   ```

2. **Ensure you're authenticated**:
   ```bash
   gcloud auth application-default login
   ```

## What Gets Migrated

- 12 users (2 teaching, 10 attending)
- 5 events
- 11 RSVPs

## Verify Migration

```bash
# Check users
curl http://localhost:8080/api/users/1

# Check events  
curl http://localhost:8080/api/events
```

## Troubleshooting

**Proxy not running?**
```bash
./setup-local-dev.sh
```

**Password not found?**
```bash
export DB_PASS='Kanakissa1!'
npm run seed:cloud
```

See `MIGRATE_TO_CLOUD_SQL.md` for detailed instructions.

