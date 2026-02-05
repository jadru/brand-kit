'use client'

import { forwardRef, useState, useId } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string
  showStrengthIndicator?: boolean
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0

  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  const levels = [
    { label: '매우 약함', color: 'bg-error' },
    { label: '약함', color: 'bg-error' },
    { label: '보통', color: 'bg-warning' },
    { label: '강함', color: 'bg-success' },
    { label: '매우 강함', color: 'bg-success' },
  ]

  return { score, ...levels[Math.min(score, 4)] }
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, id: providedId, showStrengthIndicator = false, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const generatedId = useId()
    const id = providedId || generatedId
    const errorId = `${id}-error`

    const strength = showStrengthIndicator && typeof value === 'string' && value.length > 0
      ? getPasswordStrength(value)
      : null

    return (
      <div className="w-full space-y-2">
        <div className="relative">
          <input
            id={id}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'flex h-10 w-full rounded-lg border border-border bg-surface pl-3 pr-10 py-2 text-sm transition-all duration-200',
              'placeholder:text-text-tertiary',
              'hover:border-border-hover hover:shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none',
              error && 'border-error focus:ring-error/40 focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]',
              className
            )}
            ref={ref}
            value={value}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Password strength indicator */}
        {strength && (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-all duration-300',
                    i < strength.score ? strength.color : 'bg-surface-tertiary'
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-text-tertiary">
              비밀번호 강도: <span className={cn(
                strength.score <= 1 && 'text-error',
                strength.score === 2 && 'text-warning',
                strength.score >= 3 && 'text-success'
              )}>{strength.label}</span>
            </p>
          </div>
        )}

        {error && (
          <p id={errorId} className="text-xs text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
export type { PasswordInputProps }
