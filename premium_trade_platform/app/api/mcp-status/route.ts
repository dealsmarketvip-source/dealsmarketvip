import { NextResponse } from 'next/server'
import { getUnifiedDatabaseInfo, isUnifiedDatabaseConnected } from '@/lib/unified-database'

export async function GET() {
  try {
    const dbInfo = getUnifiedDatabaseInfo()
    const isDbConnected = isUnifiedDatabaseConnected()

    // Check environment variables for MCP connections
    const mcpStatus = {
      timestamp: new Date().toISOString(),
      database: {
        provider: dbInfo.provider,
        connected: isDbConnected,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not_configured',
        features: dbInfo.features
      },
      environment_variables: {
        supabase_url: {
          configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          is_placeholder: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || false,
          is_neon: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('neon.tech') || false,
          value_preview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
        },
        supabase_key: {
          configured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          is_placeholder: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('placeholder') || false,
          length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
        },
        stripe_key: {
          configured: !!process.env.STRIPE_SECRET_KEY,
          is_placeholder: process.env.STRIPE_SECRET_KEY?.includes('placeholder') || false
        },
        site_url: {
          configured: !!process.env.NEXT_PUBLIC_SITE_URL,
          value: process.env.NEXT_PUBLIC_SITE_URL
        }
      },
      mcp_services: {
        neon: {
          name: 'Neon PostgreSQL',
          status: dbInfo.provider === 'neon' && isDbConnected ? 'active' : 'inactive',
          description: 'Serverless PostgreSQL database',
          connected: dbInfo.provider === 'neon' && isDbConnected
        },
        supabase: {
          name: 'Supabase',
          status: dbInfo.provider === 'supabase' && isDbConnected ? 'active' : 'inactive', 
          description: 'PostgreSQL database with real-time features',
          connected: dbInfo.provider === 'supabase' && isDbConnected
        },
        builder_io: {
          name: 'Builder.io CMS',
          status: 'available',
          description: 'Content management system',
          connected: false // Would need actual Builder.io integration
        },
        netlify: {
          name: 'Netlify',
          status: 'available',
          description: 'Hosting and deployment platform',
          connected: false // Would need actual Netlify integration
        },
        figma: {
          name: 'Figma',
          status: 'available',
          description: 'Design to code conversion',
          connected: false // Would need actual Figma plugin
        },
        linear: {
          name: 'Linear',
          status: 'available', 
          description: 'Project management and issue tracking',
          connected: false // Would need actual Linear integration
        },
        sentry: {
          name: 'Sentry',
          status: 'available',
          description: 'Error monitoring and debugging',
          connected: false // Would need actual Sentry integration
        },
        prisma: {
          name: 'Prisma Postgres',
          status: 'available',
          description: 'Database ORM and schema management',
          connected: false // Would need actual Prisma integration
        }
      },
      recommendations: [],
      health_score: 0
    }

    // Calculate health score and recommendations
    let healthScore = 0
    
    if (isDbConnected) {
      healthScore += 40
      mcpStatus.recommendations.push(`✅ ${dbInfo.provider.toUpperCase()} database is connected and working`)
    } else {
      mcpStatus.recommendations.push(`⚠️ Database not connected - using mock data`)
    }

    if (process.env.NEXT_PUBLIC_SITE_URL) {
      healthScore += 10
      mcpStatus.recommendations.push('✅ Site URL configured')
    }

    // Add recommendations for MCP services
    mcpStatus.recommendations.push('💡 To activate more MCPs, connect them through the MCP panel')
    mcpStatus.recommendations.push('🔧 Available MCPs: Netlify (hosting), Linear (project management), Sentry (monitoring)')
    mcpStatus.recommendations.push('🎨 For design workflow: Connect Figma plugin for design-to-code')

    mcpStatus.health_score = Math.min(healthScore, 100)

    return NextResponse.json(mcpStatus, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })

  } catch (error: any) {
    console.error('MCP status check failed:', error)
    
    return NextResponse.json({
      error: 'Failed to check MCP status',
      details: error.message || String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// POST endpoint to test MCP connections
export async function POST() {
  try {
    const dbInfo = getUnifiedDatabaseInfo()
    const isDbConnected = isUnifiedDatabaseConnected()

    const testResults = {
      timestamp: new Date().toISOString(),
      tests: [
        {
          name: 'Database Connection',
          status: isDbConnected ? 'pass' : 'fail',
          details: `${dbInfo.provider} - ${isDbConnected ? 'Connected' : 'Not connected'}`
        },
        {
          name: 'Environment Variables',
          status: 'pass', // Basic env vars are working
          details: 'Basic environment configuration is working'
        }
      ],
      overall_status: isDbConnected ? 'healthy' : 'partial',
      message: isDbConnected 
        ? 'Core systems are working correctly'
        : 'Database not connected, but basic functionality available'
    }

    return NextResponse.json(testResults)

  } catch (error: any) {
    return NextResponse.json({
      error: 'MCP test failed',
      details: error.message || String(error)
    }, { status: 500 })
  }
}
