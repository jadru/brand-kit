'use client'

import { useEffect, useState, useCallback } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from './button'

type Theme = 'light' | 'dark' | 'system'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'system'
  }

  return (localStorage.getItem('theme') as Theme | null) ?? 'system'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement

    if (newTheme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', newTheme)
    }
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [applyTheme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const isSystemDark = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && isSystemDark)

  return (
    <Button
      variant="ghost"
      size="icon"
      suppressHydrationWarning
      onClick={toggleTheme}
      aria-label={`현재 테마: ${theme === 'system' ? '시스템' : theme === 'dark' ? '다크' : '라이트'}. 클릭하여 변경`}
    >
      {isDark ? (
        <Moon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Sun className="h-5 w-5" aria-hidden="true" />
      )}
    </Button>
  )
}
