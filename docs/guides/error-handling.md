# 에러 처리 가이드

## 개요

BrandKit 프로젝트는 일관된 에러 처리를 위해 커스텀 에러 클래스와 `handleApiError` 함수를 사용합니다.

## 에러 클래스 계층

```
AppError (기본 클래스)
├── UnauthorizedError (401) - 인증 필요
├── ForbiddenError (403) - 권한 없음
├── NotFoundError (404) - 리소스 없음
├── UsageLimitError (429) - 사용량 초과
├── PlanRequiredError (403) - Pro 플랜 필요
├── ValidationError (400) - 입력 검증 실패
└── AIGenerationError (500) - AI 생성 실패
```

## 사용법

### 1. 에러 클래스 import

```typescript
import {
  handleApiError,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
  UsageLimitError,
  PlanRequiredError,
  AIGenerationError,
  AppError,
} from '@/lib/utils/errors'
```

### 2. API 라우트 패턴

```typescript
export async function POST(request: Request) {
  try {
    // 1. 인증 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new UnauthorizedError()
    }

    // 2. 입력 검증
    const { projectId } = body as { projectId?: string }
    if (!projectId) {
      throw new ValidationError('프로젝트 ID가 필요합니다.')
    }

    // 3. 리소스 확인
    const { data, error } = await supabase.from('projects').select('*')...
    if (error || !data) {
      throw new NotFoundError('프로젝트')
    }

    // 4. 권한/플랜 확인
    if (user.plan !== 'pro') {
      throw new PlanRequiredError('이 기능')
    }

    // 5. 사용량 확인
    const usage = await checkUsage(...)
    if (!usage.allowed) {
      throw new UsageLimitError('AI 헤드라인', usage.limit)
    }

    // 6. 비즈니스 로직
    const result = await doSomething()
    return Response.json(result)

  } catch (error) {
    return handleApiError(error)
  }
}
```

### 3. 에러 응답 형식

모든 에러는 다음 형식으로 응답됩니다:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "프로젝트 ID가 필요합니다."
  }
}
```

### 4. 에러 코드 목록

| 코드 | HTTP | 설명 |
|------|------|------|
| `UNAUTHORIZED` | 401 | 인증되지 않음 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `VALIDATION_ERROR` | 400 | 입력 검증 실패 |
| `USAGE_LIMIT_EXCEEDED` | 429 | 사용량 한도 초과 |
| `PLAN_REQUIRED` | 403 | Pro 플랜 필요 |
| `AI_GENERATION_FAILED` | 500 | AI 생성 실패 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

## 커스텀 에러 생성

```typescript
// AppError를 상속하여 커스텀 에러 생성
throw new AppError(
  '기술적 에러 메시지',  // 로그용
  'CUSTOM_ERROR_CODE',
  500,
  '사용자에게 표시할 메시지'  // 선택적
)
```

## 재시도 로직

AI 생성 등 실패 가능성이 있는 작업:

```typescript
import { generateWithRetry } from '@/lib/utils/errors'

const result = await generateWithRetry(
  () => generateHeadlines(params),
  3,     // 최대 재시도 횟수
  1000   // 기본 지연 시간 (ms)
)
```

## 참고 파일

- `lib/utils/errors.ts` - 에러 클래스 및 핸들러
- `app/api/*/route.ts` - API 라우트 구현 예시
