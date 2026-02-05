import crypto from 'crypto'
import { LEMONSQUEEZY_CONFIG } from '@/lib/lemonsqueezy/config'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import type {
  LemonSqueezyWebhookPayload,
  LemonSqueezySubscriptionData,
  LemonSqueezyEventName,
} from '@/types/lemonsqueezy'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('X-Signature')

  if (!signature) {
    return new Response('Missing signature', { status: 401 })
  }

  const hmac = crypto.createHmac('sha256', LEMONSQUEEZY_CONFIG.webhookSecret)
  const digest = hmac.update(body).digest('hex')

  if (digest !== signature) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(body) as LemonSqueezyWebhookPayload
  const eventName: LemonSqueezyEventName = event.meta.event_name
  const data: LemonSqueezySubscriptionData = event.data

  console.log('LemonSqueezy Webhook:', eventName, data.id)

  try {
    switch (eventName) {
      case 'subscription_created':
        await handleSubscriptionCreated(data)
        break
      case 'subscription_updated':
        await handleSubscriptionUpdated(data)
        break
      case 'subscription_cancelled':
      case 'subscription_expired':
        await handleSubscriptionCancelled(data)
        break
      case 'subscription_resumed':
        await handleSubscriptionResumed(data)
        break
      case 'subscription_payment_failed':
        await handlePaymentFailed(data)
        break
      default:
        console.log('Unhandled event:', eventName)
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Internal error', { status: 500 })
  }
}

async function handleSubscriptionCreated(data: LemonSqueezySubscriptionData) {
  const userId = data.attributes.custom_data?.user_id
  if (!userId) throw new Error('Missing user_id in custom_data')

  const customerId = data.attributes.customer_id.toString()
  const subscriptionId = data.id.toString()

  const supabaseAdmin = getSupabaseAdmin()

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('id', userId)
    .single()

  if (!user) {
    console.warn(`User ${userId} not found, skipping subscription creation`)
    return
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update({
      plan: 'pro',
      lemonsqueezy_customer_id: customerId,
      lemonsqueezy_subscription_id: subscriptionId,
    })
    .eq('id', userId)

  if (error) throw new Error(`Failed to update user plan: ${error.message}`)

  console.log('Subscription created:', userId, subscriptionId)
}

async function handleSubscriptionUpdated(data: LemonSqueezySubscriptionData) {
  const subscriptionId = data.id.toString()
  const status = data.attributes.status

  const supabaseAdmin = getSupabaseAdmin()

  if (status === 'active') {
    const { error } = await supabaseAdmin
      .from('users')
      .update({ plan: 'pro' })
      .eq('lemonsqueezy_subscription_id', subscriptionId)
    if (error) throw new Error(`Failed to update subscription: ${error.message}`)
  } else if (status === 'cancelled' || status === 'expired') {
    const { error } = await supabaseAdmin
      .from('users')
      .update({ plan: 'free' })
      .eq('lemonsqueezy_subscription_id', subscriptionId)
    if (error) throw new Error(`Failed to update subscription: ${error.message}`)
  }

  console.log('Subscription updated:', subscriptionId, status)
}

async function handleSubscriptionCancelled(data: LemonSqueezySubscriptionData) {
  const subscriptionId = data.id.toString()

  const supabaseAdmin = getSupabaseAdmin()
  const { error } = await supabaseAdmin
    .from('users')
    .update({ plan: 'free' })
    .eq('lemonsqueezy_subscription_id', subscriptionId)

  if (error) throw new Error(`Failed to cancel subscription: ${error.message}`)

  console.log('Subscription cancelled:', subscriptionId)
}

async function handleSubscriptionResumed(data: LemonSqueezySubscriptionData) {
  const subscriptionId = data.id.toString()

  const supabaseAdmin = getSupabaseAdmin()
  const { error } = await supabaseAdmin
    .from('users')
    .update({ plan: 'pro' })
    .eq('lemonsqueezy_subscription_id', subscriptionId)

  if (error) throw new Error(`Failed to resume subscription: ${error.message}`)

  console.log('Subscription resumed:', subscriptionId)
}

async function handlePaymentFailed(data: LemonSqueezySubscriptionData) {
  const subscriptionId = data.id.toString()
  console.warn('Payment failed:', subscriptionId)
}
