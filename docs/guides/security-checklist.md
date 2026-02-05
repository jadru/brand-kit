# 보안 체크리스트

## 개요

BrandKit 프로젝트의 보안 요구사항과 체크리스트입니다.

## 인증 및 인가

### 미들웨어 보안
- [x] 보호된 라우트 정의 (`lib/config/routes.ts`)
- [x] 인증 실패 시 로그인 리다이렉트
- [x] 예외 발생 시 보호된 라우트 차단 (ADR-001)
- [x] 환경변수 누락 시 보호된 라우트 차단

### API 인증
- [x] 모든 보호된 API에서 `supabase.auth.getUser()` 확인
- [x] 일관된 에러 응답 (`UnauthorizedError`)
- [x] 사용자 소유 리소스만 접근 가능 (RLS)

### Row Level Security (RLS)
- [x] `users` 테이블 - 자신의 데이터만 조회/수정
- [x] `brand_profiles` 테이블 - 자신의 프로필만
- [x] `projects` 테이블 - 자신의 프로젝트만
- [x] `style_presets` 테이블 - 모든 인증 사용자 읽기

## 입력 검증

### API 검증
- [x] Zod 스키마 사용 (`lib/validations/`)
- [x] 필수 필드 검증
- [x] 타입 검증

### 파일 업로드
- [x] 스토리지 정책으로 경로 검증
- [x] 사용자 ID 기반 폴더 구조

## 환경변수 보안

### 클라이언트 노출 가능
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_APP_URL`

### 서버 전용 (절대 노출 금지)
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `FAL_KEY`
- `LEMONSQUEEZY_API_KEY`
- `LEMONSQUEEZY_WEBHOOK_SECRET`

## 웹훅 보안

### LemonSqueezy 웹훅
- [x] HMAC-SHA256 서명 검증
- [x] 타입 안전한 페이로드 처리
- [ ] 타임스탬프 검증 (권장 - replay attack 방지)

## 사용량 제한

### Rate Limiting
- [x] 플랜별 사용량 제한 (`PLAN_LIMITS`)
- [x] 월간 자동 초기화
- [x] 데이터베이스 기반 추적

## 보안 헤더

### Vercel 기본 제공
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`

### 추가 권장
- [ ] Content-Security-Policy
- [ ] Strict-Transport-Security

## 정기 점검 항목

### 주간
- [ ] 에러 로그 검토
- [ ] 비정상 사용량 패턴 확인

### 월간
- [ ] 의존성 보안 업데이트 (`yarn audit`)
- [ ] 환경변수 검토

### 분기별
- [ ] RLS 정책 검토
- [ ] 인증 흐름 테스트
- [ ] 웹훅 검증 로직 검토

## 관련 파일

- `lib/supabase/middleware.ts` - 미들웨어 인증
- `lib/config/routes.ts` - 라우트 설정
- `lib/utils/errors.ts` - 에러 처리
- `supabase/migrations/002_rls_policies.sql` - RLS 정책
- `app/api/webhooks/lemonsqueezy/route.ts` - 웹훅 검증
