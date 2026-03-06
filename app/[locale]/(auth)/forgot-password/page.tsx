'use client'

import { useState, type FormEvent } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { sendResetEmail } from './actions'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword')
  const tCommon = useTranslations('common')

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isLoading) return

    setError(null)
    setSuccess(false)
    setIsLoading(true)

    const result = await sendResetEmail({ email: email.trim() })
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }

    setIsLoading(false)
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
              {t('title')}
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              {t('description')}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader className="lg:hidden">
            <h2 className="font-display text-2xl text-text-primary">{t('title')}</h2>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4 rounded-md border border-success/20 bg-success/5 p-4">
                <p className="text-sm font-medium text-success">{t('successTitle')}</p>
                <p className="text-sm text-text-secondary">{t('successDescription', { email })}</p>
                <Link href="/login" className="inline-flex text-sm font-medium text-accent hover:underline">
                  {t('backToLogin')}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" required>{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
                {error && (
                  <p className="text-sm text-error" role="alert" aria-live="polite">{error}</p>
                )}
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  {t('submit')}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <Link href="/login" className="text-sm text-text-secondary hover:underline">
              {t('backToLogin')}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
