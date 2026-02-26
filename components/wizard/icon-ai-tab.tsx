'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useWizardStore } from '@/store/wizard-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PlanGate } from '@/components/shared/plan-gate'
import { UsageMeter } from '@/components/shared/usage-meter'
import { cn } from '@/lib/utils/cn'
import type { BrandProfile, Plan, User } from '@/types/database'

interface IconAiTabProps {
  plan: Plan
  user: User
  brandProfile: BrandProfile | null
}

interface GeneratedImage {
  url: string
  seed: number
}

export function IconAiTab({ plan, user, brandProfile }: IconAiTabProps) {
  const { icon, setIcon } = useWizardStore()
  const [description, setDescription] = useState('')
  const [quality, setQuality] = useState<'fast' | 'quality'>('fast')
  const [isGenerating, setIsGenerating] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [iconsUsed, setIconsUsed] = useState(user.ai_icons_used_this_month)

  const iconsLimit = plan === 'pro' ? Infinity : 5
  const isExhausted = iconsUsed >= iconsLimit

  if (plan === 'free') {
    return (
      <PlanGate feature="AI Icon Generation" currentPlan={plan} requiredPlan="pro">
        <div />
      </PlanGate>
    )
  }

  async function generate(seed?: number) {
    if (!description.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/icons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          brandProfile: brandProfile ? {
            styleDirection: brandProfile.style_direction,
            primaryColor: brandProfile.primary_color,
            colorMode: brandProfile.color_mode,
            iconStyle: brandProfile.icon_style,
          cornerStyle: brandProfile.corner_style,
          keywords: brandProfile.keywords,
        } : undefined,
          seed,
          quality,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Generation failed'
        try {
          const err = await response.json()
          errorMessage = err.message || err.error || errorMessage
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setImages(data.images)
      setIconsUsed((prev) => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate icons')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleGenerate() {
    await generate()
  }

  async function handleRegenerateFromSeed(seed: number) {
    await generate(seed)
  }

  function handleSelectImage(url: string) {
    setIcon({ iconType: 'ai_generated', iconValue: url })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Describe the icon you want and AI will generate 4 options.
        </p>
        <UsageMeter label="AI Icons" current={iconsUsed} limit={iconsLimit} showUpgrade />
      </div>

      <div className="space-y-2">
        <Label htmlFor="iconDescription">Icon Description</Label>
        <Input
          id="iconDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., minimalist checkmark icon for task app"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="iconQuality">Generation Quality</Label>
        <select
          id="iconQuality"
          value={quality}
          onChange={(e) => setQuality(e.target.value as 'fast' | 'quality')}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-text-primary"
        >
          <option value="fast">Fast (Flux Schnell)</option>
          <option value="quality">High Quality (Flux Dev)</option>
        </select>
      </div>

      <Button
        onClick={handleGenerate}
        isLoading={isGenerating}
        disabled={!description.trim() || isExhausted}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Generate 4 Options
      </Button>

      {error && <p className="text-sm text-error">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, idx) => (
            <div key={idx} className="space-y-2">
              <button
                type="button"
                onClick={() => handleSelectImage(img.url)}
                className={cn(
                  'overflow-hidden rounded-lg border-2 transition-all',
                  icon.iconType === 'ai_generated' && icon.iconValue === img.url
                    ? 'border-brand ring-2 ring-brand'
                    : 'border-border hover:border-border-hover'
                )}
              >
                <Image
                  src={img.url}
                  alt={`Generated icon option ${idx + 1}`}
                  width={256}
                  height={256}
                  className="h-full w-full object-cover"
                />
              </button>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Seed {img.seed}</span>
                {icon.iconType === 'ai_generated' && icon.iconValue === img.url && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleRegenerateFromSeed(img.seed)}
                    disabled={isGenerating || isExhausted}
                    className="h-7 px-2 text-xs"
                  >
                    Similar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
