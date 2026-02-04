# Phase 09: 에러 처리 + UX 다듬기

## 목표

전체 애플리케이션의 에러 처리, 로딩 상태, 엣지 케이스 대응, UX 개선을 구현한다. 일관된 에러 바운더리, API 에러 응답 형식, 토스트 알림, 재시도 로직을 포함한다.

---

## 생성/수정 파일 목록

| 파일 경로 | 작업 | 설명 |
|-----------|------|------|
| `lib/utils/errors.ts` | 생성 | 에러 클래스 + 핸들러 |
| `components/error/error-boundary.tsx` | 생성 | React Error Boundary |
| `components/error/error-fallback.tsx` | 생성 | 에러 화면 UI |
| `app/error.tsx` | 생성 | Root 에러 바운더리 |
| `app/(dashboard)/error.tsx` | 생성 | Dashboard 에러 바운더리 |
| `components/shared/loading-spinner.tsx` | 생성 | 공통 로딩 스피너 |
| `components/shared/skeleton.tsx` | 생성 | 스켈레톤 로더 |
| `components/shared/empty-state.tsx` | 생성 | 빈 상태 UI |
| `hooks/use-toast.ts` | 수정 | 토스트 헬퍼 확장 |
| `middleware.ts` | 수정 | 에러 로깅 추가 |

---

## 1. 에러 타입 계층

### 1.1 `lib/utils/errors.ts`

```typescript
// ── Base Error ──
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public userMessage?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// ── 인증 에러 ──
export class UnauthorizedError extends AppError {
  constructor(message = '인증이 필요합니다.') {
    super(message, 'UNAUTHORIZED', 401, '로그인이 필요합니다.')
  }
}

// ── 권한 에러 ──
export class ForbiddenError extends AppError {
  constructor(message = '권한이 없습니다.') {
    super(message, 'FORBIDDEN', 403, '이 작업을 수행할 권한이 없습니다.')
  }
}

// ── 리소스 없음 ──
export class NotFoundError extends AppError {
  constructor(resource = '리소스') {
    super(`${resource}를 찾을 수 없습니다.`, 'NOT_FOUND', 404)
  }
}

// ── 사용량 제한 ──
export class UsageLimitError extends AppError {
  constructor(resource: string, limit: number) {
    super(
      `${resource} 사용량 한도를 초과했습니다. (${limit}개)`,
      'USAGE_LIMIT_EXCEEDED',
      429,
      `이번 달 ${resource} 사용량(${limit}개)을 모두 사용했습니다. Pro 플랜으로 업그레이드하세요.`
    )
  }
}

// ── 플랜 필요 ──
export class PlanRequiredError extends AppError {
  constructor(feature: string) {
    super(
      `${feature}는 Pro 플랜 전용 기능입니다.`,
      'PLAN_REQUIRED',
      403,
      `${feature}는 Pro 플랜에서 사용할 수 있습니다.`
    )
  }
}

// ── 유효성 검증 ──
export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR', 400, message)
  }
}

// ── AI 생성 실패 ──
export class AIGenerationError extends AppError {
  constructor(service: 'claude' | 'fal') {
    super(
      `${service} AI 생성에 실패했습니다.`,
      'AI_GENERATION_FAILED',
      500,
      'AI 생성에 실패했습니다. 잠시 후 다시 시도해주세요.'
    )
  }
}

// ── 에러 핸들러 ──
export function handleApiError(error: unknown): Response {
  console.error('API Error:', error)

  if (error instanceof AppError) {
    return Response.json(
      {
        error: {
          code: error.code,
          message: error.userMessage || error.message,
        },
      },
      { status: error.statusCode }
    )
  }

  // 예상치 못한 에러
  return Response.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
    { status: 500 }
  )
}
```

---

## 2. API 에러 응답 일관성

### 2.1 표준 에러 응답 형식

```typescript
interface ApiErrorResponse {
  error: {
    code: string
    message: string
    fields?: Record<string, string>  // 유효성 에러 시
  }
}
```

### 2.2 API Route 예시

```typescript
// app/api/*/route.ts
import { handleApiError, UnauthorizedError, ValidationError } from '@/lib/utils/errors'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new UnauthorizedError()
    }

    // 비즈니스 로직...

    return Response.json({ data: result })
  } catch (error) {
    return handleApiError(error)
  }
}
```

