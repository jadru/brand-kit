'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { brandProfileSchema, type BrandProfileFormValues } from '@/lib/validations/brand-profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ColorPicker } from './color-picker'
import { StyleSelector } from './style-selector'
import type { StyleDirection, ColorMode, IconStyle, CornerStyle } from '@/types/database'

interface ProfileFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<BrandProfileFormValues>
  onSubmit: (data: BrandProfileFormValues) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const COLOR_MODES: { value: ColorMode; label: string }[] = [
  { value: 'mono', label: 'Mono' },
  { value: 'duotone', label: 'Duotone' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'vibrant', label: 'Vibrant' },
]

const ICON_STYLES: { value: IconStyle; label: string }[] = [
  { value: 'outline', label: 'Outline' },
  { value: 'filled', label: 'Filled' },
  { value: '3d_soft', label: '3D Soft' },
  { value: 'flat', label: 'Flat' },
]

const CORNER_STYLES: { value: CornerStyle; label: string }[] = [
  { value: 'sharp', label: 'Sharp' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'pill', label: 'Pill' },
]

export function ProfileForm({ mode, defaultValues, onSubmit, onCancel, isLoading }: ProfileFormProps) {
  const form = useForm<BrandProfileFormValues>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: {
      name: '',
      style_direction: 'minimal',
      primary_color: '#000000',
      secondary_colors: [],
      color_mode: 'mono',
      icon_style: 'outline',
      corner_style: 'rounded',
      keywords: [],
      is_default: false,
      ...defaultValues,
    },
  })

  const { register, handleSubmit, control, setValue, formState: { errors } } = form
  const styleDirection = useWatch({ control, name: 'style_direction' }) ?? 'minimal'
  const primaryColor = useWatch({ control, name: 'primary_color' }) ?? '#000000'
  const colorMode = useWatch({ control, name: 'color_mode' }) ?? 'mono'
  const iconStyle = useWatch({ control, name: 'icon_style' }) ?? 'outline'
  const cornerStyle = useWatch({ control, name: 'corner_style' }) ?? 'rounded'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" required>Brand Name</Label>
        <Input id="name" {...register('name')} error={errors.name?.message} placeholder="My Brand" />
      </div>

      <div className="space-y-2">
        <Label required>Style Direction</Label>
        <StyleSelector
          value={styleDirection}
          onChange={(v: StyleDirection) => setValue('style_direction', v)}
        />
        {errors.style_direction && <p className="text-xs text-error">{errors.style_direction.message}</p>}
      </div>

      <ColorPicker
        label="Primary Color"
        value={primaryColor}
        onChange={(v) => setValue('primary_color', v)}
      />

      <div className="space-y-2">
        <Label>Color Mode</Label>
        <div className="flex flex-wrap gap-2">
          {COLOR_MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setValue('color_mode', m.value)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                colorMode === m.value
                  ? 'border-brand bg-brand text-brand-foreground'
                  : 'border-border text-text-secondary hover:border-border-hover'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Icon Style</Label>
        <div className="flex flex-wrap gap-2">
          {ICON_STYLES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setValue('icon_style', s.value)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                iconStyle === s.value
                  ? 'border-brand bg-brand text-brand-foreground'
                  : 'border-border text-text-secondary hover:border-border-hover'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Corner Style</Label>
        <div className="flex flex-wrap gap-2">
          {CORNER_STYLES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setValue('corner_style', c.value)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                cornerStyle === c.value
                  ? 'border-brand bg-brand text-brand-foreground'
                  : 'border-border text-text-secondary hover:border-border-hover'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="typography_mood">Typography Mood</Label>
        <Input id="typography_mood" {...register('typography_mood')} placeholder="e.g., modern, elegant, bold" />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {mode === 'create' ? 'Create Profile' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
