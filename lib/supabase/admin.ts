import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase Admin 클라이언트 (Service Role)
 * 서버사이드에서 관리자 권한이 필요한 작업에 사용
 */
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        'Missing Supabase admin environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
      )
    }

    _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
  }
  return _supabaseAdmin
}
