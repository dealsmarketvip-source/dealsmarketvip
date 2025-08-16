import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const event = await request.json()
    
    // Log the event (in production, you'd send to your analytics service)
    console.log('📊 Analytics Event Received:', {
      name: event.name,
      properties: event.properties,
      userId: event.userId,
      sessionId: event.sessionId,
      timestamp: event.timestamp,
      url: event.url,
      userAgent: event.userAgent,
    })

    // Here you would typically:
    // 1. Validate the event data
    // 2. Store in database
    // 3. Send to external analytics services (Mixpanel, Amplitude, etc.)
    // 4. Process for real-time dashboards

    // For now, just acknowledge receipt
    return NextResponse.json({ 
      success: true, 
      message: 'Event tracked successfully' 
    })

  } catch (error) {
    // Handle null/undefined errors gracefully
    const errorMessage = error instanceof Error
      ? error.message
      : error
      ? String(error)
      : 'Unknown error occurred'

    console.error('Analytics tracking error:', {
      message: errorMessage,
      error: error instanceof Error ? {
        name: error.name,
        stack: error.stack
      } : error
    })

    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
