import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLemonSqueezy } from '@/lib/lemonsqueezy/client'
import { LEMONSQUEEZY_CONFIG } from '@/lib/lemonsqueezy/config'

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

  if (!userData) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const row = userData as Record<string, unknown>
  const email = row.email as string

  const { createCheckout } = getLemonSqueezy()

  const { data: checkout, error } = await createCheckout(
    LEMONSQUEEZY_CONFIG.storeId,
    LEMONSQUEEZY_CONFIG.proVariantId,
    {
      checkoutData: {
        email,
        custom: {
          user_id: user.id,
        },
      },
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
      },
      productOptions: {
        redirectUrl: `${LEMONSQUEEZY_CONFIG.appUrl}/settings/billing?success=true`,
      },
      testMode: process.env.NODE_ENV === 'development',
    }
  )

  if (error) {
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }

  return NextResponse.json({ url: checkout?.data.attributes.url })
}
