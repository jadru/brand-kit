export const LEMONSQUEEZY_CONFIG = {
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  storeId: process.env.LEMONSQUEEZY_STORE_ID!,
  webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
  proMonthlyVariantId: process.env.LEMONSQUEEZY_PRO_VARIANT_ID!,
  proYearlyVariantId: process.env.LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID || process.env.LEMONSQUEEZY_PRO_VARIANT_ID!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''),
  portalBaseUrl: 'https://app.lemonsqueezy.com',
}

export type BillingInterval = 'month' | 'year'

export const PLAN_PRICING = {
  pro: {
    monthly: {
      price: 12,
      currency: 'USD',
      interval: 'month' as const,
    },
    yearly: {
      price: 120, // $144 -> $120 (17% 할인)
      currency: 'USD',
      interval: 'year' as const,
      monthlyEquivalent: 10, // $10/월
      savings: 24, // 연간 $24 절약
      discountPercent: 17,
    },
  },
}

export function getVariantId(interval: BillingInterval): string {
  return interval === 'year'
    ? LEMONSQUEEZY_CONFIG.proYearlyVariantId
    : LEMONSQUEEZY_CONFIG.proMonthlyVariantId
}
