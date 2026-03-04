'use client'

import { memo } from 'react'
import { Lock, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import type { StylePreset } from '@/types/database'

interface PresetCardProps {
  preset: StylePreset
  isSelected: boolean
  isLocked: boolean
  isRecommended: boolean
  ariaLabel: string
  recommendedLabel: string
  proLabel: string
  bestForFallback: string
  onClick: () => void
}

export const PresetCard = memo(function PresetCard({
  preset,
  isSelected,
  isLocked,
  isRecommended,
  ariaLabel,
  recommendedLabel,
  proLabel,
  bestForFallback,
  onClick,
}: PresetCardProps) {
  const previewImage = preset.og_background
    ? {
      type: 'gradient' as const,
      value: preset.og_background,
    }
    : preset.preview_image_url
      ? { type: 'image' as const, value: preset.preview_image_url }
      : {
        type: 'color' as const,
        value: `linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(14, 165, 233, 0.7))`,
      }

  const previewStyle = previewImage.type === 'image'
    ? {
      backgroundImage: `linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.25)), url("${previewImage.value}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
    : {
      background: previewImage.value,
    }

  const sampleTitle = preset.name.length > 16 ? `${preset.name.slice(0, 15)}…` : preset.name
  const sampleLabel = preset.og_typography
    ? preset.og_typography.length > 24
      ? `${preset.og_typography.slice(0, 23)}…`
      : preset.og_typography
    : 'Sample subtitle'
  const fallbackText = preset.name.slice(0, 1).toUpperCase() || 'B'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      className={cn('text-left w-full', isLocked && 'cursor-pointer')}
    >
      <Card className={cn(
        'relative transition-all overflow-hidden',
        isSelected && 'ring-2 ring-brand border-brand',
        isLocked && 'opacity-60',
        !isLocked && !isSelected && 'hover:border-border-hover'
      )}>
        <CardContent className="pt-4">
          <div
            className="mb-3 h-24 rounded-md border border-black/5 relative overflow-hidden"
            style={previewStyle}
          >
            <div className={cn(
              'absolute inset-0 flex flex-col justify-between p-2',
              previewImage.type === 'image' ? 'text-white' : 'text-text-primary'
            )}>
              <div className="inline-flex w-min rounded-md bg-black/20 px-1.5 py-0.5">
                {fallbackText}
              </div>
              <div>
                <p className="text-[10px] font-semibold leading-tight drop-shadow">{sampleTitle}</p>
                <p className="mt-1 text-[8px] leading-tight opacity-80">{sampleLabel}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text-primary">{preset.name}</p>
              <div className="flex gap-1">
                {isRecommended && (
                  <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                    <Star className="mr-0.5 h-3 w-3" aria-hidden="true" />
                    {recommendedLabel}
                  </Badge>
                )}
              {isLocked && (
                <Badge variant="pro" className="text-[10px] px-1.5 py-0">
                  <Lock className="mr-0.5 h-3 w-3" aria-hidden="true" /> {proLabel}
                </Badge>
              )}
            </div>
          </div>
          <p className="mt-1.5 text-[11px] leading-tight text-text-tertiary">
            {preset.best_for_styles?.[0] ?? bestForFallback}
          </p>
        </CardContent>
      </Card>
    </button>
  )
})
