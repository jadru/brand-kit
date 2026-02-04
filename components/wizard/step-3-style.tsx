'use client'

import { useMemo } from 'react'
import { useWizardStore } from '@/store/wizard-store'
import { PresetCard } from './preset-card'
import { ColorPicker } from '@/components/brand-profile/color-picker'
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

  const useOverride = style.primaryColorOverride !== null

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Choose Style Preset</h2>
        <p className="text-sm text-text-secondary">
          Select a style preset for your brand assets.
          {brandProfile && ` Recommendations based on your "${brandProfile.name}" profile.`}
        </p>
      </div>

      {brandProfile && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-text-secondary">Project Color Override</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="colorOverride"
              checked={!useOverride}
              onChange={() => setStyle({ primaryColorOverride: null })}
              className="text-brand"
            />
            <span className="text-sm text-text-primary">
              Use brand color
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
            <span className="text-sm text-text-primary">Use a different color for this project</span>
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
        {sortedPresets.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            isSelected={style.stylePresetId === preset.id}
            isLocked={!preset.is_free && plan === 'free'}
            isRecommended={recommendedSlugs.has(preset.slug)}
            onClick={() => setStyle({ stylePresetId: preset.id })}
          />
        ))}
      </div>
    </div>
  )
}
