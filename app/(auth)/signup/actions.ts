'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signUp({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const supabase = await createClient()
  const headerStore = await headers()
  const origin = headerStore.get('origin') || 'http://localhost:3000'

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
  const headerStore = await headers()
  const origin = headerStore.get('origin') || 'http://localhost:3000'

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
