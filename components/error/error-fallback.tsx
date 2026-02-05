'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4" role="alert" aria-live="assertive">
      <div className="w-full max-w-md space-y-4 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-warning" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-text-primary">문제가 발생했습니다</h1>
        <p className="text-sm text-text-secondary">
          {error.message || '알 수 없는 오류가 발생했습니다.'}
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={resetError}>다시 시도</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            홈으로
          </Button>
        </div>
      </div>
    </div>
  )
}
