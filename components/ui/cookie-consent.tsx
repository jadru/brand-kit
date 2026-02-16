'use client'

import { useState, useEffect } from 'react'
import { Cookie, Shield, ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

interface CookieConsentProps {
  locale?: 'en' | 'ko'
  privacyPolicyUrl?: string
  onAccept?: () => void
  onDecline?: () => void
}

const content = {
  en: {
    title: 'Cookie Notice',
    message:
      'We use cookies to enhance your experience, analyze site traffic, and for marketing purposes.',
    accept: 'Accept All',
    decline: 'Essential Only',
    learnMore: 'Privacy Policy',
  },
  ko: {
    title: '쿠키 안내',
    message:
      '저희는 사용자 경험 향상, 사이트 트래픽 분석, 마케팅 목적으로 쿠키를 사용합니다.',
    accept: '모두 동의',
    decline: '필수만',
    learnMore: '개인정보처리방침',
  },
}

const COOKIE_CONSENT_KEY = 'brandkit_cookie_consent'
const COOKIE_CONSENT_VERSION = '1'

type ConsentStatus = 'accepted' | 'declined' | null

export function CookieConsent({
  locale = 'en',
  privacyPolicyUrl = '/privacy',
  onAccept,
  onDecline,
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const t = content[locale]

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (storedConsent) {
      try {
        const parsed = JSON.parse(storedConsent)
        if (parsed.version === COOKIE_CONSENT_VERSION) {
          return
        }
      } catch {
        // Invalid stored consent, show banner
      }
    }

    const timer = setTimeout(() => {
      setIsVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleAccept = () => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        status: 'accepted',
        version: COOKIE_CONSENT_VERSION,
        timestamp: new Date().toISOString(),
      })
    )
    setIsAnimating(false)
    setTimeout(() => setIsVisible(false), 400)
    onAccept?.()

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      })
    }
  }

  const handleDecline = () => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        status: 'declined',
        version: COOKIE_CONSENT_VERSION,
        timestamp: new Date().toISOString(),
      })
    )
    setIsAnimating(false)
    setTimeout(() => setIsVisible(false), 400)
    onDecline?.()

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      })
    }
  }

  if (!isVisible) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className={`fixed inset-x-0 bottom-0 z-50 p-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-6 ${
        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/90 shadow-2xl backdrop-blur-xl">
        {/* Gradient accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        {/* Subtle noise texture */}
        <div className="noise pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative z-10 p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Icon with glow */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-accent/20 blur-lg" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-accent/20 bg-gradient-to-br from-accent/10 to-transparent">
                  <Cookie className="h-5 w-5 text-accent-light" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3
                  id="cookie-consent-title"
                  className="font-display text-base font-semibold tracking-tight text-white"
                >
                  {t.title}
                </h3>
                <Shield className="h-3.5 w-3.5 text-accent-light/60" aria-hidden="true" />
              </div>
              <p id="cookie-consent-description" className="text-sm leading-relaxed text-white/50">
                {t.message}{' '}
                <Link
                  href={privacyPolicyUrl}
                  className="group inline-flex items-center gap-0.5 text-accent-light/80 transition-colors hover:text-accent-light"
                >
                  {t.learnMore}
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:flex-col sm:items-stretch lg:flex-row" role="group" aria-label={locale === 'ko' ? '쿠키 설정 선택' : 'Cookie settings options'}>
              <button
                onClick={handleDecline}
                aria-label={locale === 'ko' ? '필수 쿠키만 허용' : 'Accept essential cookies only'}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-white/60 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white/80"
              >
                {t.decline}
              </button>
              <button
                onClick={handleAccept}
                aria-label={locale === 'ko' ? '모든 쿠키 허용' : 'Accept all cookies'}
                className="btn-glow relative rounded-lg bg-accent px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-accent-light hover:shadow-lg active:scale-[0.98]"
              >
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function getCookieConsent(): ConsentStatus {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored)
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null

    return parsed.status as ConsentStatus
  } catch {
    return null
  }
}

export function isAnalyticsAllowed(): boolean {
  return getCookieConsent() === 'accepted'
}

export default CookieConsent
