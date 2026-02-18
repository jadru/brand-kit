import { createClient } from '@/lib/supabase/server'
import { runAssetPipeline } from '@/lib/assets/pipeline'
import {
  handleApiError,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
  AppError,
} from '@/lib/utils/errors'
import type { BrandProfile, StylePreset, Project } from '@/types/database'

export const maxDuration = 300

/**
 * 프로젝트 에셋 생성 API
 * 브랜드 프로필과 스타일 프리셋을 기반으로 에셋을 생성합니다.
 */
export async function POST(request: Request) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new UnauthorizedError()
    }

    const body = await request.json()
    const { projectId } = body as { projectId?: string }

    if (!projectId) {
      throw new ValidationError('프로젝트 ID가 필요합니다.')
    }

    // 프로젝트 조회
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (projectError || !projectData) {
      throw new NotFoundError('프로젝트')
    }

    const project = projectData as Project

    // 브랜드 프로필 조회 (선택적)
    let brandProfile: BrandProfile | null = null
    if (project.brand_profile_id) {
      const { data: brandData } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('id', project.brand_profile_id)
        .single()
      brandProfile = brandData as BrandProfile | null
    }

    // 스타일 프리셋 조회
    const { data: presetData, error: presetError } = await supabase
      .from('style_presets')
      .select('*')
      .eq('id', project.style_preset_id)
      .single()

    if (presetError || !presetData) {
      throw new NotFoundError('스타일 프리셋')
    }

    const stylePreset = presetData as StylePreset

    // 상태 업데이트: 생성 중
    await supabase
      .from('projects')
      .update({ status: 'generating' })
      .eq('id', projectId)

    try {
      const { storageUrl, warnings } = await runAssetPipeline({
        project,
        brandProfile,
        stylePreset,
        userId: user.id,
      })

      await supabase
        .from('projects')
        .update({ status: 'completed', assets_zip_url: storageUrl })
        .eq('id', projectId)

      return Response.json({ success: true, url: storageUrl, warnings })
    } catch (pipelineError) {
      // 파이프라인 실패 시 상태 업데이트
      await supabase
        .from('projects')
        .update({ status: 'failed' })
        .eq('id', projectId)

      throw new AppError(
        pipelineError instanceof Error ? pipelineError.message : '에셋 생성 실패',
        'ASSET_GENERATION_FAILED',
        500,
        '에셋 생성에 실패했습니다. 잠시 후 다시 시도해주세요.'
      )
    }
  } catch (error) {
    return handleApiError(error)
  }
}
