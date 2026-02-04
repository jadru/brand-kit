# Phase 07: 프리뷰 & 다운로드

## 목표

위자드 Step 5 (프리뷰 + 다운로드)를 구현한다. 에셋 생성 polling 패턴, 플랫폼별 프리뷰 탭(Web/Mobile/Code), ZIP 다운로드, 프로젝트 DB 저장, 재다운로드 페이지를 포함한다.

---

## 생성/수정 파일 목록

| 파일 경로 | 작업 | 설명 |
|-----------|------|------|
| `components/wizard/step-5-preview.tsx` | 생성 | 프리뷰 & 다운로드 UI |
| `components/preview/web-preview.tsx` | 생성 | Web 에셋 프리뷰 |
| `components/preview/mobile-preview.tsx` | 생성 | Mobile 에셋 프리뷰 |
| `components/preview/code-preview.tsx` | 생성 | 코드 스니펫 프리뷰 |
| `components/preview/browser-mockup.tsx` | 생성 | 브라우저 탭 목업 |
| `components/preview/phone-mockup.tsx` | 생성 | 폰 프레임 목업 |
| `components/preview/social-card-preview.tsx` | 생성 | OG 이미지 프리뷰 |
| `app/(dashboard)/projects/[id]/page.tsx` | 생성 | 프로젝트 상세/재다운로드 |
| `app/api/assets/status/[projectId]/route.ts` | 생성 | 에셋 생성 상태 polling |
| `app/api/assets/download/[projectId]/route.ts` | 생성 | ZIP 다운로드 |

---

## 1. Step 5: 프리뷰 & 다운로드

### 1.1 전체 흐름

```
[사용자가 Step 4 완료 → "다음" 클릭]
  ↓
[프로젝트 DB 저장 (status: draft)]
  ↓
[POST /api/assets/generate 호출 → status: generating]
  ↓
[Polling: GET /api/assets/status/:projectId 반복 (2초마다)]
  ↓
[status === 'completed' → ZIP URL 수신]
  ↓
[프리뷰 UI 표시 + 다운로드 버튼 활성화]
```

### 1.2 UI 구성

```
┌──────────────────────────────────────────────┐
│  [생성 중...]  OR  [Web | Mobile | Code]      │
│                                               │
│  {탭별 프리뷰 내용}                            │
│                                               │
│  [🔄 다시 생성]  [⬇️ 모든 에셋 다운로드]       │
└──────────────────────────────────────────────┘
```

### 1.3 생성 중 로딩 UI

```typescript
function GeneratingState({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-12 w-12 animate-spin" />
      <p className="mt-4 text-lg font-medium">에셋 생성 중...</p>
      <p className="mt-2 text-sm text-gray-600">
        플랫폼별 에셋을 생성하고 있습니다. 최대 1분 소요됩니다.
      </p>
      <div className="mt-6 w-full max-w-md">
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-brand transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-gray-500">{progress}%</p>
      </div>
    </div>
  )
}
```

**Progress 추정:**
- 0-20%: 프로젝트 저장 완료
- 20-40%: Favicon 생성
- 40-60%: OG 이미지 생성
- 60-80%: 앱 아이콘 생성
- 80-100%: ZIP 패키징 & 업로드

(실제로는 백엔드에서 progress 전달 불가능하므로, 클라이언트에서 시간 기반 추정)

---

## 2. Polling 패턴

### 2.1 `app/api/assets/status/[projectId]/route.ts`

```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: project } = await supabase
    .from('projects')
    .select('status, assets_zip_url')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  return NextResponse.json({
    status: project.status,
    url: project.assets_zip_url,
  })
}
```

### 2.2 클라이언트 Polling Hook

