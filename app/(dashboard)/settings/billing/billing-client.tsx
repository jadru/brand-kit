'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlanCard } from '@/components/billing/plan-card'
import { UsageOverview } from '@/components/billing/usage-overview'
import type { User, Plan } from '@/types/database'

interface BillingClientProps {
  user: User
}

export function BillingClient({ user }: BillingClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const plan = user.plan as Plan

  async function handleUpgrade() {
    setIsLoading(true)
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
    const res = await fetch('/api/lemonsqueezy/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.open(data.url, '_blank')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">빌링</h1>
        <p className="mt-1 text-sm text-text-secondary">
          플랜 관리 및 사용량을 확인하세요.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">현재 플랜:</span>
            <Badge variant={plan === 'pro' ? 'pro' : 'secondary'}>
              {plan === 'pro' ? 'Pro' : 'Free'}
            </Badge>
          </div>
        </div>
        {plan === 'pro' && (
          <Button variant="outline" size="sm" onClick={handleManageSubscription}>
            <ExternalLink className="mr-2 h-4 w-4" />
            구독 관리
          </Button>
        )}
      </div>

      <UsageOverview user={user} />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">플랜 비교</h2>
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
