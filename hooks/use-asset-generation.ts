'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

interface UseAssetGenerationOptions {
  projectId: string | null
  enabled: boolean
}

interface AssetGenerationState {
  status: 'idle' | 'generating' | 'completed' | 'failed'
  url: string | null
  error: string | null
  progress: number
}

const MAX_POLL_DURATION = 5 * 60 * 1000 // 5 minutes

export function useAssetGeneration({ projectId, enabled }: UseAssetGenerationOptions) {
  const [state, setState] = useState<AssetGenerationState>({
    status: 'idle',
    url: null,
    error: null,
    progress: 0,
  })
  const startTimeRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startGeneration = useCallback(async () => {
    if (!projectId) return

    setState({ status: 'generating', url: null, error: null, progress: 5 })
    startTimeRef.current = Date.now()

    try {
      await fetch('/api/assets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      })
    } catch {
      setState((prev) => ({ ...prev, status: 'failed', error: '에셋 생성 요청에 실패했습니다.' }))
      return
    }

    setState((prev) => ({ ...prev, progress: 10 }))

    intervalRef.current = setInterval(async () => {
      const elapsed = Date.now() - startTimeRef.current

      if (elapsed > MAX_POLL_DURATION) {
        cleanup()
        setState((prev) => ({ ...prev, status: 'failed', error: '에셋 생성 시간이 초과되었습니다.' }))
        return
      }

      // Time-based progress estimation
      const estimatedProgress = Math.min(90, 10 + (elapsed / 60000) * 80)
      setState((prev) => ({
        ...prev,
        progress: prev.status === 'generating' ? Math.max(prev.progress, estimatedProgress) : prev.progress,
      }))

      try {
        const res = await fetch(`/api/assets/status/${projectId}`)
        if (!res.ok) throw new Error('Status check failed')
        const data = await res.json()

        if (data.status === 'completed') {
          cleanup()
          setState({ status: 'completed', url: data.url, error: null, progress: 100 })
        } else if (data.status === 'failed') {
          cleanup()
          setState((prev) => ({ ...prev, status: 'failed', error: '에셋 생성에 실패했습니다.' }))
        }
      } catch {
        cleanup()
        setState((prev) => ({ ...prev, status: 'failed', error: '상태 확인에 실패했습니다.' }))
      }
    }, 2000)
  }, [projectId, cleanup])

  const reset = useCallback(() => {
    cleanup()
    setState({ status: 'idle', url: null, error: null, progress: 0 })
  }, [cleanup])

  useEffect(() => {
    if (enabled && projectId) {
      startGeneration()
    }
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, projectId])

  return { ...state, reset, startGeneration }
}
