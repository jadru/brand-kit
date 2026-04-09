'use client'

import { useState } from 'react'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { signUp, signUpWithOAuth } from './actions'
import { AnalyticsEvents, trackEvent } from '@/lib/analytics/events'

export default function SignupPage() {
  const t = useTranslations('auth.signup')
  const tAuth = useTranslations('auth')
  const tCommon = useTranslations('common')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Password validation
  const passwordChecks = {
    length: password.length >= 6,
    match: password === confirmPassword && confirmPassword.length > 0,
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isLoading) return
    setError(null)

    if (password !== confirmPassword) {
      setError(
        t('validation.passwordsDoNotMatch', {
          defaultValue: tAuth('validation.passwordsDoNotMatch'),
        })
      )
      return
    }

    if (password.length < 6) {
      setError(
        t('validation.passwordTooShort', { defaultValue: tAuth('validation.passwordTooShort') })
      )
      return
    }

    setIsLoading(true)
    trackEvent(AnalyticsEvents.SIGNUP_START, { method: 'email' })

    const result = await signUp({ email, password })

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      trackEvent(AnalyticsEvents.SIGNUP_COMPLETE, { method: 'email' })
      setIsSuccess(true)
      setIsLoading(false)
    }
  }

  async function handleOAuth(provider: 'google' | 'github') {
    if (oauthLoading) return
    setError(null)
    setOauthLoading(provider)
    trackEvent(AnalyticsEvents.SIGNUP_METHOD_SELECT, { method: provider })
    trackEvent(AnalyticsEvents.SIGNUP_START, { method: provider })
    const result = await signUpWithOAuth(provider)
    if (result?.error) {
      setError(result.error)
      setOauthLoading(null)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">{t('success.title')}</CardTitle>
            <CardDescription>
              <span>{t('success.description', { email })}</span>
              <span className="mt-1 block">{t('success.backToLogin')}</span>
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/login">
              <Button variant="outline">{t('success.backToLogin')}</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding panel */}
      <div className="bg-brand relative hidden w-1/2 overflow-hidden lg:block">
        <div className="grid-pattern absolute inset-0" />
        <div className="gradient-mesh-dark absolute inset-0" />
        <div className="noise absolute inset-0" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link
            href="/"
            className="animate-fade-in font-display text-xl font-bold tracking-tight text-white"
          >
            BrandKit
          </Link>
          <div className="animate-fade-in-up delay-1">
            <h2 className="font-display tracking-headline text-4xl leading-[0.95] font-bold text-white xl:text-5xl">
              {t('branding.headline')}
              <br />
              <span className="text-white/40">{t('branding.headlineSub')}</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              {t('branding.description')}
            </p>
          </div>
          <div className="animate-fade-in-up flex gap-10 delay-3">
            <div>
              <div className="font-display text-2xl font-bold tracking-tight text-white">12+</div>
              <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
                {t('branding.stats.start')}
              </div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold tracking-tight text-white">
                3/Month
              </div>
              <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
                {t('branding.stats.perMonth')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <main id="main-content" className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader>
            <div className="mb-2 lg:hidden">
              <Link href="/" className="font-display text-text-primary text-lg font-bold">
                BrandKit
              </Link>
            </div>
            <CardTitle className="font-display text-2xl">{t('title')}</CardTitle>
            <CardDescription>{t('subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" required>
                  {t('email')}
                </Label>
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
                <Label htmlFor="password" required>
                  {t('password')}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-tertiary hover:text-text-secondary absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    {passwordChecks.length ? (
                      <span className="text-success flex items-center gap-1">
                        <Check className="h-3 w-3" /> {t('passwordChecks.length')}
                      </span>
                    ) : (
                      <span className="text-text-tertiary flex items-center gap-1">
                        <X className="h-3 w-3" /> {t('passwordChecks.length')}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" required>
                  {t('confirmPassword')}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('confirmPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-text-tertiary hover:text-text-secondary absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? t('hidePassword') : t('showPassword')}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    {passwordChecks.match ? (
                      <span className="text-success flex items-center gap-1">
                        <Check className="h-3 w-3" /> {t('passwordChecks.match')}
                      </span>
                    ) : (
                      <span className="text-error flex items-center gap-1">
                        <X className="h-3 w-3" /> {t('passwordChecks.mismatch')}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {error && (
                <p className="text-error text-sm" role="alert" aria-live="polite">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" isLoading={isLoading}>
                {t('submit')}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="border-border w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface text-text-tertiary px-2 font-mono">
                  {tCommon('or')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleOAuth('google')}
                isLoading={oauthLoading === 'google'}
                disabled={!!oauthLoading || isLoading}
              >
                {tAuth('oauth.google')}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuth('github')}
                isLoading={oauthLoading === 'github'}
                disabled={!!oauthLoading || isLoading}
              >
                {tAuth('oauth.github')}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-text-secondary text-sm">
              {t('hasAccount')}?
              <Link href="/login" className="text-accent ml-1 font-medium hover:underline">
                {t('loginLink')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
