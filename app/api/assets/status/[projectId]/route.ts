import { createClient } from '@/lib/supabase/server'
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
      .select('status, assets_zip_url')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    const project = projectData as Pick<
      Project,
      'status' | 'assets_zip_url'
    > | null
    if (!project) {
      throw new NotFoundError('프로젝트')
    }

    return Response.json({
      status: project.status,
      url: project.assets_zip_url,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
