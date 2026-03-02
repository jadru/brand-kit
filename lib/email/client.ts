/**
 * Resend Email Client
 * Server-side email sending utilities
 */

import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY

// Only create client when API key is available
let resendClient: Resend | null = null

function getResendClient(): Resend | null {
  if (!RESEND_API_KEY) {
    return null
  }
  if (!resendClient) {
    resendClient = new Resend(RESEND_API_KEY)
  }
  return resendClient
}

export const EMAIL_FROM = process.env.EMAIL_FROM || 'BrandKit <noreply@brandkit.ai>'

export type EmailTemplate = 'welcome' | 'project-complete' | 'subscription-update'

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  react: React.ReactElement
  replyTo?: string
}

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, react, replyTo }: SendEmailOptions) {
  const client = getResendClient()

  if (!client) {
    console.warn('[Email] Skipped (no API key):', { to, subject })
    return { success: false, error: 'Email not configured' }
  }

  try {
    const { data, error } = await client.emails.send({
      from: EMAIL_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
      replyTo,
    })

    if (error) {
      console.error('[Email] Send error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error('[Email] Unexpected error:', err)
    return { success: false, error: 'Failed to send email' }
  }
}
