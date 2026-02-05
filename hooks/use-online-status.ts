'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface UseOnlineStatusOptions {
  showToasts?: boolean
  onOnline?: () => void
  onOffline?: () => void
}

/**
 * 네트워크 연결 상태 감지 훅
 * 오프라인/온라인 전환 시 사용자에게 알림
 */
export function useOnlineStatus(options: UseOnlineStatusOptions = {}) {
  const { showToasts = true, onOnline, onOffline } = options
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  const handleOnline = useCallback(() => {
    setIsOnline(true)

    if (wasOffline && showToasts) {
      toast.success('네트워크 연결됨', {
        description: '인터넷 연결이 복구되었습니다.',
        duration: 3000,
      })
    }

    onOnline?.()
  }, [wasOffline, showToasts, onOnline])

  const handleOffline = useCallback(() => {
    setIsOnline(false)
    setWasOffline(true)

    if (showToasts) {
      toast.error('네트워크 연결 끊김', {
        description: '인터넷 연결을 확인해주세요.',
        duration: Infinity,
        id: 'offline-toast',
      })
    }

    onOffline?.()
  }, [showToasts, onOffline])

  useEffect(() => {
    // 초기 상태 설정 (SSR 안전)
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      // 오프라인 토스트 제거
      toast.dismiss('offline-toast')
    }
  }, [handleOnline, handleOffline])

  return {
    isOnline,
    wasOffline,
  }
}