```typescript
// hooks/use-asset-generation.ts
import { useEffect, useState } from 'react'

interface UseAssetGenerationOptions {
  projectId: string
  enabled: boolean
}

export function useAssetGeneration({ projectId, enabled }: UseAssetGenerationOptions) {
  const [status, setStatus] = useState<'generating' | 'completed' | 'failed'>('generating')
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/assets/status/${projectId}`)
        const data = await res.json()

        setStatus(data.status)

        if (data.status === 'completed') {
          setUrl(data.url)
          clearInterval(interval)
        } else if (data.status === 'failed') {
          setError('에셋 생성에 실패했습니다.')
          clearInterval(interval)
        }
      } catch (err) {
        setError(err.message)
        clearInterval(interval)
      }
    }, 2000)  // 2초마다 polling

    return () => clearInterval(interval)
  }, [projectId, enabled])

  return { status, url, error }
}
```

---

## 3. 프리뷰 탭

### 3.1 Web 프리뷰 (`components/preview/web-preview.tsx`)

```
┌─ Web 에셋 ─────────────────────────────────┐
│                                             │
│  Favicon        OG Image       Twitter Card │
│  ┌────┐        ┌──────────┐   ┌─────────┐  │
│  │ T  │        │ TaskFlow │   │TaskFlow │  │
│  └────┘        │ 복잡한... │   │         │  │
│                └──────────┘   └─────────┘  │
│                                             │
│  PWA Manifest ✓                             │
└─────────────────────────────────────────────┘
```

**컴포넌트:**
- Favicon 프리뷰: 작은 아이콘 표시 (16x16, 32x32)
- OG Image: Social Card 목업에 렌더링
- Twitter Card: 동일
- PWA 아이콘: 192x192, 512x512 표시

### 3.2 Mobile 프리뷰 (`components/preview/mobile-preview.tsx`)

```
┌─ Mobile 에셋 (Both 선택됨) ─────────────────┐
│                                             │
│  iOS App Icon  Android Icon  Splash Screen  │
│  ┌────────┐   ┌────────┐    ┌──────────┐   │
│  │   T    │   │   T    │    │    T     │   │
│  │        │   │        │    │ TaskFlow │   │
│  └────────┘   └────────┘    └──────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**컴포넌트:**
- Phone Mockup: 실제 기기 프레임에 스플래시 스크린 렌더링
- 앱 아이콘: 홈 스크린 목업

### 3.3 Code 프리뷰 (`components/preview/code-preview.tsx`)

```
┌─ 코드 스니펫 ──────────────────────────────┐
│  [Next.js ▼]                               │
│                                             │
│  // app/layout.tsx                          │
│  export const metadata: Metadata = {        │
│    title: 'TaskFlow',                       │
│    ...                                      │
│  };                          [📋 Copy]      │
│                                             │
└─────────────────────────────────────────────┘
```

**프레임워크 선택:**
- Next.js (App Router)
- React (CRA/Vite)
- HTML (Static)
- iOS (Info.plist)
- Android (strings.xml)

**구문 강조:** `react-syntax-highlighter` 또는 `prism-react-renderer`

---

## 4. 목업 컴포넌트

### 4.1 Browser Mockup (`components/preview/browser-mockup.tsx`)

```typescript
interface BrowserMockupProps {
  favicon: string  // Favicon URL
  title: string
  url: string
}
```

**UI:** Chrome 탭 스타일
- 주소창 + 파비콘 + 페이지 제목
- 반응형: 데스크톱 크기

### 4.2 Phone Mockup (`components/preview/phone-mockup.tsx`)

```typescript
interface PhoneMockupProps {
  screenshot: string  // Splash screen 이미지 URL
  device: 'iphone' | 'android'
}
```

**UI:** 기기 프레임 SVG + 스크린샷 오버레이
- iPhone 14 Pro 프레임
- Android Pixel 프레임

### 4.3 Social Card Preview (`components/preview/social-card-preview.tsx`)

```typescript
interface SocialCardPreviewProps {
  imageUrl: string
  title: string
  description: string
  type: 'og' | 'twitter'
}
```

**UI:** Facebook/Twitter 게시물 목업
- 프로필 이미지 placeholder
- 게시물 텍스트 + OG 이미지
- 좋아요/댓글 버튼 (비활성)

---

## 5. 다운로드 API

### 5.1 `app/api/assets/download/[projectId]/route.ts`

