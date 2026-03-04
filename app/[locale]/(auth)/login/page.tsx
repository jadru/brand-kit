'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { signIn, signInWithOAuth } from './actions'

export default function LoginPage() {
  const t = useTranslations('auth.login')
  const tAuth = useTranslations('auth')
  const tCommon = useTranslations('common')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isLoading) return
    setError(null)
    setIsLoading(true)

    const result = await signIn({ email, password })
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  async function handleOAuth(provider: 'google' | 'github') {
    if (oauthLoading) return
    setError(null)
    setOauthLoading(provider)
    const result = await signInWithOAuth(provider)
    if (result?.error) {
      setError(result.error)
      setOauthLoading(null)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-brand lg:block">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 gradient-mesh-dark" />
        <div className="noise absolute inset-0" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link href="/" className="animate-fade-in font-display text-xl font-bold tracking-tight text-white">
            {tCommon('brandName')}
          </Link>
          <div className="animate-fade-in-up delay-1">
            <h2 className="font-display text-4xl font-bold leading-[0.95] tracking-headline text-white xl:text-5xl">
              {t('branding.headline')}
              <br />
              <span className="text-white/40">{t('branding.headlineSub')}</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              {t('branding.description')}
            </p>
          </div>
          <div className="animate-fade-in-up delay-3 flex gap-10">
            <div>
              <div className="font-display text-2xl font-bold text-white tracking-tight">12+</div>
              <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">{t('branding.stats.assets')}</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white tracking-tight">&lt;60s</div>
              <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">{t('branding.stats.speed')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader>
            <div className="mb-2 lg:hidden">
              <Link href="/" className="font-display text-lg font-bold text-text-primary">{tCommon('brandName')}</Link>
            </div>
            <CardTitle className="font-display text-2xl">{t('title')}</CardTitle>
            <CardDescription>{t('subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" required>{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" required>{t('password')}</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-text-tertiary transition-colors hover:text-accent"
                    tabIndex={-1}
                  >
                    {t('forgotPassword')}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-text-secondary"
                    tabIndex={-1}
                    aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-sm text-error" role="alert" aria-live="polite">{error}</p>
              )}
              <Button type="submit" className="w-full" isLoading={isLoading}>
                {t('submit')}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 font-mono text-text-tertiary">{tCommon('or')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleOAuth('google')}
                isLoading={oauthLoading === 'google'}
                disabled={!!oauthLoading || isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {tAuth('oauth.google')}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuth('github')}
                isLoading={oauthLoading === 'github'}
                disabled={!!oauthLoading || isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M12 .297c6.63 0 12 5.373 12 12 0 5.303-3.438 9.8-8.205 11.385-.6.113-.82-.258-.82-.577 0-.285-.01-1.04-.015-2.04 0 0 3.338.726 4.042-1.417 0 0 .546-1.387 1.333-1.756-4.148-.47-8.516-2.074-8.516-9.225 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 .985-.315 3.225 1.23a11.2 11.2 0 0 1 2.98-.4c.997 0 1.998.132 2.923.39 2.239-1.545 3.223-1.23 3.223-1.23.653 1.652.241 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 7.164-4.373 8.75-8.532 9.21.548.472 1.037 1.403 1.037 2.825 0 2.04-.02 3.684-.02 4.184 0 .321-.218.695-.826.577C4.42 23.796 1 19.301 1 14C1 7.373 5.373 1 12 5.373z"/>
                </svg>
                {tAuth('oauth.github')}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-text-secondary">
              {t('noAccount')}
              <Link href="/signup" className="ml-1 font-medium text-accent hover:underline">
                {t('signupLink')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
