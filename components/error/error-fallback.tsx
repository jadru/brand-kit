'use client'

import { AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const t = useTranslations('error')

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4" role="alert" aria-live="assertive">
      <div className="w-full max-w-md space-y-4 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-warning" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-text-primary">{t('title')}</h1>
        <p className="text-sm text-text-secondary">
          {error.message || t('unknown')}
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={resetError}>{t('retry')}</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            {t('home')}
          </Button>
        </div>
      </div>
    </div>
  )
}
