import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import * as schema from '@shared/schema';

// This script directly creates all tables in the database based on our schema
export async function pushSchema() {
  try {
    console.log('Pushing schema to database...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable not set');
    }
    
    // Create a new connection for schema push
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    // Create all tables from our schema
    console.log('Creating tables if they do not exist...');
    
    // Users related tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT,
        "email" TEXT UNIQUE,
        "email_verified" TIMESTAMP,
        "username" TEXT UNIQUE,
        "password" TEXT,
        "image" TEXT,
        "language" TEXT NOT NULL DEFAULT 'en',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "role" TEXT NOT NULL DEFAULT 'user'
      );

      CREATE TABLE IF NOT EXISTS "accounts" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "provider_account_id" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT
      );
    `);

    // Real estate related tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "agents" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "phone" TEXT NOT NULL,
        "agency" TEXT NOT NULL,
        "bio" TEXT,
        "specialty" TEXT,
        "rating" NUMERIC,
        "listings_count" INTEGER DEFAULT 0,
        "image_url" TEXT
      );

      CREATE TABLE IF NOT EXISTS "properties" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "purpose" TEXT NOT NULL,
        "price" NUMERIC NOT NULL,
        "bedrooms" INTEGER,
        "bathrooms" INTEGER,
        "area" NUMERIC NOT NULL,
        "location" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "neighborhood" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "latitude" NUMERIC,
        "longitude" NUMERIC,
        "year_built" INTEGER,
        "featured" BOOLEAN DEFAULT FALSE,
        "verified" BOOLEAN DEFAULT FALSE,
        "agent_id" INTEGER NOT NULL REFERENCES "agents"("id"),
        "image_urls" TEXT[],
        "amenities" TEXT[],
        "created_at" TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "locations" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "properties_count" INTEGER DEFAULT 0
      );
    `);

    // User interactions tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "favorites" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "property_id" INTEGER NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE("user_id", "property_id")
      );

      CREATE TABLE IF NOT EXISTS "search_history" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER REFERENCES "users"("id") ON DELETE CASCADE,
        "query" JSONB NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // AI related tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "ai_conversations" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER REFERENCES "users"("id") ON DELETE CASCADE,
        "title" TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "ai_messages" (
        "id" SERIAL PRIMARY KEY,
        "conversation_id" INTEGER NOT NULL REFERENCES "ai_conversations"("id") ON DELETE CASCADE,
        "role" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "property_insights" (
        "id" SERIAL PRIMARY KEY,
        "property_id" INTEGER NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
        "market_trends" JSONB,
        "investment_potential" TEXT,
        "neighborhood_analysis" JSONB,
        "price_prediction" JSONB,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Sessions table for connect-pg-simple
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      );
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);

    console.log('Schema push completed successfully');
    
    // Close the pool when done
    await pool.end();
    
    return true;
  } catch (error) {
    console.error('Schema push failed:', error);
    throw error;
  }
}