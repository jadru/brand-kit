/**
 * Web Vitals reporting utilities
 * Integrates with Next.js built-in web-vitals support
 */

import type { Metric } from 'web-vitals'

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals'

function getConnectionSpeed(): string {
  if (typeof navigator === 'undefined') return ''
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string }
  }
  return nav.connection?.effectiveType || ''
}

/**
 * Send web vitals to analytics endpoint
 */
export function sendToAnalytics(metric: Metric, options?: { debug?: boolean }) {
  const analyticsId = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID

  if (!analyticsId) {
    if (options?.debug) {
      console.log('[Web Vitals]', metric.name, metric.value)
    }
    return
  }

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  }

  const blob = new Blob([new URLSearchParams(body as Record<string, string>).toString()], {
    type: 'application/x-www-form-urlencoded',
  })

  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob)
  } else {
    fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    })
  }
}

/**
 * Web Vitals thresholds for good/needs-improvement/poor
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
} as const

/**
 * Get rating for a web vital metric
 */
export function getMetricRating(
  name: keyof typeof WEB_VITALS_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = WEB_VITALS_THRESHOLDS[name]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}
