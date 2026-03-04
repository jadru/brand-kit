import { afterEach, describe, expect, it, vi } from 'vitest'
import { AnalyticsEvents, trackEvent } from '@/lib/analytics/events'

afterEach(() => {
  Reflect.deleteProperty(globalThis, 'window')
})

describe('analytics events', () => {
  it('does not throw when window is unavailable', () => {
    expect(() => {
      trackEvent(AnalyticsEvents.SIGNUP_START, { method: 'email' })
    }).not.toThrow()
  })

  it('sends event to gtag when available', () => {
    const gtag = vi.fn()
    Object.defineProperty(globalThis, 'window', {
      value: { gtag },
      configurable: true,
      writable: true,
    })

    trackEvent(AnalyticsEvents.PROJECT_CREATE_COMPLETE, { platform: 'web' })

    expect(gtag).toHaveBeenCalledWith(
      'event',
      AnalyticsEvents.PROJECT_CREATE_COMPLETE,
      expect.objectContaining({ platform: 'web' }),
    )
  })

  it('strips undefined values from payload', () => {
    const gtag = vi.fn()
    Object.defineProperty(globalThis, 'window', {
      value: { gtag },
      configurable: true,
      writable: true,
    })

    trackEvent(AnalyticsEvents.CHECKOUT_START, { plan: 'pro', source: undefined })

    const call = gtag.mock.calls.at(-1)
    const payload = call?.[2] as Record<string, unknown>
    expect(payload.plan).toBe('pro')
    expect(payload.source).toBeUndefined()
  })
})
