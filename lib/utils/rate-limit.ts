import type { SupabaseClient } from '@supabase/supabase-js'
import { PLAN_LIMITS, type Plan, type User } from '@/types/database'

export type UsageField =
  | 'projects_used_this_month'
  | 'ai_headlines_used_this_month'
  | 'ai_icons_used_this_month'

interface CheckUsageResult {
  allowed: boolean
  current: number
  limit: number
  plan: Plan
}

const FIELD_TO_LIMIT_KEY: Record<UsageField, keyof typeof PLAN_LIMITS.free> = {
  projects_used_this_month: 'projects_per_month',
  ai_headlines_used_this_month: 'ai_headlines_per_month',
  ai_icons_used_this_month: 'ai_icons_per_month',
}

export async function checkUsage(
  supabase: SupabaseClient,
  userId: string,
  field: UsageField
): Promise<CheckUsageResult> {
  await supabase.rpc('reset_monthly_usage')

  const { data: user, error } = await supabase
    .from('users')
    .select('plan, projects_used_this_month, ai_headlines_used_this_month, ai_icons_used_this_month')
    .eq('id', userId)
    .single()

  if (error || !user) throw new Error('User not found')

  // 타입 안전한 접근을 위해 명시적으로 필드 추출
  const userData = user as Pick<User, 'plan' | UsageField>
  const plan = userData.plan
  const current = userData[field] ?? 0
  const limitKey = FIELD_TO_LIMIT_KEY[field]
  const limit = PLAN_LIMITS[plan][limitKey] as number

  return { allowed: current < limit, current, limit, plan }
}

export async function incrementUsage(
  supabase: SupabaseClient,
  userId: string,
  field: UsageField
): Promise<void> {
  await supabase.rpc('increment_usage', {
    p_user_id: userId,
    p_field_name: field,
  })
}
