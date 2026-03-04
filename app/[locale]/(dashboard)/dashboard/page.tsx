import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLAN_LIMITS, type Plan, type ProjectStatus } from '@/types/database'
import { FolderOpen, Sparkles, Palette, Plus, ArrowRight } from 'lucide-react'
import { UsageWarningAuto } from '@/components/shared/usage-warning'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

const STATUS_VARIANTS: Record<ProjectStatus, { variant: 'default' | 'success' | 'warning' | 'error' }> = {
  draft: { variant: 'default' },
  generating: { variant: 'warning' },
  completed: { variant: 'success' },
  failed: { variant: 'error' },
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const t = await getTranslations({ locale, namespace: 'dashboard' })
  const tProjects = await getTranslations({ locale, namespace: 'projects' })

  const [{ data: userData }, { data: recentProjects }, { count: profileCount }] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('projects').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('brand_profiles').select('id', { count: 'exact' })
      .eq('user_id', user.id),
  ])

  const plan: Plan = (userData?.plan as Plan) ?? 'free'
  const limits = PLAN_LIMITS[plan]

  const stats = [
    {
      label: t('stats.projectsThisMonth'),
      value: userData?.projects_used_this_month ?? 0,
      limit: limits.projects_per_month,
      icon: FolderOpen,
    },
    {
      label: t('stats.aiHeadlines'),
      value: userData?.ai_headlines_used_this_month ?? 0,
      limit: limits.ai_headlines_per_month,
      icon: Sparkles,
    },
    {
      label: t('stats.brandProfiles'),
      value: profileCount ?? 0,
      limit: limits.brand_profiles,
      icon: Palette,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Usage Warning Banner */}
      <UsageWarningAuto
        projectsUsed={userData?.projects_used_this_month ?? 0}
        headlinesUsed={userData?.ai_headlines_used_this_month ?? 0}
        iconsUsed={userData?.ai_icons_used_this_month ?? 0}
        plan={plan}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {t('title')}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {t('welcome', { email: userData?.email })}
          </p>
        </div>
        <Badge variant={plan === 'pro' ? 'pro' : 'secondary'}>
          {plan.toUpperCase()}
        </Badge>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const limitDisplay = stat.limit === Infinity ? '∞' : stat.limit
          const progress = stat.limit === Infinity ? 0 : ((stat.value as number) / (stat.limit as number)) * 100
          return (
            <Card key={stat.label} className="hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
                    <p className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary">
                      {stat.value}
                      <span className="ml-1 text-base font-normal text-text-tertiary">
                        /{limitDisplay}
                      </span>
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-tertiary text-text-secondary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                {stat.limit !== Infinity && (
                  <div className="mt-4">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-tertiary">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          background: progress >= 80
                            ? 'linear-gradient(90deg, var(--color-warning), var(--color-error))'
                            : undefined
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('actions.newProject')}
          </Button>
        </Link>
        <Link href="/brand-profiles">
          <Button variant="outline">{t('actions.manageProfiles')}</Button>
        </Link>
      </div>

      {/* Recent Projects */}
      {recentProjects && recentProjects.length > 0 ? (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{t('recentProjects.title')}</CardTitle>
            <Link href="/projects" className="text-sm text-text-secondary transition-colors hover:text-accent">
              {t('actions.viewAll')}
            </Link>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group flex items-center justify-between py-3 transition-colors first:pt-0 last:pb-0 hover:text-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-tertiary text-text-secondary transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                      <FolderOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{project.name}</p>
                      <p className="text-xs text-text-tertiary">{project.platform}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={STATUS_VARIANTS[project.status as ProjectStatus]?.variant || 'secondary'}>
                      {tProjects(`status.${project.status as ProjectStatus}` as const)}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-text-tertiary opacity-0 transition-all group-hover:opacity-100" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('empty.title')}</CardTitle>
            <p className="mt-2 text-sm text-text-secondary">{t('empty.description')}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-text-primary">{t('recentProjects.onboardingDescription')}</p>
            <ol className="space-y-2">
              <li className="text-sm text-text-primary">1. {t('recentProjects.step1')}</li>
              <li className="text-sm text-text-primary">2. {t('recentProjects.step2')}</li>
              <li className="text-sm text-text-primary">3. {t('recentProjects.step3')}</li>
            </ol>
            <Link href="/projects/new">
              <Button>{t('empty.cta')}</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
