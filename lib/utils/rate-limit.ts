import { SupabaseClient } from '@supabase/supabase-js'
import { PLAN_LIMITS, type Plan } from '@/types/database'

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

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (!user) throw new Error('User not found')

  const row = user as Record<string, unknown>
  const plan = row.plan as Plan
  const current = (row[field] as number) ?? 0
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
