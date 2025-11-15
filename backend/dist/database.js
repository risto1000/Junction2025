// backend/database.ts
import knex from 'knex';
import { Connector } from '@google-cloud/cloud-sql-connector';
import { config } from 'dotenv';
// Load environment variables from .env file for local development
config();
const connector = new Connector();
let db = null;
// This function will initialize the database connection pool
export async function initDb() {
    if (db) {
        return db;
    }
    // Check if we are running in the cloud or locally
    const isCloudRun = !process.env.DB_HOST;
    let connectionConfig;
    if (isCloudRun) {
        // Cloud Run: Use the Cloud SQL Connector
        const instanceConnectionName = process.env.INSTANCE_CONNECTION_NAME;
        if (!instanceConnectionName) {
            throw new Error('INSTANCE_CONNECTION_NAME environment variable is required in Cloud Run');
        }
        const clientOpts = await connector.getOptions({
            instanceConnectionName: instanceConnectionName,
            ipType: 'PUBLIC',
        });
        connectionConfig = {
            ...clientOpts,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        };
    }
    else {
        // Local development: Standard TCP connection via the Cloud SQL Auth Proxy
        connectionConfig = {
            host: process.env.DB_HOST || '127.0.0.1',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        };
    }
    const knexConfig = {
        client: 'mysql2',
        connection: connectionConfig,
        // Set the pool size for the database connections
        pool: { min: 0, max: 10 },
    };
    db = knex(knexConfig);
    return db;
}
// Export a function to get the initialized instance
export const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized. Call initDb first.');
    }
    return db;
};
