#!/bin/bash
# Test script to list ElevenLabs agents and test conversation start

API_URL="http://localhost:8080"

echo "🔍 Testing ElevenLabs Integration"
echo "================================="
echo ""

# Test 1: List available agents
echo "1. Listing available agents..."
AGENTS_RESPONSE=$(curl -s "${API_URL}/api/conversations/agents")

if echo "$AGENTS_RESPONSE" | grep -q '"success":true'; then
  echo "✅ Agents retrieved successfully!"
  echo ""
  echo "$AGENTS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$AGENTS_RESPONSE"
  echo ""
  
  # Extract first agent ID
  FIRST_AGENT_ID=$(echo "$AGENTS_RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['agents'][0]['agent_id'] if data.get('agents') and len(data['agents']) > 0 else '')" 2>/dev/null)
  FIRST_AGENT_NAME=$(echo "$AGENTS_RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['agents'][0]['name'] if data.get('agents') and len(data['agents']) > 0 else '')" 2>/dev/null)
  
  if [ -n "$FIRST_AGENT_ID" ]; then
    echo "📝 Using agent: $FIRST_AGENT_NAME (ID: $FIRST_AGENT_ID)"
    echo ""
    
    # Test 2: Start conversation with first agent
    echo "2. Starting conversation session..."
    START_RESPONSE=$(curl -s -X POST "${API_URL}/api/conversations/start" \
      -H "Content-Type: application/json" \
      -d "{\"userId\": 123, \"agentId\": \"$FIRST_AGENT_ID\"}")
    
    if echo "$START_RESPONSE" | grep -q '"success":true'; then
      echo "✅ Conversation session started!"
      echo ""
      echo "$START_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$START_RESPONSE"
    else
      echo "❌ Failed to start conversation:"
      echo "$START_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$START_RESPONSE"
    fi
  else
    echo "⚠️  No agents found. Create an agent in your ElevenLabs dashboard first."
  fi
else
  echo "❌ Failed to retrieve agents:"
  echo "$AGENTS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$AGENTS_RESPONSE"
fi

echo ""
echo "💡 Tip: Update your .env file with:"
echo "   ELEVENLABS_AGENT_ID=\"$FIRST_AGENT_ID\""

