# Phase 05: 위자드 Step 3-4 (스타일 + 아이콘)

## 목표

위자드 Step 3 (스타일 프리셋 선택 + 컬러 오버라이드)과 Step 4 (아이콘 심볼 - 텍스트/심볼/AI 생성 3개 탭)를 구현한다. Brand Profile 기반 추천, Free/Pro 스타일 구분, fal.ai AI 아이콘 생성을 포함한다.

---

## 생성/수정 파일 목록

| 파일 경로 | 작업 | 설명 |
|-----------|------|------|
| `components/wizard/step-3-style.tsx` | 생성 | 스타일 프리셋 선택 |
| `components/wizard/step-4-icon.tsx` | 생성 | 아이콘 심볼 선택 (3탭) |
| `components/wizard/preset-card.tsx` | 생성 | 스타일 프리셋 카드 |
| `components/wizard/icon-text-tab.tsx` | 생성 | 텍스트 기반 아이콘 탭 |
| `components/wizard/icon-symbol-tab.tsx` | 생성 | 심볼 선택 탭 |
| `components/wizard/icon-ai-tab.tsx` | 생성 | AI 생성 탭 (Pro) |
| `app/api/ai/icons/route.ts` | 생성 | AI 아이콘 생성 API |
| `lib/ai/fal.ts` | 생성 | fal.ai 클라이언트 |
| `public/icons/symbols/` | 생성 | 심볼 라이브러리 SVG |

---

## 1. Step 3: 스타일 프리셋 선택

### 1.1 UI 구성

```
┌───────────────────────────────────────────────────┐
│  Brand Profile "My Studio" 기반    [수정하기 ▼]  │
│                                                    │
│  프로젝트 전용 컬러 오버라이드 (선택)               │
│  ○ Brand Profile 컬러 유지 (#000000)              │
│  ● 이 프로젝트만 다른 컬러: [#6366F1] 🎨          │
│                                                    │
│  스타일 프리셋 선택                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│  │[preview]│ │[preview]│ │[preview]│             │
│  │ Notion  │ │ Vercel  │ │ Linear  │             │
│  │ Minimal │ │  Sharp  │ │  Dark   │             │
│  │ ⭐추천  │ │         │ │ 🔒 PRO  │             │
│  └─────────┘ └─────────┘ └─────────┘             │
└───────────────────────────────────────────────────┘
```

### 1.2 추천 로직 (기획서 섹션 6)

```typescript
function getRecommendedPresets(
  styleDirection: StyleDirection,
  allPresets: StylePreset[]
): StylePreset[] {
  const recommendationMap: Record<StyleDirection, string[]> = {
    minimal: ['notion-minimal', 'vercel-sharp', 'linear-dark'],
    playful: ['airbnb-3d', 'duolingo-playful', 'glassmorphism'],
    corporate: ['figma-clean', 'notion-minimal', 'vercel-sharp'],
    tech: ['stripe-gradient', 'linear-dark', 'glassmorphism'],
    custom: [], // 추천 없음, 전체 표시
  }

  const recommended = recommendationMap[styleDirection]
  return allPresets
    .sort((a, b) => {
      const aIndex = recommended.indexOf(a.slug)
      const bIndex = recommended.indexOf(b.slug)
      if (aIndex !== -1 && bIndex === -1) return -1
      if (aIndex === -1 && bIndex !== -1) return 1
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      return a.sort_order - b.sort_order
    })
}
```

### 1.3 Free/Pro 구분

- Free: `is_free = true`인 프리셋만 선택 가능
- Pro 프리셋 클릭 시 → PlanGate 오버레이

### 1.4 컬러 오버라이드

- Brand Profile의 `primary_color` 기본 사용
- "이 프로젝트만 다른 컬러" 체크 시 ColorPicker 표시
- 선택한 컬러 → `wizard.style.primaryColorOverride`

### 1.5 프리셋 카드 (`components/wizard/preset-card.tsx`)

```typescript
interface PresetCardProps {
  preset: StylePreset
  isSelected: boolean
  isLocked: boolean  // Pro 프리셋 + Free 사용자
  isRecommended: boolean
  onClick: () => void
}
```

**UI:**
- 프리뷰 이미지 (또는 placeholder)
- 프리셋 이름
- 추천 배지 (⭐)
- Pro 배지 (🔒)
- 선택 시 테두리 강조

