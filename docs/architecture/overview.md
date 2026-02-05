# 시스템 아키텍처 개요

## 프로젝트 구조

```
BrandKit (Charlotte)
├── Frontend (Next.js 15 App Router)
│   ├── 랜딩페이지 (/)
│   ├── 인증 (/login, /signup)
│   └── 대시보드 (/dashboard, /projects, /brand-profiles, /settings)
│
├── Backend (Next.js API Routes)
│   ├── AI 서비스 (/api/ai/*)
│   ├── 에셋 생성 (/api/assets/*)
│   ├── 결제 (/api/lemonsqueezy/*)
│   └── 웹훅 (/api/webhooks/*)
│
├── Database (Supabase PostgreSQL)
│   ├── users - 사용자 정보, 플랜, 사용량
│   ├── brand_profiles - 브랜드 스타일 설정
│   ├── projects - 프로젝트 메타데이터
│   └── style_presets - 스타일 프리셋 (읽기 전용)
│
└── Storage (Supabase Storage)
    └── project-assets - 생성된 에셋 ZIP 파일
```

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, CVA |
| State | Zustand |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| AI | Claude (Anthropic), FAL.ai |
| Payment | LemonSqueezy |
| Deployment | Vercel |

## 핵심 흐름

### 1. 인증 흐름
```
사용자 → Supabase Auth → 미들웨어 검증 → 보호된 라우트
```

### 2. 에셋 생성 흐름
```
프로젝트 생성
    │
    ├── 브랜드 프로필 선택 (선택적)
    ├── 스타일 프리셋 선택
    ├── 플랫폼 선택 (web/mobile/all)
    └── 아이콘 설정 (text/symbol/AI)
    │
    ▼
에셋 파이프라인 실행
    │
    ├── Phase 1 (병렬): PWA manifest, code snippets
    └── Phase 2 (순차): favicons, OG images, app icons, splash screens
    │
    ▼
ZIP 패키징 → Supabase Storage 업로드
```

### 3. 결제 흐름
```
사용자 → LemonSqueezy Checkout → 웹훅 → DB 업데이트 → Pro 플랜 활성화
```

## 보안 아키텍처

### Row Level Security (RLS)
- 모든 테이블에 RLS 활성화
- 사용자는 자신의 데이터만 접근 가능

### 인증 레이어
1. **미들웨어**: 라우트 보호, 세션 검증
2. **API 라우트**: 요청별 인증 확인
3. **RLS**: 데이터베이스 레벨 보호

### 환경변수 분리
- `NEXT_PUBLIC_*`: 클라이언트 노출 가능 (Supabase URL, Anon Key)
- 서버 전용: Service Role Key, API Keys

## 성능 최적화

### 파이프라인 최적화
- 경량 작업 병렬 실행
- 이미지 작업 순차 실행 (메모리 관리)

### 캐싱 전략
- 스타일 프리셋: 읽기 전용, 변경 없음
- 정적 에셋: Vercel Edge Cache

## 관련 문서
- [데이터 흐름](./data-flow.md)
- [컴포넌트 구조](./component-structure.md)
