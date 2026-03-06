import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, ArrowRight, Sparkles } from 'lucide-react'
import type { ProjectStatus } from '@/types/database'

const STATUS_VARIANT: Record<ProjectStatus, 'default' | 'success' | 'warning' | 'error'> = {
  draft: 'default',
  generating: 'warning',
  completed: 'success',
  failed: 'error',
}

const STATUSES: ProjectStatus[] = ['draft', 'generating', 'completed', 'failed']

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams:
    | Promise<{
        q?: string | string[]
        status?: string | string[]
      }>
    | {
        q?: string | string[]
        status?: string | string[]
      }
}) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const { q: rawQuery = '', status: rawStatus = 'all' } = resolvedSearchParams
  const query = typeof rawQuery === 'string' ? rawQuery.trim() : ''
  const selectedStatus = typeof rawStatus === 'string'
    ? rawStatus
    : Array.isArray(rawStatus)
      ? rawStatus[0] ?? 'all'
      : 'all'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslations({ locale, namespace: 'projects' })
  if (!user) redirect('/login')

  let projectQuery = supabase
    .from('projects')
    .select('*, brand_profiles(primary_color)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (query) {
    projectQuery = projectQuery.ilike('name', `%${query}%`)
  }

  if (selectedStatus !== 'all' && STATUSES.includes(selectedStatus as ProjectStatus)) {
    projectQuery = projectQuery.eq('status', selectedStatus)
  }

  const { data: projects } = await projectQuery

  const isStatusFiltered = selectedStatus !== 'all' && STATUSES.includes(selectedStatus as ProjectStatus)
  const hasActiveFilter = Boolean(query) || isStatusFiltered

  const dateLocale = locale === 'ko' ? 'ko-KR' : 'en-US'
  const statusKeyMap: Record<ProjectStatus | 'all', string> = {
    all: 'statusAll',
    draft: 'draft',
    generating: 'generating',
    completed: 'completed',
    failed: 'failed',
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {t('title')}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {t('total', { count: projects?.length ?? 0 })}
          </p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('newProject')}
          </Button>
        </Link>
      </div>

      <form method="get" className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-end">
        <label className="flex-1 space-y-2">
          <span className="text-xs font-medium text-text-secondary">{t('filters.search')}</span>
          <Input
            name="q"
            defaultValue={query}
            placeholder={t('filters.searchPlaceholder')}
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-medium text-text-secondary">{t('filters.status')}</span>
          <select
            name="status"
            defaultValue={selectedStatus}
            className="h-10 w-full min-w-44 rounded-md border border-border bg-surface-secondary px-3 text-sm text-text-primary"
          >
            <option value="all">{t('filters.' + statusKeyMap.all)}</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`status.${status}`)}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          <Button type="submit">{t('filters.apply')}</Button>
          <Link href="/projects">
            <Button type="button" variant="outline">
              {t('filters.reset')}
            </Button>
          </Link>
        </div>
      </form>

      {!projects || projects.length === 0 ? (
        <Card className="overflow-hidden border-dashed">
          <CardContent className="relative flex flex-col items-center justify-center py-16">
            {/* Background decoration */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 ring-4 ring-accent/5">
                <Sparkles className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mt-6 text-center text-lg font-semibold text-text-primary">
                {t('empty.title')}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-center text-sm text-text-secondary">
                {hasActiveFilter ? t('filters.noResults') : t('empty.description')}
              </p>
              <Link href="/projects/new" className="mt-6 flex justify-center">
                <Button className="btn-glow">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('empty.cta')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const brandColor = (project.brand_profiles as { primary_color?: string } | null)?.primary_color
            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="group cursor-pointer hover:border-border-hover hover:shadow-md">
                  {/* Color bar at top */}
                  <div
                    className="h-1.5 w-full rounded-t-xl"
                    style={{ backgroundColor: brandColor || 'var(--color-surface-tertiary)' }}
                  />
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display font-semibold text-text-primary">
                          {project.name}
                        </p>
                        <p className="mt-1 text-xs text-text-tertiary">
                          {project.platform}
                          {project.created_at && (
                            <>
                              {' \u00B7 '}
                              {new Date(project.created_at).toLocaleDateString(dateLocale, {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </>
                          )}
                        </p>
                      </div>
                      <Badge variant={STATUS_VARIANT[project.status as ProjectStatus] || 'secondary'}>
                        {t(`status.${project.status as ProjectStatus}`)}
                      </Badge>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100">
                      {t('viewDetails')}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
