// Quick test script to verify Cloud SQL connection
import { initDb } from './database.js';

async function testConnection() {
  try {
    console.log('Testing Cloud SQL connection...');
    console.log('Environment:', {
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      DB_PASS: process.env.DB_PASS ? '***' : 'NOT SET',
    });
    
    const db = await initDb();
    console.log('✅ Connection successful!');
    
    // Test query
    const result = await db.raw('SELECT 1 as test');
    console.log('✅ Query test successful:', result[0]);
    
    // Check if database exists
    const databases = await db.raw('SHOW DATABASES');
    console.log('✅ Available databases:', databases[0].map((d: any) => Object.values(d)[0]));
    
    // Check if our database exists
    const dbExists = databases[0].some((d: any) => Object.values(d)[0] === process.env.DB_NAME);
    if (!dbExists) {
      console.log(`⚠️  Database '${process.env.DB_NAME}' does not exist!`);
      console.log('   Please create it in Cloud SQL Console first.');
    } else {
      console.log(`✅ Database '${process.env.DB_NAME}' exists`);
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    console.error('   Code:', error.code);
    console.error('   Errno:', error.errno);
    
    if (error.code === 'ETIMEDOUT') {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Check if Cloud SQL Auth Proxy is running: ./setup-local-dev.sh');
      console.error('   2. Verify database exists in Cloud SQL Console');
      console.error('   3. Check credentials in .env file');
    }
    
    process.exit(1);
  }
}

testConnection();

