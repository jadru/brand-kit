'use client'

import { useState } from 'react'
import { Lock, Sparkles, ArrowRight, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnalyticsEvents, trackEvent } from '@/lib/analytics/events'
import type { Plan } from '@/types/database'
import { PLAN_PRICING, type BillingInterval } from '@/lib/lemonsqueezy/config'

interface PlanGateProps {
  feature: string
  currentPlan: Plan
  requiredPlan: Plan
  children: React.ReactNode
  fallback?: React.ReactNode
  /** 기능에 대한 가치 설명 (예: "무제한으로 생성", "팀과 협업") */
  valueProposition?: string
}

const PLAN_RANK: Record<Plan, number> = { free: 0, pro: 1 }

const FEATURE_BENEFITS: Record<string, string[]> = {
  'AI Icon Generation': [
    'benefits.aiIcon.unique',
    'benefits.aiIcon.fourOptions',
    'benefits.aiIcon.commercial',
  ],
  'Additional brand profiles': [
    'benefits.brandProfiles.five',
    'benefits.brandProfiles.perProject',
    'benefits.brandProfiles.allPresets',
  ],
  'default': [
    'benefits.default.unlimited',
    'benefits.default.allPresets',
    'benefits.default.priority',
  ],
}

export function PlanGate({
  feature,
  currentPlan,
  requiredPlan,
  children,
  fallback,
  valueProposition,
}: PlanGateProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month')
  const t = useTranslations('planGate')

  if (PLAN_RANK[currentPlan] >= PLAN_RANK[requiredPlan]) {
    return <>{children}</>
  }

  if (fallback) return <>{fallback}</>

  const benefitKeys = FEATURE_BENEFITS[feature] || FEATURE_BENEFITS['default']
  const isYearly = billingInterval === 'year'
  const displayPrice = isYearly
    ? `$${PLAN_PRICING.pro.yearly.monthlyEquivalent}`
    : `$${PLAN_PRICING.pro.monthly.price}`

  const handleUpgrade = async () => {
    setIsLoading(true)
    const source = `plan_gate:${feature}`
    trackEvent(AnalyticsEvents.UPGRADE_CLICK, { source })
    trackEvent(AnalyticsEvents.CHECKOUT_START, { plan: 'pro', source })

    try {
      const response = await fetch('/api/lemonsqueezy/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval: billingInterval }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-br from-surface via-surface to-accent/5 p-6 text-center shadow-lg">
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative flex flex-col items-center gap-4">
        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 ring-4 ring-accent/5">
          <Lock className="h-6 w-6 text-accent" />
        </div>

        {/* Badge */}
        <Badge variant="pro" className="px-3 py-1">
          <Sparkles className="mr-1 h-3 w-3" />
          PRO
        </Badge>

        {/* Feature name */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{feature}</h3>
          {valueProposition && (
            <p className="mt-1 text-sm text-text-secondary">{valueProposition}</p>
          )}
        </div>

        {/* Benefits list */}
        <ul className="mt-2 space-y-2 text-left">
          {benefitKeys.map((key, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-text-secondary">
              <Zap className="h-4 w-4 shrink-0 text-accent" />
              {t(key)}
            </li>
          ))}
        </ul>

        {/* Billing toggle */}
        <div className="mt-3 flex rounded-full bg-surface-secondary p-1 text-xs">
          <button
            onClick={() => setBillingInterval('month')}
            className={`rounded-full px-3 py-1 transition-all ${
              !isYearly ? 'bg-surface text-text-primary shadow-sm' : 'text-text-tertiary'
            }`}
          >
            {t('monthly')}
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`rounded-full px-3 py-1 transition-all ${
              isYearly ? 'bg-surface text-text-primary shadow-sm' : 'text-text-tertiary'
            }`}
          >
            {t('yearly')} <span className="text-accent">{t('yearlyDiscount')}</span>
          </button>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-text-primary">{displayPrice}</span>
          <span className="text-sm text-text-tertiary">{t('perMonth')}</span>
        </div>

        {isYearly && (
          <p className="text-xs text-accent">
            {t('billedYearly', { price: PLAN_PRICING.pro.yearly.price, savings: PLAN_PRICING.pro.yearly.savings })}
          </p>
        )}

        {/* CTA Button */}
        <Button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="group mt-2 w-full bg-accent hover:bg-accent/90"
        >
          {isLoading ? (
            t('processing')
          ) : (
            <>
              {t('upgrade')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>

        {/* Trust signal */}
        <p className="text-xs text-text-tertiary">{t('trust')}</p>
      </div>
    </div>
  )
}
