import { getSupabaseAdmin } from './admin'
import { logger } from '@/lib/utils/logger'

export async function uploadToStorage(params: {
  userId: string
  projectId: string
  buffer: Buffer
  filename: string
}): Promise<string> {
  const { userId, projectId, buffer, filename } = params
  const storagePath = `${userId}/${projectId}/${filename}`

  const admin = getSupabaseAdmin()

  const { error } = await admin.storage
    .from('project-assets')
    .upload(storagePath, buffer, {
      contentType: 'application/zip',
      upsert: true,
    })

  if (error) {
    logger.error('asset.storage.upload_failed', {
      storagePath,
      error: error.message,
    })
    throw error
  }

  const { data: urlData, error: urlError } = await admin.storage
    .from('project-assets')
    .createSignedUrl(storagePath, 86400)

  if (urlError || !urlData) {
    throw new Error(`Failed to create signed URL: ${urlError?.message || 'Unknown error'}`)
  }

  return urlData.signedUrl
}
