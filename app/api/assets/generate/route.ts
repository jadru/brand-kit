import { createClient } from '@/lib/supabase/server'
import { runAssetPipeline } from '@/lib/assets/pipeline'
import { logger } from '@/lib/utils/logger'
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

    let brandProfile: BrandProfile | null = null
    if (project.brand_profile_id) {
      const { data: brandData } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('id', project.brand_profile_id)
        .single()
      brandProfile = brandData as BrandProfile | null
    }

    const { data: presetData, error: presetError } = await supabase
      .from('style_presets')
      .select('*')
      .eq('id', project.style_preset_id)
      .single()

    if (presetError || !presetData) {
      throw new NotFoundError('스타일 프리셋')
    }

    const stylePreset = presetData as StylePreset

    await supabase
      .from('projects')
      .update({ status: 'generating' })
      .eq('id', projectId)

    try {
      const startedAt = Date.now()
      const { storageUrl } = await runAssetPipeline({
        project,
        brandProfile,
        stylePreset,
        userId: user.id,
      })

      await supabase
        .from('projects')
        .update({ status: 'completed', assets_zip_url: storageUrl })
        .eq('id', projectId)

      logger.info('asset.generate.completed', {
        projectId,
        userId: user.id,
        durationMs: Date.now() - startedAt,
      })

      return Response.json({ success: true, url: storageUrl })
    } catch (pipelineError) {
      await supabase
        .from('projects')
        .update({ status: 'failed' })
        .eq('id', projectId)

      logger.error('asset.generate.pipeline_failed', {
        projectId,
        userId: user.id,
        error: pipelineError instanceof Error ? pipelineError.message : String(pipelineError),
      })

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
