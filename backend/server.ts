import express from 'express';
import cors from 'cors';
import { initDb, getDb } from './database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { findBestMatch } from './matchingService.js';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize ElevenLabs client
let elevenlabs: ElevenLabsClient | null = null;
if (process.env.ELEVENLABS_API_KEY) {
  elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
  });
  console.log('ElevenLabs client initialized');
} else {
  console.warn('ELEVENLABS_API_KEY not set - ElevenLabs features will be disabled');
}

// Middleware
app.use(cors());

// Security headers
app.use((req, res, next) => {
  // Set permissive CSP for API endpoints (Cloud Run may override this)
  if (req.path.startsWith('/api') || req.path === '/health') {
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:;");
  }
  next();
});

app.use(express.json());

// Handle favicon requests (browsers automatically request this)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const db = getDb();
    await db.raw('SELECT 1');
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});


async function saveUserDescriptionFromWebhook(req: any, res: any) {
  try {
    console.log('ElevenLabs webhook hit', { path: req.path, body: req.body, time: new Date().toISOString() });

    const { userDescription } = req.body;
    if (!userDescription) {
      return res.status(400).json({ error: 'Missing userDescription in request body' });
    }

    const db = getDb();
    const insertData: any = {
      name: userDescription.name || null,
      profession: userDescription.profession || null,
      location: userDescription.location || null,
      availability: userDescription.availability || null,
      raw_payload: JSON.stringify(userDescription),
      created_at: db.fn.now()
    };

    const [id] = await db('user_descriptions').insert(insertData);
    const saved = await db('user_descriptions').where('id', id).first();

    console.log(`Saved userDescription (id=${id})`);
    return res.status(201).json({ success: true, saved });
  } catch (err) {
    console.error('ElevenLabs webhook error:', err);
    return res.status(500).json({ success: false, message: err instanceof Error ? err.message : String(err) });
  }
}

// register both routes so clients using /api/... or /... work
app.post('/webhook/elevenlabs', saveUserDescriptionFromWebhook);
app.post('/api/webhook/elevenlabs', saveUserDescriptionFromWebhook);

