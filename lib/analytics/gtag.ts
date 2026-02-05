/**
 * Google Analytics 4 tracking utilities
 */

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js' | 'consent',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/**
 * Track a page view
 */
export function pageview(url: string) {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

/**
 * Track a custom event
 */
export function trackEvent(
  action: string,
  params?: {
    category?: string
    label?: string
    value?: number
    [key: string]: unknown
  }
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: params?.category,
      event_label: params?.label,
      value: params?.value,
      ...params,
    })
  }
}

/**
 * Track conversion events
 */
export function trackConversion(conversionLabel: string, value?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionLabel,
      value: value,
    })
  }
}
