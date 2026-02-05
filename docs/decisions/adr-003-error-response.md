# ADR-003: 에러 응답 표준화

## 상태
승인됨 (2026-02-05)

## 컨텍스트

기존 API 라우트들에서 에러 응답 형식이 일관되지 않았습니다:

```typescript
// 형식 1: 단순 에러
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// 형식 2: 에러 + 메시지
return NextResponse.json(
  { error: 'USAGE_LIMIT_EXCEEDED', message: 'AI headline usage limit exceeded' },
  { status: 429 }
)

// 형식 3: 에러 + 상세 정보
return NextResponse.json(
  { error: 'USAGE_LIMIT_EXCEEDED', message: '...', current: 5, limit: 10 },
  { status: 429 }
)
```

이로 인한 문제:
1. 클라이언트에서 에러 파싱 로직이 복잡해짐
2. 에러 메시지의 일관성 부족 (영어/한국어 혼용)
3. 에러 처리 코드 중복

## 결정

### 1. 통일된 에러 응답 형식

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "사용자에게 표시할 메시지"
  }
}
```

### 2. 에러 클래스 사용

모든 API에서 `lib/utils/errors.ts`의 에러 클래스를 사용:

```typescript
// Before
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// After
throw new UnauthorizedError()
```

### 3. handleApiError 함수 활용

```typescript
export async function POST(request: Request) {
  try {
    // 비즈니스 로직
  } catch (error) {
    return handleApiError(error)
  }
}
```

### 4. 한국어 메시지 통일

모든 사용자 메시지는 한국어로 작성:

```typescript
export class UnauthorizedError extends AppError {
  constructor(message = '인증이 필요합니다.') {
    super(message, 'UNAUTHORIZED', 401, '로그인이 필요합니다.')
  }
}
```

## 결과

### 긍정적 영향
- 클라이언트에서 일관된 에러 처리 가능
- 코드 중복 제거
- 타입 안전한 에러 처리
- 사용자 친화적인 한국어 메시지

### 부정적 영향
- 기존 클라이언트 코드 수정 필요 (에러 파싱 로직)

## 관련 파일
- `lib/utils/errors.ts` - 에러 클래스 및 핸들러
- `app/api/ai/headlines/route.ts` - 수정됨
- `app/api/ai/icons/route.ts` - 수정됨
- `app/api/assets/generate/route.ts` - 수정됨

## 참고
- [RFC 7807 - Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc7807)
