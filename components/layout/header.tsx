'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface HeaderProps {
  showAuth?: boolean
  showUserMenu?: boolean
  className?: string
}

export function Header({ showAuth = true, showUserMenu = false, className }: HeaderProps) {
  return (
    <header className={cn('sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur', className)}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-text-primary">BrandKit</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center space-x-6 md:flex">
          {showAuth && (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
          {showUserMenu && (
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </nav>

        {/* Mobile hamburger */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
