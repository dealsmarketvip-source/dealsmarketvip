import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Initializing Neon database for DealsMarket...')

    // Create users table
    await database.rpc('exec_sql', {
      sql_statement: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
      `
    })

    // Create notifications table
    await database.rpc('exec_sql', {
      sql_statement: `
        CREATE TABLE IF NOT EXISTS notifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
      `
    })

    // Create companies table
    await database.rpc('exec_sql', {
      sql_statement: `
        CREATE TABLE IF NOT EXISTS companies (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
      `
    })

    console.log('✅ Core tables created')

    // Insert admin user
    const { data: adminUser, error: adminError } = await database
      .from('users')
      .upsert({
        email: 'admin@astero.trading',
        full_name: 'ASTERO Trading Group Admin',
        is_admin: true,
        role: 'admin',
        status: 'active'
      }, {
        onConflict: 'email'
      })
      .select()

    if (adminError) {
      console.error('Error creating admin user:', adminError)
    } else {
      console.log('✅ Admin user created/updated')
    }

    // Get admin user ID for company and notification
    const { data: admin } = await database
      .from('users')
      .select('id')
      .eq('email', 'admin@astero.trading')
      .single()

    if (admin) {
      // Insert admin company
      const { error: companyError } = await database
        .from('companies')
        .upsert({
          user_id: admin.id,
          company_name: 'ASTERO Trading Group',
          legal_name: 'ASTERO International Trading S.L.',
          company_type: 'private_company',
          industry: 'International Trade',
          description: 'Premium B2B trading platform for European markets',
          country: 'Spain',
          city: 'Madrid',
          verification_status: 'verified',
          verification_date: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (companyError) {
        console.error('Error creating admin company:', companyError)
      }

      // Insert welcome notification
      const { error: notificationError } = await database
        .from('notifications')
        .insert({
          user_id: admin.id,
          type: 'system_announcement',
          title: '🎉 ¡Bienvenido a DealsMarket!',
          message: 'Tu plataforma B2B está completamente configurada con Neon database. Sistema de notificaciones activo.',
          data: { platform: 'DealsMarket', database: 'Neon', status: 'active' },
          priority: 'high',
          delivery_method: 'in_app'
        })

      if (notificationError) {
        console.error('Error creating welcome notification:', notificationError)
      }
    }

    console.log('✅ Sample data inserted')
    console.log('🎉 DealsMarket database initialized successfully on Neon!')

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      admin_email: 'admin@astero.trading',
      features: [
        'Core tables created',
        'Admin user configured',
        'ASTERO company profile',
        'Welcome notification added',
        'Neon database connected'
      ]
    })

  } catch (error: any) {
    console.error('❌ Database initialization failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Database initialization failed',
      details: error.details || 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to initialize Neon database for DealsMarket',
    endpoint: '/api/init-neon',
    method: 'POST'
  })
}
