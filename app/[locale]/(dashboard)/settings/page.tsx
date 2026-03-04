import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { PLAN_LIMITS, type Plan } from '@/types/database'
import { PasswordChangeForm } from './password-change-form'
import { EmailChangeForm } from './email-change-form'
import { User, CreditCard, Shield, ArrowRight, AlertTriangle } from 'lucide-react'

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single()

  const t = await getTranslations({ locale, namespace: 'settings' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const plan: Plan = (userData?.plan as Plan) ?? 'free'
  const limits = PLAN_LIMITS[plan]
  const currentEmail = userData?.email ?? user.email ?? ''

  const deleteAccountMailto = `mailto:support@brandkit.app?subject=${encodeURIComponent('Account deletion request')}&body=${encodeURIComponent(`Please delete my account.\n\nUser ID: ${user.id}\nEmail: ${userData?.email ?? ''}`)}`

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {t('title')}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">{t('subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-tertiary text-text-secondary">
              <User className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle>{t('account.title')}</CardTitle>
              <CardDescription>{t('account.subtitle')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between py-3 first:pt-0">
              <div>
                <p className="text-sm font-medium text-text-primary">{t('account.email')}</p>
                <p className="mt-0.5 text-sm text-text-secondary">{currentEmail}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-text-primary">{t('account.userId')}</p>
                <p className="mt-0.5 font-mono text-xs text-text-tertiary">{user.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-tertiary text-text-secondary">
              <CreditCard className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle>{t('subscription.title')}</CardTitle>
              <CardDescription>{t('subscription.subtitle')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-secondary p-4">
            <div className="flex items-center gap-3">
              <Badge variant={plan === 'pro' ? 'pro' : 'secondary'}>{plan.toUpperCase()}</Badge>
              <span className="text-sm text-text-secondary">
                {plan === 'pro' ? t('subscription.unlimited') : t('subscription.limited')}
              </span>
            </div>
            {plan === 'free' && (
              <Link href="/settings/billing">
                <Button size="sm">
                  {t('subscription.upgrade')}
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-surface-secondary p-3">
              <p className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">
                {t('subscription.projectsPerMonth')}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-text-primary">
                {limits.projects_per_month === Infinity ? tCommon('unlimited') : limits.projects_per_month}
              </p>
            </div>
            <div className="rounded-lg bg-surface-secondary p-3">
              <p className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">
                {t('subscription.aiHeadlines')}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-text-primary">
                {limits.ai_headlines_per_month === Infinity ? tCommon('unlimited') : `${limits.ai_headlines_per_month}/mo`}
              </p>
            </div>
            <div className="rounded-lg bg-surface-secondary p-3">
              <p className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">
                {t('subscription.brandProfiles')}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-text-primary">{limits.brand_profiles}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-tertiary text-text-secondary">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle>{t('security.title')}</CardTitle>
              <CardDescription>{t('security.subtitle')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-text-primary">{t('security.signout')}</p>
              <p className="mt-0.5 text-sm text-text-secondary">{t('security.signoutDesc')}</p>
              <form action={`/${locale}/auth/signout`} method="POST" className="mt-3">
                <Button variant="outline" size="sm" type="submit">
                  {t('security.signout')}
                </Button>
              </form>
            </div>

            <div className="border-t border-border pt-6">
              <p className="text-sm font-medium text-text-primary">{t('security.changeEmail.title')}</p>
              <p className="mt-0.5 text-sm text-text-secondary">{t('security.changeEmail.description')}</p>
              <div className="mt-4 max-w-md">
                <EmailChangeForm currentEmail={currentEmail} />
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <p className="text-sm font-medium text-text-primary">{t('security.changePassword.title')}</p>
              <p className="mt-0.5 text-sm text-text-secondary">{t('security.changePassword.description')}</p>
              <div className="mt-4 max-w-md">
                <PasswordChangeForm />
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="rounded-lg border border-status-warning/30 bg-status-warning/5 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-status-warning" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{t('security.deleteAccount.title')}</p>
                    <p className="mt-1 text-sm text-text-secondary">{t('security.deleteAccount.description')}</p>
                    <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-text-secondary">
                      <li>{t('security.deleteAccount.step1')}</li>
                      <li>{t('security.deleteAccount.step2')}</li>
                      <li>{t('security.deleteAccount.step3')}</li>
                    </ol>
                    <a
                      href={deleteAccountMailto}
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-3')}
                    >
                      {t('security.deleteAccount.contactButton')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
