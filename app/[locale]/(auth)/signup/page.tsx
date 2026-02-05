'use client'

import { useState } from 'react'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { signUp, signUpWithOAuth } from './actions'

export default function SignupPage() {
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
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)
    const result = await signUp({ email, password })

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setIsSuccess(true)
      setIsLoading(false)
    }
  }

  async function handleOAuth(provider: 'google' | 'github') {
    if (oauthLoading) return
    setError(null)
    setOauthLoading(provider)
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
            <CardTitle className="font-display text-2xl">Check your email</CardTitle>
            <CardDescription>
              We sent a confirmation link to <strong>{email}</strong>.
              Click the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/login">
              <Button variant="outline">Back to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-brand lg:block">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 gradient-mesh-dark" />
        <div className="noise absolute inset-0" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link href="/" className="animate-fade-in font-display text-xl font-bold text-white tracking-tight">
            BrandKit
          </Link>
          <div className="animate-fade-in-up delay-1">
            <h2 className="font-display text-4xl font-bold leading-[0.95] tracking-headline text-white xl:text-5xl">
              브랜드의 모든 것,
              <br />
              <span className="text-white/40">한 곳에서.</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              무료로 시작하세요. Favicon, OG Image, App Icon까지 모든 에셋을 자동 생성합니다.
            </p>
          </div>
          <div className="animate-fade-in-up delay-3 flex gap-10">
            <div>
              <div className="font-display text-2xl font-bold text-white tracking-tight">Free</div>
              <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">Start</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white tracking-tight">3 proj</div>
              <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">Per Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader>
            <div className="mb-2 lg:hidden">
              <Link href="/" className="font-display text-lg font-bold text-text-primary">
                BrandKit
              </Link>
            </div>
            <CardTitle className="font-display text-2xl">Create your account</CardTitle>
            <CardDescription>AI로 브랜드 에셋을 자동 생성하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" required>Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" required>Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-text-secondary"
                    tabIndex={-1}
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password strength indicator */}
                {password.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    {passwordChecks.length ? (
                      <span className="flex items-center gap-1 text-success"><Check className="h-3 w-3" /> 6+ characters</span>
                    ) : (
                      <span className="flex items-center gap-1 text-text-tertiary"><X className="h-3 w-3" /> 6+ characters</span>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" required>Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-text-secondary"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password match indicator */}
                {confirmPassword.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    {passwordChecks.match ? (
                      <span className="flex items-center gap-1 text-success"><Check className="h-3 w-3" /> Passwords match</span>
                    ) : (
                      <span className="flex items-center gap-1 text-error"><X className="h-3 w-3" /> Passwords don&apos;t match</span>
                    )}
                  </div>
                )}
              </div>
              {error && (
                <p className="text-sm text-error" role="alert" aria-live="polite">{error}</p>
              )}
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign up with Email
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 font-mono text-text-tertiary">or</span>
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
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuth('github')}
                isLoading={oauthLoading === 'github'}
                disabled={!!oauthLoading || isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-accent hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
