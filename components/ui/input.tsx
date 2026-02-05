'use client'

import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, id: providedId, ...props }, ref) => {
    const generatedId = useId()
    const id = providedId || generatedId
    const errorId = `${id}-error`

    return (
      <div className="w-full">
        <input
          id={id}
          className={cn(
            'flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm transition-all duration-150',
            'placeholder:text-text-tertiary',
            'hover:border-border-hover',
            'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus:ring-error/40 focus:border-error',
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
export type { InputProps }
