import { createClient } from '@/lib/supabase/server'
import { createProjectAssetSignedUrl, getProjectAssetStoragePath } from '@/lib/supabase/storage'
import {
  handleApiError,
  UnauthorizedError,
  NotFoundError,
} from '@/lib/utils/errors'
import type { Project } from '@/types/database'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new UnauthorizedError()
    }

    const { data: projectData } = await supabase
      .from('projects')
      .select('status, assets_zip_url, pipeline_stage')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    const project = projectData as Pick<
      Project,
      'status' | 'assets_zip_url' | 'pipeline_stage'
    > | null
    if (!project) {
      throw new NotFoundError('프로젝트')
    }

    let downloadUrl: string | null = null
    if (project.assets_zip_url && project.status === 'completed') {
      try {
        const storagePath = getProjectAssetStoragePath(project.assets_zip_url)
        downloadUrl = await createProjectAssetSignedUrl(storagePath)
      } catch {
        downloadUrl = null
      }
    }

    return Response.json({
      status: project.status,
      url: downloadUrl,
      warnings: [],
      pipelineStage: project.pipeline_stage,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
