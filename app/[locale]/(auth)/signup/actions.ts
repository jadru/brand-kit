'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getBaseUrl } from '@/lib/utils/url'

async function getOrigin(): Promise<string> {
  const headerStore = await headers()
  return headerStore.get('origin') || getBaseUrl()
}

export async function signUp({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const supabase = await createClient()
  const origin = await getOrigin()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function signUpWithOAuth(provider: 'google' | 'github') {
  const supabase = await createClient()
  const origin = await getOrigin()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}