---

## 2. Step 4: 아이콘 심볼 (3개 탭)

### 2.1 전체 구조

```
┌──────────────────────────────────────────────┐
│  [텍스트 기반] [심볼 선택] [AI 생성 🔒 PRO]   │
│                                               │
│  {탭별 내용}                                   │
│                                               │
└──────────────────────────────────────────────┘
```

### 2.2 Tab 1: 텍스트 기반 (`icon-text-tab.tsx`)

```
첫 글자: [ T ]  또는 커스텀: [    ]

※ 프로젝트명 "TaskFlow"의 첫 글자 'T' 자동 입력
```

**동작:**
1. 기본값: `projectName[0].toUpperCase()`
2. 커스텀 입력: 최대 2자
3. 선택 시 → `setIcon({ iconType: 'text', iconValue: letter })`
4. 실시간 프리뷰: 선택한 스타일 프리셋 + 컬러로 렌더링

### 2.3 Tab 2: 심볼 선택 (`icon-symbol-tab.tsx`)

```
카테고리: [전체 ▼]

┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│ ✓  │ │ 📋 │ │ 📊 │ │ ⚡ │ │ 🎯 │
└────┘ └────┘ └────┘ └────┘ └────┘
...
```

**심볼 라이브러리 구조:**

```
public/icons/symbols/
├── business/
│   ├── briefcase.svg
│   ├── chart.svg
│   └── target.svg
├── tech/
│   ├── code.svg
│   ├── cpu.svg
│   └── zap.svg
├── design/
│   ├── palette.svg
│   ├── pen.svg
│   └── layers.svg
├── social/
│   ├── share.svg
│   ├── heart.svg
│   └── message.svg
└── misc/
    ├── star.svg
    ├── bell.svg
    └── settings.svg
```

**카테고리:**
- 전체 (All)
- 비즈니스 (Business)
- 테크 (Tech)
- 디자인 (Design)
- 소셜 (Social)
- 기타 (Misc)

**동작:**
1. 카테고리 선택 → 필터링된 심볼 표시
2. 심볼 클릭 → `setIcon({ iconType: 'symbol', iconValue: 'business/briefcase' })`
3. 실시간 프리뷰

### 2.4 Tab 3: AI 생성 (`icon-ai-tab.tsx`)

```
┌──────────────────────────────────────────────┐
│  minimalist checkmark icon for task app      │
└──────────────────────────────────────────────┘
[🎨 4개 옵션 생성하기]

※ Brand Profile 키워드 "clean, minimal..." 자동 적용

┌─ 생성 결과 ─────────────────────────────────┐
│  [옵션 1] [옵션 2] [옵션 3] [옵션 4]          │
│  클릭하여 선택                                │
└───────────────────────────────────────────────┘
```

**PlanGate:** Free 사용자는 탭 비활성화 + Pro 업그레이드 안내

**동작:**
1. 사용자가 아이콘 설명 입력 (영어 권장)
2. "4개 옵션 생성하기" 클릭 → `POST /api/ai/icons`
3. 4개 이미지 URL 수신 → 그리드 표시
4. 클릭 시 선택 → `setIcon({ iconType: 'ai_generated', iconValue: imageUrl })`

---

## 3. AI 아이콘 생성 API

### 3.1 `POST /api/ai/icons`

**요청:**
```typescript
interface IconGenerationRequest {
  description: string           // 사용자 입력 아이콘 설명
  brandProfile?: {              // Brand Profile 정보 (선택)
    styleDirection: StyleDirection
    primaryColor: string
    colorMode: ColorMode
    iconStyle: IconStyle
    cornerStyle: CornerStyle
    keywords: string[]
  }
}
```

**응답:**
```typescript
interface IconGenerationResponse {
  images: Array<{
    url: string
    seed: number
  }>
}
```

**에러 코드:**
- `UNAUTHORIZED` (401)
- `USAGE_LIMIT_EXCEEDED` (429)
- `PLAN_REQUIRED` (403) - Free 사용자
- `AI_GENERATION_FAILED` (500)

### 3.2 fal.ai 프롬프트 조합 (기획서 섹션 5-3)

