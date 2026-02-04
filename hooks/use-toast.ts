import { toast as sonnerToast } from 'sonner'

export const toast = {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  loading: (message: string) => sonnerToast.loading(message),
  promise: sonnerToast.promise,

  apiError: (error: unknown) => {
    const message =
      error instanceof Error ? error.message : '오류가 발생했습니다.'
    sonnerToast.error(message)
  },

  usageLimitReached: (resource: string) => {
    sonnerToast.error(`이번 달 ${resource} 사용량을 모두 사용했습니다.`, {
      action: {
        label: 'Pro 업그레이드',
        onClick: () => {
          window.location.href = '/settings/billing'
        },
      },
    })
  },

  planRequired: (feature: string) => {
    sonnerToast.error(`${feature}는 Pro 플랜 전용 기능입니다.`, {
      action: {
        label: '플랜 보기',
        onClick: () => {
          window.location.href = '/settings/billing'
        },
      },
    })
  },
}
