import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { generateIcon } from '@/lib/ai/fal'
import { checkUsage, incrementUsage } from '@/lib/utils/rate-limit'
import {
  handleApiError,
  UnauthorizedError,
  ValidationError,
  UsageLimitError,
  PlanRequiredError,
  AIGenerationError,
} from '@/lib/utils/errors'
import type { Plan } from '@/types/database'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new UnauthorizedError()
    }

    const admin = getSupabaseAdmin()
    const { data: userData } = await admin
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single()

    const userPlan = (userData as { plan: Plan } | null)?.plan
    if (userPlan !== 'pro') {
      throw new PlanRequiredError('AI 아이콘 생성')
    }

    const usage = await checkUsage(admin, user.id, 'ai_icons_used_this_month')

    if (!usage.allowed) {
      throw new UsageLimitError('AI 아이콘', usage.limit)
    }

    const body = await request.json()

    if (!body.description?.trim()) {
      throw new ValidationError('아이콘 설명이 필요합니다.')
    }

    const images = await generateIcon({
      description: body.description,
      brandProfile: body.brandProfile,
    })

    await incrementUsage(admin, user.id, 'ai_icons_used_this_month')

    return Response.json({ images })
  } catch (error) {
    if (error instanceof UnauthorizedError ||
        error instanceof ValidationError ||
        error instanceof UsageLimitError ||
        error instanceof PlanRequiredError ||
        error instanceof AIGenerationError) {
      return handleApiError(error)
    }
    // AI 생성 중 발생한 기타 에러
    return handleApiError(new AIGenerationError('fal'))
  }
}
