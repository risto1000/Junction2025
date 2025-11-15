import { initDb, getDb } from './database.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  try {
    await initDb();
    const db = getDb();
    
    // Add voice_profile_id column to users table
    await db.schema.alterTable('users', (table) => {
      table.string('voice_profile_id', 255).nullable();
    });
    
    console.log('Migration completed successfully - voice_profile_id column added');
  } catch (error: any) {
    // If column already exists, that's okay
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('voice_profile_id column already exists, skipping migration');
    } else {
      console.error('Migration error:', error);
      throw error;
    }
  } finally {
    process.exit(0);
  }
}

migrate();

