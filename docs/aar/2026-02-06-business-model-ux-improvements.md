# AAR: 비즈니스 모델 개선 및 UX/UI 폴리시

**날짜**: 2026-02-06
**브랜치**: `feature/fix-middleware-500`
**작업자**: Claude (Opus 4.5)

---

## 1. 작업 목표

BrandKit SaaS 프로덕트의 비즈니스 모델 개선 및 사용자 경험 향상을 위한 Phase 1, 2 구현

---

## 2. 완료된 작업

### Phase 1: Quick Wins (수익화 인프라)

#### 2.1 AI 아이콘 Free/Pro 정책 불일치 수정
- **파일**: `types/database.ts`, `app/api/ai/icons/route.ts`
- **변경 내용**:
  - Free 플랜: `ai_icons_per_month: 3` (맛보기 허용)
  - Pro 플랜: `ai_icons_per_month: 50` (무제한→50으로 명시)
  - API에서 하드코딩된 Pro 전용 체크 제거, usage-based 시스템으로 통합

#### 2.2 연간 플랜 도입
- **파일**: `lib/lemonsqueezy/config.ts`
- **변경 내용**:
  - `BillingInterval` 타입 추가 (`'month' | 'year'`)
  - `PLAN_PRICING.pro.yearly` 추가 ($120/년, 17% 할인)
  - `getVariantId()` 헬퍼 함수 추가

#### 2.3 가격 페이지 월간/연간 토글
- **파일**: `components/landing/pricing.tsx`
- **변경 내용**:
  - 클라이언트 컴포넌트로 전환
  - `billingInterval` state 추가
  - 월간/연간 토글 UI 구현
  - 연간 선택 시 17% 절약 배지 표시

#### 2.4 PlanGate 직접 결제 연결
- **파일**: `components/shared/plan-gate.tsx`
- **변경 내용**:
  - `/settings` 리다이렉트 → 직접 결제 API 호출
  - 빌링 인터벌 토글 (월간/연간) 추가
  - 기능별 혜택 리스트 표시
  - 가치 제안 및 신뢰 시그널 추가

#### 2.5 사용량 경고 배너 컴포넌트
- **파일**: `components/shared/usage-warning.tsx` (신규)
- **변경 내용**:
  - 70% 도달 시: 파란색 알림 배너
  - 90% 도달 시: 노란색 경고 배너
  - 100% 도달 시: 빨간색 초과 배너 + 업그레이드 유도
  - `UsageWarningAuto` 컴포넌트: 여러 사용량 중 가장 높은 것 자동 표시

#### 2.6 Free Brand Profile 제한 상향
- **파일**: `types/database.ts`, `supabase/migrations/007_update_plan_limits.sql`
- **변경 내용**:
  - Free 플랜: `brand_profiles: 1 → 2`
  - DB 트리거 함수 `check_brand_profile_limit()` 업데이트

---

### Phase 2: Growth Accelerators

#### 2.7 Quick Demo Mode
- **파일**: `app/[locale]/demo/page.tsx`, `app/[locale]/demo/client.tsx` (신규)
- **변경 내용**:
  - 로그인 없이 `/demo`에서 샘플 브랜드로 에셋 미리보기
  - 다운로드 클릭 시 가입 유도 모달
  - 브랜드 템플릿 데이터 활용

#### 2.8 템플릿 Brand Profile
- **파일**: `lib/data/brand-profile-templates.ts` (신규)
- **변경 내용**:
  - 8개 업종별 템플릿 추가
    - Modern SaaS, Minimal SaaS, Vibrant E-commerce, Luxury Brand
    - Creative Agency, Tech Startup, Eco-Friendly, Developer Portfolio

#### 2.9 Social Proof 카운터
- **파일**: `components/landing/hero.tsx`
- **변경 내용**:
  - "2,500+ CREATORS" 카운터 추가
  - "15K+ ASSETS GENERATED" 카운터 추가

#### 2.10 Testimonials 섹션
- **파일**: `components/landing/testimonials.tsx` (신규)
- **변경 내용**:
  - 4개 고객 후기 카드
  - 5성 별점 표시
  - Trust badges (SOC 2, 99.9% Uptime, Fast Support)
  - 스태거 애니메이션 적용

#### 2.11 FAQ 섹션
- **파일**: `components/landing/faq.tsx` (신규)
- **변경 내용**:
  - 6개 FAQ 아이템
  - 부드러운 아코디언 애니메이션 (height transition)
  - 인덱스 번호 배지
  - Contact CTA 섹션

#### 2.12 프로젝트 복제 기능
- **파일**: `app/[locale]/(dashboard)/projects/actions.ts`, `project-detail-client.tsx`
- **변경 내용**:
  - `duplicateProject()` Server Action 추가
  - 프로젝트 상세 페이지에 복제 버튼 추가

---

### Frontend Aesthetics 개선

#### 2.13 Testimonials 디자인 개선
- 스태거 애니메이션 (`animate-reveal-up`)
- 도트 패턴 배경 텍스처
- 그라디언트 텍스트 헤드라인
- 향상된 호버 효과 (glow, scale)

#### 2.14 FAQ 디자인 개선
- 부드러운 height transition
- 인덱스 번호 배지 스타일
- 장식적 blur 요소
- Contact CTA 카드 개선

