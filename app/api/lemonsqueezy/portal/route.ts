import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const row = userData as Record<string, unknown> | null
  const customerId = row?.lemonsqueezy_customer_id as string | null

  if (!customerId) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
  }

  const portalUrl = `https://app.lemonsqueezy.com/my-orders?customer_id=${customerId}`

  return NextResponse.json({ url: portalUrl })
}
