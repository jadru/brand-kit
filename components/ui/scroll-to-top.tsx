'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ScrollToTopProps {
  threshold?: number
  className?: string
}

export function ScrollToTop({ threshold = 400, className }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="맨 위로 스크롤"
      className={cn(
        'fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full',
        'bg-brand text-brand-foreground shadow-lg',
        'transition-all duration-300 ease-out',
        'hover:shadow-xl hover:scale-110 active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none',
        className
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}
