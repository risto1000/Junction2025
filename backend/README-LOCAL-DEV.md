# Local Development Setup

## Quick Start

1. **Authenticate with Google Cloud:**
   ```bash
   export PATH="$HOME/google-cloud-sdk/bin:$PATH"
   gcloud auth application-default login
   ```
   This will open a browser for you to sign in.

2. **Run the setup script:**
   ```bash
   cd backend
   ./setup-local-dev.sh
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Manual Setup

If you prefer to set things up manually:

### Step 1: Authenticate
```bash
export PATH="$HOME/google-cloud-sdk/bin:$PATH"
gcloud auth application-default login
```

### Step 2: Start Cloud SQL Auth Proxy
In a separate terminal:
```bash
cloud_sql_proxy gen-lang-client-0044988466:europe-north1:junction2025db
```

Keep this terminal open while developing.

### Step 3: Start Development Server
In another terminal:
```bash
cd backend
npm run dev
```

The server will be available at `http://localhost:8080`

## Verify Connection

Test the health endpoint:
```bash
curl http://localhost:8080/health
```

You should see:
```json
{"status":"ok","timestamp":"...","database":"connected"}
```

## Troubleshooting

### Proxy won't start
- Check authentication: `gcloud auth application-default print-access-token`
- Check logs: `tail -f /tmp/cloud_sql_proxy.log`

### Database connection refused
- Make sure the proxy is running: `pgrep -f cloud_sql_proxy`
- Check port 3306: `netstat -tuln | grep 3306`
- Verify `.env` file has correct credentials

### Authentication errors
- Re-authenticate: `gcloud auth application-default login`
- Check project: `gcloud config get-value project`
