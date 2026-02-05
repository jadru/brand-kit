/**
 * Notification Client Utilities
 * Server-side functions for managing notifications
 */

import { createClient } from '@/lib/supabase/server'
import type { Notification, CreateNotificationInput, NotificationType } from './types'

/**
 * Get notifications for a user
 */
export async function getNotifications(
  userId: string,
  options?: { limit?: number; unreadOnly?: boolean }
) {
  const supabase = await createClient()
  const { limit = 20, unreadOnly = false } = options || {}

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (unreadOnly) {
    query = query.is('read_at', null)
  }

  const { data, error } = await query

  if (error) {
    console.error('[Notifications] Error fetching:', error)
    return []
  }

  return data as Notification[]
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_unread_notification_count', {
    p_user_id: userId,
  })

  if (error) {
    console.error('[Notifications] Error getting unread count:', error)
    return 0
  }

  return data || 0
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)

  if (error) {
    console.error('[Notifications] Error marking as read:', error)
    return false
  }

  return true
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
  const supabase = await createClient()

  const { error } = await supabase.rpc('mark_all_notifications_read', {
    p_user_id: userId,
  })

  if (error) {
    console.error('[Notifications] Error marking all as read:', error)
    return false
  }

  return true
}

/**
 * Create a notification (server-side only)
 */
export async function createNotification(input: CreateNotificationInput) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: input.user_id,
      type: input.type,
      title: input.title,
      message: input.message,
      data: input.data || {},
    })
    .select()
    .single()

  if (error) {
    console.error('[Notifications] Error creating:', error)
    return null
  }

  return data as Notification
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('notifications').delete().eq('id', notificationId)

  if (error) {
    console.error('[Notifications] Error deleting:', error)
    return false
  }

  return true
}

/**
 * Notification icon and color mapping
 */
export const notificationMeta: Record<
  NotificationType,
  { icon: string; color: string }
> = {
  project_complete: { icon: 'CheckCircle', color: 'text-green-500' },
  subscription_update: { icon: 'CreditCard', color: 'text-blue-500' },
  system_announcement: { icon: 'Megaphone', color: 'text-purple-500' },
  usage_warning: { icon: 'AlertTriangle', color: 'text-yellow-500' },
}
