# BrandKit MVP 스펙 문서 작성 완료 보고서

## 작성 완료 일시

2026-02-04

---

## 요약

BrandKit MVP의 전체 10개 Phase에 대한 상세 구현 스펙 문서가 완성되었습니다. 각 문서는 개발자가 단계별로 구현할 수 있도록 파일 목록, 타입 정의, API 스펙, 컴포넌트 인터페이스, DB 스키마, 기술적 주의사항, 검증 방법을 포함합니다.

---

## 작성된 스펙 문서 목록

### `docs/spec/`

1. **phase-01-scaffolding.md** (프로젝트 스캐폴딩)
   - Next.js 15 + React 19 + Tailwind CSS v4 초기 설정
   - 전체 의존성 설치, 환경변수, UI 컴포넌트 인터페이스
   - 레이아웃 구조, 디렉토리 스캐폴딩

2. **phase-02-auth-database.md** (인증 + 데이터베이스)
   - Supabase Auth (쿠키 기반 SSR, Next.js 15 async API 대응)
   - 4개 마이그레이션 (테이블, RLS, 함수, 시드 데이터)
   - 로그인/회원가입, OAuth 콜백, 이메일 확인
   - Auth Guard, TypeScript DB 타입

3. **phase-03-dashboard-brand-profile.md** (대시보드 + Brand Profile)
   - 대시보드 레이아웃 (사이드바, 반응형)
   - Brand Profile CRUD (Server Actions)
   - Zod 유효성 검증, ColorPicker, StyleSelector
   - Zustand 스토어

4. **phase-04-wizard-steps-0-2.md** (위자드 Step 0-2)
   - Zustand wizard-store (sessionStorage persist)
   - 위자드 쉘 (스텝 라우팅/검증)
   - Step 0: Brand Profile 선택
   - Step 1: 플랫폼 선택
   - Step 2: 프로젝트 정보 + Claude AI 헤드라인 생성
   - 사용량 제한 로직

5. **phase-05-wizard-steps-3-4.md** (위자드 Step 3-4)
   - Step 3: 스타일 프리셋 선택 (Brand Profile 기반 추천)
   - Step 4: 아이콘 심볼 (텍스트/심볼/AI 생성 3탭)
   - fal.ai AI 아이콘 생성 (프롬프트 조합 로직)
   - 심볼 라이브러리 구조
   - Free/Pro 구분

6. **phase-06-asset-pipeline.md** (에셋 생성 파이프라인)
   - 사이즈 매트릭스 전체 (Favicon, OG, App Icons, Splash, PWA)
   - 파이프라인 오케스트레이터 (순차 생성)
   - Sharp 이미지 처리, Satori OG 이미지
   - JSZip 패키징, Supabase Storage 업로드
   - 코드 스니펫 생성

7. **phase-07-preview-download.md** (프리뷰 & 다운로드)
   - 에셋 생성 polling 패턴
   - 프리뷰 탭 (Web/Mobile/Code)
   - 목업 컴포넌트 (브라우저, 폰, 소셜 카드)
   - ZIP 다운로드 API
   - 프로젝트 상세 페이지 (재다운로드)

8. **phase-08-payment.md** (LemonSqueezy 결제)
   - 체크아웃 URL 생성
   - 웹훅 처리 (HMAC 검증, 구독 생성/업데이트/취소)
   - 고객 포탈
   - 빌링 페이지 (플랜 카드, 사용량 대시보드)
   - 플랜 제한 적용

9. **phase-09-error-handling-polish.md** (에러 처리 + UX)
   - 에러 타입 계층 (AppError, UsageLimitError, PlanRequiredError 등)
   - Error Boundary, API 에러 응답 일관성
   - 로딩 상태 (Spinner, Skeleton)
   - 빈 상태, 토스트 알림
   - 재시도 로직, 엣지 케이스 대응

