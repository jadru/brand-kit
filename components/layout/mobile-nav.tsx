'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, FolderOpen, Palette, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/brand-profiles', label: 'Brand Profiles', icon: Palette },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    close()
  }, [pathname, close])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="animate-fade-overlay fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
          <div className="animate-slide-in-left fixed inset-y-0 left-0 flex w-72 flex-col bg-surface shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-border px-6">
              <span className="font-display text-lg font-bold text-text-primary">BrandKit</span>
              <button
                onClick={close}
                className="rounded-lg p-1.5 text-text-tertiary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-brand text-brand-foreground shadow-sm'
                        : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="border-t border-border p-4">
              <div className="rounded-lg bg-surface-tertiary/50 p-3">
                <p className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">Plan</p>
                <p className="mt-0.5 text-sm font-medium text-text-primary">Free</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
