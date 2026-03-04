import { createClient } from '@/lib/supabase/server'
import {
  handleApiError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
} from '@/lib/utils/errors'
import type { Project } from '@/types/database'
import { createProjectAssetSignedUrl, getProjectAssetStoragePath } from '@/lib/supabase/storage'

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
      .select('assets_zip_url, name')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    const project = projectData as Pick<
      Project,
      'assets_zip_url' | 'name'
    > | null
    if (!project || !project.assets_zip_url) {
      throw new NotFoundError('에셋 파일')
    }

    let downloadUrl = ''
    try {
      const storagePath = getProjectAssetStoragePath(project.assets_zip_url)
      downloadUrl = await createProjectAssetSignedUrl(storagePath)
    } catch {
      throw new ValidationError('유효하지 않은 저장소 URL입니다.')
    }

    const response = await fetch(downloadUrl)
    const buffer = await response.arrayBuffer()

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${project.name}-assets.zip"`,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
