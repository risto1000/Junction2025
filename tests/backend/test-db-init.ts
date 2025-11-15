// Test script to verify database initialization
import { initDb, getDb } from './database.js';

async function testDatabaseInit() {
  try {
    console.log('Testing database initialization...');
    
    // Initialize database (this will create tables if they don't exist)
    const db = await initDb();
    console.log('✅ Database connection established');
    
    // Test query to verify tables exist
    const tables = await db.raw('SHOW TABLES');
    console.log('✅ Tables in database:', tables[0].map((row: any) => Object.values(row)[0]));
    
    // Check if users table exists and has correct structure
    const usersTableInfo = await db.raw('DESCRIBE users');
    console.log('✅ Users table structure:');
    usersTableInfo[0].forEach((col: any) => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''}`);
    });
    
    // Check if events table exists
    const eventsTableInfo = await db.raw('DESCRIBE events');
    console.log('✅ Events table structure:');
    eventsTableInfo[0].forEach((col: any) => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''}`);
    });
    
    // Check if rsvps table exists
    const rsvpsTableInfo = await db.raw('DESCRIBE rsvps');
    console.log('✅ RSVPs table structure:');
    rsvpsTableInfo[0].forEach((col: any) => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''}`);
    });
    
    // Test inserting a sample user (teaching skills)
    console.log('\n📝 Testing user insertion (teaching skills)...');
    const [userId] = await db('users').insert({
      full_name: 'Test User',
      first_name: 'Test',
      last_name: 'User',
      age: 30,
      tagline: 'Test tagline',
      location: 'Helsinki, Finland',
      offering_apprenticeship: true,
      micro_apprenticeship_offer: 'Test apprenticeship offer'
    });
    console.log(`✅ Created user with ID: ${userId}`);
    
    // Test inserting an event (user teaching skills)
    console.log('\n📝 Testing event creation (user teaching skills)...');
    const [eventId] = await db('events').insert({
      title: 'Test Event',
      organizer_id: userId,
      time: '10:00',
      date: '2024-01-01',
      location: 'Test Location',
      description: 'Test description',
      capacity: 10,
      spaces_left: 10,
      is_micro_apprenticeship: true
    });
    console.log(`✅ Created event with ID: ${eventId}`);
    
    // Test inserting an RSVP (user attending event)
    console.log('\n📝 Testing RSVP creation (user attending event)...');
    const [rsvpUserId] = await db('users').insert({
      full_name: 'Attendee User',
      first_name: 'Attendee',
      last_name: 'User',
      age: 25,
      offering_apprenticeship: false
    });
    console.log(`✅ Created attendee user with ID: ${rsvpUserId}`);
    
    const [rsvpId] = await db('rsvps').insert({
      event_id: eventId,
      user_id: rsvpUserId,
      invite_family: false
    });
    console.log(`✅ Created RSVP with ID: ${rsvpId}`);
    
    // Verify data
    const userCount = await db('users').count('* as count');
    const eventCount = await db('events').count('* as count');
    const rsvpCount = await db('rsvps').count('* as count');
    
    console.log('\n📊 Database Summary:');
    console.log(`   Users: ${userCount[0].count}`);
    console.log(`   Events: ${eventCount[0].count}`);
    console.log(`   RSVPs: ${rsvpCount[0].count}`);
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await db('rsvps').where('id', rsvpId).delete();
    await db('events').where('id', eventId).delete();
    await db('users').where('id', userId).delete();
    await db('users').where('id', rsvpUserId).delete();
    console.log('✅ Test data cleaned up');
    
    console.log('\n✅ All database tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabaseInit();

