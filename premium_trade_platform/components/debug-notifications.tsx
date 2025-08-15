"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dbService, isDatabaseConnected } from '@/lib/database'
import { useAuth } from '@/hooks/use-auth-instant'

export function DebugNotifications() {
  const { user } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDebugTest = async () => {
    if (!user?.id) {
      setDebugInfo({ error: 'No user logged in' })
      return
    }

    setLoading(true)
    const startTime = Date.now()

    try {
      console.log('🔍 Starting notification debug test...')
      
      // Check database connection
      const dbConnected = isDatabaseConnected()
      console.log('🔗 Database connected:', dbConnected)
      
      // Test API endpoint
      const apiResponse = await fetch(`/api/debug-notifications?userId=${user.id}`)
      const apiData = await apiResponse.json()
      console.log('🌐 API Response:', apiData)
      
      // Test direct service call
      console.log('🔧 Testing direct service calls...')
      
      const notifications = await dbService.getNotifications(user.id, {
        limit: 5
      })
      console.log('📬 Direct notifications call result:', notifications)
      
      const unreadCount = await dbService.getUnreadNotificationCount(user.id)
      console.log('🔢 Direct unread count call result:', unreadCount)
      
      const endTime = Date.now()
      
      setDebugInfo({
        success: true,
        duration: `${endTime - startTime}ms`,
        databaseConnected: dbConnected,
        apiResponse: apiData,
        directCalls: {
          notifications: notifications,
          unreadCount: unreadCount
        },
        environment: {
          hasUser: !!user,
          userId: user.id,
          userEmail: user.email
        }
      })
      
    } catch (error: any) {
      console.error('❌ Debug test failed:', error)
      
      setDebugInfo({
        success: false,
        error: {
          message: error?.message || 'Unknown error',
          name: error?.name,
          stack: error?.stack
        },
        databaseConnected: isDatabaseConnected()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>🔍 Notification System Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDebugTest} 
          disabled={loading || !user}
          className="w-full"
        >
          {loading ? 'Running Debug Test...' : 'Run Notification Debug Test'}
        </Button>
        
        {!user && (
          <p className="text-orange-500 text-sm">
            ⚠️ Please log in first to test notifications
          </p>
        )}
        
        {debugInfo && (
          <div className="mt-4">
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
