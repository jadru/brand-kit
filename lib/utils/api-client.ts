/**
 * API 클라이언트 유틸리티
 * 401 에러 시 세션 만료 처리 및 로그인 페이지 리다이렉트
 */

import { toast } from 'sonner'

interface ApiClientOptions extends RequestInit {
  skipAuthRedirect?: boolean
}

interface ApiResponse<T = unknown> {
  data?: T
  error?: {
    code: string
    message: string
  }
}

/**
 * 인증이 필요한 API 호출을 위한 fetch 래퍼
 * 401 에러 시 자동으로 세션 만료 처리
 */
export async function apiClient<T = unknown>(
  url: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const { skipAuthRedirect = false, ...fetchOptions } = options

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    })

    // 401 Unauthorized - 세션 만료
    if (response.status === 401 && !skipAuthRedirect) {
      handleSessionExpired()
      return {
        error: {
          code: 'SESSION_EXPIRED',
          message: '세션이 만료되었습니다. 다시 로그인해주세요.',
        },
      }
    }

    // JSON 파싱 시도
    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        error: data?.error || {
          code: 'API_ERROR',
          message: data?.message || `요청 실패: ${response.status}`,
        },
      }
    }

    return { data: data as T }
  } catch {
    // 네트워크 에러
    return {
      error: {
        code: 'NETWORK_ERROR',
        message: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
      },
    }
  }
}

/**
 * 세션 만료 시 처리
 */
function handleSessionExpired() {
  // 토스트 알림
  toast.error('세션이 만료되었습니다', {
    description: '다시 로그인해주세요.',
    duration: 5000,
  })

  // 현재 URL을 저장하여 로그인 후 돌아올 수 있도록
  const currentPath = window.location.pathname
  const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}&reason=session_expired`

  // 약간의 딜레이 후 리다이렉트 (토스트를 볼 수 있도록)
  setTimeout(() => {
    window.location.href = redirectUrl
  }, 1500)
}

/**
 * 세션 상태 확인
 */
export async function checkSession(): Promise<boolean> {
  const response = await fetch('/api/auth/session', {
    method: 'GET',
    credentials: 'include',
  })
  return response.ok
}