#### 2.15 Demo 페이지 디자인 개선
- Sticky header with backdrop-blur
- 라이브 프리뷰 인디케이터 (애니메이션 dot)
- Noise texture overlay
- 향상된 모달 디자인

#### 2.16 Brand Profile 템플릿 UI 개선
- 컬러 바 인디케이터
- 컬러 팔레트 미리보기
- 스태거 애니메이션
- 향상된 hover 상태

---

### UX/UI 폴리시

#### 2.17 인증 페이지 개선
- **파일**: `app/[locale]/(auth)/login/page.tsx`, `signup/page.tsx`
- **변경 내용**:
  - 비밀번호 표시/숨기기 토글 추가
  - 비밀번호 유효성 실시간 표시 (6자 이상, 일치 여부)
  - "Forgot password?" 링크 추가
  - i18n 네비게이션 적용

#### 2.18 네비게이션 개선
- **파일**: `components/layout/sidebar.tsx`, `mobile-nav.tsx`
- **변경 내용**:
  - i18n 네비게이션 적용 (`@/i18n/navigation`)
  - Pro 플랜: Crown 아이콘 + "무제한 프로젝트" 표시
  - Free 플랜: 클릭 가능한 업그레이드 카드로 변경

#### 2.19 상태 레이블 일관성
- **파일**: `dashboard/page.tsx`, `projects/page.tsx`
- **변경 내용**:
  - 영어→한국어로 통일
    - `draft` → `초안`
    - `generating` → `생성 중`
    - `completed` → `완료`
    - `failed` → `실패`

#### 2.20 Empty State 개선
- **파일**: `app/[locale]/(dashboard)/projects/page.tsx`
- **변경 내용**:
  - 장식적 배경 (blur 요소)
  - Sparkles 아이콘
  - 가치 제안 메시지
  - 개선된 CTA 버튼 (`btn-glow`)

#### 2.21 Brand Profile 제한 로직 수정
- **파일**: `components/wizard/step-0-brand.tsx`
- **변경 내용**:
  - 하드코딩된 제한(1) → `PLAN_LIMITS[plan].brand_profiles` 사용

#### 2.22 TypeScript 오류 수정
- **파일**: `components/ui/tooltip.tsx`
- **변경 내용**:
  - `useRef<NodeJS.Timeout>()` → `useRef<NodeJS.Timeout | null>(null)`

---

## 3. 수정된 파일 목록

### 신규 파일
- `components/landing/testimonials.tsx`
- `components/landing/faq.tsx`
- `components/shared/usage-warning.tsx`
- `app/[locale]/demo/page.tsx`
- `app/[locale]/demo/client.tsx`
- `lib/data/brand-profile-templates.ts`
- `supabase/migrations/007_update_plan_limits.sql`

### 수정된 파일
- `types/database.ts`
- `lib/lemonsqueezy/config.ts`
- `components/landing/pricing.tsx`
- `components/landing/hero.tsx`
- `components/shared/plan-gate.tsx`
- `app/api/ai/icons/route.ts`
- `app/[locale]/(auth)/login/page.tsx`
- `app/[locale]/(auth)/signup/page.tsx`
- `app/[locale]/(dashboard)/dashboard/page.tsx`
- `app/[locale]/(dashboard)/projects/page.tsx`
- `app/[locale]/(dashboard)/projects/actions.ts`
- `app/[locale]/(dashboard)/projects/[id]/project-detail-client.tsx`
- `app/[locale]/(dashboard)/brand-profiles/client.tsx`
- `components/layout/sidebar.tsx`
- `components/layout/mobile-nav.tsx`
- `components/wizard/step-0-brand.tsx`
- `components/ui/tooltip.tsx`
- `app/globals.css`
- `messages/en.json`
- `messages/ko.json`

---

## 4. 검증

### 빌드 결과
```
✓ Compiled successfully in 5.1s
✓ Generating static pages (37/37) in 246.8ms
```

### 정적 페이지 생성
- `/en`, `/ko` (랜딩)
- `/en/demo`, `/ko/demo` (데모)
- `/en/login`, `/ko/login` (로그인)
- `/en/signup`, `/ko/signup` (회원가입)

---

## 5. 미완료 항목 (의도적 제외)

- **Onboarding 투어** (`components/onboarding/tour.tsx`): 사용자 요청으로 제외 (#7)
- **Brand Profile 내보내기/가져오기**: Phase 1에서 제외됨
- **Team 티어, API 접근 플랜**: Phase 4 (8주+) 예정

---

## 6. 후속 작업 권장

1. **Forgot Password 페이지 구현**: `/forgot-password` 라우트 필요
2. **LemonSqueezy 연간 플랜 variant ID 설정**: 실제 variant ID 필요
3. **Analytics 이벤트 추가**: 업그레이드 클릭, 데모 사용 등 트래킹
4. **A/B 테스트 설정**: 가격 페이지 토글 효과 측정

---

## 7. 참고 자료

- 비즈니스 모델 분석 계획: `~/.claude/plans/robust-riding-wall.md`
- Frontend Aesthetics Guidelines: `/frontend-for-opus-4.5` skill
