# Phase 01: 프로젝트 스캐폴딩

## 목표

Next.js 15 + React 19 + Tailwind CSS v4 기반의 프로젝트 초기 구조를 설정하고, 전체 의존성 설치, 기본 설정 파일, 공통 UI 컴포넌트 인터페이스, 레이아웃 구조를 완성한다.

---

## 생성/수정 파일 목록

| 파일 경로 | 작업 | 설명 |
|-----------|------|------|
| `package.json` | 생성 | yarn create next-app으로 초기화 후 의존성 추가 |
| `next.config.ts` | 수정 | Next.js 15 TS 네이티브 설정 |
| `postcss.config.mjs` | 수정 | Tailwind CSS v4 PostCSS 설정 |
| `tsconfig.json` | 수정 | 경로 alias 설정 |
| `app/globals.css` | 수정 | Tailwind v4 @import + @theme 블록 |
| `app/layout.tsx` | 수정 | 루트 레이아웃 (메타데이터, 폰트) |
| `app/page.tsx` | 수정 | 임시 랜딩 페이지 |
| `.env.example` | 생성 | 환경변수 템플릿 |
| `.env.local` | 생성 | 로컬 환경변수 (gitignore) |
| `.gitignore` | 수정 | .env.local 등 추가 |
| `lib/utils/cn.ts` | 생성 | clsx + tailwind-merge 유틸 |
| `components/ui/button.tsx` | 생성 | Button 컴포넌트 (CVA) |
| `components/ui/input.tsx` | 생성 | Input 컴포넌트 |
| `components/ui/label.tsx` | 생성 | Label 컴포넌트 |
| `components/ui/card.tsx` | 생성 | Card 컴포넌트 |
| `components/ui/badge.tsx` | 생성 | Badge 컴포넌트 |
| `components/ui/dialog.tsx` | 생성 | Dialog 컴포넌트 |
| `components/ui/tabs.tsx` | 생성 | Tabs 컴포넌트 |
| `components/ui/select.tsx` | 생성 | Select 컴포넌트 |
| `components/ui/toast.tsx` | 생성 | Sonner 래퍼 |
| `components/layout/header.tsx` | 생성 | 공통 헤더 |
| `components/layout/sidebar.tsx` | 생성 | 대시보드 사이드바 |
| `components/layout/mobile-nav.tsx` | 생성 | 모바일 내비게이션 |
| `types/index.ts` | 생성 | 공통 타입 re-export |

---

## 1. 프로젝트 초기화

### 1.1 Next.js 15 프로젝트 생성

```bash
yarn create next-app@15 charlotte \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --turbopack
```

> **주의**: Next.js 15는 `create-next-app` 실행 시 Tailwind CSS v4를 자동으로 설치하며, `postcss.config.mjs`와 `globals.css`를 v4 형식으로 생성한다.

### 1.2 의존성 설치

**Runtime 의존성:**

```bash
yarn add \
  @supabase/supabase-js@^2 \
  @supabase/ssr@^0.5 \
  @anthropic-ai/sdk \
  @fal-ai/client \
  @lemonsqueezy/lemonsqueezy.js \
  zustand@^5 \
  zod@^3 \
  react-hook-form@^7 \
  @hookform/resolvers@^3 \
  class-variance-authority \
  clsx \
  tailwind-merge \
  lucide-react \
  sharp@^0.33 \
  satori@^0.12 \
  @vercel/og@^0.6 \
  png-to-ico@^2 \
  jszip@^3 \
  file-saver@^2 \
  nanoid@^5 \
  sonner@^2
```

**Dev 의존성:**

```bash
yarn add -D \
  @types/node@^22 \
  @types/file-saver
```

> `@types/react`, `@types/react-dom`, `eslint`, `eslint-config-next`, `typescript`, `tailwindcss`, `@tailwindcss/postcss`는 `create-next-app`이 자동 설치하므로 별도 추가 불필요.

---

## 2. 설정 파일

### 2.1 `next.config.ts`

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Sharp 네이티브 바이너리를 서버리스 함수 번들에서 제외
  serverExternalPackages: ['sharp'],

  images: {
    // fal.ai 생성 이미지, Supabase Storage 이미지 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.fal.media',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },

  // 실험적 기능
  experimental: {
    // Turbopack 최적화 (Next.js 15에서 dev 기본)
    // serverActions는 Next.js 15에서 기본 활성화
  },
}

export default nextConfig
```

**핵심 포인트:**
- `serverExternalPackages`는 Next.js 15에서 `experimental` 밖으로 이동됨
- Sharp는 네이티브 바이너리(~20MB)이므로 반드시 외부 패키지로 처리
- `remotePatterns`에 fal.ai와 Supabase Storage 도메인 사전 등록

### 2.2 `postcss.config.mjs`

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
```

**주의:** Tailwind CSS v4에서는 `tailwindcss` 플러그인 대신 `@tailwindcss/postcss` 사용. `autoprefixer`도 불필요 (v4 내장).

