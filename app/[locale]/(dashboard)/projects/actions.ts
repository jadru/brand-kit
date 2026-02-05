'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Project } from '@/types/database'

export async function duplicateProject(projectId: string): Promise<{ success: boolean; newProjectId?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // 원본 프로젝트 조회
  const { data: original, error: fetchError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !original) {
    return { success: false, error: 'Project not found' }
  }

  const typedOriginal = original as Project

  // 새 프로젝트 생성 (복제)
  const { data: newProject, error: insertError } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      brand_profile_id: typedOriginal.brand_profile_id,
      style_preset_id: typedOriginal.style_preset_id,
      name: `${typedOriginal.name} (Copy)`,
      description: typedOriginal.description,
      platform: typedOriginal.platform,
      mobile_target: typedOriginal.mobile_target,
      primary_color_override: typedOriginal.primary_color_override,
      icon_type: typedOriginal.icon_type,
      icon_value: typedOriginal.icon_value,
      // AI 생성 콘텐츠는 복제하지 않음 (새로 생성 필요)
      status: 'draft',
    })
    .select('id')
    .single()

  if (insertError || !newProject) {
    return { success: false, error: 'Failed to duplicate project' }
  }

  return { success: true, newProjectId: (newProject as { id: string }).id }
}

export async function deleteProject(projectId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: 'Failed to delete project' }
  }

  return { success: true }
}
