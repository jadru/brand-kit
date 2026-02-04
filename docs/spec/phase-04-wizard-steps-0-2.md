# Phase 04: 위자드 Step 0-2

## 목표

6단계 프로젝트 생성 위자드의 앞부분(Step 0~2)을 구현한다. Zustand wizard-store(sessionStorage persist), 위자드 쉘(스텝 라우팅/검증), Brand Profile 선택(Step 0), 플랫폼 선택(Step 1), 프로젝트 정보 + AI 헤드라인 생성(Step 2)을 포함한다.

---

## 생성/수정 파일 목록

| 파일 경로 | 작업 | 설명 |
|-----------|------|------|
| `store/wizard-store.ts` | 생성 | 위자드 전체 상태 관리 |
| `app/(dashboard)/projects/new/page.tsx` | 생성 | 위자드 진입점 |
| `components/wizard/wizard-shell.tsx` | 생성 | 스텝 컨테이너 + 네비게이션 |
| `components/wizard/step-indicator.tsx` | 생성 | 진행 상태 표시기 |
| `components/wizard/step-0-brand.tsx` | 생성 | Brand Profile 선택 |
| `components/wizard/step-1-platform.tsx` | 생성 | 플랫폼 선택 |
| `components/wizard/step-2-project-info.tsx` | 생성 | 프로젝트 정보 + AI |
| `components/shared/plan-gate.tsx` | 생성 | Pro 기능 잠금 UI |
| `components/shared/usage-meter.tsx` | 생성 | 사용량 표시기 |
| `app/api/ai/headlines/route.ts` | 생성 | AI 헤드라인 생성 API |
| `lib/ai/claude.ts` | 생성 | Claude API 클라이언트 |
| `lib/utils/rate-limit.ts` | 생성 | 사용량 체크/증가 유틸 |
| `types/wizard.ts` | 생성 | 위자드 관련 타입 |

---

## 1. Zustand Wizard Store

### 1.1 `store/wizard-store.ts`

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  Platform, MobileTarget, StyleDirection, IconType
} from '@/types/database'

// ── 위자드 스텝별 데이터 ──
interface WizardBrandData {
  brandProfileId: string | null      // 선택된 Brand Profile ID
  skipBrandProfile: boolean           // "브랜드 없이 진행" 여부
}

interface WizardPlatformData {
  platform: Platform                  // 'web' | 'mobile' | 'all'
  mobileTarget: MobileTarget | null   // 'android' | 'ios' | 'both'
}

interface WizardProjectData {
  name: string
  description: string
  aiHeadline: string | null
  aiTagline: string | null
  aiOgDescription: string | null
  aiShortSlogan: string | null
}

interface WizardStyleData {
  stylePresetId: string | null
  primaryColorOverride: string | null  // 프로젝트 전용 컬러
}

interface WizardIconData {
  iconType: IconType | null            // 'text' | 'symbol' | 'ai_generated'
  iconValue: string | null             // 글자, 심볼명, 또는 이미지 URL
}

// ── 전체 스토어 ──
interface WizardState {
  // 현재 스텝
  currentStep: number

  // 스텝별 데이터
  brand: WizardBrandData
  platform: WizardPlatformData
  project: WizardProjectData
  style: WizardStyleData
  icon: WizardIconData

  // 액션
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  setBrand: (data: Partial<WizardBrandData>) => void
  setPlatform: (data: Partial<WizardPlatformData>) => void
  setProject: (data: Partial<WizardProjectData>) => void
  setStyle: (data: Partial<WizardStyleData>) => void
  setIcon: (data: Partial<WizardIconData>) => void

  reset: () => void
  canProceed: (step: number) => boolean
}

