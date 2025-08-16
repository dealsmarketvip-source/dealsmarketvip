import { NextRequest, NextResponse } from 'next/server'
import { dbService, isDatabaseConnected } from '@/lib/database'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') || 'test-user-id'

  try {
    console.log('Debug: Starting notification fetch...')
    
    const dbConnected = isDatabaseConnected()
    console.log('Debug: Database connected:', dbConnected)
    
    // Test notifications fetch
    const notifications = await dbService.getNotifications(userId, {
      limit: 5
    })
    
    console.log('Debug: Notifications fetched:', notifications.length)
    
    // Test unread count
    const unreadCount = await dbService.getUnreadNotificationCount(userId)
    
    console.log('Debug: Unread count:', unreadCount)
    
    return NextResponse.json({
      success: true,
      databaseConnected: dbConnected,
      notifications: notifications,
      unreadCount: unreadCount,
      environment: {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
        has_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        node_env: process.env.NODE_ENV
      }
    })
    
  } catch (error: any) {
    console.error('Debug: Error in notification fetch:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      cause: error?.cause
    })
    
    return NextResponse.json({
      success: false,
      error: {
        message: error?.message || 'Unknown error',
        name: error?.name,
        stack: error?.stack,
        cause: error?.cause
      },
      databaseConnected: isDatabaseConnected()
    }, { status: 500 })
  }
}
