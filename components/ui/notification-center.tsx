'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Bell,
  CheckCircle,
  CreditCard,
  Megaphone,
  AlertTriangle,
  Check,
  Trash2,
  X,
} from 'lucide-react'
import type { Notification, NotificationType } from '@/lib/notifications/types'

const iconMap: Record<NotificationType, React.ElementType> = {
  project_complete: CheckCircle,
  subscription_update: CreditCard,
  system_announcement: Megaphone,
  usage_warning: AlertTriangle,
}

const colorConfig: Record<NotificationType, { text: string; bg: string; glow: string }> = {
  project_complete: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    glow: 'shadow-emerald-500/20',
  },
  subscription_update: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    glow: 'shadow-blue-500/20',
  },
  system_announcement: {
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
    glow: 'shadow-violet-500/20',
  },
  usage_warning: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    glow: 'shadow-amber-500/20',
  },
}

function formatRelativeTime(date: string, locale: string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (locale === 'ko') {
    if (diffMins < 1) return '방금 전'
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    if (diffDays < 7) return `${diffDays}일 전`
    return then.toLocaleDateString('ko-KR')
  }

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return then.toLocaleDateString('en-US')
}

interface NotificationCenterProps {
  locale?: string
}

export function NotificationCenter({ locale = 'en' }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/notifications?limit=20')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const handleOpen = () => {
    setIsOpen(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true)
        // Focus the close button when panel opens
        closeButtonRef.current?.focus()
      })
    })
  }

  const handleClose = useCallback(() => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsOpen(false)
      // Return focus to trigger button
      triggerRef.current?.focus()
    }, 200)
  }, [])

  // Keyboard handling
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
        return
      }

      if (e.key === 'Tab') {
        const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', notificationId }),
      })
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
        )
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' }),
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications?id=${notificationId}`, { method: 'DELETE' })
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        ref={triggerRef}
        onClick={isOpen ? handleClose : handleOpen}
        className="group relative rounded-xl p-2.5 text-white/40 transition-all hover:bg-white/5 hover:text-white/70"
        aria-label={locale === 'ko' ? `알림${unreadCount > 0 ? `, ${unreadCount}개 읽지 않음` : ''}` : `Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Bell className="h-5 w-5 transition-transform group-hover:scale-105" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 font-mono text-[10px] font-bold text-white shadow-lg shadow-accent/30"
            aria-hidden="true"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={handleClose} />

          {/* Dropdown */}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-panel-title"
            className={`absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl backdrop-blur-xl transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-96 ${
              isAnimating
                ? 'translate-y-0 scale-100 opacity-100'
                : '-translate-y-2 scale-95 opacity-0'
            }`}
          >
            {/* Top gradient line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

            {/* Noise texture */}
            <div className="noise pointer-events-none absolute inset-0 opacity-30" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <h3
                  id="notification-panel-title"
                  className="font-display text-sm font-semibold tracking-tight text-white"
                >
                  {locale === 'ko' ? '알림' : 'Notifications'}
                </h3>
                {unreadCount > 0 && (
                  <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                    {unreadCount} {locale === 'ko' ? '개 읽지 않음' : 'unread'}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    aria-label={locale === 'ko' ? '모든 알림 읽음 처리' : 'Mark all notifications as read'}
                    className="flex items-center gap-1 rounded-lg px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/40 transition-all hover:bg-white/10 hover:text-white/70"
                  >
                    <Check className="h-3 w-3" aria-hidden="true" />
                    {locale === 'ko' ? '모두 읽음' : 'Read all'}
                  </button>
                )}
                <button
                  ref={closeButtonRef}
                  onClick={handleClose}
                  aria-label={locale === 'ko' ? '알림 패널 닫기' : 'Close notification panel'}
                  className="rounded-lg p-1.5 text-white/30 transition-all hover:bg-white/10 hover:text-white/60"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div
              className="relative z-10 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
              aria-live="polite"
              aria-busy={isLoading}
            >
              {isLoading && notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12" role="status">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-accent" aria-hidden="true" />
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-white/30">
                    {locale === 'ko' ? '로딩 중...' : 'Loading...'}
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12" role="status">
                  <div className="relative mb-3">
                    <div className="absolute inset-0 rounded-full bg-white/5 blur-xl" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                      <Bell className="h-6 w-6 text-white/20" aria-hidden="true" />
                    </div>
                  </div>
                  <p className="font-mono text-xs text-white/30">
                    {locale === 'ko' ? '알림이 없습니다' : 'No notifications yet'}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {notifications.map((notification, index) => {
                    const Icon = iconMap[notification.type]
                    const colors = colorConfig[notification.type]

                    return (
                      <li
                        key={notification.id}
                        className={`animate-fade-in-up group relative p-4 transition-colors hover:bg-white/5 ${
                          !notification.read_at ? 'bg-white/[0.02]' : ''
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors.bg}`}
                            >
                              <Icon className={`h-4 w-4 ${colors.text}`} />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium leading-tight text-white">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-white/40">
                              {notification.message}
                            </p>
                            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-white/25">
                              {formatRelativeTime(notification.created_at, locale)}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="absolute right-3 top-3 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                          {!notification.read_at && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="rounded-lg p-1.5 text-white/30 transition-all hover:bg-white/10 hover:text-emerald-400 focus:bg-white/10 focus:text-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                              aria-label={locale === 'ko' ? `"${notification.title}" 읽음 표시` : `Mark "${notification.title}" as read`}
                            >
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="rounded-lg p-1.5 text-white/30 transition-all hover:bg-white/10 hover:text-rose-400 focus:bg-white/10 focus:text-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            aria-label={locale === 'ko' ? `"${notification.title}" 삭제` : `Delete "${notification.title}"`}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        {/* Unread indicator */}
                        {!notification.read_at && (
                          <div className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent shadow-lg shadow-accent/50" />
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NotificationCenter
