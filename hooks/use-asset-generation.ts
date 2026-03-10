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

interface AssetStatusResponse {
  status?: string
  url?: string | null
  warnings?: string[]
  pipelineStage?: PipelineStage | null
}

function createIdleState(): AssetGenerationState {
  return {
    status: 'idle',
    url: null,
    error: null,
    warnings: [],
    progress: 0,
    stage: null,
  }
}

function createGeneratingState(): AssetGenerationState {
  return {
    status: 'generating',
    url: null,
    error: null,
    warnings: [],
    progress: STAGE_PROGRESS.icon_resolve,
    stage: 'icon_resolve',
  }
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

  const [state, setState] = useState<AssetGenerationState>(() =>
    enabled && projectId ? createGeneratingState() : createIdleState(),
  )

  const startTimeRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const statusErrorCountRef = useRef(0)
  const generationActiveRef = useRef(false)
  const autoStartedProjectIdRef = useRef<string | null>(null)

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const failGeneration = useCallback((error: string) => {
    cleanup()
    generationActiveRef.current = false
    setState((prev) =>
      prev.status === 'generating'
        ? { ...prev, status: 'failed', error }
        : { ...createIdleState(), status: 'failed', error },
    )
  }, [cleanup])

  const completeGeneration = useCallback((data: AssetStatusResponse) => {
    cleanup()
    generationActiveRef.current = false
    setState((prev) => ({
      status: 'completed',
      url: data.url ?? prev.url ?? null,
      error: null,
      warnings: Array.isArray(data.warnings) ? data.warnings : prev.warnings,
      progress: 100,
      stage: null,
    }))
  }, [cleanup])

  const pollStatus = useCallback(async (): Promise<AssetStatusResponse['status'] | null> => {
    const elapsed = Date.now() - startTimeRef.current

    if (elapsed > MAX_POLL_DURATION) {
      failGeneration(t('generationTimeout'))
      return 'failed'
    }

    try {
      const res = await fetch(`/api/assets/status/${projectId}`)
      if (!res.ok) throw new Error('Status check failed')

      statusErrorCountRef.current = 0
      const data = (await res.json()) as AssetStatusResponse

      if (data.status === 'completed') {
        completeGeneration(data)
        return data.status
      }

      if (data.status === 'failed') {
        failGeneration(t('generationFailed'))
        return data.status
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

      return data.status ?? 'idle'
    } catch {
      statusErrorCountRef.current += 1

      if (statusErrorCountRef.current >= MAX_STATUS_ERRORS) {
        failGeneration(t('statusCheckFailed'))
        return 'failed'
      }

      return null
    }
  }, [completeGeneration, failGeneration, projectId, t])

  const startGeneration = useCallback(async () => {
    if (!projectId || generationActiveRef.current) return

    cleanup()
    generationActiveRef.current = true
    startTimeRef.current = Date.now()
    statusErrorCountRef.current = 0

    setState(createGeneratingState())

    const initialStatus = await pollStatus()
    if (initialStatus === 'completed' || initialStatus === 'failed') return

    intervalRef.current = setInterval(() => {
      void pollStatus()
    }, POLL_INTERVAL_MS)

    if (initialStatus === 'generating') return

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
          error?: string | { code?: string; message?: string }
        }

        if (!response.ok) {
          const errorCode = typeof data.error === 'object' ? data.error?.code : null
          const errorMessage = typeof data.error === 'string'
            ? data.error
            : data.error?.message

          if (response.status === 409 && errorCode === 'ASSET_GENERATION_IN_PROGRESS') {
            return
          }

          failGeneration(errorMessage || t('generationRequestFailed'))
          return
        }

        if (data.success && data.url) {
          completeGeneration(data)
        }
      } catch {
        failGeneration(t('generationRequestFailed'))
      }
    })()
  }, [cleanup, completeGeneration, failGeneration, pollStatus, projectId, t])

  const reset = useCallback(() => {
    cleanup()
    generationActiveRef.current = false
    setState(createIdleState())
  }, [cleanup])

  useEffect(() => {
    if (!enabled || !projectId || autoStartedProjectIdRef.current === projectId) return

    autoStartedProjectIdRef.current = projectId
    void startGeneration()

    return cleanup
  }, [cleanup, enabled, projectId, startGeneration])

  return { ...state, reset, startGeneration }
}
