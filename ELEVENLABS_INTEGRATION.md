# ElevenLabs Real-Time Conversational AI Integration Guide

This guide explains how to use the ElevenLabs Conversational AI integration for **in-app voice conversations** (not phone calls).

## Overview

The integration allows you to:
1. **Start a conversation session** - Create a WebSocket connection for real-time voice conversation in your app
2. **Real-time voice interaction** - Users speak directly through the app's microphone
3. **Receive results** - Get the conversation results via webhook when the conversation completes
4. **Store user data** - Automatically save extracted user information to the database

## Setup

### 1. Environment Variables

Add these to your `.env` file or Cloud Run environment:

```env
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_AGENT_ID=your-agent-id  # Optional: can be passed in API request
API_BASE_URL=https://your-deployed-api-url.com  # Optional: auto-detected
```

### 2. Create ElevenLabs Agent

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io)
2. Navigate to Conversational AI section
3. Create a new agent with your desired voice and conversation flow
4. Copy the Agent ID

### 3. Configure Webhook

The webhook URL is automatically set to: `{API_BASE_URL}/api/webhook/elevenlabs`

Make sure your API is publicly accessible so ElevenLabs can POST to it.

## API Usage

### Start a Conversation Session

**Endpoint:** `POST /api/conversations/start`

**Request Body:**
```json
{
  "userId": 123,  // Optional
  "agentId": "your-agent-id"  // Optional if set in env
}
```

**Response:**
```json
{
  "success": true,
  "session_id": "session_1234567890_abc123",
  "agent_id": "your-agent-id",
  "websocket_url": "wss://api.elevenlabs.io/v1/convai/conversation",
  "api_key": "your-api-key",
  "webhook_url": "https://your-api.com/api/webhook/elevenlabs",
  "message": "Use the websocket_url and api_key to connect from the frontend"
}
```

**Example using curl:**
```bash
curl -X POST https://your-api.com/api/conversations/start \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123
  }'
```

### Get Conversation Status

**Endpoint:** `GET /api/conversations/:conversationId`

**Example:**
```bash
curl https://your-api.com/api/conversations/conv_abc123
```

## Frontend Usage

### Using the React Component

```typescript
import { RealTimeVoiceConversation } from './components/RealTimeVoiceConversation';

// In your component
function MyComponent() {
  const [showVoice, setShowVoice] = useState(false);

  return (
    <>
      <button onClick={() => setShowVoice(true)}>
        Start Voice Conversation
      </button>
      
      {showVoice && (
        <RealTimeVoiceConversation
          userId={123}
          agentId="your-agent-id"  // Optional
          onComplete={(transcript, userDescription) => {
            console.log('Conversation completed:', transcript);
            console.log('User description:', userDescription);
            setShowVoice(false);
          }}
          onClose={() => setShowVoice(false)}
        />
      )}
    </>
  );
}
```

### Using the API Functions Directly

```typescript
import { startElevenLabsConversation } from './utils/api';

// Start a conversation session
async function handleStartConversation() {
  try {
    const result = await startElevenLabsConversation({
      userId: 123,
      agentId: 'optional-agent-id'  // Only if not set in env
    });
    
    console.log('Session created:', result.session_id);
    console.log('WebSocket URL:', result.websocket_url);
    
    // Use result.websocket_url and result.api_key to connect via WebSocket
    // See RealTimeVoiceConversation.tsx for implementation example
  } catch (error) {
    console.error('Failed to start conversation:', error);
  }
}
```

## Webhook Handling

When the conversation completes, ElevenLabs will POST to `/api/webhook/elevenlabs` with the user description.

**Webhook Payload:**
```json
{
  "userDescription": {
    "name": "John Doe",
    "profession": "Software Engineer",
    "location": "Helsinki, Finland",
    "availability": "Weekday mornings"
  }
}
```

The webhook handler automatically:
1. Saves the data to `user_descriptions` table
2. Returns success response
3. Logs the webhook for debugging

## Database Schema

The `user_descriptions` table stores:
- `name` - User's name
- `profession` - User's profession
- `location` - User's location
- `availability` - When user is available
- `raw_payload` - Full JSON payload from ElevenLabs
- `created_at` - Timestamp

## Troubleshooting

### Conversation Not Starting

1. **Check API Key**: Verify `ELEVENLABS_API_KEY` is set correctly
2. **Check Agent ID**: Ensure agent ID is provided (env var or request body)
3. **Check Phone Number**: Must be in E.164 format (e.g., `+1234567890`)
4. **Check Logs**: Look for errors in backend logs

### Webhook Not Receiving Data

1. **Check Webhook URL**: Verify it's publicly accessible
2. **Check CORS**: Ensure ElevenLabs can POST to your endpoint
3. **Check Logs**: Look for webhook logs in backend console
4. **Test Manually**: POST to webhook endpoint to verify it works

### Common Errors

- **503 Service Unavailable**: `ELEVENLABS_API_KEY` not configured
- **400 Bad Request**: Missing phone number or agent ID
- **500 Internal Server Error**: Check backend logs for details

## Next Steps

1. **Customize Agent**: Configure your ElevenLabs agent with specific questions and conversation flow
2. **Process Results**: Add logic to process webhook data and create/update user profiles
3. **Add UI**: Create frontend components to trigger conversations and show results
4. **Error Handling**: Add retry logic and better error messages

## Example Flow

1. User clicks "Start Voice Conversation" button
2. Frontend calls `POST /api/conversations/start` (no phone number needed)
3. Backend creates a conversation session and returns WebSocket URL + API key
4. Frontend connects to ElevenLabs WebSocket using the provided credentials
5. User speaks through the app's microphone (real-time audio streaming)
6. AI agent responds with voice through the app's speakers
7. Conversation continues in real-time until user stops or conversation ends
8. ElevenLabs POSTs results to `/api/webhook/elevenlabs` when conversation completes
9. Backend saves user description to database
10. Frontend receives completion callback with transcript and user description

## Key Differences from Phone Calls

- **No phone number required** - Users speak directly through the app
- **Real-time WebSocket connection** - Low latency, bi-directional audio
- **In-app experience** - No external phone calls needed
- **Better user experience** - Seamless integration with your app UI