```typescript
// lib/ai/fal.ts
import * as fal from '@fal-ai/client'

fal.config({
  credentials: process.env.FAL_KEY!,
})

interface GenerateIconParams {
  description: string
  brandProfile?: {
    styleDirection: StyleDirection
    primaryColor: string
    colorMode: ColorMode
    iconStyle: IconStyle
    cornerStyle: CornerStyle
    keywords: string[]
  }
}

export async function generateIcon(params: GenerateIconParams) {
  const prompt = buildPrompt(params)
  const negativePrompt = buildNegativePrompt(params)

  // fal.ai Flux Schnell 모델 (빠른 생성)
  const result = await fal.subscribe('fal-ai/flux/schnell', {
    input: {
      prompt,
      negative_prompt: negativePrompt,
      num_images: 4,
      image_size: 'square_hd',  // 1024x1024
      num_inference_steps: 4,
      seed: Math.floor(Math.random() * 1000000),
    },
  })

  return result.images
}

function buildPrompt(params: GenerateIconParams): string {
  const { description, brandProfile } = params

  const parts = [
    description,
    brandProfile ? getStyleModifier(brandProfile.styleDirection) : '',
    brandProfile?.keywords.join(', ') || '',
    'single centered icon',
    brandProfile ? getColorInstruction(brandProfile) : '',
    'white background',
    brandProfile ? getIconStyleModifier(brandProfile.iconStyle) : '',
    brandProfile ? getCornerStyleModifier(brandProfile.cornerStyle) : '',
    'clean professional app icon design',
    'high quality, vector-style rendering',
    'no text, no letters, no watermark',
    'square composition, symmetric',
  ]

  return parts.filter(Boolean).join(', ')
}

function getStyleModifier(direction: StyleDirection): string {
  const map: Record<StyleDirection, string> = {
    minimal: 'clean lines, simple shapes, whitespace, understated, elegant simplicity',
    playful: 'rounded shapes, vibrant, friendly, bouncy, cheerful, soft edges',
    corporate: 'professional, structured, balanced, trustworthy, refined',
    tech: 'geometric, futuristic, sleek, digital, modern, sharp',
    custom: '',
  }
  return map[direction]
}

function getIconStyleModifier(style: IconStyle): string {
  const map: Record<IconStyle, string> = {
    outline: 'thin outline, stroke-based, line art, no fill',
    filled: 'solid fill, bold shapes, flat design',
    '3d_soft': 'soft 3D render, subtle shadows, rounded, depth',
    flat: 'flat design, solid colors, no shadows, minimal',
  }
  return map[style]
}

function getCornerStyleModifier(style: CornerStyle): string {
  const map: Record<CornerStyle, string> = {
    sharp: 'sharp corners, angular, precise edges',
    rounded: 'rounded corners, soft edges',
    pill: 'fully rounded, pill shape, circular elements',
  }
  return map[style]
}

function getColorInstruction(profile: {
  colorMode: ColorMode
  primaryColor: string
  secondaryColors?: string[]
}): string {
  const { colorMode, primaryColor, secondaryColors = [] } = profile

  switch (colorMode) {
    case 'mono':
      return `monochrome, single color ${primaryColor}`
    case 'duotone':
      return `duotone, ${primaryColor} and ${secondaryColors[0] || '#FFFFFF'}`
    case 'gradient':
      return `gradient from ${primaryColor} to ${secondaryColors[0] || '#FFFFFF'}`
    case 'vibrant':
      return `vibrant colors, ${primaryColor} as primary accent`
    default:
      return ''
  }
}

function buildNegativePrompt(params: GenerateIconParams): string {
  const base = [
    'text', 'letters', 'words', 'typography', 'watermark', 'signature',
    'blurry', 'low quality', 'distorted', 'asymmetric',
    'multiple objects', 'busy composition', 'realistic photo',
  ]

  const { brandProfile } = params
  if (brandProfile?.colorMode === 'mono') {
    base.push('gradients', 'multiple colors')
  }
  if (brandProfile?.iconStyle === 'flat') {
    base.push('shadows', '3d', 'depth')
  }

  return base.join(', ')
}
```

---

## 4. 사용량 추적

### 4.1 API Route에서 사용량 체크/증가