const initialState = {
  currentStep: 0,
  brand: { brandProfileId: null, skipBrandProfile: false },
  platform: { platform: 'web' as Platform, mobileTarget: null },
  project: {
    name: '',
    description: '',
    aiHeadline: null,
    aiTagline: null,
    aiOgDescription: null,
    aiShortSlogan: null,
  },
  style: { stylePresetId: null, primaryColorOverride: null },
  icon: { iconType: null, iconValue: null },
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 5) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

      setBrand: (data) =>
        set((s) => ({ brand: { ...s.brand, ...data } })),
      setPlatform: (data) =>
        set((s) => ({ platform: { ...s.platform, ...data } })),
      setProject: (data) =>
        set((s) => ({ project: { ...s.project, ...data } })),
      setStyle: (data) =>
        set((s) => ({ style: { ...s.style, ...data } })),
      setIcon: (data) =>
        set((s) => ({ icon: { ...s.icon, ...data } })),

      reset: () => set(initialState),

      canProceed: (step) => {
        const state = get()
        switch (step) {
          case 0: // Brand Profile 선택
            return !!state.brand.brandProfileId || state.brand.skipBrandProfile
          case 1: // Platform 선택
            return !!state.platform.platform &&
              (state.platform.platform !== 'mobile' || !!state.platform.mobileTarget)
          case 2: // Project Info
            return state.project.name.trim().length > 0
          case 3: // Style
            return !!state.style.stylePresetId
          case 4: // Icon
            return !!state.icon.iconType && !!state.icon.iconValue
          default:
            return true
        }
      },
    }),
    {
      name: 'brandkit-wizard',
      storage: createJSONStorage(() => sessionStorage),
      // 탭 닫으면 소멸, 새로고침엔 생존
    }
  )
)
```

---

## 2. 위자드 쉘

### 2.1 `components/wizard/wizard-shell.tsx`

```typescript
'use client'

interface WizardShellProps {
  brandProfiles: BrandProfile[]
  stylePresets: StylePreset[]
  user: User
}

const STEPS = [
  { label: '브랜드', description: '브랜드 프로필 선택' },
  { label: '플랫폼', description: '대상 플랫폼 선택' },
  { label: '프로젝트', description: '프로젝트 정보 입력' },
  { label: '스타일', description: '스타일 프리셋 선택' },
  { label: '아이콘', description: '아이콘 심볼 선택' },
  { label: '완료', description: '프리뷰 & 다운로드' },
]
```

**동작:**
- `useWizardStore`에서 `currentStep` 읽기
- 스텝별 컴포넌트 렌더링 (조건부)
- "이전" / "다음" 버튼
- `canProceed(currentStep)`이 false면 "다음" 버튼 비활성화
- 스텝 인디케이터 (상단)
- 스텝 변경 시 스크롤 상단으로 이동

### 2.2 `components/wizard/step-indicator.tsx`

```typescript
interface StepIndicatorProps {
  steps: { label: string; description: string }[]
  currentStep: number
  onStepClick?: (step: number) => void  // 완료된 스텝만 클릭 가능
}
```

**UI:**
- 수평 스텝 바 (데스크톱) / 번호만 표시 (모바일)
- 완료: 체크마크 + 녹색
- 현재: 강조 + 활성 색상
- 미래: 회색 + 비활성
- 완료된 스텝 클릭 시 해당 스텝으로 이동

---

## 3. Step 0: Brand Profile 선택

### 3.1 `components/wizard/step-0-brand.tsx`

```typescript
'use client'

interface Step0BrandProps {
  profiles: BrandProfile[]
  plan: Plan
}
```

**UI 구성 (기획서 원문 반영):**

```
┌─────────────────────────────────────────────────┐
│  내 브랜드 프로필                                  │
│                                                   │
│  [프로필 카드 1] [프로필 카드 2] [+ 새 브랜드]      │
│                                                   │
│  ○ 브랜드 없이 진행 (이번 프로젝트만)               │
└─────────────────────────────────────────────────┘
```

**동작:**
1. 기존 Brand Profile 카드 클릭 → `setBrand({ brandProfileId: id })`
2. "새 브랜드 만들기" → 인라인 폼 또는 모달 (Phase 3의 profile-form 재사용)
3. "브랜드 없이 진행" → `setBrand({ skipBrandProfile: true })`
4. Free 플랜 + 이미 1개 있으면 "새 브랜드 만들기" 비활성화 + PlanGate 표시
5. 선택 완료 시 `nextStep()` 호출

---

## 4. Step 1: 플랫폼 선택

### 4.1 `components/wizard/step-1-platform.tsx`

```typescript
'use client'
```

**UI 구성:**

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│   🌐     │  │   📱     │  │  📱🌐    │
│   Web    │  │  Mobile  │  │   All    │
└──────────┘  └──────────┘  └──────────┘

※ Mobile 또는 All 선택 시:
  ○ Android only
  ○ iOS only
  ● Both (Android + iOS)
```

