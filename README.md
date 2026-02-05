# BrandKit (Charlotte)

AI 기반 브랜드 에셋 자동 생성 SaaS 플랫폼

## 주요 기능

- **브랜드 프로필 관리**: 스타일, 색상, 아이콘 스타일 저장
- **AI 헤드라인 생성**: Claude AI를 활용한 브랜드 카피 생성
- **AI 아이콘 생성**: FAL.ai를 활용한 커스텀 아이콘 생성 (Pro)
- **멀티플랫폼 에셋**: 웹 (Favicon, OG Image, PWA) 및 모바일 (App Icon, Splash) 지원
- **원클릭 다운로드**: 모든 에셋을 ZIP 파일로 제공

## 기술 스택

| 카테고리 | 기술 |
|---------|------|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, CVA |
| State | Zustand |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| AI | Claude (Anthropic), FAL.ai |
| Payment | LemonSqueezy |
| Testing | Vitest |
| Deployment | Vercel |

## 시작하기

### 필수 조건

- Node.js 22+
- Yarn 4+
- Supabase 프로젝트

### 설치

```bash
# 의존성 설치
yarn install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 필요한 값 입력

# 개발 서버 실행
yarn dev
```

### 환경변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# AI Services
ANTHROPIC_API_KEY=sk-ant-...
FAL_KEY=...

# LemonSqueezy
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_STORE_ID=...
LEMONSQUEEZY_WEBHOOK_SECRET=...
LEMONSQUEEZY_PRO_VARIANT_ID=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 스크립트

```bash
yarn dev          # 개발 서버 (Turbopack)
yarn build        # 프로덕션 빌드
yarn start        # 프로덕션 서버
yarn lint         # ESLint 실행
yarn test         # 테스트 실행
yarn test:watch   # 테스트 워치 모드
yarn test:coverage # 커버리지 포함 테스트
```

## 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 페이지
│   ├── (dashboard)/       # 대시보드 페이지
│   └── api/               # API 라우트
├── components/            # React 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── landing/          # 랜딩페이지 섹션
│   └── wizard/           # 프로젝트 생성 위저드
├── lib/                   # 유틸리티 및 서비스
│   ├── ai/               # AI 서비스 (Claude, FAL)
│   ├── assets/           # 에셋 생성 파이프라인
│   ├── supabase/         # Supabase 클라이언트
│   └── utils/            # 유틸리티 함수
├── store/                 # Zustand 상태 관리
├── types/                 # TypeScript 타입 정의
├── tests/                 # 테스트 파일
└── docs/                  # 문서
    ├── architecture/     # 아키텍처 문서
    ├── guides/           # 개발 가이드
    ├── maintenance/      # 유지보수 가이드
    └── decisions/        # ADR (Architecture Decision Records)
```

## 문서

- [아키텍처 개요](./docs/architecture/overview.md)
- [에러 처리 가이드](./docs/guides/error-handling.md)
- [테스트 전략](./docs/guides/testing-strategy.md)
- [타입 안전성 가이드](./docs/guides/type-safety.md)
- [배포 가이드](./docs/maintenance/deployment-guide.md)
- [코드 리뷰 가이드](./docs/maintenance/code-review-guide.md)

## 라이선스

Private
