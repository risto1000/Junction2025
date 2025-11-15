import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Google Cloud SQL connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || '/cloudsql/YOUR_PROJECT_ID:REGION:INSTANCE_NAME',
  database: process.env.DB_NAME || 'generations_connect',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  // For Cloud SQL, use Unix socket connection
  ...(process.env.NODE_ENV === 'production' && {
    host: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
  }),
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const { event, data } = req.body;
    
    console.log('Webhook received:', { event, data });
    
    // Handle different webhook events
    switch (event) {
      case 'mentor.created':
      case 'learner.created':
        // Process the webhook data
        await handleWebhookEvent(event, data);
        break;
      default:
        console.log('Unknown webhook event:', event);
    }
    
    res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

async function handleWebhookEvent(event: string, data: any) {
  // Implement your webhook logic here
  // For example, you might want to log it to the database
  await pool.query(
    'INSERT INTO webhook_logs (event, data, created_at) VALUES ($1, $2, NOW())',
    [event, JSON.stringify(data)]
  );
}

// API Routes
// Get all mentors
app.get('/api/mentors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mentors ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get mentor by ID
app.get('/api/mentors/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mentors WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching mentor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create mentor
app.post('/api/mentors', async (req, res) => {
  try {
    const { phone_number, full_name, skills, availability, preferred_location } = req.body;
    const result = await pool.query(
      `INSERT INTO mentors (phone_number, full_name, skills, availability, preferred_location, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'available', NOW())
       RETURNING *`,
      [phone_number, full_name, skills, availability, preferred_location]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating mentor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all learners
app.get('/api/learners', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM learners ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching learners:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get learner by ID
app.get('/api/learners/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM learners WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Learner not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching learner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create learner
app.post('/api/learners', async (req, res) => {
  try {
    const { phone_number, full_name, desired_skills, availability } = req.body;
    const result = await pool.query(
      `INSERT INTO learners (phone_number, full_name, desired_skills, availability, status, created_at)
       VALUES ($1, $2, $3, $4, 'searching', NOW())
       RETURNING *`,
      [phone_number, full_name, desired_skills, availability]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating learner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});