# Phase 08: LemonSqueezy 결제

## 목표

LemonSqueezy를 통한 Pro 플랜 구독 결제를 구현한다. 체크아웃 URL 생성, 웹훅 처리(구독 생성/업데이트/취소), 고객 포탈, 빌링 페이지를 포함한다.

---

## 생성/수정 파일 목록

| 파일 경로 | 작업 | 설명 |
|-----------|------|------|
| `lib/lemonsqueezy/client.ts` | 생성 | LemonSqueezy SDK 클라이언트 |
| `lib/lemonsqueezy/config.ts` | 생성 | 설정 상수 |
| `lib/lemonsqueezy/helpers.ts` | 생성 | 유틸 함수 |
| `app/api/lemonsqueezy/checkout/route.ts` | 생성 | 체크아웃 URL 생성 API |
| `app/api/lemonsqueezy/portal/route.ts` | 생성 | 고객 포탈 URL 생성 |
| `app/api/webhooks/lemonsqueezy/route.ts` | 생성 | 웹훅 핸들러 |
| `app/(dashboard)/settings/billing/page.tsx` | 생성 | 빌링 페이지 |
| `components/billing/plan-card.tsx` | 생성 | 플랜 카드 |
| `components/billing/usage-overview.tsx` | 생성 | 사용량 대시보드 |

---

## 1. LemonSqueezy 설정

### 1.1 환경변수 (`.env.local`)

```bash
# LemonSqueezy
LEMONSQUEEZY_API_KEY=lmsq_...
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_...
LEMONSQUEEZY_PRO_VARIANT_ID=67890
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 1.2 `lib/lemonsqueezy/config.ts`

```typescript
export const LEMONSQUEEZY_CONFIG = {
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  storeId: process.env.LEMONSQUEEZY_STORE_ID!,
  webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
  proVariantId: process.env.LEMONSQUEEZY_PRO_VARIANT_ID!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}

export const PLAN_PRICING = {
  pro: {
    price: 12,
    currency: 'USD',
    interval: 'month',
  },
}
```

### 1.3 `lib/lemonsqueezy/client.ts`

```typescript
import {
  lemonSqueezySetup,
  createCheckout,
  getCustomer,
  getSubscription,
  updateSubscription,
  cancelSubscription,
} from '@lemonsqueezy/lemonsqueezy.js'
import { LEMONSQUEEZY_CONFIG } from './config'

lemonSqueezySetup({
  apiKey: LEMONSQUEEZY_CONFIG.apiKey,
  onError: (error) => console.error('LemonSqueezy Error:', error),
})

export { createCheckout, getCustomer, getSubscription, updateSubscription, cancelSubscription }
```

---

## 2. 체크아웃 URL 생성

### 2.1 `app/api/lemonsqueezy/checkout/route.ts`

```typescript
import { createCheckout } from '@/lib/lemonsqueezy/client'
import { LEMONSQUEEZY_CONFIG } from '@/lib/lemonsqueezy/config'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: userData } = await supabase
    .from('users')
    .select('email')
    .eq('id', user.id)
    .single()

  // LemonSqueezy 체크아웃 생성
  const checkout = await createCheckout(
    LEMONSQUEEZY_CONFIG.storeId,
    LEMONSQUEEZY_CONFIG.proVariantId,
    {
      checkoutData: {
        email: userData!.email,
        custom: {
          user_id: user.id,  // 웹훅에서 사용자 식별용
        },
      },
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
      },
      expiresAt: null,
      preview: false,
      testMode: process.env.NODE_ENV === 'development',
    }
  )

  if (checkout.error) {
    return NextResponse.json({ error: checkout.error.message }, { status: 500 })
  }

  return NextResponse.json({ url: checkout.data?.data.attributes.url })
}
```

---

## 3. 웹훅 핸들러

### 3.1 `app/api/webhooks/lemonsqueezy/route.ts`

```typescript
import crypto from 'crypto'
import { LEMONSQUEEZY_CONFIG } from '@/lib/lemonsqueezy/config'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  // 1. HMAC 서명 검증
  const body = await request.text()
  const signature = request.headers.get('X-Signature')

  if (!signature) {
    return new Response('Missing signature', { status: 401 })
  }

  const hmac = crypto.createHmac('sha256', LEMONSQUEEZY_CONFIG.webhookSecret)
  const digest = hmac.update(body).digest('hex')

  if (digest !== signature) {
    return new Response('Invalid signature', { status: 401 })
  }

  // 2. 이벤트 파싱
  const event = JSON.parse(body)
  const eventName = event.meta.event_name
  const data = event.data

  console.log('LemonSqueezy Webhook:', eventName, data.id)

  // 3. 이벤트별 처리
  try {
    switch (eventName) {
      case 'subscription_created':
        await handleSubscriptionCreated(data)
        break
      case 'subscription_updated':
        await handleSubscriptionUpdated(data)
        break
      case 'subscription_cancelled':
      case 'subscription_expired':
        await handleSubscriptionCancelled(data)
        break
      case 'subscription_resumed':
        await handleSubscriptionResumed(data)
        break
      case 'subscription_payment_success':
        // 결제 성공 (이미 subscription_updated에서 처리)
        break
      case 'subscription_payment_failed':
        await handlePaymentFailed(data)
        break
      default:
        console.log('Unhandled event:', eventName)
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Internal error', { status: 500 })
  }
}

