/**
 * Internal Email API Route
 * Used by webhooks and server actions to send emails
 *
 * This route is protected by an internal API key
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/client'
import { WelcomeEmail, ProjectCompleteEmail } from '@/lib/email/templates'

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY

type EmailType = 'welcome' | 'project-complete'

interface EmailRequestBody {
  type: EmailType
  to: string
  locale?: 'en' | 'ko'
  data?: {
    userName?: string
    projectName?: string
    assetsGenerated?: number
  }
}

export async function POST(request: NextRequest) {
  // Verify internal API key
  const authHeader = request.headers.get('authorization')
  if (INTERNAL_API_KEY && authHeader !== `Bearer ${INTERNAL_API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body: EmailRequestBody = await request.json()
    const { type, to, locale = 'en', data = {} } = body

    if (!type || !to) {
      return NextResponse.json({ error: 'Missing required fields: type, to' }, { status: 400 })
    }

    let emailElement: React.ReactElement
    let subject: string

    switch (type) {
      case 'welcome':
        subject = locale === 'ko' ? 'BrandKit에 오신 것을 환영합니다!' : 'Welcome to BrandKit!'
        emailElement = WelcomeEmail({ userName: data.userName, locale })
        break

      case 'project-complete':
        if (!data.projectName || !data.assetsGenerated) {
          return NextResponse.json(
            { error: 'Missing required data for project-complete email' },
            { status: 400 }
          )
        }
        subject =
          locale === 'ko'
            ? `브랜드 에셋이 준비되었습니다: ${data.projectName}`
            : `Your brand assets are ready: ${data.projectName}`
        emailElement = ProjectCompleteEmail({
          userName: data.userName,
          projectName: data.projectName,
          assetsGenerated: data.assetsGenerated,
          locale,
        })
        break

      default:
        return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 })
    }

    const result = await sendEmail({
      to,
      subject,
      react: emailElement,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: result.id })
  } catch (error) {
    console.error('[Email API] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
