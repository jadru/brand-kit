'use client'

import { useEffect } from 'react'
import { ErrorFallback } from '@/components/error/error-fallback'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Root Error:', error)
  }, [error])

  return <ErrorFallback error={error} resetError={reset} />
}
