import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PLAN_LIMITS, type Plan } from '@/types/database'
import { User, CreditCard, Shield, ArrowRight } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('*').eq('id', user!.id).single()

  const plan: Plan = (userData?.plan as Plan) ?? 'free'
  const limits = PLAN_LIMITS[plan]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your account and subscription</p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-tertiary text-text-secondary">
              <User className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle>Account</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between py-3 first:pt-0">
              <div>
                <p className="text-sm font-medium text-text-primary">Email</p>
                <p className="mt-0.5 text-sm text-text-secondary">{userData?.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-text-primary">User ID</p>
                <p className="mt-0.5 font-mono text-xs text-text-tertiary">{user?.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-tertiary text-text-secondary">
              <CreditCard className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Your current plan and usage limits</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-secondary p-4">
            <div className="flex items-center gap-3">
              <Badge variant={plan === 'pro' ? 'pro' : 'secondary'}>
                {plan.toUpperCase()}
              </Badge>
              <span className="text-sm text-text-secondary">
                {plan === 'pro' ? 'Unlimited access to all features' : 'Basic features with usage limits'}
              </span>
            </div>
            {plan === 'free' && (
              <Link href="#pricing">
                <Button size="sm">
                  Upgrade to Pro
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-surface-secondary p-3">
              <p className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">Projects / Month</p>
              <p className="mt-1 font-display text-lg font-bold text-text-primary">
                {limits.projects_per_month === Infinity ? 'Unlimited' : limits.projects_per_month}
              </p>
            </div>
            <div className="rounded-lg bg-surface-secondary p-3">
              <p className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">AI Headlines</p>
              <p className="mt-1 font-display text-lg font-bold text-text-primary">
                {limits.ai_headlines_per_month === Infinity ? 'Unlimited' : `${limits.ai_headlines_per_month}/mo`}
              </p>
            </div>
            <div className="rounded-lg bg-surface-secondary p-3">
              <p className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">Brand Profiles</p>
              <p className="mt-1 font-display text-lg font-bold text-text-primary">
                {limits.brand_profiles}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-tertiary text-text-secondary">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Authentication and security settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Sign out</p>
              <p className="mt-0.5 text-sm text-text-secondary">Sign out of your account on this device</p>
            </div>
            <form action="/api/auth/signout" method="POST">
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
