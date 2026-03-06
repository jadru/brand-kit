'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlanCard } from '@/components/billing/plan-card'
import { UsageOverview } from '@/components/billing/usage-overview'
import { AnalyticsEvents, trackEvent } from '@/lib/analytics/events'
import type { User, Plan } from '@/types/database'

interface BillingClientProps {
  user: User
}

export function BillingClient({ user }: BillingClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isManaging, setIsManaging] = useState(false)
  const tBilling = useTranslations('settings.billing')
  const plan = user.plan as Plan
  const currentPlanLabel = plan === 'pro' ? tBilling('planPro') : tBilling('planFree')

  async function handleUpgrade() {
    if (isLoading) return
    setIsLoading(true)
    trackEvent(AnalyticsEvents.UPGRADE_CLICK, { source: 'settings_billing' })
    trackEvent(AnalyticsEvents.CHECKOUT_START, { plan: 'pro', source: 'settings_billing' })
    try {
      const res = await fetch('/api/lemonsqueezy/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleManageSubscription() {
    if (isManaging) return
    setIsManaging(true)
    try {
      const res = await fetch('/api/lemonsqueezy/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.open(data.url, '_blank')
      }
    } finally {
      setIsManaging(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{tBilling('title')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{tBilling('subtitle')}</p>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">{tBilling('currentPlan')}</span>
            <Badge variant={plan === 'pro' ? 'pro' : 'secondary'}>
              {currentPlanLabel}
            </Badge>
          </div>
        </div>
        {plan === 'pro' && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleManageSubscription}
            isLoading={isManaging}
            disabled={isManaging}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {tBilling('manage')}
          </Button>
        )}
      </div>

      <UsageOverview user={user} />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">{tBilling('planComparison')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <PlanCard
            plan="free"
            currentPlan={plan}
            onSubscribe={() => {}}
          />
          <PlanCard
            plan="pro"
            currentPlan={plan}
            onSubscribe={handleUpgrade}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
