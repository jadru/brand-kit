import { createClient } from '@/lib/supabase/server'
import { LEMONSQUEEZY_CONFIG } from '@/lib/lemonsqueezy/config'
import {
  handleApiError,
  UnauthorizedError,
  NoSubscriptionError,
} from '@/lib/utils/errors'
import type { User } from '@/types/database'

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new UnauthorizedError()
    }

    const { data: userData } = await supabase
      .from('users')
      .select('lemonsqueezy_customer_id')
      .eq('id', user.id)
      .single()

    const typedUser = userData as Pick<User, 'lemonsqueezy_customer_id'> | null
    if (!typedUser?.lemonsqueezy_customer_id) {
      throw new NoSubscriptionError()
    }

    const portalUrl = `${LEMONSQUEEZY_CONFIG.portalBaseUrl}/my-orders?customer_id=${typedUser.lemonsqueezy_customer_id}`

    return Response.json({ url: portalUrl })
  } catch (error) {
    return handleApiError(error)
  }
}