```typescript
// app/api/ai/icons/route.ts
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 1. 플랜 체크
  const { data: userData } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (userData?.plan !== 'pro') {
    return NextResponse.json(
      { error: 'AI 아이콘 생성은 Pro 플랜 전용 기능입니다.' },
      { status: 403 }
    )
  }

  // 2. 사용량 체크
  const usageCheck = await checkUsage(
    supabase,
    user.id,
    'ai_icons_used_this_month'
  )

  if (!usageCheck.allowed) {
    return NextResponse.json(
      { error: '이번 달 AI 아이콘 생성 횟수를 모두 사용했습니다.' },
      { status: 429 }
    )
  }

  // 3. AI 생성
  const body = await request.json()
  const result = await generateIcon(body)

  // 4. 사용량 증가
  await incrementUsage(supabase, user.id, 'ai_icons_used_this_month')

  return NextResponse.json({ images: result })
}
```

---

## 5. 심볼 라이브러리 준비

### 5.1 SVG 파일 규격

- 크기: 24x24px viewBox
- 단색: `currentColor` 사용 (동적 컬러 적용 가능)
- 최적화: SVGO로 압축
- 네이밍: kebab-case (briefcase.svg, chart-bar.svg)

### 5.2 예시 SVG

```svg
<!-- public/icons/symbols/business/briefcase.svg -->
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
</svg>
```

### 5.3 심볼 메타데이터

```typescript
// lib/assets/symbol-library.ts
export interface SymbolMetadata {
  id: string
  name: string
  category: string
  path: string
  keywords: string[]
}

export const symbolLibrary: SymbolMetadata[] = [
  {
    id: 'briefcase',
    name: 'Briefcase',
    category: 'business',
    path: '/icons/symbols/business/briefcase.svg',
    keywords: ['work', 'job', 'business', 'case'],
  },
  // ... 최소 50개 심볼
]

export const categories = [
  { id: 'all', label: '전체' },
  { id: 'business', label: '비즈니스' },
  { id: 'tech', label: '테크' },
  { id: 'design', label: '디자인' },
  { id: 'social', label: '소셜' },
  { id: 'misc', label: '기타' },
]
```

---

## 기술적 주의사항

### 1. fal.ai Flux Schnell 속도
- 4개 이미지 생성 시간: 약 5-10초
- 로딩 UI 필수 (progress bar 또는 스피너)
- 타임아웃 설정: 30초

### 2. AI 생성 실패 대응
- 네트워크 에러 → 재시도 버튼 제공
- fal.ai 응답 지연 → "생성 중입니다. 잠시만 기다려주세요" 안내
- 결과 품질 불만족 → "다시 생성" 버튼 (사용량 추가 차감)

### 3. 심볼 SVG 로딩
- 동적 import 또는 `<img src>` 사용
- Next.js Image 컴포넌트는 SVG 최적화 안 함 → 일반 `<img>` 권장
- 실시간 컬러 적용: CSS `filter` 또는 inline SVG + `currentColor`

### 4. 프리셋 프리뷰 이미지
- 각 프리셋마다 대표 이미지 준비 (OG 이미지 샘플)
- `public/presets/` 디렉토리에 저장
- 또는 placeholder gradient 사용

---

## 검증 방법

### 검증 1: 스타일 프리셋 추천

```
1. Brand Profile "Minimal" 선택 → Step 3에서 Notion Minimal이 첫 번째로 추천
2. Brand Profile "Playful" → Airbnb 3D가 첫 번째
3. Free 사용자 → Pro 프리셋 클릭 시 잠금 오버레이
```

### 검증 2: 컬러 오버라이드

```
1. Brand Profile 컬러 유지 → primary_color 사용
2. "이 프로젝트만 다른 컬러" 체크 → ColorPicker 표시 → 선택한 컬러 적용
```

### 검증 3: 텍스트 아이콘

```
1. 프로젝트명 "TaskFlow" → 기본값 'T' 자동 입력
2. 커스텀 입력 "AB" → 프리뷰 업데이트
3. 실시간 프리뷰: 선택한 스타일 + 컬러 반영
```

### 검증 4: 심볼 선택

```
1. 카테고리 "비즈니스" → 필터링된 심볼 표시
2. 심볼 클릭 → 선택 상태 + 프리뷰
3. SVG 컬러가 Brand Profile 컬러로 적용
```

### 검증 5: AI 아이콘 생성

```
1. Free 사용자 → 탭 잠금 + Pro 안내
2. Pro 사용자: 설명 입력 → "4개 옵션 생성" → 로딩 → 4개 이미지 표시
3. 이미지 클릭 → 선택
4. 사용량 증가 확인 (ai_icons_used_this_month + 1)
```
