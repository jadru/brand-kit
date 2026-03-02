import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { generateIcon } from '@/lib/ai/fal'
import { type FalQualityTier } from '@/lib/config/ai'
import { checkUsage, incrementUsage } from '@/lib/utils/rate-limit'
import {
  handleApiError,
  UnauthorizedError,
  ValidationError,
  UsageLimitError,
  AIGenerationError,
} from '@/lib/utils/errors'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new UnauthorizedError()
    }

    const admin = getSupabaseAdmin()

    // 사용량 기반으로 체크 (Free: 월 3회, Pro: 월 50회)
    const usage = await checkUsage(admin, user.id, 'ai_icons_used_this_month')

    if (!usage.allowed) {
      throw new UsageLimitError('AI 아이콘', usage.limit)
    }

    const body = await request.json()

    if (!body.description?.trim()) {
      throw new ValidationError('아이콘 설명이 필요합니다.')
    }

    const quality = body.quality as FalQualityTier | undefined
    if (quality && quality !== 'fast' && quality !== 'quality') {
      throw new ValidationError('유효하지 않은 품질 옵션입니다.')
    }

    const seed = body.seed as number | undefined
    if (seed !== undefined && (!Number.isInteger(seed) || seed < 0)) {
      throw new ValidationError('유효하지 않은 seed 값입니다.')
    }

    const images = await generateIcon({
      description: body.description,
      brandProfile: body.brandProfile,
      seed,
      quality,
      styleModifier: body.styleModifier,
      negativePrompt: body.negativePrompt,
      promptTemplate: body.promptTemplate,
    })

    await incrementUsage(admin, user.id, 'ai_icons_used_this_month')

    return Response.json({ images })
  } catch (error) {
    if (error instanceof UnauthorizedError ||
        error instanceof ValidationError ||
        error instanceof UsageLimitError ||
        error instanceof AIGenerationError) {
      return handleApiError(error)
    }
    // AI 생성 중 발생한 기타 에러
    return handleApiError(new AIGenerationError('fal'))
  }
}
