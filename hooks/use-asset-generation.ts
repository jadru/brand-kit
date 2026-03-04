'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { PipelineStage } from '@/types/database'

interface UseAssetGenerationOptions {
  projectId: string | null
  enabled: boolean
}

interface AssetGenerationState {
  status: 'idle' | 'generating' | 'completed' | 'failed'
  url: string | null
  error: string | null
  warnings: string[]
  progress: number
  stage: PipelineStage | null
}

const STAGE_PROGRESS: Record<PipelineStage, number> = {
  icon_resolve: 5,
  favicons: 20,
  og: 45,
  app_icons: 62,
  splash: 78,
  zip: 90,
  upload: 96,
}

const PIPELINE_STAGES: PipelineStage[] = [
  'icon_resolve',
  'favicons',
  'og',
  'app_icons',
  'splash',
  'zip',
  'upload',
]

const POLL_INTERVAL_MS = 1800
const MAX_POLL_DURATION = 5 * 60 * 1000 // 5 minutes
const MAX_STATUS_ERRORS = 3

function isPipelineStage(value: unknown): value is PipelineStage {
  return typeof value === 'string' && PIPELINE_STAGES.includes(value as PipelineStage)
}

export function useAssetGeneration({ projectId, enabled }: UseAssetGenerationOptions) {
  const t = useTranslations('wizard.errors')

  const [state, setState] = useState<AssetGenerationState>({
    status: 'idle',
    url: null,
    error: null,
    warnings: [],
    progress: 0,
    stage: null,
  })

  const startTimeRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const statusErrorCountRef = useRef(0)

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startGeneration = useCallback(async () => {
    if (!projectId) return

    cleanup()
    startTimeRef.current = Date.now()
    statusErrorCountRef.current = 0

    setState({
      status: 'generating',
      url: null,
      error: null,
      warnings: [],
      progress: STAGE_PROGRESS.icon_resolve,
      stage: 'icon_resolve',
    })

    const pollStatus = async () => {
      const elapsed = Date.now() - startTimeRef.current

      if (elapsed > MAX_POLL_DURATION) {
        cleanup()
        setState((prev) =>
          prev.status === 'generating'
            ? { ...prev, status: 'failed', error: t('generationTimeout') }
            : prev,
        )
        return
      }

      try {
        const res = await fetch(`/api/assets/status/${projectId}`)
        if (!res.ok) throw new Error('Status check failed')

        statusErrorCountRef.current = 0
        const data = (await res.json()) as {
          status?: string
          url?: string | null
          warnings?: string[]
          pipelineStage?: PipelineStage | null
        }

        if (data.status === 'completed') {
          cleanup()
          setState((prev) => ({
            status: 'completed',
            url: data.url ?? prev.url,
            error: null,
            warnings: Array.isArray(data.warnings) && data.warnings.length > 0 ? data.warnings : prev.warnings,
            progress: 100,
            stage: null,
          }))
          return
        }

        if (data.status === 'failed') {
          cleanup()
          setState((prev) =>
            prev.status === 'generating'
              ? { ...prev, status: 'failed', error: t('generationFailed') }
              : prev,
          )
          return
        }

        const serverStage = isPipelineStage(data.pipelineStage) ? data.pipelineStage : null
        const stageBase = serverStage ? STAGE_PROGRESS[serverStage] : STAGE_PROGRESS.icon_resolve
        const timeFill = Math.min(6, (elapsed / 90_000) * 6)
        const stageProgress = Math.min(98, stageBase + timeFill)

        setState((prev) => {
          if (prev.status !== 'generating') return prev
          return {
            ...prev,
            stage: serverStage ?? prev.stage,
            progress: Math.max(prev.progress, stageProgress),
          }
        })
      } catch {
        statusErrorCountRef.current += 1

        if (statusErrorCountRef.current >= MAX_STATUS_ERRORS) {
          cleanup()
          setState((prev) =>
            prev.status === 'generating'
              ? { ...prev, status: 'failed', error: t('statusCheckFailed') }
              : prev,
          )
        }
      }
    }

    await pollStatus()
    intervalRef.current = setInterval(() => {
      void pollStatus()
    }, POLL_INTERVAL_MS)

    void (async () => {
      try {
        const response = await fetch('/api/assets/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId }),
        })

        const data = (await response.json().catch(() => ({}))) as {
          success?: boolean
          url?: string | null
          warnings?: string[]
          error?: string
        }

        if (!response.ok) {
          cleanup()
          setState((prev) =>
            prev.status === 'generating'
              ? {
                  ...prev,
                  status: 'failed',
                  error: typeof data.error === 'string' ? data.error : t('generationRequestFailed'),
                }
              : prev,
          )
          return
        }

        if (data.success && data.url) {
          cleanup()
          setState((prev) => ({
            status: 'completed',
            url: data.url ?? prev.url ?? null,
            error: null,
            warnings: Array.isArray(data.warnings) ? data.warnings : prev.warnings,
            progress: 100,
            stage: null,
          }))
        }
      } catch {
        cleanup()
        setState((prev) =>
          prev.status === 'generating'
            ? { ...prev, status: 'failed', error: t('generationRequestFailed') }
            : prev,
        )
      }
    })()
  }, [cleanup, projectId, t])

  const reset = useCallback(() => {
    cleanup()
    setState({
      status: 'idle',
      url: null,
      error: null,
      warnings: [],
      progress: 0,
      stage: null,
    })
  }, [cleanup])

  useEffect(() => {
    if (enabled && projectId) {
      void startGeneration()
    }

    return cleanup
  }, [cleanup, enabled, projectId, startGeneration])

  return { ...state, reset, startGeneration }
}
