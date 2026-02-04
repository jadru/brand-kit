import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { generateHeadlines } from '@/lib/ai/claude'
import { checkUsage, incrementUsage } from '@/lib/utils/rate-limit'
import type { HeadlineRequest } from '@/types/wizard'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body: HeadlineRequest = await request.json()

    if (!body.projectName?.trim()) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: 'Project name is required' },
        { status: 400 }
      )
    }

    const usage = await checkUsage(getSupabaseAdmin(), user.id, 'ai_headlines_used_this_month')

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: 'USAGE_LIMIT_EXCEEDED',
          message: 'AI headline usage limit exceeded',
          current: usage.current,
          limit: usage.limit,
          plan: usage.plan,
        },
        { status: 429 }
      )
    }

    const result = await generateHeadlines({
      projectName: body.projectName,
      description: body.description,
      platform: body.platform,
      brandKeywords: body.brandKeywords,
      brandStyleDirection: body.brandStyleDirection,
    })

    await incrementUsage(getSupabaseAdmin(), user.id, 'ai_headlines_used_this_month')

    return NextResponse.json(result)
  } catch (error) {
    console.error('AI headline generation failed:', error)
    return NextResponse.json(
      { error: 'AI_GENERATION_FAILED', message: 'Failed to generate headlines' },
      { status: 500 }
    )
  }
}
