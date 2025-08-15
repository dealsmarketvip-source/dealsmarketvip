"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, AlertCircle, Info, DollarSign, Eye, Users, Settings, Clock, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/use-auth-instant'
import { dbService, type Notification, formatDateTime, isDatabaseConnected } from '@/lib/database'
import { enhancedDbService, isNeonConnected, getConnectionInfo } from '@/lib/neon-adapter'
import { toast } from 'sonner'

interface NotificationSystemProps {
  className?: string
}

const notificationIcons = {
  inquiry_received: DollarSign,
  inquiry_response: Users,
  deal_created: DollarSign,
  deal_updated: DollarSign,
  payment_received: DollarSign,
  payment_due: AlertCircle,
  milestone_completed: Check,
  verification_approved: Check,
  verification_rejected: X,
  product_viewed: Eye,
  subscription_renewed: Check,
  subscription_expired: AlertCircle,
  security_alert: AlertCircle,
  system_announcement: Info,
  marketing: Info
}

const notificationColors = {
  inquiry_received: 'text-green-500',
  inquiry_response: 'text-blue-500',
  deal_created: 'text-green-500',
  deal_updated: 'text-blue-500',
  payment_received: 'text-green-500',
  payment_due: 'text-orange-500',
  milestone_completed: 'text-green-500',
  verification_approved: 'text-green-500',
  verification_rejected: 'text-red-500',
  product_viewed: 'text-blue-500',
  subscription_renewed: 'text-green-500',
  subscription_expired: 'text-red-500',
  security_alert: 'text-red-500',
  system_announcement: 'text-blue-500',
  marketing: 'text-purple-500'
}

const priorityStyles = {
  low: 'border-l-gray-400',
  medium: 'border-l-blue-500',
  high: 'border-l-orange-500',
  urgent: 'border-l-red-500'
}

