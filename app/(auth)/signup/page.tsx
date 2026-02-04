'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { signUp, signUpWithOAuth } from './actions'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
    setError(null)
    const result = await signUpWithOAuth(provider)
    if (result?.error) {
      setError(result.error)
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
          <Link href="/" className="font-display text-xl font-bold text-white">
            BrandKit
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight text-white xl:text-5xl">
              브랜드의 모든 것,
              <br />
              <span className="text-white/40">한 곳에서.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/40">
              무료로 시작하세요. Favicon, OG Image, App Icon까지 모든 에셋을 자동 생성합니다.
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <div className="font-display text-lg font-bold text-white">Free</div>
              <div className="font-mono text-[10px] tracking-wider text-white/30">START</div>
            </div>
            <div>
              <div className="font-display text-lg font-bold text-white">3 proj</div>
              <div className="font-mono text-[10px] tracking-wider text-white/30">PER MONTH</div>
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
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" required>Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-error">{error}</p>
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
              <Button variant="outline" onClick={() => handleOAuth('google')}>
                Google
              </Button>
              <Button variant="outline" onClick={() => handleOAuth('github')}>
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
