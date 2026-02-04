import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return new Response('Unauthorized', { status: 401 })

  const { data: project } = await supabase
    .from('projects')
    .select('assets_zip_url, name')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  const row = project as Record<string, unknown> | null
  if (!row || !row.assets_zip_url) return new Response('Not found', { status: 404 })

  const zipUrl = row.assets_zip_url as string
  const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace('https://', '')
  if (!zipUrl.includes(supabaseHost)) {
    return new Response('Invalid storage URL', { status: 400 })
  }

  const response = await fetch(zipUrl)
  const buffer = await response.arrayBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${row.name}-assets.zip"`,
    },
  })
}
