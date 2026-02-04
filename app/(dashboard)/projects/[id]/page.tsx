import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectDetailClient } from './project-detail-client'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!project) notFound()

  // Get brand profile for color info
  let primaryColor = '#6366f1'
  if (project.primary_color_override) {
    primaryColor = project.primary_color_override
  } else if (project.brand_profile_id) {
    const { data: brand } = await supabase
      .from('brand_profiles')
      .select('primary_color')
      .eq('id', project.brand_profile_id)
      .single()
    if (brand) primaryColor = brand.primary_color
  }

  return (
    <ProjectDetailClient
      project={project}
      primaryColor={primaryColor}
    />
  )
}
