'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Plan } from '@/types/database'

interface PlanCardProps {
  plan: Plan
  currentPlan: Plan
  onSubscribe: () => void
  isLoading?: boolean
}

const PLAN_DETAILS: Record<Plan, { name: string; price: string; features: string[] }> = {
  free: {
    name: 'Free',
    price: '$0',
    features: [
      '월 3개 프로젝트',
      'Brand Profile 1개',
      'AI 헤드라인 월 10회',
      'Free 스타일 프리셋',
      'Web 에셋 생성',
    ],
  },
  pro: {
    name: 'Pro',
    price: '$12',
    features: [
      '프로젝트 무제한',
      'Brand Profile 5개',
      'AI 헤드라인 무제한',
      'AI 아이콘 생성 월 50회',
      '전체 스타일 프리셋',
      'Web + Mobile 에셋',
    ],
  },
}

export function PlanCard({ plan, currentPlan, onSubscribe, isLoading }: PlanCardProps) {
  const details = PLAN_DETAILS[plan]
  const isCurrent = plan === currentPlan

  return (
    <Card className={isCurrent ? 'border-brand ring-1 ring-brand' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{details.name}</CardTitle>
          {isCurrent && <Badge variant="default">현재 플랜</Badge>}
          {plan === 'pro' && !isCurrent && <Badge variant="pro">추천</Badge>}
        </div>
        <div className="mt-2">
          <span className="text-3xl font-bold text-text-primary">{details.price}</span>
          <span className="text-sm text-text-secondary">/월</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {details.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
              <Check className="h-4 w-4 text-brand" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          {plan === 'pro' && !isCurrent && (
            <Button className="w-full" onClick={onSubscribe} isLoading={isLoading}>
              Pro로 업그레이드
            </Button>
          )}
          {isCurrent && plan === 'free' && (
            <Button variant="outline" className="w-full" disabled>
              현재 사용 중
            </Button>
          )}
          {isCurrent && plan === 'pro' && (
            <Button variant="outline" className="w-full" disabled>
              현재 사용 중
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
