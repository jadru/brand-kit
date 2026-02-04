'use client'

import { useState } from 'react'
import { Loader2, Download, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { WebPreview } from '@/components/preview/web-preview'
import { MobilePreview } from '@/components/preview/mobile-preview'
import { CodePreview } from '@/components/preview/code-preview'
import { useAssetGeneration } from '@/hooks/use-asset-generation'
import type { Platform, MobileTarget } from '@/types/database'

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

function GeneratingState({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-12 w-12 animate-spin text-brand" />
      <p className="mt-4 text-lg font-medium text-text-primary">에셋 생성 중...</p>
      <p className="mt-2 text-sm text-text-secondary">
        플랫폼별 에셋을 생성하고 있습니다. 최대 1분 소요됩니다.
      </p>
      <div className="mt-6 w-full max-w-md">
        <div className="h-2 w-full rounded-full bg-surface-secondary">
          <div
            className="h-2 rounded-full bg-brand transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-text-tertiary">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}

function FailedState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertCircle className="h-12 w-12 text-status-error" />
      <p className="mt-4 text-lg font-medium text-text-primary">생성 실패</p>
      <p className="mt-2 text-sm text-text-secondary">{error}</p>
      <Button onClick={onRetry} className="mt-6">
        <RefreshCw className="mr-2 h-4 w-4" />
        다시 생성
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
  const { status, url, error, progress, reset, startGeneration } = useAssetGeneration({
    projectId,
    enabled: !!projectId,
  })

  const showMobile = platform === 'mobile' || platform === 'all'
  const showWeb = platform === 'web' || platform === 'all'

  async function handleRetry() {
    reset()
    startGeneration()
  }

  async function handleDownload() {
    if (!projectId) return
    const link = document.createElement('a')
    link.href = `/api/assets/download/${projectId}`
    link.download = `${projectName}-assets.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (status === 'generating' || status === 'idle') {
    return <GeneratingState progress={progress} />
  }

  if (status === 'failed') {
    return <FailedState error={error || '알 수 없는 오류'} onRetry={handleRetry} />
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
        <h2 className="text-lg font-semibold text-text-primary">에셋 프리뷰</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 생성
          </Button>
          <Button size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            모든 에셋 다운로드
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {showWeb && <TabsTrigger value="web">Web</TabsTrigger>}
          {showMobile && <TabsTrigger value="mobile">Mobile</TabsTrigger>}
          <TabsTrigger value="code">Code</TabsTrigger>
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
        <p className="text-center text-xs text-text-tertiary">
          에셋이 성공적으로 생성되었습니다. 다운로드 링크는 24시간 동안 유효합니다.
        </p>
      )}
    </div>
  )
}
