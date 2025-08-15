import { createClient } from '@supabase/supabase-js'
import { Client } from 'pg'

// Neon PostgreSQL connection
const NEON_CONNECTION_STRING = 'postgresql://neondb_owner:npg_3QTMwzEFO4bS@ep-gentle-star-abamfguf-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

// Create PostgreSQL client for direct connection
export const neonClient = new Client({
  connectionString: NEON_CONNECTION_STRING,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
})

// Supabase client configuration for Neon
const supabaseUrl = 'https://ep-gentle-star-abamfguf-pooler.eu-west-2.aws.neon.tech'
const supabaseKey = 'npg_3QTMwzEFO4bS'

export const supabaseNeon = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false
  }
})

// Test connection function
export async function testNeonConnection() {
  try {
    console.log('🔗 Testing Neon database connection...')
    
    await neonClient.connect()
    const result = await neonClient.query('SELECT NOW() as current_time, version() as postgres_version')
    
    console.log('✅ Neon connection successful!')
    console.log('📊 Database info:', {
      time: result.rows[0].current_time,
      version: result.rows[0].postgres_version.split(' ')[0]
    })
    
    await neonClient.end()
    return true
  } catch (error) {
    console.error('❌ Neon connection failed:', error)
    return false
  }
}

// Initialize database schema
export async function initializeNeonDatabase() {
  try {
    console.log('🚀 Initializing DealsMarket database on Neon...')
    
    await neonClient.connect()
    
    // Enable required extensions
    await neonClient.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    await neonClient.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    
    console.log('✅ Extensions enabled')
    
    // Create users table
    await neonClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        email_verified BOOLEAN DEFAULT FALSE,
        phone_verified BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'pending')),
        last_login TIMESTAMP WITH TIME ZONE,
        is_admin BOOLEAN DEFAULT FALSE,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
        avatar_url TEXT,
        timezone VARCHAR(50) DEFAULT 'UTC',
        language VARCHAR(10) DEFAULT 'es'
      )
    `)
    
    // Create notifications table
    await neonClient.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        data JSONB DEFAULT '{}',
        read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP WITH TIME ZONE,
        related_entity_type VARCHAR(50),
        related_entity_id VARCHAR(255),
        priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        delivery_method VARCHAR(20) DEFAULT 'in_app' CHECK (delivery_method IN ('in_app', 'email', 'sms', 'push')),
        scheduled_for TIMESTAMP WITH TIME ZONE,
        sent_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)
    
    // Create companies table
    await neonClient.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        company_name VARCHAR(255) NOT NULL,
        legal_name VARCHAR(255),
        tax_id VARCHAR(100) UNIQUE,
        registration_number VARCHAR(100),
        company_type VARCHAR(50) NOT NULL,
        industry VARCHAR(100),
        description TEXT,
        website VARCHAR(255),
        founded_year INTEGER,
        employee_count VARCHAR(20),
        annual_revenue_range VARCHAR(50),
        headquarters_address TEXT,
        country VARCHAR(100) NOT NULL,
        city VARCHAR(100),
        verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'suspended')),
        verification_date TIMESTAMP WITH TIME ZONE,
        verification_documents JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)
    
    console.log('✅ Core tables created')
    
    // Insert admin user
    const adminResult = await neonClient.query(`
      INSERT INTO users (email, full_name, is_admin, role, status) 
      VALUES ('admin@astero.trading', 'ASTERO Trading Group Admin', true, 'admin', 'active')
      ON CONFLICT (email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        is_admin = EXCLUDED.is_admin,
        role = EXCLUDED.role,
        updated_at = NOW()
      RETURNING id
    `)
    
    const adminId = adminResult.rows[0].id
    console.log('✅ Admin user created/updated:', adminId)
    
    // Insert admin company
    await neonClient.query(`
      INSERT INTO companies (
        user_id, company_name, legal_name, company_type, industry, 
        description, country, city, verification_status, verification_date
      ) VALUES (
        $1, 'ASTERO Trading Group', 'ASTERO International Trading S.L.', 'private_company', 
        'International Trade', 'Premium B2B trading platform for European markets', 
        'Spain', 'Madrid', 'verified', NOW()
      ) ON CONFLICT (user_id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        verification_status = EXCLUDED.verification_status,
        updated_at = NOW()
    `, [adminId])
    
    // Insert welcome notification
    await neonClient.query(`
      INSERT INTO notifications (
        user_id, type, title, message, data, priority, delivery_method
      ) VALUES (
        $1, 'system_announcement', '🎉 ¡Bienvenido a DealsMarket!', 
        'Tu plataforma B2B está completamente configurada con Neon database. Sistema de notificaciones activo.',
        '{"platform": "DealsMarket", "database": "Neon", "status": "active"}',
        'high', 'in_app'
      )
    `, [adminId])
    
    console.log('✅ Sample data inserted')
    
    await neonClient.end()
    
    console.log('🎉 DealsMarket database initialized successfully on Neon!')
    return true
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    await neonClient.end()
    return false
  }
}
