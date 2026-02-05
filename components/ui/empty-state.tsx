import { cn } from '@/lib/utils/cn'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface py-16 px-6 text-center',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-tertiary text-text-tertiary">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-text-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

// Compact version for inline use
interface EmptyStateInlineProps {
  icon: LucideIcon
  message: string
  className?: string
}

export function EmptyStateInline({
  icon: Icon,
  message,
  className,
}: EmptyStateInlineProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-dashed border-border bg-surface-secondary/50 p-4 text-sm text-text-secondary',
        className
      )}
    >
      <Icon className="h-5 w-5 text-text-tertiary" aria-hidden="true" />
      {message}
    </div>
  )
}
