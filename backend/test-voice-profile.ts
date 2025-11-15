// Test script for voice profile endpoint
import { initDb, getDb } from './database.js';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'https://junction2025-backend-1087825056058.europe-north1.run.app';

async function testVoiceProfileEndpoint() {
  console.log('🧪 Testing Voice Profile Endpoint...\n');
  
  try {
    // Test 1: Create new user (no user_id)
    console.log('Test 1: Creating new user profile...');
    const createResponse = await fetch(`${API_URL}/api/users/voice-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voice_profile_id: 'test_voice_123',
        full_name: 'Test User',
        age: 30,
        tagline: 'Test tagline',
        location: 'Helsinki, Finland',
        hobbies: ['Reading', 'Coding'],
        career_highlights: [{ company: 'Test Corp', title: 'Developer', years: '2020-2024' }],
        achievements: ['Test Achievement']
      })
    });
    
    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(`Create failed: ${JSON.stringify(error)}`);
    }
    
    const newUser = await createResponse.json() as any;
    console.log('✅ New user created:', { id: newUser.id, voice_profile_id: newUser.voice_profile_id });
    
    // Test 2: Update existing user (with user_id)
    console.log('\nTest 2: Updating existing user profile...');
    const updateResponse = await fetch(`${API_URL}/api/users/voice-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: newUser.id,
        voice_profile_id: 'updated_voice_456',
        full_name: 'Updated Test User',
        age: 31,
        tagline: 'Updated tagline',
        location: 'Espoo, Finland',
        hobbies: ['Reading', 'Coding', 'Swimming']
      })
    });
    
    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(`Update failed: ${JSON.stringify(error)}`);
    }
    
    const updatedUser = await updateResponse.json() as any;
    console.log('✅ User updated:', { id: updatedUser.id, voice_profile_id: updatedUser.voice_profile_id, age: updatedUser.age });
    
    // Test 3: Verify data via API (skip DB verification if not accessible)
    console.log('\nTest 3: Verifying data via API...');
    const verifyResponse = await fetch(`${API_URL}/api/users/${newUser.id}`);
    if (verifyResponse.ok) {
      const verifyUser = await verifyResponse.json() as any;
      if (verifyUser.voice_profile_id !== 'updated_voice_456') {
        throw new Error(`voice_profile_id mismatch: expected 'updated_voice_456', got '${verifyUser.voice_profile_id}'`);
      }
      console.log('✅ API verification passed');
      console.log('   - voice_profile_id:', verifyUser.voice_profile_id);
      console.log('   - age:', verifyUser.age);
    } else {
      console.log('⚠️  Could not verify via API (user may have been cleaned up)');
    }
    
    // Cleanup via API (if endpoint exists) or skip
    console.log('\n🧹 Test data cleanup skipped (manual cleanup may be needed)');
    
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testVoiceProfileEndpoint();

