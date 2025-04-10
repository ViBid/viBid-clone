import { db } from './db';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// This script will create all tables in the database according to our schema definitions
export async function migrateDatabase() {
  try {
    console.log('Starting database migration...');
    
    // Create a new connection to avoid any issues with existing connections
    const migrationPool = new Pool({ connectionString: process.env.DATABASE_URL });
    const migrationDb = drizzle(migrationPool, { schema });
    
    // Use Drizzle's pushSchema to create all tables based on our schema
    await migrate(migrationDb, { migrationsFolder: 'drizzle' });
    
    console.log('Database migration completed successfully');
    
    // Close the pool when done
    await migrationPool.end();
    
    return true;
  } catch (error) {
    console.error('Database migration failed:', error);
    throw error;
  }
}