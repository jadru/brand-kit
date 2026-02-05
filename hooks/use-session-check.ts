'use client'

import { useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

/**
 * 세션 만료 감지 훅
 * API 응답에서 401 에러를 감지하고 사용자를 로그인 페이지로 안내
 */
export function useSessionCheck() {
  const router = useRouter()

  const handleUnauthorized = useCallback(() => {
    toast.error('세션이 만료되었습니다', {
      description: '다시 로그인해주세요.',
      duration: 5000,
    })

    const currentPath = window.location.pathname
    const locale = currentPath.match(/^\/(en|ko)/)?.[1] || 'en'

    setTimeout(() => {
      router.push(`/${locale}/login?reason=session_expired`)
    }, 1500)
  }, [router])

  // 전역 fetch 응답 인터셉터 (선택적)
  useEffect(() => {
    const originalFetch = window.fetch

    window.fetch = async (...args) => {
      const response = await originalFetch(...args)

      // API 엔드포인트에서 401 응답 시 처리
      if (response.status === 401) {
        const input = args[0]
        let url = ''
        if (typeof input === 'string') {
          url = input
        } else if (input instanceof URL) {
          url = input.pathname
        } else if (input instanceof Request) {
          url = new URL(input.url).pathname
        }
        // 내부 API 호출인 경우에만 세션 만료 처리
        if (url.startsWith('/api/')) {
          // Clone response so it can still be used
          const clonedResponse = response.clone()
          handleUnauthorized()
          return clonedResponse
        }
      }

      return response
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [handleUnauthorized])

  return { handleUnauthorized }
}
