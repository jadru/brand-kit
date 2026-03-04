/**
 * Analytics Event Definitions for CRO tracking
 */
import { trackEvent as trackGtagEvent } from './gtag'

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
  [AnalyticsEvents.CHECKOUT_START]: { plan: 'pro'; source?: string }
  [AnalyticsEvents.CHECKOUT_COMPLETE]: { plan: 'pro'; price: number }

  // Engagement
  [AnalyticsEvents.FEEDBACK_SUBMIT]: { type: 'bug' | 'feature' | 'general' }
  [AnalyticsEvents.NPS_RESPONSE]: { score: number }
  [AnalyticsEvents.FEATURE_REQUEST]: { feature: string }
}

function sanitizeParams(input: Record<string, unknown>) {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      result[key] = value
    }
  }

  return result
}

export function trackEvent<T extends AnalyticsEventName>(
  event: T,
  params: T extends keyof AnalyticsEventParams ? AnalyticsEventParams[T] : never
): void {
  const payload = sanitizeParams((params ?? {}) as Record<string, unknown>)

  // Development logs help verify instrumentation quickly.
  if (process.env.NODE_ENV === 'development') {
    console.warn('[Analytics]', event, payload)
  }

  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return

  trackGtagEvent(event, payload)
}