**동작:**
1. Web/Mobile/All 카드 클릭 → `setPlatform({ platform })`
2. Mobile 또는 All 선택 시 서브옵션(mobileTarget) 표시
3. Web 선택 시 mobileTarget = null
4. `platform === 'mobile'`이면 mobileTarget 필수
5. `platform === 'all'`이면 mobileTarget 자동으로 `'both'`

---

## 5. Step 2: 프로젝트 정보 + AI 헤드라인

### 5.1 `components/wizard/step-2-project-info.tsx`

```typescript
'use client'

interface Step2ProjectInfoProps {
  user: User
  brandProfile: BrandProfile | null  // Step 0에서 선택된 프로필
}
```

**UI 구성:**

| 필드 | 유형 | 필수 | 설명 |
|------|------|------|------|
| 프로젝트명 | Input | ✅ | 최대 50자 |
| 한 줄 설명 | Input | ❌ | 최대 200자 |
| AI 헤드라인 생성 | Button | - | Claude API 호출 |

**AI 생성 결과 UI:**

```
┌─ AI 생성 결과 ──────────────────────────────────┐
│                                                  │
│  헤드라인: "복잡한 업무, 심플하게 정리하세요"       │
│  태그라인: "팀워크를 위한 미니멀 태스크 관리"       │
│  OG 설명: "TaskFlow로 팀의 업무를 한눈에..."      │
│  짧은 슬로건: "Simple Tasks"                     │
│                                                  │
│  [✓ 이 카피 사용하기]  [🔄 다시 생성]              │
└──────────────────────────────────────────────────┘
```

**동작:**
1. 프로젝트명 입력 → `setProject({ name })`
2. "AI로 SEO 헤드라인 생성하기" 클릭 → `POST /api/ai/headlines`
3. 응답 수신 → AI 결과 표시
4. "이 카피 사용하기" → `setProject({ aiHeadline, aiTagline, ... })`
5. "다시 생성" → 재호출 (사용량 추가 차감)
6. 사용량 초과 시 → UsageMeter 표시 + 버튼 비활성화

---

## 6. AI 헤드라인 API

### 6.1 `POST /api/ai/headlines`

**요청 타입:**
```typescript
interface HeadlineRequest {
  projectName: string
  description?: string
  platform: Platform
  brandKeywords?: string[]
  brandStyleDirection?: StyleDirection
}
```

**응답 타입:**
```typescript
interface HeadlineResponse {
  headline: string       // 메인 헤드라인 (max 60자, 한국어)
  tagline: string        // 태그라인 (max 30자)
  ogDescription: string  // OG 설명 (max 155자)
  shortSlogan: string    // 짧은 슬로건 (max 15자)
}
```

**에러 코드:**

| 코드 | 상태 | 설명 |
|------|------|------|
| `UNAUTHORIZED` | 401 | 미인증 |
| `USAGE_LIMIT_EXCEEDED` | 429 | AI 헤드라인 사용량 초과 |
| `AI_GENERATION_FAILED` | 500 | Claude API 실패 |
| `INVALID_INPUT` | 400 | 필수 필드 누락 |

**처리 흐름:**

```
1. 인증 확인 (getUser)
2. Lazy reset (reset_monthly_usage RPC)
3. 사용량 체크 (ai_headlines_used_this_month < limit)
4. Claude API 호출 (시스템 프롬프트 + 사용자 프롬프트)
5. JSON 파싱 + 유효성 검증
6. 사용량 atomic increment
7. 응답 반환
```

