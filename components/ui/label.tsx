'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        className={cn('text-sm font-medium text-text-primary', className)}
        ref={ref}
        {...props}
      >
        {children}
        {required && <span className="ml-0.5 text-error">*</span>}
      </label>
    )
  }
)
Label.displayName = 'Label'

export { Label }
export type { LabelProps }
