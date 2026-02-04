import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BillingClient } from './billing-client'
import type { User } from '@/types/database'

export default async function BillingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!userData) redirect('/login')

  return <BillingClient user={userData as unknown as User} />
}
