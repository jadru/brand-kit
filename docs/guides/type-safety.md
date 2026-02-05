# TypeScript 타입 안전성 가이드

## 개요

이 문서는 BrandKit 프로젝트에서 타입 안전성을 유지하기 위한 가이드라인을 제공합니다.

## 핵심 원칙

### 1. `any` 타입 사용 금지

```typescript
// Bad
const data: any = response.data

// Good
const data: User = response.data as User
```

### 2. 명시적 타입 정의

```typescript
// Bad
const user = await supabase.from('users').select('*').single()

// Good
const { data: user, error } = await supabase
  .from('users')
  .select('plan, projects_used_this_month')
  .eq('id', userId)
  .single()

const userData = user as Pick<User, 'plan' | 'projects_used_this_month'>
```

## Supabase 타입 처리

### 기본 패턴

```typescript
import type { User, Project, BrandProfile } from '@/types/database'

// 1. 쿼리 실행
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('id', projectId)
  .single()

// 2. 에러 체크
if (error || !data) {
  throw new Error('Project not found')
}

// 3. 명시적 타입 변환
const project = data as Project
```

### 필드 선택 시 타입

```typescript
// 필요한 필드만 선택하고 타입 지정
const { data } = await supabase
  .from('users')
  .select('plan, ai_headlines_used_this_month')
  .eq('id', userId)
  .single()

type UserUsage = Pick<User, 'plan' | 'ai_headlines_used_this_month'>
const userData = data as UserUsage
```

## 웹훅 타입 처리

### LemonSqueezy 웹훅

```typescript
import type {
  LemonSqueezyWebhookPayload,
  LemonSqueezySubscriptionData,
} from '@/types/lemonsqueezy'

// 파싱 후 타입 지정
const event = JSON.parse(body) as LemonSqueezyWebhookPayload
const data: LemonSqueezySubscriptionData = event.data

// 핸들러 함수 타입
async function handleSubscriptionCreated(
  data: LemonSqueezySubscriptionData
): Promise<void> {
  const userId = data.attributes.custom_data?.user_id
  // ...
}
```

## API 응답 타입

### 요청 본문 파싱

```typescript
// Bad
const body = await request.json()
const { projectId } = body

// Good
const body = await request.json()
const { projectId } = body as { projectId?: string }
```

### 응답 타입

```typescript
interface ApiErrorResponse {
  error: string
  message?: string
}

interface ApiSuccessResponse<T> {
  success: true
  data: T
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
```

## 타입 정의 파일 구조

```
types/
├── database.ts      # Supabase 테이블 타입 (User, Project, BrandProfile 등)
├── lemonsqueezy.ts  # LemonSqueezy 웹훅 타입
├── wizard.ts        # 위저드 관련 타입
└── index.ts         # 공통 타입 re-export
```

## 권장사항

### DO

- `type` import 사용 (`import type { User } from ...`)
- 명시적 타입 annotation
- Pick, Omit 등 유틸리티 타입 활용
- 에러 체크 후 타입 변환

### DON'T

- `any` 타입 사용
- `as unknown as Type` 체인
- eslint-disable로 타입 에러 무시
- 암시적 `any` 허용

## 관련 ESLint 규칙

```javascript
// eslint.config.mjs
{
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/consistent-type-imports": "error",
}
```

## 참고 자료

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Supabase TypeScript Guide](https://supabase.com/docs/guides/api/rest/generating-types)
