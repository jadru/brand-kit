'use client'

import { useEffect, useState, useCallback } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from './button'

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement

    if (newTheme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', newTheme)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) {
      setTheme(stored)
      applyTheme(stored)
    }
  }, [applyTheme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  // 서버 렌더링 시 아이콘 깜빡임 방지
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="테마 변경" disabled>
        <Sun className="h-5 w-5" aria-hidden="true" />
      </Button>
    )
  }

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <Button
      variant="ghost"
      size="icon"
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
