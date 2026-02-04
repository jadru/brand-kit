import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLAN_LIMITS, type Plan } from '@/types/database'
import { FolderOpen, Sparkles, Palette, Plus, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: userData }, { data: recentProjects }, { count: profileCount }] = await Promise.all([
    supabase.from('users').select('*').eq('id', user!.id).single(),
    supabase.from('projects').select('*').eq('user_id', user!.id)
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('brand_profiles').select('id', { count: 'exact' })
      .eq('user_id', user!.id),
  ])

  const plan: Plan = (userData?.plan as Plan) ?? 'free'
  const limits = PLAN_LIMITS[plan]

  const stats = [
    {
      label: 'Projects this month',
      value: userData?.projects_used_this_month ?? 0,
      limit: limits.projects_per_month,
      icon: FolderOpen,
    },
    {
      label: 'AI Headlines',
      value: userData?.ai_headlines_used_this_month ?? 0,
      limit: limits.ai_headlines_per_month,
      icon: Sparkles,
    },
    {
      label: 'Brand Profiles',
      value: profileCount ?? 0,
      limit: limits.brand_profiles,
      icon: Palette,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-secondary">Welcome back, {userData?.email}</p>
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
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
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
            New Project
          </Button>
        </Link>
        <Link href="/brand-profiles">
          <Button variant="outline">Manage Profiles</Button>
        </Link>
      </div>

      {/* Recent Projects */}
      {recentProjects && recentProjects.length > 0 && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Projects</CardTitle>
            <Link href="/projects" className="text-sm text-text-secondary transition-colors hover:text-accent">
              View all
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
                    <Badge variant={project.status === 'completed' ? 'success' : 'secondary'}>
                      {project.status}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-text-tertiary opacity-0 transition-all group-hover:opacity-100" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
