'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  function handleMouseEnter() {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  function handleMouseLeave() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-brand border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-brand border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-brand border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-brand border-y-transparent border-l-transparent',
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-brand rounded-md shadow-lg',
            'animate-fade-in whitespace-nowrap',
            positionClasses[position],
            className
          )}
        >
          {content}
          <span
            className={cn(
              'absolute w-0 h-0 border-4',
              arrowClasses[position]
            )}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}

// Simple tooltip for icons
interface IconTooltipProps {
  label: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function IconTooltip({ label, children, position = 'top' }: IconTooltipProps) {
  return (
    <Tooltip content={label} position={position}>
      <span className="inline-flex cursor-default">{children}</span>
    </Tooltip>
  )
}
