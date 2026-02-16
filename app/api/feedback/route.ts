/**
 * Feedback API Route
 * Handles submission of general feedback and NPS responses
 */

import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface FeedbackBody {
  type: 'nps' | 'feedback'
  score?: number
  sentiment?: 'positive' | 'neutral' | 'negative'
  message?: string
  pageUrl?: string
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  try {
    const body: FeedbackBody = await request.json()
    const userAgent = request.headers.get('user-agent') || undefined

    if (body.type === 'nps') {
      if (body.score === undefined || body.score < 0 || body.score > 10) {
        return NextResponse.json({ error: 'Invalid NPS score (0-10 required)' }, { status: 400 })
      }

      const { error } = await supabase.from('nps_responses').insert({
        user_id: user?.id || null,
        score: body.score,
        feedback: body.message || null,
      })

      if (error) {
        console.error('[Feedback API] NPS insert error:', error)
        return NextResponse.json({ error: 'Failed to save NPS response' }, { status: 500 })
      }

      return NextResponse.json({ success: true, type: 'nps' })
    }

    if (body.type === 'feedback') {
      if (!body.sentiment || !body.message?.trim()) {
        return NextResponse.json(
          { error: 'Sentiment and message are required' },
          { status: 400 }
        )
      }

      const { error } = await supabase.from('feedback').insert({
        user_id: user?.id || null,
        sentiment: body.sentiment,
        message: body.message.trim(),
        page_url: body.pageUrl || null,
        user_agent: userAgent,
      })

      if (error) {
        console.error('[Feedback API] Feedback insert error:', error)
        return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
      }

      return NextResponse.json({ success: true, type: 'feedback' })
    }

    return NextResponse.json({ error: 'Invalid feedback type' }, { status: 400 })
  } catch (error) {
    console.error('[Feedback API] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
