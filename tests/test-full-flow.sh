#!/bin/bash
# Test the full ElevenLabs voice profile automation flow

API_URL="https://junction2025-backend-1087825056058.europe-north1.run.app"

echo "🧪 Testing Full ElevenLabs Voice Profile Flow"
echo "=============================================="
echo ""

# Step 1: Simulate voice recording completion (what ElevenLabs would send)
echo "Step 1: Simulating ElevenLabs voice profile data..."
VOICE_PROFILE_DATA='{
  "voice_profile_id": "elevenlabs_voice_'$(date +%s)'",
  "full_name": "Jari Koskinen",
  "age": 68,
  "tagline": "Retired carpenter — loves walks & woodworking",
  "location": "Helsinki, Finland",
  "hobbies": ["Woodworking", "Duck Walks", "Swimming", "Knitting"],
  "career_highlights": [
    {"company": "Helsinki Construction", "title": "Master Carpenter", "years": "1978-2015"},
    {"company": "City of Helsinki", "title": "Woodwork Instructor", "years": "2016-2020"}
  ],
  "achievements": ["Master Carpenter", "Community Mentor", "50+ Events Hosted"],
  "micro_apprenticeship_offer": "30-min coffee chat on basic chair repair",
  "offering_apprenticeship": true
}'

# Step 2: Create profile (new user scenario)
echo "Step 2: Creating new user profile via API..."
CREATE_RESPONSE=$(curl -s -X POST "${API_URL}/api/users/voice-profile" \
  -H "Content-Type: application/json" \
  -d "$VOICE_PROFILE_DATA")

USER_ID=$(echo $CREATE_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
VOICE_ID=$(echo $CREATE_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['voice_profile_id'])" 2>/dev/null)

if [ -z "$USER_ID" ]; then
  echo "❌ Failed to create user profile"
  echo "Response: $CREATE_RESPONSE"
  exit 1
fi

echo "✅ User profile created successfully!"
echo "   User ID: $USER_ID"
echo "   Voice Profile ID: $VOICE_ID"
echo ""

# Step 3: Verify profile was created correctly
echo "Step 3: Verifying profile data..."
VERIFY_RESPONSE=$(curl -s "${API_URL}/api/users/${USER_ID}")
VERIFY_NAME=$(echo $VERIFY_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['full_name'])" 2>/dev/null)
VERIFY_HOBBIES=$(echo $VERIFY_RESPONSE | python3 -c "import sys, json; h=json.load(sys.stdin)['hobbies']; print(','.join(h) if isinstance(h,list) else h)" 2>/dev/null)

if [ "$VERIFY_NAME" != "Jari Koskinen" ]; then
  echo "❌ Profile verification failed: name mismatch"
  exit 1
fi

echo "✅ Profile verified!"
echo "   Name: $VERIFY_NAME"
echo "   Hobbies: $VERIFY_HOBBIES"
echo ""

# Step 4: Test update scenario (re-record)
echo "Step 4: Testing profile update (re-record scenario)..."
UPDATE_DATA='{
  "user_id": '$USER_ID',
  "voice_profile_id": "elevenlabs_voice_updated_'$(date +%s)'",
  "full_name": "Jari Koskinen",
  "age": 69,
  "tagline": "Updated: Retired carpenter — loves walks & woodworking",
  "location": "Helsinki, Finland",
  "hobbies": ["Woodworking", "Duck Walks", "Swimming", "Knitting", "Photography"]
}'

UPDATE_RESPONSE=$(curl -s -X POST "${API_URL}/api/users/voice-profile" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_DATA")

UPDATED_AGE=$(echo $UPDATE_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['age'])" 2>/dev/null)
UPDATED_HOBBIES=$(echo $UPDATE_RESPONSE | python3 -c "import sys, json; h=json.load(sys.stdin)['hobbies']; print(len(h) if isinstance(h,list) else 0)" 2>/dev/null)

if [ "$UPDATED_AGE" != "69" ] || [ "$UPDATED_HOBBIES" != "5" ]; then
  echo "❌ Update failed: data mismatch"
  echo "Response: $UPDATE_RESPONSE"
  exit 1
fi

echo "✅ Profile updated successfully!"
echo "   Updated Age: $UPDATED_AGE"
echo "   Updated Hobbies Count: $UPDATED_HOBBIES"
echo ""

# Step 5: Test frontend API call format
echo "Step 5: Testing frontend API integration format..."
FRONTEND_PAYLOAD='{
  "voice_profile_id": "test_frontend_'$(date +%s)'",
  "full_name": "Frontend Test User",
  "age": 25,
  "tagline": "Test from frontend",
  "location": "Test Location",
  "hobbies": ["Test1", "Test2"]
}'

FRONTEND_RESPONSE=$(curl -s -X POST "${API_URL}/api/users/voice-profile" \
  -H "Content-Type: application/json" \
  -d "$FRONTEND_PAYLOAD")

FRONTEND_USER_ID=$(echo $FRONTEND_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)

if [ -z "$FRONTEND_USER_ID" ]; then
  echo "❌ Frontend integration test failed"
  exit 1
fi

echo "✅ Frontend integration test passed!"
echo ""

echo "=============================================="
echo "✅ ALL TESTS PASSED!"
echo ""
echo "Summary:"
echo "  - New user creation: ✅"
echo "  - Profile verification: ✅"
echo "  - Profile update (re-record): ✅"
echo "  - Frontend integration: ✅"
echo ""
echo "The ElevenLabs voice profile automation is working!"
echo "Service URL: $API_URL"
echo ""

