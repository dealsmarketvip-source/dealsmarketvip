// Production Neon Database Configuration for DealsMarket
import { createClient } from '@supabase/supabase-js'

// Neon PostgreSQL connection for production
const NEON_CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3QTMwzEFO4bS@ep-gentle-star-abamfguf-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

// Production Supabase client configuration for Neon
const neonUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ep-gentle-star-abamfguf-pooler.eu-west-2.aws.neon.tech'
const neonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'npg_3QTMwzEFO4bS'

export const neonClient = createClient(neonUrl, neonKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Production database schema setup
export const initializeProductionDatabase = async () => {
  try {
    console.log('🚀 Initializing production database on Neon...')

    // Create users table
    const { error: usersError } = await neonClient.rpc('exec_sql', {
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
          language VARCHAR(10) DEFAULT 'es',
          profile_image_url TEXT,
          company_name VARCHAR(255),
          location VARCHAR(255),
          bio TEXT,
          website VARCHAR(255)
        );
      `
    })

    if (usersError) {
      console.error('Users table error:', usersError)
    } else {
      console.log('✅ Users table ready')
    }

    // Create products table
    const { error: productsError } = await neonClient.rpc('exec_sql', {
      sql_statement: `
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          description TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          currency VARCHAR(10) DEFAULT 'EUR',
          category VARCHAR(100) NOT NULL,
          condition VARCHAR(50) NOT NULL,
          location VARCHAR(255),
          shipping_included BOOLEAN DEFAULT false,
          shipping_cost DECIMAL(8,2) DEFAULT 0,
          seller_id VARCHAR(255) NOT NULL,
          seller_name VARCHAR(255) NOT NULL,
          seller_email VARCHAR(255) NOT NULL,
          status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'paused', 'draft')),
          images TEXT[] DEFAULT '{}',
          tags TEXT[] DEFAULT '{}',
          featured BOOLEAN DEFAULT false,
          verified BOOLEAN DEFAULT true,
          views_count INTEGER DEFAULT 0,
          favorites_count INTEGER DEFAULT 0,
          specifications JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (productsError) {
      console.error('Products table error:', productsError)
    } else {
      console.log('✅ Products table ready')
    }

    // Create notifications table
    const { error: notificationsError } = await neonClient.rpc('exec_sql', {
      sql_statement: `
        CREATE TABLE IF NOT EXISTS notifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id VARCHAR(255) NOT NULL,
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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (notificationsError) {
      console.error('Notifications table error:', notificationsError)
    } else {
      console.log('✅ Notifications table ready')
    }

    // Create user_activities table
    const { error: activitiesError } = await neonClient.rpc('exec_sql', {
      sql_statement: `
        CREATE TABLE IF NOT EXISTS user_activities (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id VARCHAR(255) NOT NULL,
          products_sold TEXT[] DEFAULT '{}',
          products_bought TEXT[] DEFAULT '{}',
          total_sales INTEGER DEFAULT 0,
          total_purchases INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id)
        );
      `
    })

    if (activitiesError) {
      console.error('User activities table error:', activitiesError)
    } else {
      console.log('✅ User activities table ready')
    }

    // Create admin user
    const { error: adminError } = await neonClient
      .from('users')
      .upsert({
        email: 'admin@dealsmarket.com',
        full_name: 'DealsMarket Admin',
        is_admin: true,
        role: 'admin',
        status: 'active',
        email_verified: true
      }, {
        onConflict: 'email'
      })

    if (adminError) {
      console.error('Admin user error:', adminError)
    } else {
      console.log('✅ Admin user ready')
    }

    console.log('🎉 Production database initialized successfully!')
    return true

  } catch (error) {
    console.error('❌ Production database initialization failed:', error)
    return false
  }
}

// Production data migration from localStorage
export const migrateLocalDataToProduction = async () => {
  try {
    console.log('📦 Migrating localStorage data to production...')

    // Migrate products
    const localProducts = localStorage.getItem('dealsmarket_products')
    if (localProducts) {
      const products = JSON.parse(localProducts)
      
      for (const product of products) {
        await neonClient.from('products').upsert(product, { onConflict: 'id' })
      }
      
      console.log(`✅ Migrated ${products.length} products to production`)
    }

    // Migrate user activities
    const localActivities = localStorage.getItem('dealsmarket_user_activities')
    if (localActivities) {
      const activities = JSON.parse(localActivities)
      
      for (const [userId, activity] of Object.entries(activities)) {
        await neonClient.from('user_activities').upsert({
          user_id: userId,
          ...activity as any
        }, { onConflict: 'user_id' })
      }
      
      console.log(`✅ Migrated ${Object.keys(activities).length} user activities to production`)
    }

    return true
  } catch (error) {
    console.error('❌ Data migration failed:', error)
    return false
  }
}

// Health check for production database
export const checkProductionHealth = async () => {
  try {
    const { data, error } = await neonClient.from('users').select('count').limit(1)
    
    if (error) {
      console.error('❌ Production health check failed:', error)
      return false
    }
    
    console.log('✅ Production database is healthy')
    return true
  } catch (error) {
    console.error('❌ Production health check error:', error)
    return false
  }
}

export default neonClient
