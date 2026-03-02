/**
 * Analytics Event Definitions for CRO tracking
 */

export const AnalyticsEvents = {
  // Landing Page Events
  HERO_CTA_CLICK: 'hero_cta_click',
  PRICING_VIEW: 'pricing_view',
  PRICING_PLAN_SELECT: 'pricing_plan_select',
  FEATURE_VIEW: 'feature_view',
  CTA_SECTION_CLICK: 'cta_section_click',

  // Auth Events
  SIGNUP_START: 'signup_start',
  SIGNUP_METHOD_SELECT: 'signup_method_select',
  SIGNUP_COMPLETE: 'signup_complete',
  LOGIN_START: 'login_start',
  LOGIN_COMPLETE: 'login_complete',
  LOGOUT: 'logout',

  // Onboarding Events
  ONBOARDING_START: 'onboarding_start',
  ONBOARDING_STEP_COMPLETE: 'onboarding_step_complete',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  ONBOARDING_SKIP: 'onboarding_skip',

  // Core Feature Events
  PROJECT_CREATE_START: 'project_create_start',
  PROJECT_CREATE_COMPLETE: 'project_create_complete',
  BRAND_PROFILE_CREATE: 'brand_profile_create',
  ASSET_GENERATE_START: 'asset_generate_start',
  ASSET_GENERATE_COMPLETE: 'asset_generate_complete',
  ASSET_DOWNLOAD: 'asset_download',

  // Conversion Events
  UPGRADE_PROMPT_VIEW: 'upgrade_prompt_view',
  UPGRADE_CLICK: 'upgrade_click',
  CHECKOUT_START: 'checkout_start',
  CHECKOUT_COMPLETE: 'checkout_complete',

  // Engagement Events
  FEEDBACK_SUBMIT: 'feedback_submit',
  NPS_RESPONSE: 'nps_response',
  FEATURE_REQUEST: 'feature_request',
} as const

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents]

export interface AnalyticsEventParams {
  // Landing Page
  [AnalyticsEvents.HERO_CTA_CLICK]: { button_text: string; variant?: string }
  [AnalyticsEvents.PRICING_VIEW]: { locale: string }
  [AnalyticsEvents.PRICING_PLAN_SELECT]: { plan: 'free' | 'pro' }
  [AnalyticsEvents.FEATURE_VIEW]: { feature_name: string }
  [AnalyticsEvents.CTA_SECTION_CLICK]: { section: string }

  // Auth
  [AnalyticsEvents.SIGNUP_START]: { method?: 'email' | 'google' | 'github' }
  [AnalyticsEvents.SIGNUP_METHOD_SELECT]: { method: 'email' | 'google' | 'github' }
  [AnalyticsEvents.SIGNUP_COMPLETE]: { method: 'email' | 'google' | 'github' }
  [AnalyticsEvents.LOGIN_START]: { method?: 'email' | 'google' | 'github' }
  [AnalyticsEvents.LOGIN_COMPLETE]: { method: 'email' | 'google' | 'github' }
  [AnalyticsEvents.LOGOUT]: Record<string, never>

  // Onboarding
  [AnalyticsEvents.ONBOARDING_START]: Record<string, never>
  [AnalyticsEvents.ONBOARDING_STEP_COMPLETE]: { step: number; step_name: string }
  [AnalyticsEvents.ONBOARDING_COMPLETE]: { total_steps: number }
  [AnalyticsEvents.ONBOARDING_SKIP]: { skipped_at_step: number }

  // Core Features
  [AnalyticsEvents.PROJECT_CREATE_START]: Record<string, never>
  [AnalyticsEvents.PROJECT_CREATE_COMPLETE]: { platform: string }
  [AnalyticsEvents.BRAND_PROFILE_CREATE]: Record<string, never>
  [AnalyticsEvents.ASSET_GENERATE_START]: { asset_types: string[] }
  [AnalyticsEvents.ASSET_GENERATE_COMPLETE]: { asset_count: number; duration_ms: number }
  [AnalyticsEvents.ASSET_DOWNLOAD]: { project_id: string; format: 'zip' }

  // Conversion
  [AnalyticsEvents.UPGRADE_PROMPT_VIEW]: { trigger: string }
  [AnalyticsEvents.UPGRADE_CLICK]: { source: string }
  [AnalyticsEvents.CHECKOUT_START]: { plan: 'pro' }
  [AnalyticsEvents.CHECKOUT_COMPLETE]: { plan: 'pro'; price: number }

  // Engagement
  [AnalyticsEvents.FEEDBACK_SUBMIT]: { type: 'bug' | 'feature' | 'general' }
  [AnalyticsEvents.NPS_RESPONSE]: { score: number }
  [AnalyticsEvents.FEATURE_REQUEST]: { feature: string }
}

/**
 * Type-safe analytics tracking function placeholder
 * Will be implemented with actual analytics provider (GA4, etc.) in Phase 5
 */
export function trackEvent<T extends AnalyticsEventName>(
  event: T,
  params: T extends keyof AnalyticsEventParams ? AnalyticsEventParams[T] : never
): void {
  // Placeholder - will be implemented with GA4 in Phase 5
  if (process.env.NODE_ENV === 'development') {
    console.warn('[Analytics]', event, params)
  }

  // TODO: Implement actual tracking in Phase 5
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', event, params)
  // }
}
