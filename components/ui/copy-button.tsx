'use client'

import { useState, useCallback } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { Button, type ButtonProps } from './button'

interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  value: string
  successMessage?: string
  onCopy?: () => void
}

export function CopyButton({
  value,
  successMessage = '클립보드에 복사됨',
  onCopy,
  className,
  children,
  variant = 'outline',
  size = 'sm',
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false)

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setHasCopied(true)
      toast.success(successMessage)
      onCopy?.()

      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    } catch {
      toast.error('복사에 실패했습니다')
    }
  }, [value, successMessage, onCopy])

  return (
    <Button
      variant={variant}
      size={size}
      onClick={copyToClipboard}
      className={cn('transition-all', className)}
      {...props}
    >
      {hasCopied ? (
        <>
          <Check className="mr-2 h-4 w-4 text-success" aria-hidden="true" />
          {children || '복사됨'}
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
          {children || '복사'}
        </>
      )}
    </Button>
  )
}

// Icon-only version for compact spaces
interface CopyIconButtonProps {
  value: string
  successMessage?: string
  className?: string
}

export function CopyIconButton({ value, successMessage = '클립보드에 복사됨', className }: CopyIconButtonProps) {
  const [hasCopied, setHasCopied] = useState(false)

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setHasCopied(true)
      toast.success(successMessage)

      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    } catch {
      toast.error('복사에 실패했습니다')
    }
  }, [value, successMessage])

  return (
    <button
      onClick={copyToClipboard}
      aria-label="클립보드에 복사"
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md',
        'text-text-tertiary hover:text-text-primary hover:bg-surface-secondary',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className
      )}
    >
      {hasCopied ? (
        <Check className="h-4 w-4 text-success" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}