// ── subscription_created ──
async function handleSubscriptionCreated(data: any) {
  const userId = data.attributes.custom_data?.user_id
  if (!userId) throw new Error('Missing user_id in custom_data')

  const customerId = data.attributes.customer_id.toString()
  const subscriptionId = data.id.toString()

  // users 테이블 업데이트: plan = 'pro'
  await supabaseAdmin
    .from('users')
    .update({
      plan: 'pro',
      lemonsqueezy_customer_id: customerId,
      lemonsqueezy_subscription_id: subscriptionId,
    })
    .eq('id', userId)

  console.log('Subscription created:', userId, subscriptionId)
}

// ── subscription_updated ──
async function handleSubscriptionUpdated(data: any) {
  const subscriptionId = data.id.toString()
  const status = data.attributes.status  // 'active', 'past_due', 'cancelled', 'expired'

  // status === 'active'이면 plan = 'pro' 유지
  // status === 'cancelled' 또는 'expired'이면 다운그레이드
  if (status === 'active') {
    await supabaseAdmin
      .from('users')
      .update({ plan: 'pro' })
      .eq('lemonsqueezy_subscription_id', subscriptionId)
  } else if (status === 'cancelled' || status === 'expired') {
    await supabaseAdmin
      .from('users')
      .update({ plan: 'free' })
      .eq('lemonsqueezy_subscription_id', subscriptionId)
  }

  console.log('Subscription updated:', subscriptionId, status)
}

// ── subscription_cancelled ──
async function handleSubscriptionCancelled(data: any) {
  const subscriptionId = data.id.toString()

  // plan 다운그레이드
  await supabaseAdmin
    .from('users')
    .update({ plan: 'free' })
    .eq('lemonsqueezy_subscription_id', subscriptionId)

  console.log('Subscription cancelled:', subscriptionId)
}

// ── subscription_resumed ──
async function handleSubscriptionResumed(data: any) {
  const subscriptionId = data.id.toString()

  await supabaseAdmin
    .from('users')
    .update({ plan: 'pro' })
    .eq('lemonsqueezy_subscription_id', subscriptionId)

  console.log('Subscription resumed:', subscriptionId)
}

// ── payment_failed ──
async function handlePaymentFailed(data: any) {
  const subscriptionId = data.id.toString()

  // 결제 실패 알림 (이메일 등)
  // 일단 plan은 유지 (grace period)
  console.warn('Payment failed:', subscriptionId)
}
```

**주의사항:**
- `request.text()`로 raw body 보존 (HMAC 검증용)
- `X-Signature` 헤더로 HMAC SHA256 검증
- `custom_data.user_id`로 Supabase 사용자 매핑

---

## 4. 고객 포탈

### 4.1 `app/api/lemonsqueezy/portal/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { LEMONSQUEEZY_CONFIG } from '@/lib/lemonsqueezy/config'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: userData } = await supabase
    .from('users')
    .select('lemonsqueezy_customer_id')
    .eq('id', user.id)
    .single()

  if (!userData?.lemonsqueezy_customer_id) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
  }

  // LemonSqueezy 고객 포탈 URL
  const portalUrl = `https://app.lemonsqueezy.com/my-orders?customer_id=${userData.lemonsqueezy_customer_id}`

  return NextResponse.json({ url: portalUrl })
}
```

**고객 포탈 기능:**
- 구독 취소
- 결제 수단 변경
- 인보이스 다운로드
- 구독 재개

---

## 5. 빌링 페이지

### 5.1 `app/(dashboard)/settings/billing/page.tsx`

**Server Component (데이터 fetch)**

```typescript
export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user!.id)
    .single()

  return <BillingClient user={userData!} />
}
```

**UI 구성:**

```
┌─ 현재 플랜 ────────────────────────────────┐
│  Free / Pro                                 │
│  • 프로젝트: 1 / 3                          │
│  • AI 헤드라인: 5 / 10                      │
│  • AI 아이콘: 0 / 5                         │
│                                             │
│  [Pro로 업그레이드] OR [구독 관리]           │
└─────────────────────────────────────────────┘

