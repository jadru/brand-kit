'use client'

import { Link } from '@/i18n/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  className?: string
}

export function Breadcrumb({ items, showHome = true, className }: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', href: '/dashboard' }, ...items]
    : items

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center space-x-1 text-sm">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          const isHome = showHome && index === 0

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="mx-1 h-4 w-4 text-text-tertiary flex-shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  className="font-medium text-text-primary truncate max-w-[200px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center text-text-secondary hover:text-text-primary transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded'
                  )}
                >
                  {isHome && <Home className="h-4 w-4" aria-hidden="true" />}
                  {!isHome && <span className="truncate max-w-[150px]">{item.label}</span>}
                </Link>
              ) : (
                <span className="text-text-secondary truncate max-w-[150px]">
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
