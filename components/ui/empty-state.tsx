import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'

type EmptyStateAction = {
  label: string
  onClick: () => void
} | React.ReactNode

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: EmptyStateAction
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const isPrimaryAction = (
    value: EmptyStateAction | undefined
  ): value is Extract<EmptyStateAction, { label: string; onClick: () => void }> => {
    return !!value && typeof value === 'object' && 'label' in value && 'onClick' in value
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface py-16 px-6 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-tertiary text-text-tertiary">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-text-secondary">
          {description}
        </p>
      )}
      {isPrimaryAction(action) ? (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      ) : (
        action && <div className="mt-6">{action}</div>
      )}
    </div>
  )
}

// Compact version for inline use
interface EmptyStateInlineProps {
  icon: React.ReactNode
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
      <span className="h-5 w-5 text-text-tertiary" aria-hidden="true">
        {Icon}
      </span>
      {message}
    </div>
  )
}
