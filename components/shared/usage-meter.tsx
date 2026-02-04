'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface UsageMeterProps {
  label: string
  current: number
  limit: number
  showUpgrade?: boolean
}

export function UsageMeter({ label, current, limit, showUpgrade }: UsageMeterProps) {
  const isUnlimited = !isFinite(limit)
  const percentage = isUnlimited ? 0 : Math.min((current / limit) * 100, 100)
  const isWarning = !isUnlimited && percentage >= 80
  const isExhausted = !isUnlimited && current >= limit

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className={cn('font-medium', isExhausted ? 'text-error' : isWarning ? 'text-warning' : 'text-text-primary')}>
          {current} / {isUnlimited ? 'Unlimited' : limit}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 overflow-hidden rounded-full bg-surface-secondary">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              isExhausted ? 'bg-error' : isWarning ? 'bg-warning' : 'bg-brand'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      {isExhausted && showUpgrade && (
        <Link href="/settings" className="text-xs text-brand hover:underline">
          Upgrade to Pro for unlimited usage
        </Link>
      )}
    </div>
  )
}
