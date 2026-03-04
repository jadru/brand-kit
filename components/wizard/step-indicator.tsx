'use client'

import { memo } from 'react'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'

interface StepIndicatorProps {
  steps: { label: string; description: string }[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export const StepIndicator = memo(function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  const t = useTranslations('wizard.progress')

  return (
    <nav aria-label={t('label', { current: currentStep + 1, total: steps.length })}>
      {/* Desktop */}
      <ol className="hidden items-center sm:flex">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isClickable = isCompleted && onStepClick

          return (
            <li key={step.label} className="flex flex-1 items-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(index)}
                className={cn(
                  'flex items-center gap-2',
                  isClickable && 'cursor-pointer'
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                    isCompleted && 'bg-success text-white',
                    isCurrent && 'bg-brand text-white',
                    !isCompleted && !isCurrent && 'bg-surface-secondary text-text-tertiary'
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span className="hidden lg:block">
                  <span className={cn(
                    'text-xs font-medium',
                    isCurrent ? 'text-text-primary' : 'text-text-tertiary'
                  )}>
                    {step.label}
                  </span>
                </span>
              </button>
              {index < steps.length - 1 && (
                <div className={cn(
                  'mx-2 h-px flex-1',
                  isCompleted ? 'bg-success' : 'bg-border'
                )} />
              )}
            </li>
          )
        })}
      </ol>

      {/* Mobile */}
      <div className="flex items-center justify-between sm:hidden">
        <span className="text-sm font-medium text-text-primary">
          {t('label', { current: currentStep + 1, total: steps.length })}
        </span>
        <span className="text-sm text-text-secondary">
          {steps[currentStep]?.label}
        </span>
      </div>
    </nav>
  )
})
