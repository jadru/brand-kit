import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, FolderOpen, ArrowRight } from 'lucide-react'

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
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-tertiary text-text-tertiary">
              <FolderOpen className="h-6 w-6" />
            </div>
            <p className="mt-4 font-medium text-text-primary">No projects yet</p>
            <p className="mt-1 text-sm text-text-secondary">Create your first project to get started</p>
            <Link href="/projects/new" className="mt-6">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create your first project
              </Button>
            </Link>
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
                      <Badge variant={project.status === 'completed' ? 'success' : 'secondary'}>
                        {project.status}
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
