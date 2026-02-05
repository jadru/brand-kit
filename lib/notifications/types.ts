/**
 * Notification Types
 */

export type NotificationType =
  | 'project_complete'
  | 'subscription_update'
  | 'system_announcement'
  | 'usage_warning'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown>
  read_at: string | null
  created_at: string
}

export interface CreateNotificationInput {
  user_id: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
}
