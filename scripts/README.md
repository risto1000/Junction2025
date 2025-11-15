# Scripts

Utility scripts and migration files for the project.

## Structure

- `migrations/` - Database migration scripts
- `utils/` - Utility scripts for development and deployment

## Migrations

### migrate-voice-profile.ts
Adds the `voice_profile_id` column to the users table.

**Usage:**
```bash
cd backend
tsx ../scripts/migrations/migrate-voice-profile.ts
```

Or run via Cloud SQL Console:
```sql
ALTER TABLE users ADD COLUMN voice_profile_id VARCHAR(255) NULL;
```

## Utilities

### connect-db.sh
Connects to Cloud SQL database via proxy.

**Usage:**
```bash
./scripts/utils/connect-db.sh
```

### run-migration-via-api.sh
Helper script with instructions for running migrations.

