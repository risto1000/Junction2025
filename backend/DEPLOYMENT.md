# Cloud SQL MySQL Deployment Guide

This guide covers deploying the backend to Google Cloud Run with Cloud SQL MySQL connectivity.

## Prerequisites

✅ **Already Completed:**
- Service Account: `junction2025-app-runner`
  - Roles: Cloud SQL Client, Secret Manager Secret Accessor
- Secret Manager: `junction2025-db-password`
  - Contains database password: `Kanakissa1!`
- Secret Manager: `elevenlabs-api-key` (create this)
  - Contains ElevenLabs API key for voice profile creation
- Database User: `root`
- Instance: `gen-lang-client-0044988466:europe-north1:junction2025db`

## Local Development Setup

### 1. Install Cloud SQL Auth Proxy

Download and install from:
https://cloud.google.com/sql/docs/mysql/sql-proxy

### 2. Run the Proxy

In a separate terminal:
```bash
cloud_sql_proxy gen-lang-client-0044988466:europe-north1:junction2025db
```

Keep this terminal open while developing.

### 3. Create .env File

Copy `.env.example` to `.env` in the `backend/` directory:
```bash
cd backend
cp .env.example .env
```

Edit `.env` and set:
```env
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_USER="root"
DB_PASS="Kanakissa1!"
DB_NAME="junction2025"
ELEVENLABS_API_KEY="your-elevenlabs-api-key-here"
ELEVENLABS_AGENT_ID="your-agent-id-here"  # Optional: can also be passed in API request
API_BASE_URL="https://your-deployed-api-url.com"  # Optional: auto-detected if not set
```

### 4. Install Dependencies

```bash
cd backend
npm install
```

### 5. Run the Server

```bash
npm run dev
```

The server will run on `http://localhost:8080`

## Database Setup

Before deploying, ensure you have created a database inside your Cloud SQL instance:

1. Go to Cloud SQL in Google Cloud Console
2. Click on your instance: `junction2025db`
3. Go to the "Databases" tab
4. Click "CREATE DATABASE"
5. Name it: `junction2025` (or update `.env` and Cloud Run config)

### Run Database Migration

To add the `voice_profile_id` column to the users table:

```bash
cd backend
npm install
tsx migrate-voice-profile.ts
```

This will add the `voice_profile_id` column to store ElevenLabs voice profile IDs.

## Deploying to Cloud Run

### Step 1: Build and Test Locally

```bash
cd backend
npm run build
npm start
```

### Step 2: Deploy to Cloud Run

1. Go to **Cloud Run** in Google Cloud Console
2. Click **"+ CREATE SERVICE"**
3. Choose **"Continuously deploy new revisions from a source repository"**
4. Click **"SET UP WITH CLOUD BUILD"**
5. Connect your GitHub account and select the `Junction2025` repository
6. Click **Next**

### Step 3: Configure Build Settings

- **Branch**: `feature/database-integration` (or your branch)
- **Build Type**: **Dockerfile**
- **Dockerfile path**: `backend/Dockerfile`
- Click **Save**

### Step 4: Configure Service Details

- **Service name**: `junction2025-backend`
- **Region**: **europe-north1** (CRITICAL: Must match your database region)
- **Authentication**: **"Allow unauthenticated invocations"** (for public API)

### Step 5: Configure Container, Connections, and Secrets

1. Expand **"Container(s), Volumes, Networking, Security"**

2. **Cloud SQL Connections**:
   - Go to **"Cloud SQL Connections"** section
   - Click **"+ ADD CONNECTION"**
   - Select: `gen-lang-client-0044988466:europe-north1:junction2025db`

3. **Variables & Secrets** tab:
   - Click **"+ ADD VARIABLE"**
     - **Name**: `DB_USER`
     - **Value**: `root`
   
   - Click **"+ ADD VARIABLE"**
     - **Name**: `DB_NAME`
     - **Value**: `junction2025` (or your database name)
   
   - Click **"+ ADD VARIABLE"**
     - **Name**: `INSTANCE_CONNECTION_NAME`
     - **Value**: `gen-lang-client-0044988466:europe-north1:junction2025db`
   
   - Click **"Reference a secret"** tab:
     - **Exposed as**: Environment Variable
     - **Name**: `DB_PASS`
     - **Secret**: Select `junction2025-db-password`
     - **Version**: `latest`
     - Click **Done**
   
   - Click **"Reference a secret"** tab again:
     - **Exposed as**: Environment Variable
     - **Name**: `ELEVENLABS_API_KEY`
     - **Secret**: Select `elevenlabs-api-key` (create this secret in Secret Manager first)
     - **Version**: `latest`
     - Click **Done**

4. **Security** tab:
   - **Service Account**: Select `junction2025-app-runner`

### Step 6: Deploy

Click **"CREATE"** and wait for Cloud Build to:
1. Build your Docker image
2. Push it to Artifact Registry
3. Deploy to Cloud Run

## API Endpoints

Once deployed, your API will be available at:

- `GET /health` - Health check
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `POST /api/users/voice-profile` - Create or update user profile from ElevenLabs voice data
  - Body: `{ user_id?: number, voice_profile_id?: string, full_name, age, tagline, location, ... }`
  - If `user_id` provided: updates existing user
  - If `user_id` not provided: creates new user
- `POST /api/rsvps` - Create RSVP
- `GET /api/users/:id/favorites` - Get user favorites
- `POST /api/favorites` - Add favorite
- `DELETE /api/favorites` - Remove favorite
- `POST /webhook` - Webhook endpoint
- `POST /api/conversations/start` - Start ElevenLabs Conversational AI conversation
  - Body: `{ phoneNumber: string, userId?: number, agentId?: string }`
  - Returns: `{ success: boolean, conversation_id: string, status: string, webhook_url: string }`
- `GET /api/conversations/:conversationId` - Get conversation status
- `POST /api/webhook/elevenlabs` - ElevenLabs webhook endpoint (receives conversation results)

## Troubleshooting

### Database Connection Issues

- Verify the region matches: `europe-north1`
- Check that the service account has the correct roles
- Verify the secret exists and is accessible
- Check Cloud Run logs for detailed error messages

### Build Issues

- Ensure all dependencies are in `package.json`
- Check that `tsconfig.json` is correct
- Verify the Dockerfile is in the `backend/` directory

### Local Development Issues

- Ensure Cloud SQL Auth Proxy is running
- Verify `.env` file exists and has correct values
- Check that the database exists in Cloud SQL
- Verify `ELEVENLABS_API_KEY` is set in `.env` for voice profile features

### ElevenLabs Integration

- Create a secret in Google Cloud Secret Manager named `elevenlabs-api-key`
- Add your ElevenLabs API key as the secret value
- Create a Conversational AI agent in ElevenLabs dashboard and get the agent ID
- Optionally create a secret named `elevenlabs-agent-id` with your agent ID (or pass it in API requests)
- The backend will use this to start voice conversations when users initiate voice onboarding
- The webhook endpoint `/api/webhook/elevenlabs` receives the conversation results and user descriptions
- The `user_descriptions` table stores the extracted user information from conversations

