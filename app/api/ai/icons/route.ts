import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { generateIcon } from '@/lib/ai/fal'
import { checkUsage, incrementUsage } from '@/lib/utils/rate-limit'

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

    const admin = getSupabaseAdmin()
    const { data: userData } = await admin
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single()

    if ((userData as Record<string, unknown>)?.plan !== 'pro') {
      return NextResponse.json(
        { error: 'PLAN_REQUIRED', message: 'AI icon generation requires a Pro plan' },
        { status: 403 }
      )
    }

    const usage = await checkUsage(admin, user.id, 'ai_icons_used_this_month')

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: 'USAGE_LIMIT_EXCEEDED',
          message: 'AI icon usage limit exceeded',
          current: usage.current,
          limit: usage.limit,
        },
        { status: 429 }
      )
    }

    const body = await request.json()

    if (!body.description?.trim()) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: 'Icon description is required' },
        { status: 400 }
      )
    }

    const images = await generateIcon({
      description: body.description,
      brandProfile: body.brandProfile,
    })

    await incrementUsage(admin, user.id, 'ai_icons_used_this_month')

    return NextResponse.json({ images })
  } catch (error) {
    console.error('AI icon generation failed:', error)
    return NextResponse.json(
      { error: 'AI_GENERATION_FAILED', message: 'Failed to generate icons' },
      { status: 500 }
    )
  }
}