// Get latest user description (for frontend to fetch after conversation)
app.get('/api/user-descriptions/latest', async (req, res) => {
  try {
    const db = getDb();
    const latest = await db('user_descriptions')
      .orderBy('created_at', 'desc')
      .first();
    
    if (!latest) {
      return res.status(404).json({ error: 'No user descriptions found' });
    }

    // Parse raw_payload if it exists
    let parsedPayload = {};
    if (latest.raw_payload) {
      try {
        parsedPayload = typeof latest.raw_payload === 'string' 
          ? JSON.parse(latest.raw_payload) 
          : latest.raw_payload;
      } catch (e) {
        console.warn('Failed to parse raw_payload:', e);
      }
    }

    res.json({
      ...latest,
      userDescription: parsedPayload
    });
  } catch (error) {
    console.error('Error fetching user description:', error);
    res.status(500).json({
      error: 'Failed to fetch user description',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ElevenLabs API test endpoint - helps debug API access
app.get('/api/conversations/test', async (req, res) => {
  try {
    if (!elevenlabs) {
      return res.status(503).json({ 
        error: 'ElevenLabs service unavailable',
        message: 'ELEVENLABS_API_KEY not configured'
      });
    }

    // Test API key by making a simple request
    const testResponse = await fetch('https://api.elevenlabs.io/v1/user', {
      method: 'GET',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!
      }
    });

    const testData = await testResponse.json();
    
    res.json({
      success: testResponse.ok,
      apiKeyValid: testResponse.ok,
      status: testResponse.status,
      userInfo: testData,
      message: testResponse.ok 
        ? 'API key is valid. Check ElevenLabs docs for correct Conversational AI endpoint.'
        : 'API key test failed. Check your ELEVENLABS_API_KEY.'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ElevenLabs Real-Time Conversational AI - Get WebSocket connection info
// This creates a session for in-app voice conversation (not phone calls)
app.post('/api/conversations/start', async (req, res) => {
  try {
    if (!elevenlabs) {
      return res.status(503).json({ 
        error: 'ElevenLabs service unavailable',
        message: 'ELEVENLABS_API_KEY not configured'
      });
    }

    const { userId, agentId } = req.body;
    
    // Get agent ID from request or environment variable
    const agent_id = agentId || process.env.ELEVENLABS_AGENT_ID;
    if (!agent_id) {
      return res.status(400).json({ 
        error: 'Agent ID is required',
        message: 'Provide agentId in request body or set ELEVENLABS_AGENT_ID environment variable'
      });
    }

    // Construct webhook URL for conversation completion
    // Use HTTPS in production (Cloud Run), HTTP for local dev
    let apiBaseUrl = process.env.API_BASE_URL || process.env.VITE_API_URL;
    
    if (!apiBaseUrl) {
      // Detect if we're in Cloud Run (production)
      const isProduction = process.env.NODE_ENV === 'production' || 
                          req.get('host')?.includes('.run.app') ||
                          !req.get('host')?.includes('localhost');
      
      const protocol = isProduction ? 'https' : (req.protocol || 'http');
      const host = req.get('host') || req.get('x-forwarded-host') || 'localhost:8080';
      apiBaseUrl = `${protocol}://${host}`;
    }
    
    const webhookUrl = `${apiBaseUrl}/api/webhook/elevenlabs`;
    
    console.log('Starting ElevenLabs real-time conversation session:', {
      agent_id,
      webhookUrl,
      userId
    });

    // Create a real-time conversation session using ElevenLabs API
    // For in-app conversations, we need to get a WebSocket URL or session token
    let conversationData: any;
    let lastError: any = null;
    
    // Try real-time conversation endpoints (for in-app voice, not phone)
    const endpoints = [
      'https://api.elevenlabs.io/v1/convai/conversation',
      'https://api.elevenlabs.io/v1/convai/conversations/create',
      'https://api.elevenlabs.io/v1/convai/real-time/create'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY!,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            agent_id: agent_id,
            webhook_url: webhookUrl,
            ...(userId && { metadata: { user_id: userId.toString() } })
          })
        });

        if (response.ok) {
          conversationData = await response.json();
          console.log(`Successfully used endpoint: ${endpoint}`);
          break;
        } else if (response.status !== 404 && response.status !== 405) {
          const errorText = await response.text();
          console.error(`Endpoint ${endpoint} returned ${response.status}:`, errorText);
          lastError = { status: response.status, message: errorText };
        }
      } catch (err) {
        console.error(`Error trying endpoint ${endpoint}:`, err);
        lastError = err;
      }
    }
    
    // If endpoints failed, try to get WebSocket connection info directly
    if (!conversationData) {
      try {
        // For real-time in-app conversations, we typically need:
        // 1. A conversation ID or session token
        // 2. A WebSocket URL to connect to
        // Let's try getting agent info first to understand the structure
        const agentResponse = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agent_id}`, {
          method: 'GET',
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY!
          }
        });

        if (agentResponse.ok) {
          const agentInfo = await agentResponse.json();
          console.log('Agent info retrieved:', agentInfo);
          
          // Generate a session token or conversation ID for the frontend
          // The frontend will use this to connect via WebSocket
          conversationData = {
            agent_id: agent_id,
            session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            websocket_url: `wss://api.elevenlabs.io/v1/convai/conversation`,
            agent_info: agentInfo
          };
        } else {
          const errorText = await agentResponse.text();
          console.error('Agent fetch error:', agentResponse.status, errorText);
          
          // If agent not found, try to list available agents
          if (agentResponse.status === 404) {
            try {
              const agentsListResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents', {
                method: 'GET',
                headers: {
                  'xi-api-key': process.env.ELEVENLABS_API_KEY!
                }
              });
              
              if (agentsListResponse.ok) {
                const agentsListData: any = await agentsListResponse.json();
                const availableAgents = agentsListData.agents?.map((a: any) => ({ id: a.agent_id, name: a.name })) || [];
                throw new Error(`Agent ID "${agent_id}" not found. Available agents: ${JSON.stringify(availableAgents)}`);
              }
            } catch (listError) {
              // If listing also fails, just throw the original error
            }
          }
          
          throw new Error(`Could not retrieve agent info: ${errorText}`);
        }
      } catch (sdkError) {
        console.error('Session creation failed:', sdkError);
        return res.status(lastError?.status || 500).json({
          error: 'Failed to start conversation session',
          message: lastError?.message || 'Could not create conversation session.',
          details: {
            triedEndpoints: endpoints,
            agentId: agent_id,
            webhookUrl: webhookUrl
          },
          troubleshooting: [
            '1. Verify your ELEVENLABS_AGENT_ID is correct in your ElevenLabs dashboard',
            '2. Check the ElevenLabs API documentation for Real-Time Conversational AI',
            '3. Ensure your API key has access to Conversational AI features',
            '4. Test your API key: GET /api/conversations/test',
            '5. For in-app voice, you may need to use the ElevenLabs React SDK on the frontend'
          ],
          documentation: 'https://elevenlabs.io/docs/agents-platform/integrate/overview'
        });
      }
    }
    
    console.log('Conversation session created successfully:', conversationData);

    // Log to database
    try {
      const db = getDb();
      await db('webhook_logs').insert({
        event_type: 'conversation.session_created',
        source: 'elevenlabs',
        payload: JSON.stringify({
          session_id: conversationData.session_id || conversationData.id,
          user_id: userId,
          agent_id: agent_id,
          type: 'real-time_in-app'
        }),
        created_at: db.fn.now()
      });
    } catch (logError) {
      console.warn('Failed to log conversation session:', logError);
    }

    // Return session info for frontend to connect
    res.json({
      success: true,
      session_id: conversationData.session_id || conversationData.id || conversationData.conversation_id,
      agent_id: agent_id,
      websocket_url: conversationData.websocket_url || conversationData.ws_url || 'wss://api.elevenlabs.io/v1/convai/conversation',
      api_key: process.env.ELEVENLABS_API_KEY?.trim(), // Frontend will need this for WebSocket auth
      webhook_url: webhookUrl,
      message: 'Use the websocket_url and api_key to connect from the frontend'
    });
  } catch (error) {
    console.error('Error starting conversation session:', error);
    res.status(500).json({
      error: 'Failed to start conversation session',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get signed URL for ElevenLabs widget (required for widget embed)
app.get('/api/conversations/signed-url', async (req, res) => {
  try {
    if (!elevenlabs) {
      return res.status(503).json({ 
        error: 'ElevenLabs service unavailable',
        message: 'ELEVENLABS_API_KEY not configured'
      });
    }

    const agentId = req.query.agentId as string || process.env.ELEVENLABS_AGENT_ID;
    if (!agentId) {
      return res.status(400).json({ 
        error: 'Agent ID is required',
        message: 'Provide agentId as query parameter or set ELEVENLABS_AGENT_ID environment variable'
      });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!.trim()
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to get signed URL:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Failed to get signed URL',
        message: errorText
      });
    }

    const body: any = await response.json();
    res.json({
      success: true,
      signed_url: body.signed_url || body.signedUrl || body.url,
      agent_id: agentId
    });
  } catch (error) {
    console.error('Error getting signed URL:', error);
    res.status(500).json({
      error: 'Failed to get signed URL',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get conversation status endpoint
app.get('/api/conversations/:conversationId', async (req, res) => {
  try {
    if (!elevenlabs) {
      return res.status(503).json({ 
        error: 'ElevenLabs service unavailable',
        message: 'ELEVENLABS_API_KEY not configured'
      });
    }

    const { conversationId } = req.params;

    const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'Failed to get conversation status',
        message: errorText
      });
    }

    const conversationData = await response.json();
    res.json(conversationData);
  } catch (error) {
    console.error('Error getting conversation status:', error);
    res.status(500).json({
      error: 'Failed to get conversation status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const { event, data, source } = req.body;
    const db = getDb();
    
    console.log('Webhook received:', { event, source, timestamp: new Date().toISOString() });
    
    // Log webhook to database (assuming webhook_logs table exists)
    await db('webhook_logs').insert({
      event_type: event,
      source: source || 'unknown',
      payload: JSON.stringify(data || req.body),
      created_at: db.fn.now()
    });
    
    // Handle different webhook events
    switch (event) {
      case 'event.created':
        await handleEventCreated(data);
        break;
      case 'event.updated':
        await handleEventUpdated(data);
        break;
      case 'rsvp.created':
        await handleRSVPCreated(data);
        break;
      case 'user.created':
        await handleUserCreated(data);
        break;
      case 'profile.updated':
        await handleProfileUpdated(data);
        break;
      default:
        console.log('Unhandled webhook event:', event);
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed',
      event,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Webhook event handlers
async function handleEventCreated(data: any) {
  if (data && data.id) {
    console.log('Processing event.created for event:', data.id);
  }
}

async function handleEventUpdated(data: any) {
  if (data && data.id) {
    console.log('Processing event.updated for event:', data.id);
  }
}

async function handleRSVPCreated(data: any) {
  if (data && data.eventId && data.userId) {
    const db = getDb();
    console.log('Processing rsvp.created for event:', data.eventId, 'user:', data.userId);
    // Update event spaces left
    await db('events')
      .where('id', data.eventId)
      .where('spaces_left', '>', 0)
      .decrement('spaces_left', 1);
  }
}

async function handleUserCreated(data: any) {
  if (data && data.id) {
    console.log('Processing user.created for user:', data.id);
  }
}

async function handleProfileUpdated(data: any) {
  if (data && data.userId) {
    console.log('Processing profile.updated for user:', data.userId);
  }
}

// API Routes - Events
app.get('/api/events', async (req, res) => {
  try {
    const db = getDb();
    const events = await db('events')
      .leftJoin('users as u', 'events.organizer_id', 'u.id')
      .leftJoin('rsvps as r', 'events.id', 'r.event_id')
      .select(
        'events.*',
        'u.full_name as organizer_name',
        'u.avatar as organizer_avatar',
        'u.badge as organizer_badge',
        'u.bio as organizer_bio',
        db.raw('COUNT(DISTINCT r.id) as rsvp_count')
      )
      .groupBy('events.id', 'u.id')
      .orderBy('events.created_at', 'desc');
    
    // Format events with participants
    const eventsWithParticipants = await Promise.all(events.map(async (event) => {
      const participants = await db('rsvps as r')
        .join('users as u', 'r.user_id', 'u.id')
        .where('r.event_id', event.id)
        .select('u.id', 'u.first_name', 'u.last_name', 'u.avatar')
        .limit(10);
      
      return {
        ...event,
        participantDetails: participants.map(p => ({
          id: p.id,
          firstName: p.first_name,
          lastName: p.last_name,
          avatar: p.avatar
        })),
        participants: participants.map(p => p.avatar)
      };
    }));
    
    res.json(eventsWithParticipants);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const db = getDb();
    const event = await db('events')
      .leftJoin('users as u', 'events.organizer_id', 'u.id')
      .where('events.id', req.params.id)
      .select(
        'events.*',
        'u.full_name as organizer_name',
        'u.avatar as organizer_avatar',
        'u.badge as organizer_badge',
        'u.bio as organizer_bio'
      )
      .first();
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Get participants
    const participants = await db('rsvps as r')
      .join('users as u', 'r.user_id', 'u.id')
      .where('r.event_id', event.id)
      .select('u.id', 'u.first_name', 'u.last_name', 'u.avatar');
    
    res.json({
      ...event,
      participantDetails: participants.map(p => ({
        id: p.id,
        firstName: p.first_name,
        lastName: p.last_name,
        avatar: p.avatar
      })),
      participants: participants.map(p => p.avatar)
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const {
      title,
      organizer_id,
      time,
      date,
      location,
      description,
      latitude,
      longitude,
      capacity,
      is_micro_apprenticeship,
      accessibility_notes,
      age_suitability,
      image
    } = req.body;
    
    const db = getDb();
    const [id] = await db('events').insert({
      title,
      organizer_id,
      time,
      date,
      location,
      description,
      latitude,
      longitude,
      capacity,
      spaces_left: capacity,
      is_micro_apprenticeship,
      accessibility_notes,
      age_suitability,
      image,
      created_at: db.fn.now()
    });
    
    const event = await db('events').where('id', id).first();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Routes - Users/Profiles
app.get('/api/users/:id', async (req, res) => {
  try {
    const db = getDb();
    const user = await db('users').where('id', req.params.id).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const {
      full_name,
      age,
      tagline,
      location,
      avatar,
      career_highlights,
      achievements,
      hobbies,
      micro_apprenticeship_offer,
      offering_apprenticeship
    } = req.body;
    
    const db = getDb();
    const updateData: any = {
      updated_at: db.fn.now()
    };
    
    if (full_name !== undefined) updateData.full_name = full_name;
    if (age !== undefined) updateData.age = age;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (location !== undefined) updateData.location = location;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (career_highlights !== undefined) updateData.career_highlights = JSON.stringify(career_highlights);
    if (achievements !== undefined) updateData.achievements = JSON.stringify(achievements);
    if (hobbies !== undefined) updateData.hobbies = JSON.stringify(hobbies);
    if (micro_apprenticeship_offer !== undefined) updateData.micro_apprenticeship_offer = micro_apprenticeship_offer;
    if (offering_apprenticeship !== undefined) updateData.offering_apprenticeship = offering_apprenticeship;
    
    await db('users')
      .where('id', req.params.id)
      .update(updateData);
    
    const user = await db('users').where('id', req.params.id).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Route - Voice Profile Creation/Update
app.post('/api/users/voice-profile', async (req, res) => {
  try {
    const {
      user_id,
      voice_profile_id,
      full_name,
      first_name,
      last_name,
      age,
      tagline,
      location,
      avatar,
      career_highlights,
      achievements,
      hobbies,
      micro_apprenticeship_offer,
      offering_apprenticeship
    } = req.body;
    
    const db = getDb();
    
    // Prepare user data from ElevenLabs output
    const userData: any = {
      updated_at: db.fn.now()
    };
    
    if (full_name !== undefined) userData.full_name = full_name;
    if (first_name !== undefined) userData.first_name = first_name;
    if (last_name !== undefined) userData.last_name = last_name;
    if (age !== undefined) userData.age = age;
    if (tagline !== undefined) userData.tagline = tagline;
    if (location !== undefined) userData.location = location;
    if (avatar !== undefined) userData.avatar = avatar;
    if (voice_profile_id !== undefined) userData.voice_profile_id = voice_profile_id;
    if (career_highlights !== undefined) {
      userData.career_highlights = typeof career_highlights === 'string' 
        ? career_highlights 
        : JSON.stringify(career_highlights);
    }
    if (achievements !== undefined) {
      userData.achievements = typeof achievements === 'string'
        ? achievements
        : JSON.stringify(achievements);
    }
    if (hobbies !== undefined) {
      userData.hobbies = typeof hobbies === 'string'
        ? hobbies
        : JSON.stringify(hobbies);
    }
    if (micro_apprenticeship_offer !== undefined) userData.micro_apprenticeship_offer = micro_apprenticeship_offer;
    if (offering_apprenticeship !== undefined) userData.offering_apprenticeship = offering_apprenticeship;
    
    let user;
    
    if (user_id) {
      // Update existing user
      await db('users')
        .where('id', user_id)
        .update(userData);
      
      user = await db('users').where('id', user_id).first();
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    } else {
      // Create new user
      userData.created_at = db.fn.now();
      const [id] = await db('users').insert(userData);
      user = await db('users').where('id', id).first();
    }
    
    // Parse JSON fields for response
    if (user.career_highlights) {
      try {
        user.career_highlights = typeof user.career_highlights === 'string' 
          ? JSON.parse(user.career_highlights) 
          : user.career_highlights;
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
    if (user.achievements) {
      try {
        user.achievements = typeof user.achievements === 'string'
          ? JSON.parse(user.achievements)
          : user.achievements;
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
    if (user.hobbies) {
      try {
        user.hobbies = typeof user.hobbies === 'string'
          ? JSON.parse(user.hobbies)
          : user.hobbies;
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
    
    res.status(user_id ? 200 : 201).json(user);
  } catch (error) {
    console.error('Error creating/updating voice profile:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API Routes - RSVPs
app.post('/api/rsvps', async (req, res) => {
  try {
    const { event_id, user_id, invite_family } = req.body;
    const db = getDb();
    
    // Check if already RSVP'd
    const existing = await db('rsvps')
      .where('event_id', event_id)
      .where('user_id', user_id)
      .first();
    
    if (existing) {
      return res.status(400).json({ error: 'Already RSVP\'d to this event' });
    }
    
    // Check if event has space
    const event = await db('events').where('id', event_id).first();
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    if (event.spaces_left <= 0) {
      return res.status(400).json({ error: 'Event is full' });
    }
    
    const [id] = await db('rsvps').insert({
      event_id,
      user_id,
      invite_family: invite_family || false,
      created_at: db.fn.now()
    });
    
    // Update event spaces_left
    await db('events')
      .where('id', event_id)
      .decrement('spaces_left', 1);
    
    const rsvp = await db('rsvps').where('id', id).first();
    res.status(201).json(rsvp);
  } catch (error) {
    console.error('Error creating RSVP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Routes - Favorites
app.get('/api/users/:id/favorites', async (req, res) => {
  try {
    const db = getDb();
    const favorites = await db('favorites as f')
      .join('events as e', 'f.event_id', 'e.id')
      .where('f.user_id', req.params.id)
      .select('e.*')
      .orderBy('f.created_at', 'desc');
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    const { event_id, user_id } = req.body;
    const db = getDb();
    
    try {
      const [id] = await db('favorites').insert({
        event_id,
        user_id,
        created_at: db.fn.now()
      });
      const favorite = await db('favorites').where('id', id).first();
      res.status(201).json(favorite);
    } catch (error: any) {
      // MySQL duplicate entry error
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(200).json({ message: 'Already favorited' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/favorites', async (req, res) => {
  try {
    const { event_id, user_id } = req.body;
    const db = getDb();
    
    await db('favorites')
      .where('event_id', event_id)
      .where('user_id', user_id)
      .delete();
    
    res.status(200).json({ message: 'Favorite removed' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from frontend build (if exists)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple possible paths for frontend build
const possiblePaths = [
  path.join(__dirname, '../frontend/build'),  // From backend/dist -> ../frontend/build
  path.join(process.cwd(), '../frontend/build'), // From backend/ -> ../frontend/build
  path.join(process.cwd(), 'frontend/build'),   // From app root -> frontend/build
  '/app/frontend/build'                         // Absolute path in Docker
];

let frontendBuildPath: string | null = null;
for (const possiblePath of possiblePaths) {
  if (existsSync(possiblePath)) {
    frontendBuildPath = possiblePath;
    console.log(`Found frontend build at: ${frontendBuildPath}`);
    break;
  }
}

if (frontendBuildPath) {
  app.use(express.static(frontendBuildPath));
  
  // Serve React app for all non-API routes (SPA routing)
  app.get('*', (req, res) => {
    // Don't serve frontend for API routes
    if (req.path.startsWith('/api') || req.path === '/health' || req.path === '/favicon.ico') {
      return;
    }
    res.sendFile(path.join(frontendBuildPath!, 'index.html'));
  });
  
  console.log('Frontend static files enabled');
} else {
  console.log('Frontend build not found, serving API only');
  console.log('Checked paths:', possiblePaths);
}

// Initialize database and start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Database: ${process.env.DB_HOST ? 'Local (via proxy)' : 'Cloud Run'}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