### 2.3 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2.4 `app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* ── Brand Colors ── */
  --color-brand: #000000;
  --color-brand-foreground: #ffffff;

  /* ── Neutral / Surface ── */
  --color-surface: #ffffff;
  --color-surface-secondary: #f9fafb;
  --color-surface-tertiary: #f3f4f6;

  /* ── Border ── */
  --color-border: #e5e7eb;
  --color-border-hover: #d1d5db;

  /* ── Text ── */
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;

  /* ── Status ── */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* ── Radius ── */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* ── Shadows ── */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  /* ── Font ── */
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

/* ── Base Layer ── */
body {
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background-color: var(--color-surface);
}
```

**Tailwind v4 변경점:**
- `@tailwind base; @tailwind components; @tailwind utilities;` → `@import "tailwindcss";` 한 줄
- `tailwind.config.ts` → CSS `@theme {}` 블록
- CSS 변수 기반이므로 런타임에 값 변경 가능
- `content` 배열 불필요 (자동 감지)

---

## 3. 환경변수

### 3.1 `.env.example`

```bash
# ── Supabase ──
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ── AI Services ──
ANTHROPIC_API_KEY=sk-ant-...
FAL_KEY=...

# ── LemonSqueezy ──
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_STORE_ID=...
LEMONSQUEEZY_WEBHOOK_SECRET=...
LEMONSQUEEZY_PRO_VARIANT_ID=...

# ── App ──
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**보안 규칙:**
- `NEXT_PUBLIC_` 접두사: 클라이언트에 노출됨 → Supabase URL, Anon Key만 사용
- `SUPABASE_SERVICE_ROLE_KEY`: 서버 전용, 절대 NEXT_PUBLIC_ 붙이지 않음
- `ANTHROPIC_API_KEY`, `FAL_KEY`, `LEMONSQUEEZY_*`: 서버 전용

---

## 4. 유틸리티 함수

### 4.1 `lib/utils/cn.ts`

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 5. UI 컴포넌트 인터페이스

### 5.1 `components/ui/button.tsx`

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // base
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-brand text-brand-foreground hover:bg-brand/90',
        secondary: 'bg-surface-secondary text-text-primary hover:bg-surface-tertiary',
        outline: 'border border-border bg-surface hover:bg-surface-secondary',
        ghost: 'hover:bg-surface-secondary',
        destructive: 'bg-error text-white hover:bg-error/90',
        link: 'text-brand underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}
```

**Props:**
- `variant`: `'default'` | `'secondary'` | `'outline'` | `'ghost'` | `'destructive'` | `'link'`
- `size`: `'default'` | `'sm'` | `'lg'` | `'icon'`
- `isLoading`: boolean - 로딩 시 Loader2 아이콘 + disabled 처리
- HTML button 기본 속성 모두 전달

### 5.2 `components/ui/input.tsx`

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}
```

**스타일:** `border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand`
**에러 상태:** `border-error focus:ring-error` + 하단 에러 메시지

### 5.3 `components/ui/label.tsx`

```typescript
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}
```

**스타일:** `text-sm font-medium text-text-primary`
**required:** `true`일 때 `*` 표시

### 5.4 `components/ui/card.tsx`

```typescript
// Card 컴포넌트 계층
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
```

**스타일:** `rounded-lg border border-border bg-surface shadow-sm`

### 5.5 `components/ui/badge.tsx`

```typescript
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-brand text-brand-foreground',
        secondary: 'bg-surface-secondary text-text-primary',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        error: 'bg-error/10 text-error',
        outline: 'border border-border text-text-primary',
        pro: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}
```

### 5.6 `components/ui/dialog.tsx`

```typescript
interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}
```

**구현 방식:** HTML `<dialog>` 엘리먼트 + portal (외부 라이브러리 없이 직접 구현)
**동작:** 백드롭 클릭 닫기, ESC 닫기, 포커스 트랩

### 5.7 `components/ui/tabs.tsx`

```typescript
interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}
```

### 5.8 `components/ui/select.tsx`

```typescript
interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  options: { label: string; value: string }[]
  placeholder?: string
  disabled?: boolean
  error?: string
}
```

### 5.9 `components/ui/toast.tsx`

```typescript
// Sonner 래퍼
// Toaster 컴포넌트를 root layout에 배치
// toast() 함수 re-export

import { Toaster, toast } from 'sonner'

// Root layout에서:
// <Toaster position="bottom-right" richColors />

// 사용:
// toast.success('저장되었습니다')
// toast.error('오류가 발생했습니다')
// toast.loading('처리 중...')
```

---

## 6. 레이아웃 컴포넌트

### 6.1 `app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'BrandKit - AI Brand Asset Generator',
    template: '%s | BrandKit',
  },
  description: '나만의 브랜드 스타일 저장 → 플랫폼 선택 → 모든 브랜드 에셋 자동 생성',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
```

### 6.2 `components/layout/header.tsx`

```typescript
interface HeaderProps {
  showAuth?: boolean      // 로그인/회원가입 버튼 표시 여부
  showUserMenu?: boolean  // 사용자 메뉴 표시 여부
}
```

**구성:**
- 로고 (좌측)
- 네비게이션 링크 (중앙, 데스크톱만)
- 인증 버튼 or 사용자 메뉴 (우측)
- 모바일: 햄버거 메뉴

### 6.3 `components/layout/sidebar.tsx`

```typescript
interface SidebarProps {
  className?: string
}

