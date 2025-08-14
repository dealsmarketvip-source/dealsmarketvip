import { NextRequest, NextResponse } from 'next/server'
import { initializeSystem } from '@/lib/auth-enhanced'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Initializing DealsMarket system...')
    
    const success = await initializeSystem()
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'DealsMarket system initialized successfully',
        accounts: {
          'ASTERO1': {
            email: 'admin@astero.trading',
            password: 'AsteroSecure2024!',
            description: 'Enterprise account with full access'
          },
          'BETA50': {
            email: 'beta@dealsmarket.vip',
            password: 'BetaTest2024!',
            description: 'Beta testing account with full access'
          }
        },
        instructions: {
          1: 'Use invitation codes ASTERO1 or BETA50 to log in',
          2: 'These codes create real accounts with full functionality',
          3: 'All database tables and functions are now created',
          4: 'You can now use the marketplace, account, and settings pages'
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'System initialization had issues, but may still work'
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('System initialization error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to initialize system',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'DealsMarket Initialization Endpoint',
    usage: 'POST to this endpoint to initialize the system',
    note: 'This will create database schema and default accounts'
  })
}
