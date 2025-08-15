import { NextResponse } from 'next/server'
import { isDatabaseConnected } from '@/lib/database'

export async function GET() {
  const isConnected = isDatabaseConnected()
  
  return NextResponse.json({
    connected: isConnected,
    status: isConnected ? 'connected' : 'disconnected',
    message: isConnected 
      ? 'Database is properly connected and ready for use'
      : 'Database not connected - using placeholder configuration',
    environment: {
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') ? 'placeholder' : 'configured',
      supabase_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('placeholder') ? 'placeholder' : 'configured'
    },
    next_steps: isConnected ? [
      'Database is ready',
      'All features are functional',
      'You can use the full B2B platform'
    ] : [
      'Connect to Neon database via MCP',
      'Run database initialization script',
      'Test with admin login: admin@astero.trading'
    ]
  })
}
