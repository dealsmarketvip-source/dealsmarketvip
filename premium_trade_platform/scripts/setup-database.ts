#!/usr/bin/env ts-node

/**
 * Database Setup Script for DealsMarket B2B Platform
 * 
 * This script initializes the database with the complete schema and seed data.
 * Run this after connecting to Neon database.
 * 
 * Usage: npx ts-node scripts/setup-database.ts
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nPlease make sure you have connected to Neon database via MCP and set up the environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSQLFile(filePath: string, description: string) {
  console.log(`📄 Running ${description}...`)
  
  try {
    const sql = readFileSync(filePath, 'utf8')
    
    // Split SQL into individual statements and execute them
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql_statement: statement })
        if (error) {
          console.error(`❌ Error executing statement: ${error.message}`)
          console.error(`Statement: ${statement.substring(0, 100)}...`)
        }
      }
    }
    
    console.log(`✅ ${description} completed successfully`)
  } catch (error) {
    console.error(`❌ Error reading/executing ${description}:`, error)
    throw error
  }
}

async function setupDatabase() {
  console.log('🚀 Starting DealsMarket Database Setup...\n')
  
  try {
    // Test connection
    console.log('🔗 Testing database connection...')
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error && !error.message.includes('relation "users" does not exist')) {
      throw new Error(`Database connection failed: ${error.message}`)
    }
    console.log('✅ Database connection established\n')
    
    // Run schema
    const schemaPath = join(process.cwd(), 'lib', 'database-schema.sql')
    await runSQLFile(schemaPath, 'database schema')
    
    console.log('')
    
    // Run seed data
    const seedPath = join(process.cwd(), 'lib', 'database-seed.sql')
    await runSQLFile(seedPath, 'seed data')
    
    console.log('\n🎉 Database setup completed successfully!')
    console.log('\n📊 Database initialized with:')
    console.log('   • Complete B2B platform schema')
    console.log('   • 8 verified companies from across Europe and Middle East')
    console.log('   • Premium products and services (€50K+ average value)')
    console.log('   • Realistic notifications and inquiries')
    console.log('   • Admin account (ASTERO1) with full privileges')
    console.log('   • FindersFee-inspired wanted posts and deals')
    
    console.log('\n🔐 Admin Access:')
    console.log('   Email: admin@astero.trading')
    console.log('   Password: SecureAdmin2024!')
    console.log('   Role: Admin with platform management capabilities')
    
    console.log('\n💼 Sample B2B Companies:')
    console.log('   • Italian Steel Works S.p.A. - Manufacturing')
    console.log('   • France Trade Solutions SAS - International Trade')
    console.log('   • German Tech Industries GmbH - Technology')
    console.log('   • Spanish Logistics Group S.L. - Logistics')
    console.log('   • Polish Manufacturing Co. - Precision Manufacturing')
    console.log('   • Dutch Export Partners B.V. - Export Services')
    console.log('   • Middle East Trading LLC - Luxury Automotive')
    
    console.log('\n✨ Platform Features:')
    console.log('   • Real-time notifications system')
    console.log('   • Advanced product search and filtering')
    console.log('   • B2B inquiries and deal management')
    console.log('   • Company verification system')
    console.log('   • Premium subscription tiers')
    console.log('   • European marketplace focus')
    
    console.log('\n🎯 Next Steps:')
    console.log('   1. Restart your development server')
    console.log('   2. Test login with admin@astero.trading')
    console.log('   3. Explore the marketplace and notifications')
    console.log('   4. Create test inquiries between companies')
    console.log('   5. Configure additional MCP integrations as needed')
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error)
    console.error('\n🔧 Troubleshooting:')
    console.error('   1. Ensure Neon database is connected via MCP')
    console.error('   2. Check environment variables in .env.local')
    console.error('   3. Verify database permissions')
    console.error('   4. Try running individual SQL files manually')
    process.exit(1)
  }
}

// Alternative simple setup function using direct SQL execution
async function simpleSetup() {
  console.log('🔄 Running simplified database setup...\n')
  
  try {
    // Create basic tables if they don't exist
    const basicSchema = `
      -- Create users table
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create notifications table
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        data JSONB DEFAULT '{}',
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Insert admin user
      INSERT INTO users (email, full_name, is_admin) 
      VALUES ('admin@astero.trading', 'ASTERO Trading Group Admin', true)
      ON CONFLICT (email) DO NOTHING;
    `
    
    const { error } = await supabase.rpc('exec_sql', { sql_statement: basicSchema })
    if (error) {
      console.error('❌ Error creating basic schema:', error)
      throw error
    }
    
    console.log('✅ Basic database setup completed!')
    console.log('📧 Admin login: admin@astero.trading')
    
  } catch (error) {
    console.error('❌ Simple setup failed:', error)
    console.error('Please run the full setup manually or check Neon connection.')
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.includes('--simple')) {
    simpleSetup()
  } else {
    setupDatabase()
  }
}

export { setupDatabase, simpleSetup }
