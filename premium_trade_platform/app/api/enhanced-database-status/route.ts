import { NextResponse } from 'next/server'
import { getConnectionInfo, isNeonConnected, enhancedDbService } from '@/lib/neon-adapter'
import { isDatabaseConnected } from '@/lib/database'

export async function GET() {
  try {
    const connectionInfo = getConnectionInfo()
    const neonConnected = isNeonConnected()
    const supabaseConnected = isDatabaseConnected()
    const provider = enhancedDbService.getProvider()

    // Test notification fetching
    const testUserId = 'test-user-123'
    let notificationTest = null
    let errorDetails = null

    try {
      const notifications = await enhancedDbService.getNotifications(testUserId, { limit: 3 })
      const unreadCount = await enhancedDbService.getUnreadNotificationCount(testUserId)
      
      notificationTest = {
        success: true,
        notificationsCount: notifications.length,
        unreadCount,
        sampleNotification: notifications[0] || null
      }
    } catch (error: any) {
      notificationTest = {
        success: false,
        error: error.message || String(error)
      }
      errorDetails = {
        message: error?.message || 'Unknown error',
        code: error?.code || 'NO_CODE',
        name: error?.name || 'UnknownError'
      }
    }

    const status = {
      timestamp: new Date().toISOString(),
      connections: {
        neon: {
          connected: neonConnected,
          status: neonConnected ? 'active' : 'not_configured',
          info: neonConnected ? connectionInfo : null
        },
        supabase: {
          connected: supabaseConnected,
          status: supabaseConnected ? 'active' : 'placeholder_values'
        },
        active_provider: provider
      },
      notification_system: notificationTest,
      error_details: errorDetails,
      recommendations: []
    }

    // Add recommendations
    if (neonConnected) {
      status.recommendations.push('✅ Neon PostgreSQL está conectado y funcionando')
      status.recommendations.push('📊 Sistema de notificaciones operativo')
      status.recommendations.push('🎯 Plataforma B2B completamente funcional')
    } else {
      status.recommendations.push('⚠️ Neon no está configurado - usando datos demo')
      status.recommendations.push('🔧 Para activar Neon, configura las credenciales correctas')
      status.recommendations.push('📚 Las notificaciones funcionan en modo mock')
    }

    return NextResponse.json(status, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })

  } catch (error: any) {
    console.error('Enhanced database status check failed:', error)
    
    return NextResponse.json({
      error: 'Failed to check database status',
      details: error.message || String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
