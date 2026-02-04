'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PLAN_LIMITS, type User, type Plan } from '@/types/database'

interface UsageOverviewProps {
  user: User
}

interface UsageItemProps {
  label: string
  used: number
  limit: number
  locked?: boolean
}

function UsageItem({ label, used, limit, locked }: UsageItemProps) {
  const isUnlimited = !isFinite(limit)
  const percentage = isUnlimited ? 0 : limit > 0 ? (used / limit) * 100 : 0
  const barColor =
    percentage > 90 ? 'bg-status-error' : percentage > 70 ? 'bg-status-warning' : 'bg-brand'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-primary">
          {locked ? (
            <span className="text-text-tertiary">Pro 전용</span>
          ) : isUnlimited ? (
            `${used} / 무제한`
          ) : (
            `${used} / ${limit}`
          )}
        </span>
      </div>
      {!locked && (
        <div className="h-2 w-full rounded-full bg-surface-secondary">
          <div
            className={`h-2 rounded-full transition-all ${barColor}`}
            style={{ width: `${isUnlimited ? 0 : Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

export function UsageOverview({ user }: UsageOverviewProps) {
  const plan = user.plan as Plan
  const limits = PLAN_LIMITS[plan]

  const resetDate = user.usage_reset_at
    ? new Date(user.usage_reset_at).toLocaleDateString('ko-KR')
    : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">이번 달 사용량</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <UsageItem
          label="프로젝트"
          used={user.projects_used_this_month}
          limit={limits.projects_per_month}
        />
        <UsageItem
          label="AI 헤드라인"
          used={user.ai_headlines_used_this_month}
          limit={limits.ai_headlines_per_month}
        />
        <UsageItem
          label="AI 아이콘"
          used={user.ai_icons_used_this_month}
          limit={limits.ai_icons_per_month}
          locked={plan === 'free'}
        />
        {resetDate && (
          <p className="pt-2 text-xs text-text-tertiary">
            사용량 리셋: {resetDate}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
