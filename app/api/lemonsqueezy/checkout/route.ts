import { createClient } from '@/lib/supabase/server'
import { getLemonSqueezy } from '@/lib/lemonsqueezy/client'
import {
  LEMONSQUEEZY_CONFIG,
  getVariantId,
  type BillingInterval,
} from '@/lib/lemonsqueezy/config'
import {
  handleApiError,
  UnauthorizedError,
  NotFoundError,
  PaymentError,
} from '@/lib/utils/errors'
import {
  checkRateLimit,
  getClientIdentifier,
  rateLimitExceededResponse,
  RATE_LIMITS,
} from '@/lib/security'
import type { User } from '@/types/database'

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(`checkout:${clientId}`, RATE_LIMITS.auth)
    if (!rateLimitResult.success) {
      return rateLimitExceededResponse(rateLimitResult.resetAt)
    }
    const body = await request.json().catch(() => ({}))
    const interval: BillingInterval = body.interval === 'year' ? 'year' : 'month'

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new UnauthorizedError()
    }

    const { data: userData } = await supabase
      .from('users')
      .select('email')
      .eq('id', user.id)
      .single()

    if (!userData) {
      throw new NotFoundError('사용자')
    }

    const typedUser = userData as Pick<User, 'email'>
    const { createCheckout } = getLemonSqueezy()

    const { data: checkout, error } = await createCheckout(
      LEMONSQUEEZY_CONFIG.storeId,
      getVariantId(interval),
      {
        checkoutData: {
          email: typedUser.email,
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

    if (error || !checkout) {
      throw new PaymentError('checkout')
    }

    return Response.json({ url: checkout.data.attributes.url })
  } catch (error) {
    return handleApiError(error)
  }
}
