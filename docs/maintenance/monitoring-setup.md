# 모니터링 설정 가이드

## 개요

BrandKit 프로젝트의 에러 추적 및 성능 모니터링을 위한 Sentry 설정 가이드입니다.

## Sentry 설치

```bash
yarn add @sentry/nextjs
```

## 초기 설정

### 1. Sentry 프로젝트 생성

1. [Sentry 대시보드](https://sentry.io)에서 새 프로젝트 생성
2. Platform: Next.js 선택
3. DSN 복사

### 2. 환경변수 설정

`.env.local`:
```bash
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_xxx  # 소스맵 업로드용
```

`.env.production`:
```bash
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_xxx
```

### 3. 설정 파일 생성

**sentry.client.config.ts**:
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // 환경 구분
  environment: process.env.NODE_ENV,

  // 샘플링 비율
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 세션 리플레이 (유료 기능)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // 개발 환경에서는 비활성화
  enabled: process.env.NODE_ENV === 'production',

  // 무시할 에러
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],

  // 이벤트 전 필터링
  beforeSend(event) {
    // 민감한 정보 제거
    if (event.request?.headers) {
      delete event.request.headers['Authorization']
      delete event.request.headers['Cookie']
    }
    return event
  },
})
```

**sentry.server.config.ts**:
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  enabled: process.env.NODE_ENV === 'production',
})
```

**sentry.edge.config.ts**:
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  enabled: process.env.NODE_ENV === 'production',
})
```

### 4. Next.js 설정 업데이트

**next.config.ts**:
```typescript
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig = {
  // 기존 설정...
}

export default withSentryConfig(nextConfig, {
  // 소스맵 업로드 설정
  org: 'your-sentry-org',
  project: 'brandkit',

  // 빌드 시 소스맵 자동 업로드
  silent: !process.env.CI,

  // 클라이언트 번들에서 소스맵 숨기기
  hideSourceMaps: true,

  // 와이드닝 (더 많은 에러 컨텍스트)
  widenClientFileUpload: true,

  // Turbopack 지원
  tunnelRoute: '/monitoring',
})
```

## 커스텀 에러 추적

### AppError 통합

**lib/utils/errors.ts**에 Sentry 통합 추가:

```typescript
import * as Sentry from '@sentry/nextjs'

export function handleApiError(error: unknown): NextResponse {
  // Sentry에 에러 전송
  if (!(error instanceof AppError) || error.statusCode >= 500) {
    Sentry.captureException(error)
  }

  // 기존 로직...
}
```

### 커스텀 컨텍스트 추가

```typescript
// 사용자 컨텍스트 설정
Sentry.setUser({
  id: user.id,
  email: user.email,
})

// 커스텀 태그
Sentry.setTag('plan', user.plan)

// 브레드크럼 추가
Sentry.addBreadcrumb({
  category: 'asset-generation',
  message: 'Started generating assets',
  level: 'info',
  data: {
    projectId: project.id,
    platform: project.platform,
  },
})
```

## 성능 모니터링

### API 라우트 계측

```typescript
import * as Sentry from '@sentry/nextjs'

export async function POST(request: Request) {
  return Sentry.withServerActionInstrumentation(
    'api/assets/generate',
    async () => {
      // 기존 로직...
    }
  )
}
```

### 커스텀 트랜잭션

```typescript
const transaction = Sentry.startTransaction({
  name: 'Asset Pipeline',
  op: 'asset.generate',
})

try {
  const span = transaction.startChild({
    op: 'favicon.generate',
    description: 'Generate favicon set',
  })
  await generateFavicons()
  span.finish()

  // 더 많은 작업...
} finally {
  transaction.finish()
}
```

## 알림 설정

### Sentry 대시보드에서 설정

1. **Alerts** → **Create Alert Rule**
2. 조건 설정:
   - 새 이슈 발생 시
   - 이슈 빈도 급증 시
   - 특정 에러 타입 발생 시
3. 알림 채널:
   - Slack
   - 이메일
   - PagerDuty (온콜용)

### 권장 알림 규칙

| 규칙 | 조건 | 채널 |
|------|------|------|
| Critical Errors | 500 에러 10분 내 5회 이상 | Slack + PagerDuty |
| Auth Failures | 인증 실패 10분 내 20회 이상 | Slack |
| New Issues | 새 이슈 발생 | Slack (daily digest) |
| Quota Alerts | 사용량 80% 도달 | 이메일 |

## 대시보드 활용

### 주요 메트릭

- **Error Rate**: 전체 요청 대비 에러 비율
- **P95 Latency**: 95% 요청의 응답 시간
- **Apdex Score**: 사용자 만족도 지표
- **Release Health**: 릴리즈별 에러 추이

### 커스텀 대시보드 위젯

1. API 엔드포인트별 에러율
2. 사용자별 에러 분포
3. 결제 관련 에러 추적
4. AI 서비스 응답 시간

## 프라이버시 고려사항

### 민감 데이터 필터링

```typescript
Sentry.init({
  beforeSend(event) {
    // 이메일 마스킹
    if (event.user?.email) {
      event.user.email = maskEmail(event.user.email)
    }

    // 요청 본문에서 민감 정보 제거
    if (event.request?.data) {
      const data = JSON.parse(event.request.data)
      delete data.password
      delete data.creditCard
      event.request.data = JSON.stringify(data)
    }

    return event
  },
})

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  return `${local[0]}***@${domain}`
}
```

### 데이터 보존 정책

- Sentry 기본: 90일 보존
- 중요 이슈: 북마크로 영구 보존
- GDPR 준수: 사용자 요청 시 데이터 삭제

## Vercel 통합

Vercel에서 Sentry 통합 활성화:

1. Vercel 대시보드 → Settings → Integrations
2. Sentry 찾기 → Install
3. 환경변수 자동 동기화

## 트러블슈팅

### 소스맵이 작동하지 않는 경우

1. `SENTRY_AUTH_TOKEN` 확인
2. `org`와 `project` 설정 확인
3. Vercel 빌드 로그에서 업로드 확인

### 이벤트가 전송되지 않는 경우

1. `dsn` 값 확인
2. `enabled` 설정 확인
3. 브라우저 콘솔에서 Sentry 초기화 확인

### 과도한 이벤트 발생 시

1. `tracesSampleRate` 낮추기
2. `ignoreErrors` 패턴 추가
3. `beforeSend`에서 필터링

## 관련 문서

- [Sentry Next.js 공식 문서](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [에러 처리 가이드](../guides/error-handling.md)
- [배포 가이드](./deployment-guide.md)
