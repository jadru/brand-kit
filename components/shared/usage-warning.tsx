'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { AlertTriangle, X, TrendingUp, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Plan } from '@/types/database'
import { PLAN_LIMITS } from '@/types/database'

type UsageType = 'projects' | 'ai_headlines' | 'ai_icons'

interface UsageWarningProps {
  usageType: UsageType
  current: number
  plan: Plan
  /** 닫기 버튼 표시 여부 */
  dismissible?: boolean
  /** 컴팩트 모드 (인라인 표시용) */
  compact?: boolean
}

const USAGE_LABELS: Record<UsageType, { ko: string; en: string }> = {
  projects: { ko: '프로젝트', en: 'projects' },
  ai_headlines: { ko: 'AI 헤드라인', en: 'AI headlines' },
  ai_icons: { ko: 'AI 아이콘', en: 'AI icons' },
}

const LIMIT_KEYS: Record<UsageType, keyof typeof PLAN_LIMITS.free> = {
  projects: 'projects_per_month',
  ai_headlines: 'ai_headlines_per_month',
  ai_icons: 'ai_icons_per_month',
}

export function UsageWarning({
  usageType,
  current,
  plan,
  dismissible = true,
  compact = false,
}: UsageWarningProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  const limit = PLAN_LIMITS[plan][LIMIT_KEYS[usageType]] as number
  const percentage = limit === Infinity ? 0 : Math.round((current / limit) * 100)
  const label = USAGE_LABELS[usageType].ko

  // 무제한이거나 70% 미만이면 표시 안 함
  if (limit === Infinity || percentage < 70 || isDismissed) {
    return null
  }

  const isWarning = percentage >= 90
  const isExceeded = percentage >= 100

  // 상태에 따른 스타일
  const bgColor = isExceeded
    ? 'bg-red-500/10 border-red-500/30'
    : isWarning
      ? 'bg-amber-500/10 border-amber-500/30'
      : 'bg-blue-500/10 border-blue-500/30'

  const textColor = isExceeded
    ? 'text-red-600 dark:text-red-400'
    : isWarning
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-blue-600 dark:text-blue-400'

  const iconColor = isExceeded
    ? 'text-red-500'
    : isWarning
      ? 'text-amber-500'
      : 'text-blue-500'

  const progressColor = isExceeded
    ? 'bg-red-500'
    : isWarning
      ? 'bg-amber-500'
      : 'bg-blue-500'

  if (compact) {
    return (
      <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${bgColor} border`}>
        <AlertTriangle className={`h-3.5 w-3.5 ${iconColor}`} />
        <span className={textColor}>
          {label} {current}/{limit} ({percentage}%)
        </span>
        {isExceeded ? (
          <Link href="/settings/billing" className="ml-auto font-medium text-accent hover:underline">
            업그레이드
          </Link>
        ) : (
          <span className="ml-auto text-text-tertiary">{limit - current}개 남음</span>
        )}
      </div>
    )
  }

  return (
    <div className={`relative rounded-xl border p-4 ${bgColor}`}>
      {dismissible && !isExceeded && (
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-3 top-3 rounded-full p-1 text-text-tertiary hover:bg-surface hover:text-text-secondary"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bgColor}`}>
          {isExceeded ? (
            <AlertTriangle className={`h-5 w-5 ${iconColor}`} />
          ) : (
            <TrendingUp className={`h-5 w-5 ${iconColor}`} />
          )}
        </div>

        <div className="flex-1">
          <h4 className={`font-medium ${textColor}`}>
            {isExceeded
              ? `${label} 한도 초과`
              : isWarning
                ? `${label} 거의 소진`
                : `${label} 사용량 알림`}
          </h4>
          <p className="mt-1 text-sm text-text-secondary">
            {isExceeded ? (
              <>이번 달 {label} 사용량({limit}개)을 모두 사용했습니다.</>
            ) : (
              <>
                이번 달 {label} 사용량의 {percentage}%를 사용했습니다.
                <span className="font-medium"> {limit - current}개 </span>
                남았습니다.
              </>
            )}
          </p>

          {/* Progress bar */}
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
            <div
              className={`h-full ${progressColor} transition-all duration-300`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-text-tertiary">
            <span>{current}개 사용</span>
            <span>{limit}개 한도</span>
          </div>

          {/* CTA */}
          {plan === 'free' && (
            <div className="mt-4 flex items-center gap-3">
              <Link href="/settings/billing">
                <Button size="sm" className="gap-1">
                  <Zap className="h-3.5 w-3.5" />
                  Pro로 업그레이드
                </Button>
              </Link>
              <span className="text-xs text-text-tertiary">무제한 사용</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * 여러 사용량을 한 번에 확인하고 가장 높은 사용률의 경고만 표시
 */
export function UsageWarningAuto({
  projectsUsed,
  headlinesUsed,
  iconsUsed,
  plan,
  compact = false,
}: {
  projectsUsed: number
  headlinesUsed: number
  iconsUsed: number
  plan: Plan
  compact?: boolean
}) {
  const usages = [
    { type: 'projects' as UsageType, current: projectsUsed },
    { type: 'ai_headlines' as UsageType, current: headlinesUsed },
    { type: 'ai_icons' as UsageType, current: iconsUsed },
  ]

  // 사용률이 가장 높은 항목 찾기
  const highestUsage = usages
    .map(({ type, current }) => {
      const limit = PLAN_LIMITS[plan][LIMIT_KEYS[type]] as number
      const percentage = limit === Infinity ? 0 : (current / limit) * 100
      return { type, current, percentage }
    })
    .filter(({ percentage }) => percentage >= 70)
    .sort((a, b) => b.percentage - a.percentage)[0]

  if (!highestUsage) {
    return null
  }

  return (
    <UsageWarning
      usageType={highestUsage.type}
      current={highestUsage.current}
      plan={plan}
      compact={compact}
    />
  )
}