export function NotificationSystem({ className }: NotificationSystemProps) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return

    const dbConnected = isDatabaseConnected()
    console.log('Fetching notifications:', {
      userId: user.id,
      filter,
      databaseConnected: dbConnected
    })

    setLoading(true)
    try {
      const [notifs, count] = await Promise.all([
        dbService.getNotifications(user.id, {
          unreadOnly: filter === 'unread',
          limit: 50
        }),
        dbService.getUnreadNotificationCount(user.id)
      ])

      console.log('Notifications fetched successfully:', {
        count: notifs.length,
        unreadCount: count,
        usingMockData: !dbConnected
      })

      setNotifications(notifs)
      setUnreadCount(count)
    } catch (error: any) {
      // Extract meaningful error information
      const errorMessage = error?.message || error?.error?.message || String(error) || 'Unknown error'
      const errorCode = error?.code || error?.error?.code || 'NO_CODE'

      console.error('Error fetching notifications:', errorMessage)
      console.error('Error code:', errorCode)
      console.error('Database connected:', dbConnected)

      // Don't show error toast if database is not connected (expected)
      if (dbConnected) {
        toast.error('Error al cargar notificaciones')
      }
    } finally {
      setLoading(false)
    }
  }, [user?.id, filter])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Refresh notifications every 30 seconds
  useEffect(() => {
    if (!user?.id) return

    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchNotifications, user?.id])

  const markAsRead = async (notificationId: string) => {
    try {
      await dbService.markNotificationAsRead(notificationId)
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, read: true, read_at: new Date().toISOString() }
            : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!user?.id) return

    const dbConnected = isDatabaseConnected()
    if (!dbConnected) {
      // In demo mode, just update local state
      setNotifications(prev =>
        prev.map(notif => ({
          ...notif,
          read: true,
          read_at: new Date().toISOString()
        }))
      )
      setUnreadCount(0)
      toast.success('Todas las notificaciones marcadas como leídas (modo demo)')
      return
    }

    try {
      await dbService.markAllNotificationsAsRead(user.id)
      setNotifications(prev =>
        prev.map(notif => ({
          ...notif,
          read: true,
          read_at: new Date().toISOString()
        }))
      )
      setUnreadCount(0)
      toast.success('Todas las notificaciones marcadas como leídas')
    } catch (error: any) {
      // Extract meaningful error information
      const errorMessage = error?.message || error?.error?.message || String(error) || 'Unknown error'
      const errorCode = error?.code || error?.error?.code || 'NO_CODE'

      console.error('Error marking all notifications as read:', errorMessage)
      console.error('Error code:', errorCode)
      console.error('Database connected:', dbConnected)

      toast.error('Error al marcar notificaciones como leídas')
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id)
    }

    // Handle navigation based on notification type
    if (notification.related_entity_type && notification.related_entity_id) {
      switch (notification.related_entity_type) {
        case 'inquiry':
          // Navigate to inquiries page
          window.location.href = `/account?tab=inquiries`
          break
        case 'deal':
          // Navigate to deals page
          window.location.href = `/account?tab=deals`
          break
        case 'product':
          // Navigate to product
          window.location.href = `/product/${notification.related_entity_id}`
          break
        default:
          // Navigate to account dashboard
          window.location.href = `/account`
      }
    }

    setIsOpen(false)
  }

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || !notif.read
  )

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const IconComponent = notificationIcons[notification.type as keyof typeof notificationIcons] || Info
    const iconColor = notificationColors[notification.type as keyof typeof notificationColors] || 'text-blue-500'
    const priorityStyle = priorityStyles[notification.priority as keyof typeof priorityStyles] || 'border-l-gray-400'

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={`p-4 border-l-4 ${priorityStyle} hover:bg-muted/50 transition-colors cursor-pointer ${
          !notification.read ? 'bg-primary/5 border-primary/20' : ''
        }`}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${iconColor}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                {notification.title}
              </h4>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(notification.created_at)}
                </span>
              </div>
            </div>
            <p className={`text-sm mt-1 ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
              {notification.message}
            </p>
            {notification.priority === 'high' || notification.priority === 'urgent' ? (
              <Badge 
                variant={notification.priority === 'urgent' ? 'destructive' : 'secondary'}
                className="mt-2 text-xs"
              >
                {notification.priority === 'urgent' ? 'Urgente' : 'Alta prioridad'}
              </Badge>
            ) : null}
          </div>
        </div>
      </motion.div>
    )
  }

  if (!user) return null

  return (
    <div className={className}>
      {/* Notification Bell Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </Button>

        {/* Notification Panel */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-96 max-w-[90vw] bg-background border border-border rounded-lg shadow-lg z-50"
              >
                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Notificaciones</CardTitle>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs"
                          >
                            Marcar todas como leídas
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Filter Tabs */}
                    <div className="flex gap-1 mt-2">
                      <Button
                        variant={filter === 'all' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('all')}
                        className="text-xs h-7"
                      >
                        Todas ({notifications.length})
                      </Button>
                      <Button
                        variant={filter === 'unread' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('unread')}
                        className="text-xs h-7"
                      >
                        No leídas ({unreadCount})
                      </Button>
                    </div>
                  </CardHeader>

                  <Separator />

                  <CardContent className="p-0">
                    {/* Database Status Info */}
                    {!isDatabaseConnected() && (
                      <div className="p-3 bg-orange-500/10 border-b border-orange-500/20">
                        <div className="flex items-center gap-2 text-orange-400 text-xs">
                          <AlertCircle className="h-3 w-3" />
                          <span>Modo demo - Conecta a Neon para notificaciones reales</span>
                        </div>
                      </div>
                    )}

                    <ScrollArea className="h-96">
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">Cargando...</span>
                          </div>
                        </div>
                      ) : filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No tienes notificaciones'}
                          </p>
                          {!isDatabaseConnected() && (
                            <p className="text-xs text-orange-400 mt-1">
                              Conecta la base de datos para ver notificaciones reales
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <AnimatePresence>
                            {filteredNotifications.map((notification, index) => (
                              <div key={notification.id}>
                                <NotificationItem notification={notification} />
                                {index < filteredNotifications.length - 1 && <Separator />}
                              </div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>

                  {filteredNotifications.length > 0 && (
                    <>
                      <Separator />
                      <div className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => {
                            window.location.href = '/account?tab=notifications'
                            setIsOpen(false)
                          }}
                        >
                          Ver todas las notificaciones
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Hook for notification management
export function useNotifications() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  const refreshUnreadCount = useCallback(async () => {
    if (!user?.id) return

    try {
      const count = await dbService.getUnreadNotificationCount(user.id)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }, [user?.id])

  useEffect(() => {
    refreshUnreadCount()
    
    // Refresh every minute
    const interval = setInterval(refreshUnreadCount, 60000)
    return () => clearInterval(interval)
  }, [refreshUnreadCount])

  const createNotification = async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    try {
      await dbService.createNotification(notification)
      await refreshUnreadCount()
      return true
    } catch (error) {
      console.error('Error creating notification:', error)
      return false
    }
  }

  return {
    unreadCount,
    refreshUnreadCount,
    createNotification
  }
}