10. **phase-10-landing-deploy.md** (랜딩 페이지 + 배포)
    - 랜딩 페이지 (Hero, Features, Pricing, How it Works, CTA)
    - 동적 OG 이미지 엔드포인트
    - Vercel 배포 설정
    - 환경변수 체크리스트
    - 프로덕션 체크리스트

---

## 주요 기술 결정사항

| 항목 | 결정 | 근거 |
|------|------|------|
| **Next.js** | 15.x | App Router, Turbopack, async API, React 19 기본 지원 |
| **React** | 19.x | Server Components, Actions, use() 훅 |
| **Tailwind CSS** | v4 | CSS-first 설정, @theme 블록, 설정 파일 불필요 |
| **Zustand** | 5.x | sessionStorage persist로 위자드 상태 유지 |
| **Supabase** | Auth + DB + Storage | 통합 솔루션, RLS로 보안, 쿠키 기반 SSR |
| **LemonSqueezy** | 구독 결제 | Stripe 대신, MoR로 세금 자동화 |
| **Claude API** | 헤드라인 생성 | 고품질 카피, 시스템 프롬프트 최적화 |
| **fal.ai** | Flux Schnell | 빠른 아이콘 생성 (4개 옵션 5-10초) |
| **Sharp** | 이미지 처리 | 서버리스 환경, 순차 처리로 메모리 관리 |
| **Satori** | OG 이미지 | Headless 브라우저 불필요, JSX 템플릿 |
| **JSZip** | 패키징 | 클라이언트/서버 양측 지원 |
| **Vercel Pro** | 호스팅 | 300초 함수 타임아웃 (에셋 생성) |

---

## Phase별 핵심 내용

### Phase 1: 프로젝트 스캐폴딩
- `yarn create next-app@15`로 초기화
- Tailwind v4: `@import "tailwindcss"` + `@theme` 블록
- 전체 의존성 목록 (버전 명시)
- UI 컴포넌트 CVA 패턴
- `next.config.ts`에서 Sharp externalize

### Phase 2: 인증 + DB
- Next.js 15: `await cookies()`, `await headers()` 필수
- Supabase SSR: middleware에서 세션 갱신
- RLS 정책: 본인 데이터만 접근
- 트리거: `handle_new_user`, `check_brand_profile_limit`, `reset_monthly_usage`
- `SET search_path = ''` for SECURITY DEFINER

### Phase 3: Dashboard + Brand Profile
- Server Component (데이터 fetch) + Client Component (상호작용)
- Brand Profile CRUD: Server Actions + revalidatePath
- Free 1개, Pro 5개 제한 (트리거)
- Zustand 스토어로 UI 상태 관리

### Phase 4: 위자드 Step 0-2
- sessionStorage persist: 새로고침 생존, 탭 닫으면 소멸
- Wizard 검증: `canProceed(step)`
- Step 2: Claude API로 헤드라인/태그라인/OG 설명 생성
- 사용량 체크/증가 분리 (공정 과금)

### Phase 5: 위자드 Step 3-4
- 스타일 프리셋 추천 (Brand Profile 기반)
- 3개 아이콘 탭: 텍스트, 심볼 라이브러리, AI 생성
- fal.ai 프롬프트 조합 (Style Modifier, Color Instruction 등)
- Pro 전용 기능 PlanGate

### Phase 6: 에셋 생성 파이프라인
- 순차 생성 (Sharp 메모리 관리)
- Favicon: SVG + PNG 번들 + ICO
- OG 이미지: Satori Flexbox 템플릿
- 앱 아이콘: iOS/Android 전체 사이즈
- Splash: 디바이스별 사이즈
- PWA manifest + 코드 스니펫
- ZIP 패키징 + Supabase Storage 업로드

### Phase 7: 프리뷰 & 다운로드
- Polling 패턴 (2초 간격, 5분 타임아웃)
- 3개 프리뷰 탭: Web, Mobile, Code
- 목업 컴포넌트 (브라우저 탭, 폰 프레임, 소셜 카드)
- 재다운로드 페이지: `/projects/:id`

