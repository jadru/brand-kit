/**
 * LemonSqueezy Webhook 타입 정의
 * @see https://docs.lemonsqueezy.com/api/webhooks
 */

/**
 * 웹훅 이벤트 이름
 */
export type LemonSqueezyEventName =
  | 'subscription_created'
  | 'subscription_updated'
  | 'subscription_cancelled'
  | 'subscription_expired'
  | 'subscription_resumed'
  | 'subscription_payment_failed'
  | 'subscription_payment_success'
  | 'subscription_payment_recovered'
  | 'order_created'
  | 'order_refunded'
  | 'license_key_created'
  | 'license_key_updated'

/**
 * 구독 상태
 */
export type LemonSqueezySubscriptionStatus =
  | 'on_trial'
  | 'active'
  | 'paused'
  | 'past_due'
  | 'unpaid'
  | 'cancelled'
  | 'expired'

/**
 * 웹훅 이벤트 메타데이터
 */
export interface LemonSqueezyWebhookMeta {
  event_name: LemonSqueezyEventName
  custom_data?: {
    user_id?: string
    [key: string]: unknown
  }
  webhook_id?: string
}

/**
 * 구독 속성
 */
export interface LemonSqueezySubscriptionAttributes {
  store_id: number
  customer_id: number
  order_id: number
  order_item_id: number
  product_id: number
  variant_id: number
  product_name: string
  variant_name: string
  user_name: string
  user_email: string
  status: LemonSqueezySubscriptionStatus
  status_formatted: string
  card_brand: string | null
  card_last_four: string | null
  pause: null | {
    mode: string
    resumes_at: string | null
  }
  cancelled: boolean
  trial_ends_at: string | null
  billing_anchor: number
  first_subscription_item: {
    id: number
    subscription_id: number
    price_id: number
    quantity: number
    is_usage_based: boolean
    created_at: string
    updated_at: string
  } | null
  urls: {
    update_payment_method: string
    customer_portal: string
    customer_portal_update_subscription: string
  }
  renews_at: string | null
  ends_at: string | null
  created_at: string
  updated_at: string
  test_mode: boolean
  custom_data?: {
    user_id?: string
    [key: string]: unknown
  }
}

/**
 * 구독 데이터
 */
export interface LemonSqueezySubscriptionData {
  type: 'subscriptions'
  id: string
  attributes: LemonSqueezySubscriptionAttributes
  relationships?: {
    store: { data: { type: string; id: string } }
    customer: { data: { type: string; id: string } }
    order: { data: { type: string; id: string } }
    'order-item': { data: { type: string; id: string } }
    product: { data: { type: string; id: string } }
    variant: { data: { type: string; id: string } }
  }
}

/**
 * LemonSqueezy 웹훅 페이로드
 */
export interface LemonSqueezyWebhookPayload {
  meta: LemonSqueezyWebhookMeta
  data: LemonSqueezySubscriptionData
}

/**
 * 웹훅 핸들러 함수 타입
 */
export type LemonSqueezyWebhookHandler = (
  data: LemonSqueezySubscriptionData
) => Promise<void>
