'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Plan } from '@/types/database'

interface PlanGateProps {
  feature: string
  currentPlan: Plan
  requiredPlan: Plan
  children: React.ReactNode
  fallback?: React.ReactNode
}

const PLAN_RANK: Record<Plan, number> = { free: 0, pro: 1 }

export function PlanGate({ feature, currentPlan, requiredPlan, children, fallback }: PlanGateProps) {
  if (PLAN_RANK[currentPlan] >= PLAN_RANK[requiredPlan]) {
    return <>{children}</>
  }

  if (fallback) return <>{fallback}</>

  return (
    <div className="relative rounded-lg border border-border bg-surface-secondary p-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
          <Lock className="h-5 w-5 text-text-tertiary" />
        </div>
        <Badge variant="pro">PRO</Badge>
        <p className="text-sm text-text-secondary">
          <span className="font-medium">{feature}</span> requires a Pro plan
        </p>
        <Link href="/settings">
          <Button size="sm">Upgrade to Pro</Button>
        </Link>
      </div>
    </div>
  )
}
