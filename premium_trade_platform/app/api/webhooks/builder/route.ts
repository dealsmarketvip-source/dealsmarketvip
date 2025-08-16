import { NextRequest, NextResponse } from 'next/server'
import { handleBuilderWebhook } from '@/lib/search'

export async function POST(request: NextRequest) {
  try {
    // Verify webhook authenticity (in production, verify signature)
    const builderSecret = process.env.BUILDER_WEBHOOK_SECRET
    const signature = request.headers.get('x-builder-signature')
    
    if (builderSecret && signature) {
      // In production, verify the webhook signature
      // const crypto = require('crypto')
      // const expectedSignature = crypto.createHmac('sha256', builderSecret)
      //   .update(await request.text())
      //   .digest('hex')
      // 
      // if (signature !== expectedSignature) {
      //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      // }
    }

    const webhookData = await request.json()
    
    console.log('📝 Builder.io webhook received:', {
      type: webhookData.type,
      model: webhookData.model,
      id: webhookData.data?.id
    })

    // Handle the webhook and update search index
    const result = await handleBuilderWebhook(webhookData)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Webhook processed successfully' 
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Builder webhook processing failed:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    service: 'builder-webhook',
    timestamp: new Date().toISOString()
  })
}
