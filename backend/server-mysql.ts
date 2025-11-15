import express from 'express';
import cors from 'cors';
import { initDb, getDb } from './database.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

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

