export const LEMONSQUEEZY_CONFIG = {
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  storeId: process.env.LEMONSQUEEZY_STORE_ID!,
  webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
  proVariantId: process.env.LEMONSQUEEZY_PRO_VARIANT_ID!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}

export const PLAN_PRICING = {
  pro: {
    price: 12,
    currency: 'USD',
    interval: 'month' as const,
  },
}
