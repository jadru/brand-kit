import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { brandProfileToMetadataConfig, generateHeadlines } from '@/lib/ai/claude'
import { checkUsage, incrementUsage } from '@/lib/utils/rate-limit'
import {
  handleApiError,
  UnauthorizedError,
  ValidationError,
  UsageLimitError,
  AIGenerationError,
} from '@/lib/utils/errors'
import type { HeadlineRequest } from '@/types/wizard'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new UnauthorizedError()
    }

    const body: HeadlineRequest = await request.json()

    if (!body.projectName?.trim()) {
      throw new ValidationError('프로젝트 이름이 필요합니다.')
    }

    const usage = await checkUsage(getSupabaseAdmin(), user.id, 'ai_headlines_used_this_month')

    if (!usage.allowed) {
      throw new UsageLimitError('AI 헤드라인', usage.limit)
    }

    const promptConfig = body.promptConfig ?? (
      body.brandStyleDirection || body.brandKeywords?.length
        ? brandProfileToMetadataConfig({
            platform: body.platform,
            styleDirection: body.brandStyleDirection,
            keywords: body.brandKeywords,
          })
        : undefined
    )

    const result = await generateHeadlines({
      projectName: body.projectName,
      description: body.description,
      platform: body.platform,
      brandKeywords: body.brandKeywords,
      brandStyleDirection: body.brandStyleDirection,
      promptConfig,
    })

    await incrementUsage(getSupabaseAdmin(), user.id, 'ai_headlines_used_this_month')

    return Response.json(result)
  } catch (error) {
    if (error instanceof AIGenerationError ||
        error instanceof UnauthorizedError ||
        error instanceof ValidationError ||
        error instanceof UsageLimitError) {
      return handleApiError(error)
    }
    // AI 생성 중 발생한 기타 에러
    return handleApiError(new AIGenerationError('claude'))
  }
}