// 네비게이션 항목
const navItems = [
  { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/dashboard/projects', label: '프로젝트', icon: FolderOpen },
  { href: '/dashboard/brand-profiles', label: '브랜드 프로필', icon: Palette },
  { href: '/dashboard/settings', label: '설정', icon: Settings },
]
```

**동작:**
- 데스크톱: 좌측 고정 사이드바 (w-64)
- 모바일: Sheet/Drawer 형태 (오버레이)
- 현재 경로 활성 상태 표시

### 6.4 `components/layout/mobile-nav.tsx`

```typescript
interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}
```

**동작:** 좌측에서 슬라이드 인, 백드롭 클릭/ESC로 닫기

---

## 7. 디렉토리 구조 스캐폴딩

Phase 1 완료 시 생성되어야 하는 빈 디렉토리:

```
charlotte/
├── app/
│   ├── (auth)/           # Phase 2에서 구현
│   ├── (dashboard)/      # Phase 3에서 구현
│   └── api/              # Phase 4+에서 구현
├── components/
│   ├── ui/               # 이 Phase에서 구현
│   ├── layout/           # 이 Phase에서 구현
│   ├── wizard/           # Phase 4에서 구현
│   ├── brand-profile/    # Phase 3에서 구현
│   ├── preview/          # Phase 7에서 구현
│   └── shared/           # 공통 컴포넌트
├── lib/
│   ├── supabase/         # Phase 2에서 구현
│   ├── lemonsqueezy/     # Phase 8에서 구현
│   ├── ai/               # Phase 4에서 구현
│   ├── assets/           # Phase 6에서 구현
│   └── utils/            # cn.ts만 이 Phase
├── store/                # Phase 3+4에서 구현
├── types/                # index.ts만 이 Phase
├── public/
│   ├── icons/            # 심볼 라이브러리 SVG (Phase 5)
│   └── fonts/            # OG 이미지용 폰트 (Phase 6)
├── supabase/
│   └── migrations/       # Phase 2에서 구현
└── docs/
    ├── spec/
    └── reports/
```

---

## 기술적 주의사항

### 1. Tailwind CSS v4 마이그레이션
- `tailwind.config.ts` 파일이 존재하면 안 됨 (v4에서 제거)
- `@apply` 디렉티브는 v4에서도 지원되지만, CSS 변수 사용 권장
- `@theme` 블록 내 변수명은 `--color-*`, `--spacing-*` 등 Tailwind 네이밍 컨벤션 따름

### 2. Inter 폰트 로딩
- `next/font/google`의 `Inter`를 사용하면 Google Fonts CDN 대신 빌드 타임에 폰트를 인라인
- OG 이미지용 폰트는 별도로 `public/fonts/`에 `.woff`/`.ttf` 파일로 준비 (Phase 6)

### 3. Next.js 15 기본 동작
- `create-next-app@15`는 `turbopack`을 dev 서버 기본으로 사용
- `next dev --turbopack` 명시 불필요 (자동)
- `server actions`가 기본 활성화됨

### 4. ESLint 9 Flat Config
- Next.js 15의 `eslint-config-next@15`는 ESLint 9 flat config 형식 사용
- `eslint.config.mjs` 파일이 `create-next-app`에 의해 자동 생성됨

### 5. CVA 패턴
- 모든 UI 컴포넌트는 `class-variance-authority`로 variant 관리
- `cn()` 유틸을 통해 외부 className과 안전하게 병합
- 각 variant는 `@theme` 변수를 참조하여 테마 일관성 유지

---

## 검증 방법

### 검증 1: 개발 서버 정상 실행

```bash
yarn dev
# http://localhost:3000 접속 → 페이지 정상 렌더링
# 콘솔에 에러 없음 확인
# Turbopack 활성화 확인 (터미널에 "Turbopack" 표시)
```

### 검증 2: Tailwind CSS v4 작동

```bash
# globals.css에 @theme 변수가 정상 적용되는지 확인
# 브라우저 DevTools > Elements에서 CSS 변수 확인:
# --color-brand: #000000
# 컴포넌트에 Tailwind 클래스 적용 시 정상 스타일링
```

### 검증 3: UI 컴포넌트 렌더링

```
1. Button 컴포넌트 variant별 렌더링 확인 (default, secondary, outline, ghost)
2. Input 컴포넌트 포커스 스타일 + 에러 상태 확인
3. Card 컴포넌트 border, shadow 확인
4. Badge 컴포넌트 variant별 확인 (pro 배지 그라데이션 포함)
5. Toast 알림 정상 표시 (toast.success 호출)
```

### 검증 4: TypeScript 빌드

```bash
yarn build
# 타입 에러 없이 빌드 완료
# .next 디렉토리 생성 확인
```

### 검증 5: 환경변수 설정

```bash
# .env.example에 모든 키가 나열되어 있는지 확인
# .env.local이 .gitignore에 포함되어 있는지 확인
# git status에 .env.local이 표시되지 않는지 확인
```
