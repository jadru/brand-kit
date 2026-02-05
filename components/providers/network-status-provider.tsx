'use client'

import { useOnlineStatus } from '@/hooks/use-online-status'
import { useSessionCheck } from '@/hooks/use-session-check'
import { ScrollToTop } from '@/components/ui/scroll-to-top'

interface NetworkStatusProviderProps {
  children: React.ReactNode
}

/**
 * 네트워크 상태 및 세션 모니터링 프로바이더
 * 대시보드 레이아웃에서 사용하여 전역 상태 감지
 */
export function NetworkStatusProvider({ children }: NetworkStatusProviderProps) {
  // 네트워크 연결 상태 감지
  useOnlineStatus()

  // 세션 만료 감지
  useSessionCheck()

  return (
    <>
      {children}
      <ScrollToTop />
    </>
  )
}
