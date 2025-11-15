#!/bin/bash
# Setup script for local development with Cloud SQL

echo "=== Cloud SQL Local Development Setup ==="
echo ""

# Add gcloud and cloud_sql_proxy to PATH if not already there
export PATH="$HOME/google-cloud-sdk/bin:$HOME/.local/bin:$PATH"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it first:"
    echo "   curl https://sdk.cloud.google.com | bash"
    exit 1
fi

echo "✅ gcloud CLI found"

# Check if cloud_sql_proxy is installed
if ! command -v cloud_sql_proxy &> /dev/null; then
    echo "❌ cloud_sql_proxy not found in PATH"
    echo "   Looking for it in ~/.local/bin..."
    if [ -f "$HOME/.local/bin/cloud_sql_proxy" ]; then
        echo "   Found at ~/.local/bin/cloud_sql_proxy"
        export PATH="$HOME/.local/bin:$PATH"
    else
        echo "❌ cloud_sql_proxy not found. Please install it:"
        echo "   cd /tmp && wget https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.linux.amd64 -O cloud_sql_proxy"
        echo "   chmod +x cloud_sql_proxy && mkdir -p ~/.local/bin && mv cloud_sql_proxy ~/.local/bin/"
        exit 1
    fi
fi

echo "✅ cloud_sql_proxy found"

# Check authentication
echo ""
echo "Checking authentication..."
if gcloud auth application-default print-access-token &> /dev/null; then
    echo "✅ Application Default Credentials are set up"
else
    echo "❌ Application Default Credentials not found"
    echo ""
    echo "Please run the following command to authenticate:"
    echo "  gcloud auth application-default login"
    echo ""
    echo "This will open a browser window for you to sign in."
    echo "After authentication, run this script again."
    exit 1
fi

# Check if proxy is already running
if pgrep -f "cloud_sql_proxy" > /dev/null; then
    echo "✅ Cloud SQL Auth Proxy is already running"
    PROXY_PID=$(pgrep -f "cloud_sql_proxy")
    echo "   PID: $PROXY_PID"
else
    echo ""
    echo "Starting Cloud SQL Auth Proxy..."
    cloud_sql_proxy gen-lang-client-0044988466:europe-north1:junction2025db > /tmp/cloud_sql_proxy.log 2>&1 &
    PROXY_PID=$!
    sleep 3
    
    if pgrep -f "cloud_sql_proxy" > /dev/null; then
        echo "✅ Cloud SQL Auth Proxy started (PID: $PROXY_PID)"
        echo "   Logs: /tmp/cloud_sql_proxy.log"
    else
        echo "❌ Failed to start Cloud SQL Auth Proxy"
        echo "   Check logs: /tmp/cloud_sql_proxy.log"
        tail -20 /tmp/cloud_sql_proxy.log
        exit 1
    fi
fi

# Check if port 3306 is listening
echo ""
echo "Checking database connection..."
sleep 2
if nc -z 127.0.0.1 3306 2>/dev/null || timeout 1 bash -c "</dev/tcp/127.0.0.1/3306" 2>/dev/null; then
    echo "✅ Database proxy is listening on port 3306"
else
    echo "⚠️  Port 3306 is not listening yet. The proxy may still be starting..."
    echo "   Check logs: /tmp/cloud_sql_proxy.log"
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "You can now start the development server with:"
echo "  cd backend && npm run dev"
echo ""
echo "To stop the proxy, run:"
echo "  pkill -f cloud_sql_proxy"

