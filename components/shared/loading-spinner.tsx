import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_MAP = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return <Loader2 className={cn('animate-spin text-brand', SIZE_MAP[size], className)} />
}