---

## 3. Error Boundary

### 3.1 `components/error/error-boundary.tsx`

```typescript
'use client'

import { Component, type ReactNode } from 'react'
import { ErrorFallback } from './error-fallback'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallback
          error={this.state.error!}
          resetError={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}
```

### 3.2 `components/error/error-fallback.tsx`

```typescript
interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold">문제가 발생했습니다</h1>
        <p className="text-gray-600">
          {error.message || '알 수 없는 오류가 발생했습니다.'}
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={resetError}>다시 시도</Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            홈으로
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### 3.3 `app/error.tsx` (Root Error Boundary)

```typescript
'use client'

import { useEffect } from 'react'
import { ErrorFallback } from '@/components/error/error-fallback'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Root Error:', error)
  }, [error])

  return <ErrorFallback error={error} resetError={reset} />
}
```

---

## 4. 로딩 상태

### 4.1 `components/shared/loading-spinner.tsx`

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }[size]

  return (
    <Loader2 className={cn('animate-spin', sizeClass, className)} />
  )
}
```

### 4.2 `components/shared/skeleton.tsx`

```typescript
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  )
}

// 프리셋: Card Skeleton
export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

// 프리셋: Table Skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}
```

### 4.3 Next.js `loading.tsx`

```typescript
// app/(dashboard)/loading.tsx
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
```

---

## 5. 빈 상태

### 5.1 `components/shared/empty-state.tsx`

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-5xl opacity-50">{icon}</div>}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  )
}
```

**사용 예시:**

```typescript
// Brand Profile 목록이 비어있을 때
<EmptyState
  icon="📁"
  title="브랜드 프로필이 없습니다"
  description="첫 번째 브랜드 프로필을 만들어보세요."
  action={{
    label: "브랜드 만들기",
    onClick: () => openCreateForm()
  }}
/>
```

---

## 6. 토스트 알림

### 6.1 `hooks/use-toast.ts` 확장

```typescript
import { toast as sonnerToast } from 'sonner'

export const toast = {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  loading: (message: string) => sonnerToast.loading(message),
  promise: sonnerToast.promise,

  // 커스텀 헬퍼
  apiError: (error: unknown) => {
    const message = error instanceof Error
      ? error.message
      : '오류가 발생했습니다.'
    sonnerToast.error(message)
  },

  usageLimitReached: (resource: string) => {
    sonnerToast.error(`이번 달 ${resource} 사용량을 모두 사용했습니다.`, {
      action: {
        label: 'Pro 업그레이드',
        onClick: () => window.location.href = '/settings/billing',
      },
    })
  },

  planRequired: (feature: string) => {
    sonnerToast.error(`${feature}는 Pro 플랜 전용 기능입니다.`, {
      action: {
        label: '플랜 보기',
        onClick: () => window.location.href = '/settings/billing',
      },
    })
  },
}
```

---

## 7. 재시도 로직

### 7.1 AI 생성 재시도

```typescript
async function generateWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      console.warn(`Attempt ${i + 1} failed:`, error)

      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError!
}

// 사용:
const result = await generateWithRetry(
  () => generateHeadlines(params),
  3,
  2000
)
```

### 7.2 Polling 타임아웃

```typescript
// hooks/use-asset-generation.ts 수정
const POLLING_TIMEOUT = 5 * 60 * 1000  // 5분
const startTime = Date.now()

const interval = setInterval(async () => {
  if (Date.now() - startTime > POLLING_TIMEOUT) {
    clearInterval(interval)
    setError('에셋 생성 시간이 초과되었습니다. 다시 시도해주세요.')
    return
  }

  // polling 로직...
}, 2000)
```

---

## 8. 엣지 케이스 대응

### 8.1 Brand Profile 없이 위자드 진입

```
시나리오: 사용자가 Brand Profile을 하나도 생성하지 않고 위자드 진입
대응: Step 0에서 "새 브랜드 만들기" 또는 "브랜드 없이 진행" 선택 강제
```

### 8.2 AI 생성 실패 폴백

```typescript
// AI 헤드라인 생성 실패 시
if (error) {
  // 프로젝트명 기반 기본값 제공
  const fallback = {
    headline: projectName,
    tagline: description?.substring(0, 30) || projectName,
    ogDescription: description?.substring(0, 155) || '',
    shortSlogan: projectName.substring(0, 15),
  }

  setProject(fallback)
  toast.error('AI 생성에 실패했습니다. 기본값을 사용합니다.')
}
```

### 8.3 에셋 생성 부분 실패

```typescript
// Favicon 생성 성공, OG Image 실패 시
try {
  results.favicons = await generateFavicons(input)
} catch (error) {
  console.error('Favicon generation failed:', error)
  results.favicons = null  // 부분 실패 허용
}

