'use client'

import { useState } from 'react'
import { Sparkles, RefreshCw, Check } from 'lucide-react'
import { useWizardStore } from '@/store/wizard-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { UsageMeter } from '@/components/shared/usage-meter'
import type { BrandProfile, User } from '@/types/database'
import type { HeadlineResponse } from '@/types/wizard'

interface Step2ProjectInfoProps {
  user: User
  brandProfile: BrandProfile | null
}

export function Step2ProjectInfo({ user, brandProfile }: Step2ProjectInfoProps) {
  const { project, platform, setProject } = useWizardStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiResult, setAiResult] = useState<HeadlineResponse | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [headlinesUsed, setHeadlinesUsed] = useState(user.ai_headlines_used_this_month)
  const [headlinesLimit] = useState(() => {
    const limits = { free: 10, pro: Infinity }
    return limits[user.plan] ?? 10
  })

  const isExhausted = headlinesUsed >= headlinesLimit

  async function handleGenerate() {
    if (!project.name.trim()) return

    setIsGenerating(true)
    setAiError(null)

    try {
      const response = await fetch('/api/ai/headlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: project.name,
          description: project.description || undefined,
          platform: platform.platform,
          brandKeywords: brandProfile?.keywords,
          brandStyleDirection: brandProfile?.style_direction,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        if (err.error === 'USAGE_LIMIT_EXCEEDED') {
          setAiError('AI headline usage limit exceeded. Upgrade to Pro for unlimited generation.')
          setHeadlinesUsed(err.current)
          return
        }
        throw new Error(err.message || 'Generation failed')
      }

      const data: HeadlineResponse = await response.json()
      setAiResult(data)
      setHeadlinesUsed((prev) => prev + 1)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to generate headlines')
    } finally {
      setIsGenerating(false)
    }
  }

  function handleAcceptCopy() {
    if (!aiResult) return
    setProject({
      aiHeadline: aiResult.headline,
      aiTagline: aiResult.tagline,
      aiOgDescription: aiResult.ogDescription,
      aiShortSlogan: aiResult.shortSlogan,
    })
  }

  const hasCopyApplied = !!project.aiHeadline

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Project Info</h2>
        <p className="text-sm text-text-secondary">
          Name your project and optionally generate AI copy.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectName" required>Project Name</Label>
          <Input
            id="projectName"
            value={project.name}
            onChange={(e) => setProject({ name: e.target.value })}
            placeholder="My Awesome App"
            maxLength={50}
          />
          <p className="text-xs text-text-tertiary">{project.name.length}/50</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Short Description</Label>
          <Input
            id="description"
            value={project.description}
            onChange={(e) => setProject({ description: e.target.value })}
            placeholder="A brief description of your project"
            maxLength={200}
          />
          <p className="text-xs text-text-tertiary">{project.description.length}/200</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>AI SEO Copy</Label>
          <UsageMeter
            label="Headlines"
            current={headlinesUsed}
            limit={headlinesLimit}
            showUpgrade
          />
        </div>

        <Button
          variant="outline"
          onClick={handleGenerate}
          isLoading={isGenerating}
          disabled={!project.name.trim() || isExhausted}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {aiResult ? 'Regenerate' : 'Generate AI Headlines'}
        </Button>

        {aiError && <p className="text-sm text-error">{aiError}</p>}

        {aiResult && (
          <Card>
            <CardContent className="space-y-3 pt-4">
              <div>
                <p className="text-xs font-medium text-text-tertiary">Headline</p>
                <p className="text-sm text-text-primary">{aiResult.headline}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-tertiary">Tagline</p>
                <p className="text-sm text-text-primary">{aiResult.tagline}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-tertiary">OG Description</p>
                <p className="text-sm text-text-primary">{aiResult.ogDescription}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-tertiary">Short Slogan</p>
                <p className="text-sm text-text-primary">{aiResult.shortSlogan}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleAcceptCopy}
                  disabled={hasCopyApplied}
                >
                  <Check className="mr-1 h-3.5 w-3.5" />
                  {hasCopyApplied ? 'Applied' : 'Use this copy'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerate}
                  isLoading={isGenerating}
                  disabled={isExhausted}
                >
                  <RefreshCw className="mr-1 h-3.5 w-3.5" />
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
