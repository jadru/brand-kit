'use client'

interface SocialCardPreviewProps {
  title: string
  description: string
  type: 'og' | 'twitter'
  bgColor: string
}

export function SocialCardPreview({ title, description, type, bgColor }: SocialCardPreviewProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div
        className="flex h-40 items-center justify-center p-6"
        style={{ backgroundColor: bgColor }}
      >
        <div className="text-center">
          <p className="text-lg font-bold text-white">{title}</p>
          {description && <p className="mt-1 text-sm text-white/80">{description}</p>}
        </div>
      </div>
      <div className="bg-surface-secondary p-3">
        <p className="text-xs text-text-tertiary uppercase">{type === 'og' ? 'Open Graph' : 'Twitter Card'}</p>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-xs text-text-secondary">{description}</p>
      </div>
    </div>
  )
}