// ZIP에 생성된 에셋만 포함
if (results.favicons) {
  // ZIP에 추가
}

// 실패한 에셋은 README에 명시
```

### 8.4 네트워크 오프라인

```typescript
// 클라이언트에서 오프라인 감지
useEffect(() => {
  const handleOffline = () => {
    toast.error('인터넷 연결이 끊어졌습니다.')
  }

  const handleOnline = () => {
    toast.success('인터넷 연결이 복구되었습니다.')
  }

  window.addEventListener('offline', handleOffline)
  window.addEventListener('online', handleOnline)

  return () => {
    window.removeEventListener('offline', handleOffline)
    window.removeEventListener('online', handleOnline)
  }
}, [])
```

### 8.5 세션 만료

```typescript
// API 401 응답 시 자동 로그인 페이지 리다이렉트
async function apiClient(url: string, options?: RequestInit) {
  const response = await fetch(url, options)

  if (response.status === 401) {
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
    throw new UnauthorizedError()
  }

  return response
}
```

---

## 9. 유효성 검증 피드백

### 9.1 실시간 유효성 검증

```typescript
// react-hook-form + zod
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onBlur',  // blur 시 검증
})

// 개별 필드 에러 표시
<Input
  {...form.register('name')}
  error={form.formState.errors.name?.message}
/>
```

### 9.2 제출 전 검증

```typescript
async function handleSubmit(data: FormData) {
  // 1. 클라이언트 검증
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    toast.error(parsed.error.issues[0].message)
    return
  }

  // 2. 서버 제출
  try {
    await createBrandProfile(parsed.data)
    toast.success('브랜드 프로필이 생성되었습니다.')
  } catch (error) {
    toast.apiError(error)
  }
}
```

---

## 기술적 주의사항

### 1. Error Boundary 범위
- Root: 전체 앱 catch
- Dashboard Layout: 대시보드 영역 catch
- 위자드: 스텝별 catch (선택)

### 2. 에러 로깅
- 개발: `console.error`
- 프로덕션: Sentry 등 외부 서비스 (Phase 10)
- 민감 정보 제외

### 3. 토스트 중복 방지
- 동일 메시지 연속 표시 방지
- `toast.promise`로 로딩 → 성공/실패 자동 전환

### 4. Skeleton vs Spinner
- 전체 페이지 로딩: Spinner
- 컨텐츠 영역 로딩: Skeleton
- 버튼 로딩: disabled + Spinner

---

## 검증 시나리오

### 시나리오 1: AI 생성 실패

```
1. Claude API 키 잘못 설정
2. AI 헤드라인 생성 시도
3. "AI 생성에 실패했습니다" 토스트
4. 기본값 자동 입력
5. 위자드 진행 가능
```

### 시나리오 2: 사용량 초과

```
1. Free 사용자: 프로젝트 3개 생성
2. 4번째 시도
3. "이번 달 프로젝트 사용량을 모두 사용했습니다" 토스트
4. "Pro 업그레이드" 버튼 표시
5. 클릭 시 빌링 페이지 이동
```

### 시나리오 3: 에셋 생성 타임아웃

```
1. 위자드 완료 → 에셋 생성 시작
2. 5분 경과
3. Polling 타임아웃
4. "에셋 생성 시간이 초과되었습니다" 에러
5. "다시 생성" 버튼 활성화
```

### 시나리오 4: 네트워크 오프라인

```
1. WiFi 끄기
2. 폼 제출 시도
3. "인터넷 연결이 끊어졌습니다" 토스트
4. WiFi 켜기
5. "인터넷 연결이 복구되었습니다" 토스트
```

### 시나리오 5: 세션 만료

```
1. 로그인 후 8시간 경과 (세션 만료)
2. API 요청 시도
3. 401 응답 수신
4. 자동으로 /login?redirect=... 리다이렉트
```
