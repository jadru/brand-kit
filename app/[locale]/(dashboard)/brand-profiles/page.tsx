import { createClient } from '@/lib/supabase/server'
import type { Plan } from '@/types/database'
import { BrandProfilesClient } from './client'

export default async function BrandProfilesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profiles }, { data: userData }] = await Promise.all([
    supabase.from('brand_profiles').select('*')
      .eq('user_id', user!.id).order('created_at', { ascending: false }),
    supabase.from('users').select('plan').eq('id', user!.id).single(),
  ])

  return (
    <BrandProfilesClient
      initialProfiles={profiles ?? []}
      plan={(userData?.plan ?? 'free') as Plan}
    />
  )
}
