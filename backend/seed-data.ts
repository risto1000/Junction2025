// Seed script to migrate hardcoded data to database
import { initDb, getDb } from './database.js';

interface SeedUser {
  full_name: string;
  first_name: string;
  last_name: string;
  age: number;
  tagline: string;
  location: string;
  avatar: string;
  badge?: 'Senior-host' | 'Youth-host' | 'Community';
  bio?: string;
  career_highlights?: string; // JSON string
  achievements?: string; // JSON string
  hobbies?: string; // JSON string
  micro_apprenticeship_offer?: string;
  offering_apprenticeship: boolean;
}

interface SeedEvent {
  title: string;
  organizer_id: number;
  time: string;
  date: string;
  location: string;
  description: string;
  latitude?: number;
  longitude?: number;
  distance?: string;
  image: string;
  capacity: number;
  spaces_left: number;
  match_score?: number;
  is_micro_apprenticeship: boolean;
  accessibility_notes?: string;
  age_suitability?: string;
}

interface SeedRSVP {
  event_id: number;
  user_id: number;
  invite_family?: boolean;
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize database connection
    const db = await initDb();
    
    // Check if data already exists
    const existingUsers = await db('users').count('* as count');
    const userCount = typeof existingUsers[0].count === 'string' 
      ? parseInt(existingUsers[0].count) 
      : existingUsers[0].count;
    if (userCount > 0) {
      console.log('⚠️  Database already contains data. Skipping seed.');
      console.log('   To re-seed, clear the database first.');
      process.exit(0);
    }
    
    // Seed Users (teaching skills and attendees)
    console.log('\n📝 Seeding users...');
    
    const users: SeedUser[] = [
      {
        // Main user - Jari Koskinen (teaching skills)
        full_name: 'Jari Koskinen',
        first_name: 'Jari',
        last_name: 'Koskinen',
        age: 68,
        tagline: 'Retired carpenter — loves walks & woodworking',
        location: 'Helsinki, Finland',
        avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop',
        badge: 'Senior-host',
        bio: 'Retired carpenter who loves nature walks and meeting new people.',
        career_highlights: JSON.stringify([
          { company: 'Helsinki Construction', title: 'Master Carpenter', years: '1978-2015' },
          { company: 'City of Helsinki', title: 'Woodwork Instructor', years: '2016-2020' }
        ]),
        achievements: JSON.stringify(['Master Carpenter', 'Community Mentor', '50+ Events Hosted']),
        hobbies: JSON.stringify(['Woodworking', 'Duck Walks', 'Swimming', 'Knitting', 'Photography']),
        micro_apprenticeship_offer: '30-min coffee chat on basic chair repair',
        offering_apprenticeship: true,
      },
      {
        // Mirka Lahti (teaching skills - youth host)
        full_name: 'Mirka Lahti',
        first_name: 'Mirka',
        last_name: 'Lahti',
        age: 25,
        tagline: 'Recent graduate passionate about community connections',
        location: 'Helsinki, Finland',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        badge: 'Youth-host',
        bio: 'Recent graduate passionate about preserving stories and building community connections.',
        offering_apprenticeship: false,
      },
      {
        // Attendee - Alice Johnson
        full_name: 'Alice Johnson',
        first_name: 'Alice',
        last_name: 'Johnson',
        age: 35,
        tagline: '',
        location: 'Helsinki, Finland',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        offering_apprenticeship: false,
      },
      {
        // Attendee - Bob Smith
        full_name: 'Bob Smith',
        first_name: 'Bob',
        last_name: 'Smith',
        age: 42,
        tagline: '',
        location: 'Helsinki, Finland',
        avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop',
        offering_apprenticeship: false,
      },
      {
        // Attendee - Charlie Brown
        full_name: 'Charlie Brown',
        first_name: 'Charlie',
        last_name: 'Brown',
        age: 29,
        tagline: '',
        location: 'Helsinki, Finland',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        offering_apprenticeship: false,
      },
      {
        // Attendee - David Wilson
        full_name: 'David Wilson',
        first_name: 'David',
        last_name: 'Wilson',
        age: 38,
        tagline: '',
        location: 'Helsinki, Finland',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        offering_apprenticeship: false,
      },
      {
        // Attendee - Eve Davis
        full_name: 'Eve Davis',
        first_name: 'Eve',
        last_name: 'Davis',
        age: 31,
        tagline: '',
        location: 'Helsinki, Finland',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        offering_apprenticeship: false,
      },
      {
        // Attendee - Frank Miller
        full_name: 'Frank Miller',
        first_name: 'Frank',
        last_name: 'Miller',
        age: 45,
        tagline: '',
        location: 'Helsinki, Finland',
        avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop',
        offering_apprenticeship: false,
      },
      {
        // Attendee - Grace Anderson
        full_name: 'Grace Anderson',
        first_name: 'Grace',
        last_name: 'Anderson',
        age: 33,
        tagline: '',
        location: 'Helsinki, Finland',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        offering_apprenticeship: false,
      },
      {
        // Attendee - Hannah Thomas
        full_name: 'Hannah Thomas',
        first_name: 'Hannah',
        last_name: 'Thomas',
        age: 27,
        tagline: '',
        location: 'Helsinki, Finland',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        offering_apprenticeship: false,
      },
      {
        // Attendee - Ian Jackson
        full_name: 'Ian Jackson',
        first_name: 'Ian',
        last_name: 'Jackson',
        age: 40,
        tagline: '',
        location: 'Helsinki, Finland',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        offering_apprenticeship: false,
      },
      {
        // Attendee - Jack White
        full_name: 'Jack White',
        first_name: 'Jack',
        last_name: 'White',
        age: 36,
        tagline: '',
        location: 'Helsinki, Finland',
        avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop',
        offering_apprenticeship: false,
      },
    ];
    
