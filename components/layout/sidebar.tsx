'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderOpen, Palette, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/brand-profiles', label: 'Brand Profiles', icon: Palette },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn('hidden w-64 shrink-0 border-r border-border bg-surface-secondary md:block', className)}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/dashboard" className="font-display text-lg font-bold text-text-primary">
            BrandKit
          </Link>
        </div>

        {/* Navigation */}
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

        {/* Bottom */}
        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-surface-tertiary/50 p-3">
            <p className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">Plan</p>
            <p className="mt-0.5 text-sm font-medium text-text-primary">Free</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
