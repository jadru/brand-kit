'use client'

import { useMemo, useState } from 'react'
import { Sparkles, Wand2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useWizardStore } from '@/store/wizard-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { UsageMeter } from '@/components/shared/usage-meter'
import { cn } from '@/lib/utils/cn'
import type { BrandProfile, Plan, StylePreset, User } from '@/types/database'
import { PLAN_LIMITS } from '@/types/database'

interface IconAiTabProps {
  plan: Plan
  user: User
  brandProfile: BrandProfile | null
  stylePreset: StylePreset | null
}

interface GeneratedImage {
  url: string
  seed: number
}

function buildSuggestions(
  projectName: string,
  projectDescription: string,
  platform: string,
  brandProfile: BrandProfile | null,
  stylePreset: StylePreset | null,
): string[] {
  const suggestions: string[] = []

  if (stylePreset && projectName) {
    suggestions.push(`${stylePreset.name}-style icon for ${projectName}`)
  }

  if (brandProfile?.keywords?.length) {
    const keyword = brandProfile.keywords[0]
    const iconStyle = stylePreset?.icon_style || brandProfile.icon_style
    suggestions.push(`${keyword} themed ${iconStyle ? iconStyle + ' ' : ''}icon`)
  }

  if (projectName && projectDescription) {
    suggestions.push(
      `modern ${platform} app icon for ${projectName}, ${projectDescription}`,
    )
  }

  if (projectName && !stylePreset) {
    suggestions.push(`minimalist icon for ${projectName}`)
  }

  if (suggestions.length === 0) {
    suggestions.push('minimalist app icon, clean and modern')
  }

  return suggestions
}

export function IconAiTab({ plan, user, brandProfile, stylePreset }: IconAiTabProps) {
  const t = useTranslations('wizard.iconAi')
  const { icon, setIcon, project, platform } = useWizardStore()
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [iconsUsed, setIconsUsed] = useState(user.ai_icons_used_this_month)

  const suggestions = useMemo(
    () =>
      buildSuggestions(
        project.name,
        project.description,
        platform.platform,
        brandProfile,
        stylePreset,
      ),
    [project.name, project.description, platform.platform, brandProfile, stylePreset],
  )

  const iconsLimit = PLAN_LIMITS[plan].ai_icons_per_month
  const isExhausted = iconsUsed >= iconsLimit

  async function handleGenerate() {
    if (!description.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/icons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          styleModifier: stylePreset?.ai_style_modifier ?? undefined,
          negativePrompt: stylePreset?.icon_ai_negative_prompt ?? undefined,
          brandProfile: brandProfile ? {
            styleDirection: brandProfile.style_direction,
            primaryColor: brandProfile.primary_color,
            colorMode: brandProfile.color_mode,
            iconStyle: brandProfile.icon_style,
            cornerStyle: brandProfile.corner_style,
            keywords: brandProfile.keywords,
          } : undefined,
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

  function handleSelectImage(url: string) {
    setIcon({ iconType: 'ai_generated', iconValue: url })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {t('description')}
        </p>
        <UsageMeter label="AI Icons" current={iconsUsed} limit={iconsLimit} showUpgrade />
      </div>

      <div className="space-y-2">
        <Label htmlFor="iconDescription">{t('label')}</Label>
        <Input
          id="iconDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('placeholder')}
        />
        {suggestions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-text-tertiary">
              <Wand2 className="h-3 w-3" />
              {t('suggested')}
            </span>
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDescription(s)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors',
                  description === s
                    ? 'border-brand bg-brand/10 text-brand'
                    : 'border-border text-text-secondary hover:border-border-hover hover:bg-surface-secondary',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={handleGenerate}
        isLoading={isGenerating}
        disabled={!description.trim() || isExhausted}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {t('generate')}
      </Button>

      {error && <p className="text-sm text-error">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, idx) => (
            <button
              key={idx}
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
          ))}
        </div>
      )}
    </div>
  )
}