    const userIds: number[] = [];
    for (const user of users) {
      const [id] = await db('users').insert(user);
      userIds.push(id);
      console.log(`   ✅ Created user: ${user.full_name} (ID: ${id})`);
    }
    
    // Seed Events (users teaching skills)
    console.log('\n📅 Seeding events...');
    
    const events: SeedEvent[] = [
      {
        title: 'Morning Duck Walk — Kaivopuisto',
        organizer_id: userIds[0], // Jari Koskinen
        time: '09:30',
        date: 'Saturday, Nov 16',
        location: 'Kaivopuisto Park, Helsinki',
        description: 'Join us for a gentle morning walk to see the ducks and enjoy fresh air together.',
        latitude: 60.1534,
        longitude: 24.9571,
        distance: '0.8 km away',
        image: 'https://images.unsplash.com/photo-1551069613-1904dbdcda11?w=800&h=400&fit=crop',
        capacity: 12,
        spaces_left: 5,
        match_score: 92,
        is_micro_apprenticeship: false,
        accessibility_notes: 'Flat paths, benches available',
        age_suitability: 'All ages welcome',
      },
      {
        title: 'Intro to Chair Repair — Coffee & Tools',
        organizer_id: userIds[0], // Jari Koskinen
        time: '14:00',
        date: 'Sunday, Nov 17',
        location: 'Community Workshop, Kallio',
        description: 'Learn basic chair repair techniques over coffee. Bring a wobbly chair or practice on ours!',
        latitude: 60.1840,
        longitude: 24.9501,
        distance: '1.2 km away',
        image: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&h=400&fit=crop',
        capacity: 6,
        spaces_left: 2,
        match_score: 88,
        is_micro_apprenticeship: true,
        accessibility_notes: 'Workshop on ground floor, wheelchair accessible',
        age_suitability: '16+ recommended',
      },
      {
        title: 'Intergenerational Story Circle',
        organizer_id: userIds[1], // Mirka Lahti
        time: '18:00',
        date: 'Wednesday, Nov 20',
        location: 'Central Library Oodi',
        description: 'Share and listen to life stories across generations. Tea and snacks provided.',
        latitude: 60.1733,
        longitude: 24.9307,
        distance: '2.1 km away',
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=400&fit=crop',
        capacity: 15,
        spaces_left: 8,
        match_score: 76,
        is_micro_apprenticeship: false,
        accessibility_notes: 'Fully accessible venue',
        age_suitability: 'All ages welcome',
      },
      {
        title: 'Cycling Mentorship Coffee',
        organizer_id: userIds[1], // Mirka Lahti
        time: '11:00',
        date: 'Saturday, Nov 23',
        location: 'Cafe Regatta',
        description: 'Casual coffee chat where I hope to learn from experienced mentors about career transitions.',
        latitude: 60.1872,
        longitude: 24.9099,
        distance: '3.4 km away',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop',
        capacity: 4,
        spaces_left: 4,
        is_micro_apprenticeship: true,
        accessibility_notes: 'Small cafe with steps',
        age_suitability: 'Adults',
      },
      {
        title: 'Weekend Knitting Circle',
        organizer_id: userIds[0], // Jari Koskinen (or another user)
        time: '15:00',
        date: 'Sunday, Nov 24',
        location: 'Community Center, Töölö',
        description: 'Bring your knitting projects or learn from experienced knitters. All skill levels welcome.',
        latitude: 60.1756,
        longitude: 24.9201,
        distance: '1.8 km away',
        image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&h=400&fit=crop',
        capacity: 10,
        spaces_left: 7,
        match_score: 84,
        is_micro_apprenticeship: false,
        accessibility_notes: 'Ground floor, accessible',
        age_suitability: 'All ages',
      },
    ];
    