### 6.2 `lib/ai/claude.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface GenerateHeadlinesParams {
  projectName: string
  description?: string
  platform: string
  brandKeywords?: string[]
  brandStyleDirection?: string
}

export async function generateHeadlines(
  params: GenerateHeadlinesParams
): Promise<HeadlineResponse> {
  const systemPrompt = `You are a senior brand copywriter...` // 기획서 섹션 5-1 시스템 프롬프트 전문

  const userPrompt = `
Project Name: ${params.projectName}
Description: ${params.description || 'No description provided'}
Platform: ${params.platform}
Brand Keywords: ${params.brandKeywords?.join(', ') || 'Not specified'}
Brand Style: ${params.brandStyleDirection || 'Not specified'}

Generate brand copy for this project.
`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  // content[0]에서 텍스트 추출 후 JSON 파싱
  const text = message.content[0].type === 'text'
    ? message.content[0].text
    : ''

  return JSON.parse(text)
}
```

**Claude 시스템 프롬프트 (기획서 섹션 5-1 전문):**

```
You are a senior brand copywriter specializing in tech startups and SaaS products.
Your task is to generate SEO-optimized, conversion-focused copy for app/web projects.

## Context
You will receive:
- Project name and description
- Target platform (web/mobile/all)
- Brand profile keywords (if available)

## Output Requirements
Generate exactly 4 items in JSON format:
1. headline: Main headline for landing page (max 60 chars, Korean)
2. tagline: Short memorable tagline (max 30 chars, Korean)
3. ogDescription: Open Graph description for social sharing (max 155 chars, Korean)
4. shortSlogan: Ultra-short slogan for app stores (max 15 chars, Korean)

## Writing Guidelines
- Use active, benefit-driven language
- Avoid generic buzzwords (혁신적인, 강력한, 최고의)
- Focus on specific value proposition
- Consider SEO keywords naturally
- If brand keywords provided, reflect the brand's tone

## Response Format
Return ONLY valid JSON, no markdown formatting:
{"headline": "...", "tagline": "...", "ogDescription": "...", "shortSlogan": "..."}
```

---

## 7. 사용량 제한 유틸

### 7.1 `lib/utils/rate-limit.ts`

```typescript
import { SupabaseClient } from '@supabase/supabase-js'
import { PLAN_LIMITS } from '@/types/database'

type UsageField =
  | 'projects_used_this_month'
  | 'ai_headlines_used_this_month'
  | 'ai_icons_used_this_month'

interface CheckUsageResult {
  allowed: boolean
  current: number
  limit: number
  plan: string
}

/**
 * 사용량을 체크하고 Lazy reset을 수행한다.
 * 실제 증가는 별도 호출로 처리 (체크와 증가를 분리하여 UX 향상).
 */
export async function checkUsage(
  supabase: SupabaseClient,
  userId: string,
  field: UsageField
): Promise<CheckUsageResult> {
  // 1. Lazy reset
  await supabase.rpc('reset_monthly_usage')

  // 2. 현재 사용량 조회
  const { data: user } = await supabase
    .from('users')
    .select('plan, ' + field)
    .eq('id', userId)
    .single()

  if (!user) throw new Error('User not found')

  const plan = user.plan as 'free' | 'pro'
  const current = (user as Record<string, unknown>)[field] as number
  const limitKey = field.replace('_used_this_month', '_per_month') as keyof typeof PLAN_LIMITS.free
  const limit = PLAN_LIMITS[plan][limitKey] as number

  return {
    allowed: current < limit,
    current,
    limit,
    plan,
  }
}

/**
 * 사용량을 atomic하게 1 증가시킨다.
 * 반드시 checkUsage() 이후에 호출.
 */
