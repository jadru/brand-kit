'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Download, RefreshCw, AlertCircle, AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { WebPreview } from '@/components/preview/web-preview'
import { MobilePreview } from '@/components/preview/mobile-preview'
import { CodePreview } from '@/components/preview/code-preview'
import { Card, CardContent } from '@/components/ui/card'
import { useAssetGeneration } from '@/hooks/use-asset-generation'
import { cn } from '@/lib/utils/cn'
import { AnalyticsEvents, trackEvent } from '@/lib/analytics/events'
import type { Platform, MobileTarget, PipelineStage } from '@/types/database'

interface Step5PreviewProps {
  projectId: string | null
  projectName: string
  platform: Platform
  mobileTarget: MobileTarget | null
  primaryColor: string
  headline: string | null
  description: string | null
  aiOgDescription: string | null
  aiTagline: string | null
}

const STAGE_ORDER: PipelineStage[] = ['icon_resolve', 'favicons', 'og', 'app_icons', 'splash', 'zip', 'upload']

const STAGE_PROGRESS_MARKER: Record<PipelineStage, number> = {
  icon_resolve: 5,
  favicons: 20,
  og: 45,
  app_icons: 62,
  splash: 78,
  zip: 90,
  upload: 96,
}

function GeneratingState({ progress, stage }: { progress: number; stage: PipelineStage | null }) {
  const t = useTranslations('wizard.preview')
  const tProgress = useTranslations('wizard.preview.progress')
  const stageForLabel = stage ?? 'icon_resolve'

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-12 w-12 animate-spin text-brand" />
      <p className="mt-4 text-lg font-medium text-text-primary">{t('generatingTitle')}</p>
      <p className="mt-2 text-sm text-text-secondary">{t('generatingDescription')}</p>
      <div className="mt-6 w-full max-w-md">
        <div className="h-2 w-full rounded-full bg-surface-secondary">
          <div
            className="h-2 rounded-full bg-brand transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-text-tertiary">{Math.round(progress)}%</p>
        <p className="mt-1 text-center text-xs text-text-secondary">
          {tProgress('currentStage', { stage: tProgress(`stages.${stageForLabel}`) })}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {STAGE_ORDER.map((item) => {
            const isActive = stage === item
            const isCompleted = progress >= STAGE_PROGRESS_MARKER[item]
            return (
              <span
                key={item}
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-medium',
                  isActive && 'bg-brand text-white',
                  !isActive && isCompleted && 'bg-brand/15 text-brand',
                  !isActive && !isCompleted && 'bg-surface-secondary text-text-tertiary',
                )}
              >
                {tProgress(`shortStages.${item}`)}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function FailedState({ error, onRetry }: { error: string; onRetry: () => void }) {
  const t = useTranslations('wizard.preview')

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertCircle className="h-12 w-12 text-status-error" />
      <p className="mt-4 text-lg font-medium text-text-primary">{t('failedTitle')}</p>
      <p className="mt-2 text-sm text-text-secondary">{error}</p>
      <Button onClick={onRetry} className="mt-6">
        <RefreshCw className="mr-2 h-4 w-4" />
        {t('retry')}
      </Button>
    </div>
  )
}

export function Step5Preview({
  projectId,
  projectName,
  platform,
  mobileTarget,
  primaryColor,
  headline,
  description,
  aiOgDescription,
  aiTagline,
}: Step5PreviewProps) {
  const [activeTab, setActiveTab] = useState('web')
  const generationStartedRef = useRef(false)
  const generationCompletedRef = useRef(false)
  const generationStartMsRef = useRef<number | null>(null)
  const t = useTranslations('wizard.preview')
  const tPlatforms = useTranslations('projects.platform')
  const tDetail = useTranslations('projects.detail')
  const { status, url, error, warnings, progress, stage, reset, startGeneration } = useAssetGeneration({
    projectId,
    enabled: !!projectId,
  })

  const showMobile = platform === 'mobile' || platform === 'all'
  const showWeb = platform === 'web' || platform === 'all'

  useEffect(() => {
    if (!projectId) return

    if (status === 'generating' && !generationStartedRef.current) {
      generationStartedRef.current = true
      generationCompletedRef.current = false
      generationStartMsRef.current = Date.now()
      const assetTypes = platform === 'all'
        ? ['web', 'mobile']
        : [platform]
      trackEvent(AnalyticsEvents.ASSET_GENERATE_START, { asset_types: assetTypes })
    }

    if (status === 'completed' && generationStartedRef.current && !generationCompletedRef.current) {
      generationCompletedRef.current = true
      const durationMs = generationStartMsRef.current ? Date.now() - generationStartMsRef.current : 0
      const assetCount = (showWeb ? 1 : 0) + (showMobile ? 1 : 0)
      trackEvent(AnalyticsEvents.ASSET_GENERATE_COMPLETE, {
        asset_count: assetCount,
        duration_ms: durationMs,
      })
    }
  }, [platform, projectId, showMobile, showWeb, status])

  async function handleRetry() {
    reset()
    generationStartedRef.current = false
    generationCompletedRef.current = false
    generationStartMsRef.current = null
    startGeneration()
  }

  async function handleDownload() {
    if (!projectId) return
    trackEvent(AnalyticsEvents.ASSET_DOWNLOAD, { project_id: projectId, format: 'zip' })
    const link = document.createElement('a')
    link.href = `/api/assets/download/${projectId}`
    link.download = `${projectName}-assets.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (status === 'generating' || status === 'idle') {
    return <GeneratingState progress={progress} stage={stage} />
  }

  if (status === 'failed') {
    return <FailedState error={error || t('unknownError')} onRetry={handleRetry} />
  }

  const project = {
    name: projectName,
    platform,
    mobile_target: mobileTarget,
    ai_og_description: aiOgDescription,
    ai_tagline: aiTagline,
    description,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">{t('title')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('retry')}
          </Button>
          <Button size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            {t('download')}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {showWeb && <TabsTrigger value="web">{tPlatforms('web')}</TabsTrigger>}
          {showMobile && <TabsTrigger value="mobile">{tPlatforms('mobile')}</TabsTrigger>}
          <TabsTrigger value="code">{tDetail('code')}</TabsTrigger>
        </TabsList>

        {showWeb && (
          <TabsContent value="web">
            <WebPreview
              projectName={projectName}
              headline={headline}
              description={aiOgDescription || description}
              bgColor={primaryColor}
            />
          </TabsContent>
        )}
        {showMobile && (
          <TabsContent value="mobile">
            <MobilePreview
              projectName={projectName}
              bgColor={primaryColor}
              mobileTarget={mobileTarget}
            />
          </TabsContent>
        )}
        <TabsContent value="code">
          <CodePreview project={project} />
        </TabsContent>
      </Tabs>

      {url && (
        <p className="text-center text-xs text-text-tertiary">{t('downloadReady')}</p>
      )}

      {warnings.length > 0 && (
        <Card className="border-amber-400/40 bg-amber-50/10">
          <CardContent className="py-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-500">
              <AlertTriangle className="h-4 w-4" />
              <span>{t('warningTitle')}</span>
            </div>
            <ul className="ml-5 list-disc space-y-1 text-xs text-text-secondary">
              {warnings.map((warning) => (
                <li key={warning}>{t(`warnings.${warning}`, { defaultValue: warning })}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
