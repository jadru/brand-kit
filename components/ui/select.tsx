'use client'

import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  options: { label: string; value: string }[]
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ value, onValueChange, options, placeholder, disabled, error, className }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full appearance-none rounded-md border border-border bg-surface px-3 py-2 pr-8 text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus:ring-error',
            !value && 'text-text-tertiary',
            className
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-text-tertiary" />
        {error && (
          <p className="mt-1.5 text-xs text-error">{error}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
export type { SelectProps }