export async function incrementUsage(
  supabase: SupabaseClient,
  userId: string,
  field: UsageField
): Promise<void> {
  // atomic increment: SET field = field + 1
  await supabase.rpc('increment_usage', {
    user_id: userId,
    field_name: field,
  })
  // 또는 직접 SQL:
  // await supabase.from('users')
  //   .update({ [field]: supabase.sql`${field} + 1` })
  //   .eq('id', userId)
}
```

> **주의:** `increment_usage` RPC 함수가 필요하면 별도 마이그레이션으로 추가. 또는 Supabase의 `.rpc()`를 사용하여 직접 atomic increment 쿼리를 실행할 수 있다.

---

## 8. 공유 컴포넌트

### 8.1 `components/shared/plan-gate.tsx`

```typescript
interface PlanGateProps {
  feature: string          // "AI 아이콘 생성", "Pro 스타일 프리셋" 등
  currentPlan: Plan
  requiredPlan: Plan
  children: React.ReactNode // Pro일 때 렌더링할 내용
  fallback?: React.ReactNode // Free일 때 렌더링할 내용
}
```

**동작:**
- `currentPlan >= requiredPlan` → children 렌더링
- 아니면 → 잠금 오버레이 + "Pro 업그레이드" CTA
- `🔒 PRO` 배지 표시

### 8.2 `components/shared/usage-meter.tsx`

```typescript
interface UsageMeterProps {
  label: string           // "AI 헤드라인", "프로젝트" 등
  current: number
  limit: number           // Infinity이면 "무제한" 표시
  showUpgrade?: boolean
}
```

**UI:**
- 프로그레스 바 (current / limit)
- `3 / 10` 텍스트
- limit 가까우면 warning 색상
- limit 도달 시 error 색상 + "Pro 업그레이드" 링크

---

## 기술적 주의사항

### 1. sessionStorage persist
- `zustand/middleware`의 `persist` + `createJSONStorage(() => sessionStorage)`
- 탭 닫으면 소멸 (의도적), 새로고침엔 생존
- AI 생성 결과도 store에 저장하여 뒤로가기 시 유지

### 2. Hydration 불일치 방지
- sessionStorage는 서버에서 사용 불가
- `useEffect`에서 store 초기화하거나, `skipHydration` 옵션 사용
- 또는 `onRehydrateStorage` 콜백으로 hydration 완료 후 렌더링

### 3. Claude API JSON 파싱
- `JSON.parse()` 실패 대비 try/catch
- 응답에 markdown 코드블록이 포함될 수 있음 → 정규식으로 제거
- 각 필드 길이 제한 검증 (max chars)

### 4. 사용량 체크와 증가 분리
- 체크: API 요청 시작 시 (UI에 표시용)
- 증가: AI 호출 성공 후 (실제 소비 확정 시)
- 실패 시 증가하지 않음 (공정 과금)

---

## 검증 방법

### 검증 1: 위자드 스텝 탐색

```
1. /projects/new 접속 → Step 0 표시
2. Brand Profile 선택 → "다음" 클릭 → Step 1
3. "이전" 클릭 → Step 0 (선택 상태 유지)
4. 새로고침 → 현재 스텝 + 데이터 유지 (sessionStorage)
5. 브라우저 탭 닫기 → 새 탭에서 /projects/new → 초기 상태 (리셋)
```

### 검증 2: AI 헤드라인 생성

```
1. Step 2에서 프로젝트명 입력 → "AI로 SEO 헤드라인 생성하기"
2. 로딩 스피너 표시 → 결과 수신 → 4개 항목 표시
3. "이 카피 사용하기" → store에 저장
4. "다시 생성" → 새로운 결과 (사용량 +1)
```

### 검증 3: 사용량 제한

```
1. Free 사용자: AI 헤드라인 10회 사용 후
2. 11번째 시도 → "사용량 초과" 에러 + UsageMeter 빨간색
3. Pro 업그레이드 후 → 무제한 사용 가능
```

### 검증 4: 스텝 검증

```
1. Step 0: Brand Profile 미선택 + "브랜드 없이 진행" 미체크 → "다음" 비활성화
2. Step 1: Mobile 선택 + mobileTarget 미선택 → "다음" 비활성화
3. Step 2: 프로젝트명 비어있음 → "다음" 비활성화
```