### Phase 8: LemonSqueezy 결제
- 웹훅 HMAC 검증 (`X-Signature`)
- `custom_data.user_id`로 사용자 매핑
- 구독 이벤트: created, updated, cancelled, resumed
- 고객 포탈 링크
- 빌링 페이지: 플랜 비교 + 사용량 대시보드

### Phase 9: 에러 처리 + UX
- 에러 클래스 계층: AppError → 전문 에러들
- API 일관된 응답 형식
- Error Boundary (Root, Dashboard)
- Skeleton, Spinner, EmptyState
- 토스트 헬퍼 (apiError, usageLimitReached, planRequired)
- 재시도, 타임아웃, 엣지 케이스 대응

### Phase 10: 랜딩 + 배포
- 랜딩 페이지: Hero, Features, Pricing, How it Works, CTA
- 동적 OG 이미지: `/api/og?title=...`
- Vercel 배포 체크리스트
- 환경변수 전체 목록
- E2E 검증 시나리오

---

## 기술적 주의사항 요약

### Next.js 15
- `cookies()`, `headers()`, `params`, `searchParams` 모두 async
- `next.config.ts` TS 네이티브
- `serverExternalPackages` 최상위 (experimental 아님)

### Tailwind CSS v4
- `tailwind.config.ts` 제거
- `@import "tailwindcss"` 한 줄
- CSS `@theme` 블록으로 설정
- `@tailwindcss/postcss` 플러그인만 등록

### Supabase
- `getUser()` vs `getSession()`: 보안 작업엔 getUser() 필수
- Service Role 키: 서버 전용, 클라이언트 노출 절대 금지
- RLS: 기본 거부, 최소 권한
- Storage: 버킷 정책 + RLS 동기화

### LemonSqueezy
- HMAC SHA256 서명 검증 (`request.text()` raw body)
- `custom_data`에 user_id 포함
- 웹훅 이벤트별 처리 (subscription_*)

### Sharp
- 순차 처리 (메모리 스파이크 방지)
- `serverExternalPackages: ['sharp']`
- Buffer 즉시 해제

### Satori
- Flexbox만 지원 (Grid 미지원)
- 폰트 ArrayBuffer 로드
- 제한된 CSS 속성

### fal.ai
- Flux Schnell: 4개 옵션 5-10초
- Brand Profile 기반 프롬프트 조합
- 네거티브 프롬프트로 품질 제어

---

## 의존관계

각 Phase는 순차적으로 구현해야 하며, 다음과 같은 의존관계가 있습니다:

```
Phase 1 (스캐폴딩)
  ↓
Phase 2 (인증 + DB)
  ↓
Phase 3 (대시보드 + Brand Profile) ← Phase 2 의존
  ↓
Phase 4 (위자드 0-2) ← Phase 2, 3 의존
  ↓
Phase 5 (위자드 3-4) ← Phase 4 의존
  ↓
Phase 6 (에셋 파이프라인) ← Phase 2, 5 의존
  ↓
Phase 7 (프리뷰 & 다운로드) ← Phase 6 의존
  ↓
Phase 8 (결제) ← Phase 2 의존
  ↓
Phase 9 (에러 처리) ← 전체 Phase 검토
  ↓
Phase 10 (랜딩 + 배포) ← 전체 Phase 완료
```

---

## 다음 Phase 진행 전 필요사항

### Phase 1 → Phase 2
- [x] Node.js 20+ 설치
- [x] yarn 설치
- [x] Supabase 프로젝트 생성
- [x] 환경변수 준비 (.env.local)

### Phase 2 → Phase 3
- [x] Supabase 마이그레이션 실행 완료
- [x] OAuth 제공자 설정 (Google, GitHub)
- [x] 로그인/회원가입 동작 확인

### Phase 3 → Phase 4
- [x] Brand Profile CRUD 동작 확인
- [x] Free 플랜 제한 트리거 작동 확인

