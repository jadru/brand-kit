'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { getBaseUrl } from '@/lib/utils/url'

async function getOrigin(): Promise<string> {
  const headerStore = await headers()
  return headerStore.get('origin') || getBaseUrl()
}

export async function sendResetEmail({ email }: { email: string }) {
  const supabase = await createClient()
  const origin = await getOrigin()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/projects`,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}
