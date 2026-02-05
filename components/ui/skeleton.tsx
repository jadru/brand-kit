import { cn } from '@/lib/utils/cn'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Animate the skeleton
   * @default true
   */
  animate?: boolean
}

function Skeleton({ className, animate = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-surface-tertiary',
        animate && 'skeleton',
        className
      )}
      {...props}
    />
  )
}

// Pre-built skeleton patterns for common use cases
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 px-4 py-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 rounded-lg border border-border bg-surface px-4 py-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  )
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  return <Skeleton className={cn('rounded-full', sizes[size])} />
}

function SkeletonButton({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const sizes = {
    sm: 'h-9 w-20',
    default: 'h-10 w-24',
    lg: 'h-11 w-32',
  }

  return <Skeleton className={cn('rounded-md', sizes[size])} />
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
}