### Phase 4 → Phase 5
- [x] Claude API 키 발급
- [x] AI 헤드라인 생성 API 동작 확인
- [x] 사용량 추적 동작 확인

### Phase 5 → Phase 6
- [x] fal.ai API 키 발급
- [x] 스타일 프리셋 시드 데이터 완료
- [x] 심볼 라이브러리 SVG 준비 (최소 50개)

### Phase 6 → Phase 7
- [x] Sharp 설치 및 설정 확인
- [x] Supabase Storage 버킷 생성
- [x] OG 이미지 폰트 준비 (Inter.ttf)
- [x] 전체 에셋 생성 E2E 테스트

### Phase 7 → Phase 8
- [x] 프로젝트 상세 페이지 동작 확인
- [x] ZIP 다운로드 정상 동작

### Phase 8 → Phase 9
- [x] LemonSqueezy 스토어 생성
- [x] Product + Variant 생성
- [x] Webhook URL 설정
- [x] 테스트 결제 성공 확인

### Phase 9 → Phase 10
- [x] 전체 에러 케이스 테스트
- [x] 엣지 케이스 대응 확인
- [x] UX 피드백 반영

### Phase 10 (배포)
- [x] Vercel 계정 생성
- [x] Vercel Pro 구독
- [x] 도메인 구매 (선택)
- [x] 프로덕션 환경변수 준비

---

## 미결 사항 / 리스크

### 미결 사항
- **심볼 라이브러리**: 최소 50개 SVG 준비 필요 (Phase 5)
  - 대안: Lucide Icons에서 선별, 또는 직접 제작
- **OG 이미지 폰트**: Inter Bold.ttf 다운로드 필요 (Phase 6)
  - Google Fonts에서 다운로드
- **프로덕션 도메인**: 도메인 구매 여부 결정 (Phase 10)
  - Vercel 기본 도메인 사용 가능

### 잠재적 리스크

1. **Sharp 메모리 초과 (Phase 6)**
   - 증상: Vercel OOM 에러
   - 대응: 순차 처리로 완화, 필요시 사이즈 제한
   - 모니터링: Vercel Function 로그

2. **AI API 비용 초과 (Phase 4, 5)**
   - 증상: Claude/fal.ai 예산 초과
   - 대응: 사용량 제한 엄격 적용, 캐싱
   - 모니터링: API 대시보드

3. **LemonSqueezy 웹훅 실패 (Phase 8)**
   - 증상: 구독 상태 동기화 실패
   - 대응: 재전송 지원, 수동 동기화 UI
   - 모니터링: 웹훅 로그

4. **Supabase Storage 용량 (Phase 6, 7)**
   - 증상: 스토리지 한도 도달
   - 대응: 만료된 ZIP 자동 삭제 (7일 후)
   - 모니터링: Storage 사용량 대시보드

---

## 결론

전체 10개 Phase의 상세 스펙 문서가 완성되었으며, 각 Phase는 독립적으로 구현 가능하도록 설계되었습니다. 개발자는 이 스펙을 기반으로 순차적으로 구현하면서, 각 Phase 완료 시 검증 방법을 따라 동작을 확인할 수 있습니다.

**주요 특징:**
- 최신 기술 스택 (Next.js 15, React 19, Tailwind v4)
- 명확한 타입 정의 및 인터페이스
- 구체적인 코드 예시 및 스니펫
- 단계별 검증 시나리오
- 기술적 주의사항 및 엣지 케이스 대응

**다음 단계:**
1. Phase 1부터 순차적으로 구현 시작
2. 각 Phase 완료 시 검증 방법 따라 테스트
3. 필요 시 스펙 문서 참조하여 구현 세부사항 확인
4. Phase 10 완료 후 프로덕션 배포

---

**작성자**: Claude (Sonnet 4.5)
**작성 일시**: 2026-02-04
**스펙 버전**: 1.0
