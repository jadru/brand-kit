import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, ArrowRight, Sparkles } from 'lucide-react'
import type { ProjectStatus } from '@/types/database'

const STATUS_CONFIG: Record<ProjectStatus, { variant: 'default' | 'success' | 'warning' | 'error'; label: string }> = {
  draft: { variant: 'default', label: '초안' },
  generating: { variant: 'warning', label: '생성 중' },
  completed: { variant: 'success', label: '완료' },
  failed: { variant: 'error', label: '실패' },
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, brand_profiles(primary_color)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Projects
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {projects?.length ?? 0} project{(projects?.length ?? 0) !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
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
                첫 프로젝트를 만들어보세요
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-center text-sm text-text-secondary">
                60초 안에 OG 이미지, 파비콘, 앱 아이콘 등 12종 이상의 브랜드 에셋을 자동 생성합니다.
              </p>
              <Link href="/projects/new" className="mt-6 flex justify-center">
                <Button className="btn-glow">
                  <Plus className="mr-2 h-4 w-4" />
                  새 프로젝트 만들기
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
                              {new Date(project.created_at).toLocaleDateString('ko-KR', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </>
                          )}
                        </p>
                      </div>
                      <Badge variant={STATUS_CONFIG[project.status as ProjectStatus]?.variant || 'secondary'}>
                        {STATUS_CONFIG[project.status as ProjectStatus]?.label || project.status}
                      </Badge>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100">
                      View details
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
