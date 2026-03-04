import { getSupabaseAdmin } from './admin'
import { logger } from '@/lib/utils/logger'

const PROJECT_ASSETS_BUCKET = 'project-assets'
const PROJECT_ASSETS_DOWNLOAD_EXPIRES_IN = 86400

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
    .from(PROJECT_ASSETS_BUCKET)
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

  const urlData = await createProjectAssetSignedUrl(storagePath)
  return urlData
}

export function getProjectAssetStoragePath(signedUrl: string): string {
  if (signedUrl.startsWith(`${PROJECT_ASSETS_BUCKET}/`)) {
    return signedUrl
  }

  if (signedUrl.startsWith(`/${PROJECT_ASSETS_BUCKET}/`)) {
    return signedUrl.slice(1)
  }

  const parsed = new URL(signedUrl)
  const bucketPrefix = `/storage/v1/object/sign/${PROJECT_ASSETS_BUCKET}/`

  if (!parsed.pathname.startsWith(bucketPrefix)) {
    throw new Error('Invalid Supabase storage URL for project assets')
  }

  const encodedPath = parsed.pathname.slice(bucketPrefix.length)
  return decodeURIComponent(encodedPath)
}

export async function createProjectAssetSignedUrl(storagePath: string): Promise<string> {
  const admin = getSupabaseAdmin()
  const { data: urlData, error: urlError } = await admin.storage
    .from(PROJECT_ASSETS_BUCKET)
    .createSignedUrl(storagePath, PROJECT_ASSETS_DOWNLOAD_EXPIRES_IN)

  if (urlError || !urlData) {
    throw new Error(`Failed to create signed URL: ${urlError?.message || 'Unknown error'}`)
  }

  return urlData.signedUrl
}
