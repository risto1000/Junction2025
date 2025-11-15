// Check what data exists in the database
import { initDb } from './database.js';

async function checkData() {
  try {
    const db = await initDb();
    
    const userCount = await db('users').count('* as count');
    const eventCount = await db('events').count('* as count');
    const rsvpCount = await db('rsvps').count('* as count');
    
    const users = typeof userCount[0].count === 'string' ? parseInt(userCount[0].count) : userCount[0].count;
    const events = typeof eventCount[0].count === 'string' ? parseInt(eventCount[0].count) : eventCount[0].count;
    const rsvps = typeof rsvpCount[0].count === 'string' ? parseInt(rsvpCount[0].count) : rsvpCount[0].count;
    
    console.log('\n📊 Current Database Contents:');
    console.log(`   Users: ${users}`);
    console.log(`   Events: ${events}`);
    console.log(`   RSVPs: ${rsvps}`);
    
    if (users > 0) {
      const sampleUsers = await db('users').select('id', 'full_name', 'offering_apprenticeship').limit(5);
      console.log('\n   Sample Users:');
      sampleUsers.forEach((u: any) => {
        console.log(`     - ID ${u.id}: ${u.full_name} ${u.offering_apprenticeship ? '(teaching)' : '(attending)'}`);
      });
    }
    
    if (events > 0) {
      const sampleEvents = await db('events').select('id', 'title', 'organizer_id').limit(5);
      console.log('\n   Sample Events:');
      sampleEvents.forEach((e: any) => {
        console.log(`     - ID ${e.id}: ${e.title} (organizer: ${e.organizer_id})`);
      });
    }
    
    console.log('\n✅ Database check complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
}

checkData();