    const eventIds: number[] = [];
    for (const event of events) {
      const [id] = await db('events').insert(event);
      eventIds.push(id);
      console.log(`   ✅ Created event: ${event.title} (ID: ${id})`);
    }
    
    // Seed RSVPs (users attending events)
    console.log('\n🎫 Seeding RSVPs...');
    
    const rsvps: SeedRSVP[] = [
      // Event 1: Morning Duck Walk attendees
      { event_id: eventIds[0], user_id: userIds[2] }, // Alice Johnson
      { event_id: eventIds[0], user_id: userIds[3] }, // Bob Smith
      { event_id: eventIds[0], user_id: userIds[4] }, // Charlie Brown
      
      // Event 2: Chair Repair attendees
      { event_id: eventIds[1], user_id: userIds[5] }, // David Wilson
      { event_id: eventIds[1], user_id: userIds[6] }, // Eve Davis
      
      // Event 3: Story Circle attendees
      { event_id: eventIds[2], user_id: userIds[7] }, // Frank Miller
      { event_id: eventIds[2], user_id: userIds[8] }, // Grace Anderson
      { event_id: eventIds[2], user_id: userIds[9] }, // Hannah Thomas
      { event_id: eventIds[2], user_id: userIds[10] }, // Ian Jackson
      
      // Event 5: Knitting Circle attendees
      { event_id: eventIds[4], user_id: userIds[11] }, // Jack White
    ];
    
    for (const rsvp of rsvps) {
      await db('rsvps').insert(rsvp);
      // Update spaces_left for the event
      await db('events')
        .where('id', rsvp.event_id)
        .where('spaces_left', '>', 0)
        .decrement('spaces_left', 1);
    }
    
    console.log(`   ✅ Created ${rsvps.length} RSVPs`);
    
    // Summary
    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Users: ${userIds.length}`);
    console.log(`   Events: ${eventIds.length}`);
    console.log(`   RSVPs: ${rsvps.length}`);
    console.log(`\n💡 Main user ID: ${userIds[0]} (Jari Koskinen)`);
    console.log(`   Set VITE_DEFAULT_USER_ID=${userIds[0]} in frontend/.env to use this user`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

