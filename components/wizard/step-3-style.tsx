'use client'

import { useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useWizardStore } from '@/store/wizard-store'
import { PresetCard } from './preset-card'
import { ColorPicker } from '@/components/brand-profile/color-picker'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { AnalyticsEvents, trackEvent } from '@/lib/analytics/events'
import type { BrandProfile, StylePreset, StyleDirection, Plan } from '@/types/database'

interface Step3StyleProps {
  presets: StylePreset[]
  brandProfile: BrandProfile | null
  plan: Plan
}

const RECOMMENDATION_MAP: Record<StyleDirection, string[]> = {
  minimal: ['notion-minimal', 'vercel-sharp', 'linear-dark'],
  playful: ['airbnb-3d', 'duolingo-playful', 'glassmorphism'],
  corporate: ['figma-clean', 'notion-minimal', 'vercel-sharp'],
  tech: ['stripe-gradient', 'linear-dark', 'glassmorphism'],
  custom: [],
}

export function Step3Style({ presets, brandProfile, plan }: Step3StyleProps) {
  const { style, setStyle } = useWizardStore()
  const tSteps = useTranslations('wizard.steps')
  const tStyle = useTranslations('wizard.style')
  const tPreset = useTranslations('wizard.preset')

  const useOverride = style.primaryColorOverride !== null
  const [lockedPresetId, setLockedPresetId] = useState<string | null>(null)

  const sortedPresets = useMemo(() => {
    const direction = brandProfile?.style_direction ?? 'custom'
    const recommended = RECOMMENDATION_MAP[direction]

    return [...presets].sort((a, b) => {
      const aIdx = recommended.indexOf(a.slug)
      const bIdx = recommended.indexOf(b.slug)
      if (aIdx !== -1 && bIdx === -1) return -1
      if (aIdx === -1 && bIdx !== -1) return 1
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
      return a.sort_order - b.sort_order
    })
  }, [presets, brandProfile?.style_direction])

  const recommendedSlugs = useMemo(() => {
    const direction = brandProfile?.style_direction ?? 'custom'
    return new Set(RECOMMENDATION_MAP[direction])
  }, [brandProfile?.style_direction])

  const lockedPreset = lockedPresetId
    ? presets.find((preset) => preset.id === lockedPresetId)
    : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{tStyle('title')}</h2>
        <p className="text-sm text-text-secondary">
          {tSteps('style.description')}
          {brandProfile ? ` ${tStyle('profileRecommendation', { profileName: brandProfile.name })}` : ''}
        </p>
      </div>

      {brandProfile && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-text-secondary">{tStyle('projectColorOverride')}</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="colorOverride"
              checked={!useOverride}
              onChange={() => setStyle({ primaryColorOverride: null })}
              className="text-brand"
            />
            <span className="text-sm text-text-primary">
              {tStyle('useBrandColor')}
              <span
                className="ml-2 inline-block h-4 w-4 rounded border border-border align-middle"
                style={{ backgroundColor: brandProfile.primary_color }}
              />
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="colorOverride"
              checked={useOverride}
              onChange={() => setStyle({ primaryColorOverride: brandProfile.primary_color })}
              className="text-brand"
            />
            <span className="text-sm text-text-primary">{tStyle('useDifferentColor')}</span>
          </label>
          {useOverride && (
            <ColorPicker
              label=""
              value={style.primaryColorOverride!}
              onChange={(color) => setStyle({ primaryColorOverride: color })}
            />
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sortedPresets.map((preset) => {
          const isLocked = !preset.is_free && plan === 'free'
          return (
            <PresetCard
              key={preset.id}
              preset={preset}
              isSelected={style.stylePresetId === preset.id}
              isLocked={isLocked}
              isRecommended={recommendedSlugs.has(preset.slug)}
              ariaLabel={tPreset('cardAriaLabel', {
                name: preset.name,
                status: isLocked
                  ? tStyle('proPreset')
                  : recommendedSlugs.has(preset.slug)
                    ? tPreset('recommendedBadge')
                    : tPreset('previewTitle'),
              })}
              recommendedLabel={tPreset('recommendedBadge')}
              proLabel={tPreset('proBadge')}
              bestForFallback={tStyle('bestForFallback')}
              onClick={() => {
                if (isLocked) {
                  setLockedPresetId(preset.id)
                  return
                }
                setLockedPresetId(null)
                setStyle({ stylePresetId: preset.id })
              }}
            />
          )
        })}
      </div>

      {lockedPreset && plan === 'free' && (
        <div className="rounded-lg border border-accent/40 bg-accent/5 p-3 text-sm text-text-secondary">
          <p className="font-medium text-text-primary">
            {tStyle('lockedPresetTitle', { presetName: lockedPreset.name })}
          </p>
          <p className="mt-1 text-xs text-text-secondary">{tStyle('lockedPresetDescription')}</p>
          <div className="mt-3 flex gap-2">
            <Link
              href="/settings/billing"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
              onClick={() => trackEvent(AnalyticsEvents.UPGRADE_CLICK, { source: 'locked_preset' })}
            >
              {tStyle('goPro')}
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setLockedPresetId(null)}
            >
              {tStyle('close')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
