'use client'

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
  onClick: () => void
}

export function PresetCard({ preset, isSelected, isLocked, isRecommended, onClick }: PresetCardProps) {
  return (
    <button
      type="button"
      onClick={isLocked ? undefined : onClick}
      className={cn('text-left w-full', isLocked && 'cursor-not-allowed')}
      disabled={isLocked}
    >
      <Card className={cn(
        'relative transition-all overflow-hidden',
        isSelected && 'ring-2 ring-brand border-brand',
        isLocked && 'opacity-60',
        !isLocked && !isSelected && 'hover:border-border-hover'
      )}>
        <CardContent className="pt-4">
          {/* Preview placeholder */}
          <div
            className="mb-3 h-20 rounded-md"
            style={{
              background: preset.og_background
                ? `linear-gradient(135deg, ${preset.og_background}, #f5f5f5)`
                : 'linear-gradient(135deg, #e5e7eb, #f9fafb)',
            }}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-primary">{preset.name}</p>
            <div className="flex gap-1">
              {isRecommended && (
                <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                  <Star className="mr-0.5 h-3 w-3" /> Rec
                </Badge>
              )}
              {isLocked && (
                <Badge variant="pro" className="text-[10px] px-1.5 py-0">
                  <Lock className="mr-0.5 h-3 w-3" /> PRO
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  )
}