```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { data: project } = await supabase
    .from('projects')
    .select('assets_zip_url, name')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project || !project.assets_zip_url) {
    return new Response('Not found', { status: 404 })
  }

  // Supabase Storage에서 파일 다운로드
  const response = await fetch(project.assets_zip_url)
  const buffer = await response.arrayBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${project.name}-assets.zip"`,
    },
  })
}
```

---

## 6. 프로젝트 상세 페이지

### 6.1 `app/(dashboard)/projects/[id]/page.tsx`

**Server Component (데이터 fetch)**

```typescript
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: project } = await supabase
    .from('projects')
    .select('*, brand_profiles(*), style_presets(*)')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!project) notFound()

  return <ProjectDetailClient project={project} />
}
```

**UI:**
- 프로젝트 정보 요약 (이름, 플랫폼, 생성일)
- 상태 배지 (생성 중 / 완료 / 실패)
- 프리뷰 탭 (Step 5와 동일)
- "다운로드" 버튼
- "다시 생성" 버튼

---

## 7. 프로젝트 저장

### 7.1 위자드 완료 시 프로젝트 INSERT

```typescript
// components/wizard/wizard-shell.tsx
async function handleComplete() {
  const state = useWizardStore.getState()

  // 1. 프로젝트 INSERT
  const { data: project } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      brand_profile_id: state.brand.brandProfileId,
      style_preset_id: state.style.stylePresetId!,
      name: state.project.name,
      description: state.project.description,
      platform: state.platform.platform,
      mobile_target: state.platform.mobileTarget,
      primary_color_override: state.style.primaryColorOverride,
      icon_type: state.icon.iconType,
      icon_value: state.icon.iconValue,
      ai_headline: state.project.aiHeadline,
      ai_tagline: state.project.aiTagline,
      ai_og_description: state.project.aiOgDescription,
      ai_short_slogan: state.project.aiShortSlogan,
      status: 'draft',
    })
    .select()
    .single()

  // 2. 에셋 생성 API 호출
  await fetch('/api/assets/generate', {
    method: 'POST',
    body: JSON.stringify({ projectId: project.id }),
  })

  // 3. Polling 시작 (useAssetGeneration hook)
}
```

---

## 8. 재생성

### 8.1 "다시 생성" 버튼

```typescript
async function handleRegenerate(projectId: string) {
  // 1. 상태 리셋
  await supabase
    .from('projects')
    .update({ status: 'draft', assets_zip_url: null })
    .eq('id', projectId)

  // 2. 에셋 생성 재호출
  await fetch('/api/assets/generate', {
    method: 'POST',
    body: JSON.stringify({ projectId }),
  })

  // 3. Polling 재시작
}
```

---

## 기술적 주의사항

### 1. Polling 최적화
- 2초 간격 (너무 짧으면 서버 부하)
- 최대 5분 후 타임아웃
- `completed` 또는 `failed` 시 즉시 중단

### 2. ZIP 다운로드 성능
- Vercel Serverless: 응답 크기 제한 4.5MB
- ZIP이 4.5MB 초과 시 Signed URL로 직접 다운로드 링크 제공
- 브라우저 `<a download>` 사용

### 3. 프리뷰 이미지 로딩
- Supabase Storage Signed URL은 24시간 유효
- 만료 시 재생성 필요
- 또는 public URL 사용 (버킷 설정)

### 4. 사용량 증가 타이밍
- 프로젝트 생성 시점에 `projects_used_this_month + 1`
- "다시 생성"은 사용량 차감 없음 (동일 프로젝트)

---

## 검증 방법

### 검증 1: 에셋 생성 플로우

```
1. 위자드 Step 4 완료 → "다음"
2. 로딩 화면 표시 (progress bar)
3. 2초마다 status API 호출
4. status: completed → 프리뷰 표시
5. "다운로드" → ZIP 파일 저장
```

### 검증 2: 프리뷰 탭

```
1. Web 탭: Favicon, OG Image 표시
2. Mobile 탭: 앱 아이콘, Splash (플랫폼별 필터링)
3. Code 탭: 프레임워크 선택 → 스니펫 전환
4. 복사 버튼 → 클립보드 확인
```

### 검증 3: 재다운로드

```
1. /dashboard/projects → 프로젝트 클릭
2. /projects/:id 페이지 → 프리뷰 + 다운로드 버튼
3. 다운로드 → ZIP 파일 동일
4. "다시 생성" → 새 ZIP URL
```

### 검증 4: 실패 대응

```
1. Sharp 에러 시뮬레이션 → status: failed
2. 에러 메시지 표시 + "다시 생성" 버튼
3. 재시도 성공 확인
```
