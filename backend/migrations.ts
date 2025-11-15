// backend/migrations.ts
import { Knex } from 'knex';

/**
 * Initialize database tables for the application
 * Creates tables for users (teaching skills and attending events), events, rsvps, favorites, and webhook_logs
 */
export async function initTables(db: Knex): Promise<void> {
  try {
    // Create users table
    await db.schema.hasTable('users').then(async (exists) => {
      if (!exists) {
        await db.schema.createTable('users', (table) => {
          table.increments('id').primary();
          table.string('full_name', 255).notNullable();
          table.string('first_name', 100);
          table.string('last_name', 100);
          table.integer('age');
          table.text('tagline');
          table.string('location', 255);
          table.text('avatar');
          table.string('badge', 50);
          table.text('bio');
          table.text('career_highlights'); // JSON stored as TEXT in MySQL
          table.text('achievements'); // JSON array stored as TEXT in MySQL
          table.text('hobbies'); // JSON array stored as TEXT in MySQL
          table.text('micro_apprenticeship_offer');
          table.boolean('offering_apprenticeship').defaultTo(false);
          table.timestamp('created_at').defaultTo(db.fn.now());
          table.timestamp('updated_at').defaultTo(db.fn.now());
        });
        console.log('Created users table');
      }
    });

    // Create events table
    await db.schema.hasTable('events').then(async (exists) => {
      if (!exists) {
        await db.schema.createTable('events', (table) => {
          table.increments('id').primary();
          table.string('title', 255).notNullable();
          table.integer('organizer_id').unsigned();
          table.string('time', 50);
          table.string('date', 100);
          table.string('location', 255);
          table.text('description');
          table.decimal('latitude', 10, 8);
          table.decimal('longitude', 11, 8);
          table.string('distance', 50);
          table.text('image');
          table.integer('capacity').notNullable();
          table.integer('spaces_left').notNullable();
          table.integer('match_score');
          table.boolean('is_micro_apprenticeship').defaultTo(false);
          table.text('accessibility_notes');
          table.string('age_suitability', 100);
          table.timestamp('created_at').defaultTo(db.fn.now());
          table.timestamp('updated_at').defaultTo(db.fn.now());
          
          // Foreign key constraint
          table.foreign('organizer_id').references('id').inTable('users').onDelete('SET NULL');
        });
        console.log('Created events table');
      }
    });

    // Create rsvps table
    await db.schema.hasTable('rsvps').then(async (exists) => {
      if (!exists) {
        await db.schema.createTable('rsvps', (table) => {
          table.increments('id').primary();
          table.integer('event_id').unsigned().notNullable();
          table.integer('user_id').unsigned().notNullable();
          table.boolean('invite_family').defaultTo(false);
          table.timestamp('created_at').defaultTo(db.fn.now());
          
          // Foreign key constraints
          table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE');
          table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
          
          // Unique constraint
          table.unique(['event_id', 'user_id'], 'unique_event_user');
        });
        console.log('Created rsvps table');
      }
    });

    // Create favorites table
    await db.schema.hasTable('favorites').then(async (exists) => {
      if (!exists) {
        await db.schema.createTable('favorites', (table) => {
          table.increments('id').primary();
          table.integer('event_id').unsigned().notNullable();
          table.integer('user_id').unsigned().notNullable();
          table.timestamp('created_at').defaultTo(db.fn.now());
          
          // Foreign key constraints
          table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE');
          table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
          
          // Unique constraint
          table.unique(['event_id', 'user_id'], 'unique_favorite');
        });
        console.log('Created favorites table');
      }
    });

    // Create webhook_logs table
    await db.schema.hasTable('webhook_logs').then(async (exists) => {
      if (!exists) {
        await db.schema.createTable('webhook_logs', (table) => {
          table.increments('id').primary();
          table.string('event_type', 100).notNullable();
          table.string('source', 100);
          table.text('payload'); // JSON stored as TEXT in MySQL
          table.timestamp('created_at').defaultTo(db.fn.now());
        });
        console.log('Created webhook_logs table');
      }
    });

    await db.schema.hasTable('webhook_logs').then(async (exists) => {
      if (!exists) {
        await db.schema.createTable('webhook_logs', (table) => {
          table.increments('id').primary();
          table.string('event_type', 100).notNullable();
          table.string('source', 100);
          table.text('payload'); // JSON stored as TEXT in MySQL
          table.timestamp('created_at').defaultTo(db.fn.now());
        });
        console.log('Created webhook_logs table');
      }
    });

    // Create user_descriptions table (for ElevenLabs webhook)
    await db.schema.hasTable('user_descriptions').then(async (exists) => {
      if (!exists) {
        await db.schema.createTable('user_descriptions', (table) => {
          table.increments('id').primary();
          table.string('name', 255);
          table.string('profession', 255);
          table.string('location', 255);
          table.text('availability');
          table.text('raw_payload'); // JSON stored as TEXT in MySQL
          table.timestamp('created_at').defaultTo(db.fn.now());
        });
        console.log('Created user_descriptions table');
      }
    });    

    // Create indexes
    await db.raw('CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id)').catch(() => {});
    await db.raw('CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at DESC)').catch(() => {});
    await db.raw('CREATE INDEX IF NOT EXISTS idx_rsvps_event ON rsvps(event_id)').catch(() => {});
    await db.raw('CREATE INDEX IF NOT EXISTS idx_rsvps_user ON rsvps(user_id)').catch(() => {});
    await db.raw('CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id)').catch(() => {});
    await db.raw('CREATE INDEX IF NOT EXISTS idx_favorites_event ON favorites(event_id)').catch(() => {});
    await db.raw('CREATE INDEX IF NOT EXISTS idx_webhook_logs_event ON webhook_logs(event_type)').catch(() => {});
    await db.raw('CREATE INDEX IF NOT EXISTS idx_webhook_logs_created ON webhook_logs(created_at DESC)').catch(() => {});

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
}

