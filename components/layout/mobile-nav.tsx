'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { Menu, X, LayoutDashboard, FolderOpen, Palette, Settings, Sparkles, Crown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Plan } from '@/types/database'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/brand-profiles', label: 'Brand Profiles', icon: Palette },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface MobileNavProps {
  plan?: Plan
}

export function MobileNav({ plan = 'free' }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerButtonRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    // Return focus to trigger button
    triggerButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Focus the close button when drawer opens
      closeButtonRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  return (
    <div key={pathname}>
      <button
        ref={triggerButtonRef}
        onClick={() => setIsOpen(true)}
        aria-label="메뉴 열기"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        className="touch-target flex items-center justify-center rounded-lg p-2.5 text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-nav-title">
          <div className="animate-fade-overlay fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={close} aria-hidden="true" />
          <div id="mobile-nav-drawer" className="animate-slide-in-left fixed inset-y-0 left-0 flex w-72 flex-col bg-surface shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-border px-6">
              <span id="mobile-nav-title" className="font-display text-lg font-bold text-text-primary">BrandKit</span>
              <button
                ref={closeButtonRef}
                onClick={close}
                aria-label="메뉴 닫기"
                className="touch-target flex items-center justify-center rounded-lg p-2.5 text-text-tertiary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-brand text-brand-foreground shadow-sm'
                        : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                    )}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="border-t border-border p-4">
              {plan === 'pro' ? (
                <div className="rounded-lg bg-accent/10 p-3" role="status" aria-label="Pro Plan 사용 중">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20">
                      <Crown className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-accent">Pro Plan</p>
                      <p className="text-[10px] text-text-tertiary">무제한 프로젝트</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/settings/billing" onClick={close} aria-label="Pro Plan으로 업그레이드">
                  <div className="group rounded-lg border border-dashed border-border bg-surface-tertiary/30 p-3 transition-all hover:border-accent/50 hover:bg-accent/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">Free Plan</p>
                        <p className="text-[10px] text-text-tertiary">월 3개 프로젝트</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-accent">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        업그레이드
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
