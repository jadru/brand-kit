'use client'

import { Minus, Sparkles, Building2, Cpu, Pen } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { StyleDirection } from '@/types/database'

const STYLES: { value: StyleDirection; label: string; description: string; icon: React.ElementType }[] = [
  { value: 'minimal', label: 'Minimal', description: 'Clean and simple', icon: Minus },
  { value: 'playful', label: 'Playful', description: 'Fun and vibrant', icon: Sparkles },
  { value: 'corporate', label: 'Corporate', description: 'Professional', icon: Building2 },
  { value: 'tech', label: 'Tech', description: 'Modern and sharp', icon: Cpu },
  { value: 'custom', label: 'Custom', description: 'Your own style', icon: Pen },
]

interface StyleSelectorProps {
  value: StyleDirection
  onChange: (value: StyleDirection) => void
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {STYLES.map((style) => {
        const isSelected = value === style.value
        return (
          <button
            key={style.value}
            type="button"
            onClick={() => onChange(style.value)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all',
              isSelected
                ? 'border-brand ring-2 ring-brand bg-surface'
                : 'border-border hover:border-border-hover bg-surface'
            )}
          >
            <style.icon className={cn('h-5 w-5', isSelected ? 'text-brand' : 'text-text-secondary')} />
            <span className="text-sm font-medium">{style.label}</span>
            <span className="text-xs text-text-tertiary">{style.description}</span>
          </button>
        )
      })}
    </div>
  )
}
