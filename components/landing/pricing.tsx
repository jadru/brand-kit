'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { PLAN_PRICING, type BillingInterval } from '@/lib/lemonsqueezy/config'

const planKeys = ['free', 'pro'] as const

export function Pricing() {
  const t = useTranslations('landing.pricing')
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month')

  const isYearly = billingInterval === 'year'
  const yearlyPricing = PLAN_PRICING.pro.yearly

  return (
    <section id="pricing" className="relative px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section header - centered */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-in-up mb-4 font-mono text-xs tracking-[0.2em] text-accent uppercase">
            {t('sectionLabel')}
          </div>
          <h2 className="animate-fade-in-up delay-1 font-display text-3xl font-bold tracking-headline text-text-primary sm:text-4xl lg:text-5xl">
            {t('headline')}{' '}
            <span className="text-text-tertiary">{t('headlineSub')}</span>
          </h2>
          <p className="animate-fade-in-up delay-2 mx-auto mt-4 max-w-lg text-text-secondary">
            {t('description')}
          </p>
        </div>

        {/* Billing interval toggle */}
        <div className="animate-fade-in-up delay-3 mt-10 flex justify-center">
          <div className="relative flex rounded-full bg-surface-secondary p-1 border border-border">
            <button
              onClick={() => setBillingInterval('month')}
              className={`relative z-10 rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 ${
                !isYearly
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t('monthly')}
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`relative z-10 rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 ${
                isYearly
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t('yearly')}
            </button>
            {/* Savings badge */}
            <span className="absolute -right-2 -top-2 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <Sparkles className="h-3 w-3" />
              {t('save')} {yearlyPricing.discountPercent}%
            </span>
          </div>
        </div>

        <div className="mt-12 mx-auto grid gap-6 md:grid-cols-2 md:max-w-4xl">
          {planKeys.map((planKey) => {
            const isPopular = planKey === 'pro'
            const features = t.raw(`${planKey}.features`) as string[]

            // Pro 플랜의 가격은 토글에 따라 변경
            const displayPrice = planKey === 'pro'
              ? isYearly
                ? `$${yearlyPricing.monthlyEquivalent}`
                : `$${PLAN_PRICING.pro.monthly.price}`
              : t(`${planKey}.price`)

            const displayInterval = planKey === 'pro'
              ? t('perMonth')
              : t(`${planKey}.interval`)

            return (
              <div
                key={planKey}
                className={`animate-fade-in-up relative overflow-hidden rounded-2xl border p-8 transition-all duration-200 lg:p-10 ${
                  isPopular
                    ? 'border-accent/50 bg-brand text-brand-foreground shadow-xl glow-ring'
                    : 'border-border bg-surface hover:border-border-hover hover:shadow-md'
                }`}
              >
                {/* Pro card subtle gradient overlay */}
                {isPopular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
                )}

                {isPopular && (
                  <span className="absolute -top-px left-8 inline-flex items-center rounded-b-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                    {t(`${planKey}.badge`)}
                  </span>
                )}

                <div className="relative flex items-baseline gap-2">
                  <h3 className={`font-display text-xl font-semibold ${isPopular ? 'text-white' : 'text-text-primary'}`}>
                    {t(`${planKey}.name`)}
                  </h3>
                </div>

                <p className={`relative mt-2 text-sm ${isPopular ? 'text-white/60' : 'text-text-secondary'}`}>
                  {t(`${planKey}.description`)}
                </p>

                <div className="relative mt-6 flex items-baseline">
                  <span className={`font-display text-5xl font-bold tracking-tighter ${isPopular ? 'text-white' : 'text-text-primary'}`}>
                    {displayPrice}
                  </span>
                  <span className={`ml-2 text-sm ${isPopular ? 'text-white/50' : 'text-text-tertiary'}`}>
                    /{displayInterval}
                  </span>
                </div>

                {/* Yearly billing note for Pro */}
                {isPopular && isYearly && (
                  <p className="relative mt-2 text-xs text-white/50">
                    {t('billedYearly', { total: yearlyPricing.price, savings: yearlyPricing.savings })}
                  </p>
                )}

                <div className={`relative my-8 h-px ${isPopular ? 'bg-white/10' : 'bg-border'}`} />

                <ul className="relative space-y-3">
                  {features.map((feature, idx) => (
                    <li key={idx} className={`flex items-center gap-3 text-sm ${isPopular ? 'text-white/80' : 'text-text-secondary'}`}>
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        isPopular ? 'bg-accent/20 text-accent-light' : 'bg-accent/10 text-accent'
                      }`}>
                        <Check className="h-3 w-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={planKey === 'pro' ? `/signup?interval=${billingInterval}` : '/signup'}
                  className={`group relative mt-8 flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                    isPopular
                      ? 'btn-glow bg-white text-brand shadow-sm hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                      : 'border border-border bg-surface text-text-primary hover:bg-surface-secondary active:scale-[0.98]'
                  }`}
                >
                  {t(`${planKey}.cta`)}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
