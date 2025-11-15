# Testing Database Integration

This document explains how to test the database initialization and table creation.

## Prerequisites

1. **Database Connection**: Ensure you have a MySQL database accessible
   - For local development: Run the Cloud SQL Auth Proxy (see `backend/setup-local-dev.sh`)
   - For production: Ensure Cloud SQL connection is configured

2. **Environment Variables**: Create a `.env` file in the `backend/` directory:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=junction2025
   ```

## Testing Steps

### 1. Test Database Initialization

Run the test script to verify tables are created correctly:

```bash
cd backend
npm run test:db
```

This will:
- ✅ Connect to the database
- ✅ Create all necessary tables (if they don't exist)
- ✅ Verify table structures
- ✅ Test inserting users (teaching skills)
- ✅ Test creating events (users teaching skills)
- ✅ Test RSVPs (users attending events)
- ✅ Clean up test data

### 2. Test Backend Server

Start the backend server:

```bash
cd backend
npm run dev
```

The server will:
- ✅ Initialize database connection
- ✅ Create tables automatically on startup
- ✅ Start on port 8080

Check the console output for:
```
Created users table
Created events table
Created rsvps table
Created favorites table
Created webhook_logs table
Database tables initialized successfully
Server running on port 8080
```

### 3. Test API Endpoints

With the server running, test the user API:

```bash
# Test health endpoint
curl http://localhost:8080/health

# Test user endpoint (will return 404 if user doesn't exist)
curl http://localhost:8080/api/users/1
```

### 4. Test Frontend Integration

Start the frontend development server:

```bash
cd frontend
npm run dev
```

The frontend will:
- ✅ Fetch user profile from `/api/users/1` on mount
- ✅ Handle loading states
- ✅ Handle 404 errors gracefully (if user doesn't exist)

Check the browser console for any errors.

## Expected Database Tables

After initialization, you should have these tables:

1. **users** - All users (both teaching and attending)
   - `offering_apprenticeship` flag indicates users teaching skills
   - Users who organize events (via `events.organizer_id`) are teaching skills

2. **events** - Events organized by users
   - `organizer_id` references `users.id`
   - `is_micro_apprenticeship` indicates skill-teaching events

3. **rsvps** - Users attending events
   - `user_id` references `users.id` (attendees/clients)
   - `event_id` references `events.id`

4. **favorites** - User favorite events

5. **webhook_logs** - Webhook event logging

## Troubleshooting

### Database Connection Errors

- Ensure Cloud SQL Auth Proxy is running (for local dev)
- Check environment variables in `.env` file
- Verify database credentials

### Table Creation Errors

- Check database permissions
- Ensure database exists
- Check MySQL version compatibility

### Frontend API Errors

- Ensure backend server is running on port 8080
- Check browser console for CORS errors
- Verify proxy configuration in `vite.config.ts`

## Manual Testing

To manually test with sample data:

1. Insert a user (teaching skills):
```sql
INSERT INTO users (full_name, first_name, last_name, age, tagline, location, offering_apprenticeship, micro_apprenticeship_offer)
VALUES ('Jari Koskinen', 'Jari', 'Koskinen', 68, 'Retired carpenter — loves walks & woodworking', 'Helsinki, Finland', true, '30-min coffee chat on basic chair repair');
```

2. Insert an event:
```sql
INSERT INTO events (title, organizer_id, time, date, location, description, capacity, spaces_left, is_micro_apprenticeship)
VALUES ('Morning Duck Walk', 1, '09:30', 'Saturday, Nov 16', 'Kaivopuisto Park', 'Join us for a gentle morning walk', 12, 12, false);
```

3. Insert an RSVP (user attending):
```sql
INSERT INTO users (full_name, first_name, last_name, age, offering_apprenticeship)
VALUES ('Alice Johnson', 'Alice', 'Johnson', 35, false);

INSERT INTO rsvps (event_id, user_id, invite_family)
VALUES (1, 2, false);
```

