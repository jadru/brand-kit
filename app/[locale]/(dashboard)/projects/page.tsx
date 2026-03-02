import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, ArrowRight, Sparkles } from 'lucide-react'
import type { ProjectStatus } from '@/types/database'

const STATUS_VARIANT: Record<ProjectStatus, 'default' | 'success' | 'warning' | 'error'> = {
  draft: 'default',
  generating: 'warning',
  completed: 'success',
  failed: 'error',
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslations({ locale, namespace: 'projects' })

  const { data: projects } = await supabase
    .from('projects')
    .select('*, brand_profiles(primary_color)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const dateLocale = locale === 'ko' ? 'ko-KR' : 'en-US'

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
                {t('empty.description')}
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
