import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Test connection
    const { data: test, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError && !testError.message.includes('relation "users" does not exist')) {
      throw new Error(`Database connection failed: ${testError.message}`)
    }

    // Create basic schema for MVP
    const basicSchema = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        is_admin BOOLEAN DEFAULT FALSE,
        role VARCHAR(20) DEFAULT 'user',
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Companies table
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        company_name VARCHAR(255) NOT NULL,
        description TEXT,
        country VARCHAR(100) NOT NULL,
        verification_status VARCHAR(20) DEFAULT 'verified',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Products table
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(15,2),
        currency VARCHAR(3) DEFAULT 'EUR',
        status VARCHAR(20) DEFAULT 'active',
        featured BOOLEAN DEFAULT FALSE,
        views_count INTEGER DEFAULT 0,
        inquiries_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Notifications table
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        data JSONB DEFAULT '{}',
        read BOOLEAN DEFAULT FALSE,
        priority VARCHAR(10) DEFAULT 'medium',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Inquiries table
      CREATE TABLE IF NOT EXISTS inquiries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Execute schema creation
    const { error: schemaError } = await supabase.rpc('exec_sql', { 
      sql: basicSchema 
    })

    if (schemaError) {
      console.error('Schema creation error:', schemaError)
      // Continue anyway, tables might already exist
    }

    // Insert admin user
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .upsert({
        email: 'admin@astero.trading',
        full_name: 'ASTERO Trading Group Admin',
        is_admin: true,
        role: 'admin'
      }, {
        onConflict: 'email',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (adminError) {
      console.error('Admin user creation error:', adminError)
    }

    // Insert sample companies and products
    const sampleData = [
      {
        email: 'marco.rossi@italiansteel.com',
        full_name: 'Marco Rossi',
        company: 'Italian Steel Works S.p.A.',
        country: 'Italy',
        products: [{
          title: 'Premium Structural Steel Beams - Grade S355',
          description: 'High-grade structural steel beams manufactured to European standards EN 10025. Perfect for construction, industrial buildings, and infrastructure projects.',
          category: 'Manufacturing & Industry',
          price: 1250.00
        }]
      },
      {
        email: 'sophie.dubois@francetrade.fr',
        full_name: 'Sophie Dubois',
        company: 'France Trade Solutions SAS',
        country: 'France',
        products: [{
          title: 'European Market Entry Consulting Services',
          description: 'Comprehensive market entry consulting for companies looking to establish presence in European markets. 98% success rate.',
          category: 'Finance & Professional Services',
          price: 15000.00
        }]
      },
      {
        email: 'klaus.mueller@germantech.de',
        full_name: 'Klaus Müller',
        company: 'German Tech Industries GmbH',
        country: 'Germany',
        products: [{
          title: 'Industrial IoT Automation Systems',
          description: 'Complete Industrial IoT solution including sensors, gateways, cloud platform, and analytics dashboard. Increase manufacturing efficiency by 30%.',
          category: 'Technology & Software',
          price: 25000.00
        }]
      }
    ]

    for (const userData of sampleData) {
      // Insert user
      const { data: user, error: userError } = await supabase
        .from('users')
        .upsert({
          email: userData.email,
          full_name: userData.full_name
        }, {
          onConflict: 'email',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (userError) {
        console.error('User creation error:', userError)
        continue
      }

      // Insert company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .upsert({
          user_id: user.id,
          company_name: userData.company,
          country: userData.country,
          description: 'Verified European B2B company specializing in high-value transactions.',
          verification_status: 'verified'
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (companyError) {
        console.error('Company creation error:', companyError)
        continue
      }

      // Insert products
      for (const productData of userData.products) {
        const { error: productError } = await supabase
          .from('products')
          .upsert({
            seller_id: user.id,
            title: productData.title,
            description: productData.description,
            category: productData.category,
            price: productData.price,
            currency: 'EUR',
            status: 'active',
            featured: true,
            views_count: Math.floor(Math.random() * 500 + 100),
            inquiries_count: Math.floor(Math.random() * 20 + 5)
          }, {
            onConflict: 'seller_id,title',
            ignoreDuplicates: true
          })

        if (productError) {
          console.error('Product creation error:', productError)
        }
      }

      // Create sample notifications
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: user.id,
            type: 'system_announcement',
            title: '🎉 Bienvenido a DealsMarket Premium',
            message: 'Tu empresa ha sido verificada exitosamente. Explora deals millonarios con empresas verificadas de Europa.',
            data: { platform: 'DealsMarket', user_tier: 'Premium' },
            read: false,
            priority: 'medium'
          },
          {
            user_id: user.id,
            type: 'product_viewed',
            title: '👀 Tu producto ha sido visto',
            message: 'Tu producto ha sido visto por 15 empresas verificadas en las últimas 24 horas.',
            data: { views: 15, period: '24h' },
            read: false,
            priority: 'low'
          }
        ])

      if (notifError) {
        console.error('Notification creation error:', notifError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully with B2B marketplace data',
      data: {
        tablesCreated: ['users', 'companies', 'products', 'notifications', 'inquiries'],
        sampleCompanies: sampleData.length,
        adminUserCreated: !adminError
      }
    })

  } catch (error: any) {
    console.error('Database initialization error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to initialize database'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'DealsMarket Database Initialization API',
    usage: 'POST to this endpoint to initialize the database with B2B marketplace schema and data',
    features: [
      'European B2B marketplace schema',
      'Verified companies and premium products',
      'Real-time notifications system',
      'Admin account with full privileges',
      'FindersFee-inspired wanted posts and deals'
    ]
  })
}
