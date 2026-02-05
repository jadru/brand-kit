/**
 * Notifications API Route
 * Handles fetching and updating notifications for authenticated users
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '@/lib/notifications'

/**
 * GET /api/notifications
 * Fetch notifications for the current user
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const unreadOnly = searchParams.get('unreadOnly') === 'true'

  const [notifications, unreadCount] = await Promise.all([
    getNotifications(user.id, { limit, unreadOnly }),
    getUnreadCount(user.id),
  ])

  return NextResponse.json({
    notifications,
    unreadCount,
  })
}

/**
 * PATCH /api/notifications
 * Mark notifications as read
 */
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action, notificationId } = body

  switch (action) {
    case 'mark_read':
      if (!notificationId) {
        return NextResponse.json({ error: 'Missing notificationId' }, { status: 400 })
      }
      await markAsRead(notificationId)
      break

    case 'mark_all_read':
      await markAllAsRead(user.id)
      break

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

/**
 * DELETE /api/notifications
 * Delete a notification
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const notificationId = searchParams.get('id')

  if (!notificationId) {
    return NextResponse.json({ error: 'Missing notification id' }, { status: 400 })
  }

  const success = await deleteNotification(notificationId)

  if (!success) {
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