┌─ 플랜 비교 ────────────────────────────────┐
│  [Free Card]  [Pro Card]                    │
└─────────────────────────────────────────────┘
```

### 5.2 `components/billing/plan-card.tsx`

```typescript
interface PlanCardProps {
  plan: 'free' | 'pro'
  currentPlan: 'free' | 'pro'
  onSubscribe: () => void
  isLoading?: boolean
}
```

**Free 플랜:**
- $0/월
- 프로젝트 월 3개
- Brand Profile 1개
- AI 헤드라인 월 10회
- AI 아이콘 생성 불가
- Free 스타일 3개

**Pro 플랜:**
- $12/월
- 프로젝트 무제한
- Brand Profile 5개
- AI 헤드라인 무제한
- AI 아이콘 월 50회
- 전체 스타일 8개+

### 5.3 "Pro로 업그레이드" 버튼

```typescript
async function handleUpgrade() {
  setIsLoading(true)

  // 1. 체크아웃 URL 생성
  const res = await fetch('/api/lemonsqueezy/checkout', { method: 'POST' })
  const { url } = await res.json()

  // 2. 리다이렉트
  window.location.href = url
}
```

### 5.4 "구독 관리" 버튼 (Pro 사용자)

```typescript
async function handleManageSubscription() {
  // 고객 포탈로 리다이렉트
  const res = await fetch('/api/lemonsqueezy/portal', { method: 'POST' })
  const { url } = await res.json()
  window.open(url, '_blank')
}
```

---

## 6. 사용량 대시보드

### 6.1 `components/billing/usage-overview.tsx`

```typescript
interface UsageOverviewProps {
  user: User
}
```

**UI:**

```
┌─ 이번 달 사용량 ───────────────────────────┐
│                                             │
│  프로젝트        [████░░] 1 / 3             │
│  AI 헤드라인     [████░░] 5 / 10            │
│  AI 아이콘       [      ] 0 / 5  🔒         │
│                                             │
│  리셋: 2025-03-04                           │
└─────────────────────────────────────────────┘
```

**progress bar 색상:**
- < 70%: 녹색
- 70-90%: 노란색
- > 90%: 빨간색

---

## 7. 플랜 제한 적용

### 7.1 API에서 플랜 체크

```typescript
// 프로젝트 생성 시
const { data: user } = await supabase
  .from('users')
  .select('plan, projects_used_this_month')
  .eq('id', userId)
  .single()

const limit = PLAN_LIMITS[user.plan].projects_per_month

if (user.projects_used_this_month >= limit) {
  return NextResponse.json(
    { error: '이번 달 프로젝트 생성 한도를 초과했습니다.' },
    { status: 429 }
  )
}
```

### 7.2 UI에서 플랜 체크

```typescript
// Brand Profile 생성 버튼
<Button
  disabled={profileCount >= PLAN_LIMITS[plan].brand_profiles}
  onClick={handleCreate}
>
  새 브랜드 만들기
</Button>
```

---

## 기술적 주의사항

### 1. 웹훅 보안
- HMAC SHA256 서명 검증 필수
- `request.text()` raw body 사용 (JSON.parse 전)
- 재전송 공격 방지: 이벤트 ID 중복 체크 (optional)

### 2. custom_data 사용
- `custom_data`에 `user_id` 포함하여 웹훅에서 사용자 식별
- LemonSqueezy는 고객 이메일만으로는 Supabase 사용자 매핑 어려움

### 3. 구독 상태 동기화
- `subscription_updated` 이벤트로 status 변경 추적
- `status === 'active'` → Pro 유지
- `status === 'cancelled'` → 즉시 다운그레이드 (또는 grace period)

### 4. 결제 실패 대응
- `subscription_payment_failed` 이벤트 수신
- 이메일 알림 (선택)
- 3회 실패 후 자동 취소 (LemonSqueezy 설정)

### 5. 테스트 모드
- `testMode: true` 설정 → 개발 환경에서 결제 시뮬레이션
- 웹훅도 테스트 모드 이벤트 수신
- 프로덕션 배포 시 `testMode: false`

---

## 검증 방법

### 검증 1: 구독 플로우 E2E

```
1. Free 사용자 → /settings/billing → "Pro로 업그레이드"
2. LemonSqueezy 체크아웃 페이지 → 테스트 카드 결제
3. 웹훅 수신 → subscription_created
4. Supabase users 테이블: plan = 'pro' 확인
5. 대시보드 → Pro 기능 사용 가능
```

### 검증 2: 구독 취소 → 다운그레이드

```
1. Pro 사용자 → "구독 관리" → LemonSqueezy 포탈
2. 구독 취소 클릭
3. 웹훅 수신 → subscription_cancelled
4. plan = 'free' 확인
5. Pro 전용 기능 잠김
```

### 검증 3: 사용량 제한

```
1. Free 사용자: 프로젝트 3개 생성
2. 4번째 시도 → "한도 초과" 에러
3. Pro 업그레이드 후 → 무제한 생성
```

### 검증 4: 웹훅 HMAC 검증

```
1. 잘못된 서명으로 웹훅 전송 → 401 응답
2. 올바른 서명 → 200 응답 + DB 업데이트
```
