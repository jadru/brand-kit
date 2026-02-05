'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { LayoutDashboard, FolderOpen, Palette, Settings, Sparkles, Crown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Plan } from '@/types/database'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/brand-profiles', label: 'Brand Profiles', icon: Palette },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  className?: string
  plan?: Plan
}

export function Sidebar({ className, plan = 'free' }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn('hidden w-64 shrink-0 border-r border-border bg-surface-secondary md:block', className)} aria-label="주요 네비게이션">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/dashboard" className="font-display text-lg font-bold text-text-primary" aria-label="BrandKit - 대시보드로 이동">
            BrandKit
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4" aria-label="대시보드 메뉴">
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

        {/* Bottom */}
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
            <Link href="/settings/billing" className="block" aria-label="Pro Plan으로 업그레이드">
              <div className="group rounded-lg border border-dashed border-border bg-surface-tertiary/30 p-3 transition-all hover:border-accent/50 hover:bg-accent/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Free Plan</p>
                    <p className="text-[10px] text-text-tertiary">월 3개 프로젝트</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    업그레이드
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}
