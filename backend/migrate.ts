import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.NODE_ENV === 'production' 
    ? `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
    : process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'apprentice_circles',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ...(process.env.NODE_ENV === 'production' && {
    port: undefined,
  }),
});

async function migrate() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        age INTEGER,
        tagline TEXT,
        location VARCHAR(255),
        avatar TEXT,
        badge VARCHAR(50) CHECK (badge IN ('Senior-host', 'Youth-host', 'Community')),
        bio TEXT,
        career_highlights JSONB,
        achievements TEXT[],
        hobbies TEXT[],
        micro_apprenticeship_offer TEXT,
        offering_apprenticeship BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        organizer_id INTEGER REFERENCES users(id),
        time VARCHAR(50),
        date VARCHAR(100),
        location VARCHAR(255),
        description TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        distance VARCHAR(50),
        image TEXT,
        capacity INTEGER NOT NULL,
        spaces_left INTEGER NOT NULL,
        match_score INTEGER,
        is_micro_apprenticeship BOOLEAN DEFAULT false,
        accessibility_notes TEXT,
        age_suitability VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create rsvps table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        invite_family BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id)
      )
    `);

    // Create favorites table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id)
      )
    `);

    // Create webhook_logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS webhook_logs (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        source VARCHAR(100),
        payload JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at DESC)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_rsvps_event ON rsvps(event_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_rsvps_user ON rsvps(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_favorites_event ON favorites(event_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_webhook_logs_event ON webhook_logs(event_type)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_webhook_logs_created ON webhook_logs(created_at DESC)');

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrate();