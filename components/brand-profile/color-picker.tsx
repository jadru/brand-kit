'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils/cn'

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#EF4444', '#3B82F6',
  '#10B981', '#8B5CF6', '#F59E0B', '#EC4899',
]

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-text-primary">{label}</p>}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-10 w-10 shrink-0 rounded-md border border-border"
          style={{ backgroundColor: value }}
        />
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
          }}
          className="h-10 w-28 rounded-md border border-border bg-surface px-3 text-sm font-mono uppercase"
          maxLength={7}
        />
      </div>
      <div className="flex gap-1.5">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              'h-6 w-6 rounded-full border',
              value === color ? 'ring-2 ring-brand ring-offset-1' : 'border-border'
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  )
}
