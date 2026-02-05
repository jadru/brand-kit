'use client'

import { useState } from 'react'
import { Download, RefreshCw, Loader2, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Link, useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { WebPreview } from '@/components/preview/web-preview'
import { MobilePreview } from '@/components/preview/mobile-preview'
import { CodePreview } from '@/components/preview/code-preview'
import { useAssetGeneration } from '@/hooks/use-asset-generation'
import { duplicateProject } from '../actions'
import type { Project, ProjectStatus } from '@/types/database'

interface ProjectDetailClientProps {
  project: Project
  primaryColor: string
}

const STATUS_BADGE: Record<ProjectStatus, { variant: 'default' | 'success' | 'warning' | 'error'; label: string }> = {
  draft: { variant: 'default', label: '초안' },
  generating: { variant: 'warning', label: '생성 중' },
  completed: { variant: 'success', label: '완료' },
  failed: { variant: 'error', label: '실패' },
}

export function ProjectDetailClient({ project, primaryColor }: ProjectDetailClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('web')
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const { status: genStatus, progress } = useAssetGeneration({
    projectId: isRegenerating ? project.id : null,
    enabled: isRegenerating,
  })

  const showMobile = project.platform === 'mobile' || project.platform === 'all'
  const showWeb = project.platform === 'web' || project.platform === 'all'

  const isGenerating = isRegenerating && (genStatus === 'generating' || genStatus === 'idle')
  const currentStatus = isRegenerating ? genStatus : project.status
  const badge = STATUS_BADGE[currentStatus as ProjectStatus] || STATUS_BADGE.draft

  async function handleRegenerate() {
    setIsRegenerating(true)

    await fetch(`/api/assets/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: project.id }),
    })
  }

  async function handleDuplicate() {
    setIsDuplicating(true)
    try {
      const result = await duplicateProject(project.id)
      if (result.success && result.newProjectId) {
        toast.success('프로젝트가 복제되었습니다')
        router.push(`/projects/${result.newProjectId}`)
      } else {
        toast.error(result.error || '복제에 실패했습니다')
      }
    } catch {
      toast.error('복제에 실패했습니다')
    } finally {
      setIsDuplicating(false)
    }
  }

  async function handleDownload() {
    const link = document.createElement('a')
    link.href = `/api/assets/download/${project.id}`
    link.download = `${project.name}-assets.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const codeProject = {
    name: project.name,
    platform: project.platform,
    mobile_target: project.mobile_target,
    ai_og_description: project.ai_og_description,
    ai_tagline: project.ai_tagline,
    description: project.description,
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Projects', href: '/projects' },
          { label: project.name }
        ]}
      />

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">{project.name}</h1>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            {project.platform === 'web' ? 'Web' : project.platform === 'mobile' ? 'Mobile' : 'Web + Mobile'}
            {' · '}
            {new Date(project.created_at).toLocaleDateString('ko-KR')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            disabled={isDuplicating}
          >
            {isDuplicating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            복제
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            다시 생성
          </Button>
          {(project.status === 'completed' || genStatus === 'completed') && (
            <Button size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              다운로드
            </Button>
          )}
        </div>
      </div>

      {isGenerating && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-brand" />
              <p className="mt-4 text-sm font-medium text-text-primary">에셋 재생성 중...</p>
              <div className="mt-4 w-full max-w-sm">
                <div className="h-2 w-full rounded-full bg-surface-secondary">
                  <div
                    className="h-2 rounded-full bg-brand transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isGenerating && (currentStatus === 'completed' || project.status === 'completed') && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {showWeb && <TabsTrigger value="web">Web</TabsTrigger>}
            {showMobile && <TabsTrigger value="mobile">Mobile</TabsTrigger>}
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          {showWeb && (
            <TabsContent value="web">
              <WebPreview
                projectName={project.name}
                headline={project.ai_headline}
                description={project.ai_og_description || project.description}
                bgColor={primaryColor}
              />
            </TabsContent>
          )}
          {showMobile && (
            <TabsContent value="mobile">
              <MobilePreview
                projectName={project.name}
                bgColor={primaryColor}
                mobileTarget={project.mobile_target}
              />
            </TabsContent>
          )}
          <TabsContent value="code">
            <CodePreview project={codeProject} />
          </TabsContent>
        </Tabs>
      )}

      {!isGenerating && project.status === 'failed' && !isRegenerating && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-secondary">에셋 생성에 실패했습니다.</p>
            <Button onClick={handleRegenerate} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 생성
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
