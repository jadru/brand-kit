'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface LocaleSwitcherProps {
  className?: string
  variant?: 'default' | 'minimal'
}

const localeNames: Record<Locale, string> = {
  en: 'EN',
  ko: 'KO',
}

const localeFullNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
}

export function LocaleSwitcher({ className, variant = 'default' }: LocaleSwitcherProps) {
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  function onChange(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale })
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  if (variant === 'minimal') {
    return (
      <div ref={dropdownRef} className={cn('relative', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'inline-flex items-center gap-1.5 text-sm font-medium transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded'
          )}
          aria-label="Select language"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="font-mono text-xs tracking-wider">{localeNames[locale]}</span>
          <ChevronDown className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 min-w-[120px] overflow-hidden rounded-lg border border-white/10 bg-brand/95 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="py-1" role="listbox">
              {routing.locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => onChange(loc)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors',
                    locale === loc
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  )}
                  role="option"
                  aria-selected={locale === loc}
                >
                  <span className="font-medium">{localeFullNames[loc]}</span>
                  {locale === loc && <Check className="h-4 w-4 text-accent-light" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-medium transition-colors',
          'hover:border-border-hover focus:outline-none focus:ring-2 focus:ring-accent/20',
          isOpen && 'border-border-hover ring-2 ring-accent/20'
        )}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4 text-text-tertiary" />
        <span className="text-text-primary">{localeFullNames[locale]}</span>
        <ChevronDown className={cn(
          'h-4 w-4 text-text-tertiary transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-[140px] overflow-hidden rounded-lg border border-border bg-surface shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1" role="listbox">
            {routing.locales.map((loc) => (
              <button
                key={loc}
                onClick={() => onChange(loc)}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors',
                  locale === loc
                    ? 'bg-accent/10 text-text-primary'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                )}
                role="option"
                aria-selected={locale === loc}
              >
                <span className="font-medium">{localeFullNames[loc]}</span>
                {locale === loc && <Check className="h-4 w-4 text-accent" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
