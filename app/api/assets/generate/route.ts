import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runAssetPipeline } from '@/lib/assets/pipeline'
import type { BrandProfile, StylePreset, Project } from '@/types/database'

export const maxDuration = 300

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { projectId } = body

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
  }

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const typedProject = project as unknown as Project

  // Fetch related data
  let brandProfile: BrandProfile | null = null
  if (typedProject.brand_profile_id) {
    const { data } = await supabase
      .from('brand_profiles')
      .select('*')
      .eq('id', typedProject.brand_profile_id)
      .single()
    brandProfile = data as unknown as BrandProfile | null
  }

  const { data: stylePreset } = await supabase
    .from('style_presets')
    .select('*')
    .eq('id', typedProject.style_preset_id)
    .single()

  if (!stylePreset) {
    return NextResponse.json({ error: 'Style preset not found' }, { status: 404 })
  }

  // Update status: generating
  await supabase
    .from('projects')
    .update({ status: 'generating' })
    .eq('id', projectId)

  try {
    const { storageUrl } = await runAssetPipeline({
      project: typedProject,
      brandProfile,
      stylePreset: stylePreset as unknown as StylePreset,
      userId: user.id,
    })

    await supabase
      .from('projects')
      .update({ status: 'completed', assets_zip_url: storageUrl })
      .eq('id', projectId)

    return NextResponse.json({ success: true, url: storageUrl })
  } catch (error) {
    console.error('Asset generation failed:', error)

    await supabase
      .from('projects')
      .update({ status: 'failed' })
      .eq('id', projectId)

    return NextResponse.json(
      { error: 'Asset generation failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
