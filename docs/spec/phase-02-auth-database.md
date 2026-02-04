# Phase 02: 인증 + 데이터베이스 스키마

## 목표

Supabase Auth(쿠키 기반 SSR)와 전체 DB 스키마를 설정한다. Next.js 15의 async API에 맞는 Supabase 클라이언트, middleware, 4개 마이그레이션(테이블, RLS, 함수, 시드 데이터), 인증 페이지(로그인/회원가입), OAuth 콜백, 이메일 확인 라우트를 구현한다.

---

## 생성/수정 파일 목록

| 파일 경로 | 작업 | 설명 |
|-----------|------|------|
| `lib/supabase/client.ts` | 생성 | 브라우저 Supabase 클라이언트 |
| `lib/supabase/server.ts` | 생성 | 서버 Supabase 클라이언트 (SSR) |
| `lib/supabase/middleware.ts` | 생성 | middleware용 Supabase 클라이언트 |
| `lib/supabase/admin.ts` | 생성 | Service Role 클라이언트 (서버 전용) |
| `lib/supabase/types.ts` | 생성 | re-export |
| `middleware.ts` | 생성 | Next.js root middleware |
| `supabase/migrations/001_initial_schema.sql` | 생성 | 테이블 + 인덱스 |
| `supabase/migrations/002_rls_policies.sql` | 생성 | RLS 정책 |
| `supabase/migrations/003_functions.sql` | 생성 | 트리거 함수 |
| `supabase/migrations/004_seed_presets.sql` | 생성 | 스타일 프리셋 시드 |
| `app/(auth)/login/page.tsx` | 생성 | 로그인 페이지 |
| `app/(auth)/login/actions.ts` | 생성 | 로그인 Server Actions |
| `app/(auth)/signup/page.tsx` | 생성 | 회원가입 페이지 |
| `app/(auth)/signup/actions.ts` | 생성 | 회원가입 Server Actions |
| `app/(auth)/auth/confirm/route.ts` | 생성 | 이메일 확인 핸들러 |
| `app/(auth)/auth/callback/route.ts` | 생성 | OAuth 콜백 핸들러 |
| `app/(auth)/auth/signout/route.ts` | 생성 | 로그아웃 핸들러 |
| `components/layout/auth-guard.tsx` | 생성 | 서버 컴포넌트 인증 가드 |
| `types/database.ts` | 생성 | DB 타입 정의 |

---

## 1. Supabase 클라이언트 설정

### 1.1 `lib/supabase/client.ts` (브라우저용)

```typescript
'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 1.2 `lib/supabase/server.ts` (서버용 - Next.js 15 async)

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies() // Next.js 15: async 필수

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서 호출 시 무시
            // middleware에서 세션 갱신이 처리됨
          }
        },
      },
    }
  )
}
```

**핵심:** `await cookies()`는 Next.js 15 필수. 동기 호출 시 런타임 에러 발생.

### 1.3 `lib/supabase/middleware.ts` (middleware용)

```typescript
import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 세션 갱신 (토큰 리프레시)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 미인증 사용자가 보호 경로 접근 시 리다이렉트
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 인증된 사용자가 auth 페이지 접근 시 대시보드로 리다이렉트
  if (
    user &&
    (request.nextUrl.pathname.startsWith('/login') ||
     request.nextUrl.pathname.startsWith('/signup'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

### 1.4 `lib/supabase/admin.ts` (Service Role - 서버 전용)

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Service Role: RLS 바이패스. 절대 클라이언트에서 사용 금지.
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### 1.5 `middleware.ts` (root)

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * 아래 경로를 제외한 모든 요청에 매칭:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     * - public 폴더의 정적 파일 (svg, png 등)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## 2. DB 마이그레이션

### 2.1 `001_initial_schema.sql`

```sql
-- ─────────────────────────────────────────────
-- Extension
-- ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- Enum Types
-- ─────────────────────────────────────────────
CREATE TYPE plan_type AS ENUM ('free', 'pro');
CREATE TYPE style_direction AS ENUM ('minimal', 'playful', 'corporate', 'tech', 'custom');
CREATE TYPE color_mode AS ENUM ('mono', 'duotone', 'gradient', 'vibrant');
CREATE TYPE icon_style AS ENUM ('outline', 'filled', '3d_soft', 'flat');
CREATE TYPE corner_style AS ENUM ('sharp', 'rounded', 'pill');
CREATE TYPE platform_type AS ENUM ('web', 'mobile', 'all');
CREATE TYPE mobile_target AS ENUM ('android', 'ios', 'both');
CREATE TYPE icon_type AS ENUM ('text', 'symbol', 'ai_generated');
CREATE TYPE project_status AS ENUM ('draft', 'generating', 'completed', 'failed');

-- ─────────────────────────────────────────────
-- users
-- ─────────────────────────────────────────────
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  plan plan_type NOT NULL DEFAULT 'free',
  lemonsqueezy_customer_id TEXT,
  lemonsqueezy_subscription_id TEXT,
  projects_used_this_month INTEGER NOT NULL DEFAULT 0,
  ai_headlines_used_this_month INTEGER NOT NULL DEFAULT 0,
  ai_icons_used_this_month INTEGER NOT NULL DEFAULT 0,
  usage_reset_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- brand_profiles
-- ─────────────────────────────────────────────
CREATE TABLE public.brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  style_direction style_direction NOT NULL DEFAULT 'minimal',
  primary_color TEXT NOT NULL DEFAULT '#000000',
  secondary_colors TEXT[] NOT NULL DEFAULT '{}',
  color_mode color_mode NOT NULL DEFAULT 'mono',
  icon_style icon_style NOT NULL DEFAULT 'outline',
  corner_style corner_style NOT NULL DEFAULT 'rounded',
  typography_mood TEXT,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- style_presets
-- ─────────────────────────────────────────────
CREATE TABLE public.style_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_free BOOLEAN NOT NULL DEFAULT false,
  best_for_styles TEXT[] NOT NULL DEFAULT '{}',
  icon_style TEXT,
  corner_radius INTEGER NOT NULL DEFAULT 8,
  shadow_style TEXT,
  color_mode TEXT,
  og_layout TEXT,
  og_typography TEXT,
  og_background TEXT,
  ai_style_modifier TEXT,
  preview_image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- projects
-- ─────────────────────────────────────────────
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  brand_profile_id UUID REFERENCES public.brand_profiles(id) ON DELETE SET NULL,
  style_preset_id UUID NOT NULL REFERENCES public.style_presets(id),
  name TEXT NOT NULL,
  description TEXT,
  platform platform_type NOT NULL DEFAULT 'web',
  mobile_target mobile_target,
  primary_color_override TEXT,
  icon_type icon_type,
  icon_value TEXT,
  ai_headline TEXT,
  ai_tagline TEXT,
  ai_og_description TEXT,
  ai_short_slogan TEXT,
  assets_zip_url TEXT,
  status project_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────
CREATE INDEX idx_brand_profiles_user_id ON public.brand_profiles(user_id);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_brand_profile_id ON public.projects(brand_profile_id);
CREATE INDEX idx_style_presets_is_free ON public.style_presets(is_free);
CREATE INDEX idx_style_presets_slug ON public.style_presets(slug);

-- ─────────────────────────────────────────────
-- Updated_at trigger function
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_profiles_updated_at
  BEFORE UPDATE ON public.brand_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

### 2.2 `002_rls_policies.sql`

```sql
-- ─────────────────────────────────────────────
-- Enable RLS
-- ─────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_presets ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- users 정책
-- ─────────────────────────────────────────────
-- SELECT: 본인만
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- UPDATE: 본인만
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT 없음: handle_new_user 트리거(SECURITY DEFINER)가 처리

-- ─────────────────────────────────────────────
-- brand_profiles 정책
-- ─────────────────────────────────────────────
CREATE POLICY "brand_profiles_select_own"
  ON public.brand_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "brand_profiles_insert_own"
  ON public.brand_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "brand_profiles_update_own"
  ON public.brand_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "brand_profiles_delete_own"
  ON public.brand_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- projects 정책
-- ─────────────────────────────────────────────
CREATE POLICY "projects_select_own"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "projects_insert_own"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update_own"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_delete_own"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- style_presets 정책 (읽기 전용, 모든 인증 사용자)
-- ─────────────────────────────────────────────
CREATE POLICY "style_presets_select_all"
  ON public.style_presets FOR SELECT
  USING (true);
```

### 2.3 `003_functions.sql`

```sql
-- ─────────────────────────────────────────────
-- 1. handle_new_user: auth.users INSERT 시 public.users 자동 생성
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'email');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────
-- 2. check_brand_profile_limit: brand_profiles INSERT 전 개수 제한
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.check_brand_profile_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_count INTEGER;
  user_plan public.plan_type;
  max_profiles INTEGER;
BEGIN
  -- 사용자의 현재 플랜 조회
  SELECT plan INTO user_plan
  FROM public.users
  WHERE id = NEW.user_id;

  -- 플랜별 최대 프로필 수
  IF user_plan = 'free' THEN
    max_profiles := 1;
  ELSE
    max_profiles := 5;
  END IF;

  -- 현재 프로필 수 조회
  SELECT COUNT(*) INTO current_count
  FROM public.brand_profiles
  WHERE user_id = NEW.user_id;

  -- 제한 초과 시 에러
  IF current_count >= max_profiles THEN
    RAISE EXCEPTION 'Brand profile limit reached. Current plan (%) allows up to % profiles.',
      user_plan, max_profiles;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER before_brand_profile_insert
  BEFORE INSERT ON public.brand_profiles
  FOR EACH ROW EXECUTE FUNCTION public.check_brand_profile_limit();

-- ─────────────────────────────────────────────
-- 3. reset_monthly_usage: Lazy reset 패턴
--    usage_reset_at이 지난 사용자의 카운터를 0으로 리셋
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.users
  SET
    projects_used_this_month = 0,
    ai_headlines_used_this_month = 0,
    ai_icons_used_this_month = 0,
    usage_reset_at = NOW() + INTERVAL '30 days',
    updated_at = NOW()
  WHERE
    usage_reset_at <= NOW()
    AND auth.uid() = id;
END;
$$;
```

**핵심 포인트:**
- `SET search_path = ''`: `SECURITY DEFINER` 함수의 search_path 인젝션 방지
- `handle_new_user`: OAuth, 이메일 가입 모두 작동 (auth.users INSERT 트리거)
- `reset_monthly_usage`: `auth.uid() = id` 조건으로 본인 데이터만 리셋
- `check_brand_profile_limit`: INSERT 전에 실행되어 제한 초과 방지

### 2.4 `004_seed_presets.sql`

```sql
-- ─────────────────────────────────────────────
-- 스타일 프리셋 시드 데이터
-- ─────────────────────────────────────────────

-- FREE 프리셋 (3개)
INSERT INTO public.style_presets (name, slug, is_free, best_for_styles, icon_style, corner_radius, shadow_style, color_mode, og_layout, og_typography, og_background, ai_style_modifier, sort_order)
VALUES
  (
    'Notion Minimal',
    'notion-minimal',
    true,
    ARRAY['minimal'],
    'Outline / Line art',
    8,
    'None',
    'Monochrome',
    'Left-aligned, icon beside text',
    'Inter, Medium',
    'Pure white (#FFFFFF)',
    'clean lines, simple shapes, whitespace, understated, elegant simplicity, Notion-style',
    1
  ),
  (
    'Airbnb 3D',
    'airbnb-3d',
    true,
    ARRAY['playful'],
    '3D with soft shadows',
    22,
    'Soft drop shadow',
    'Solid with gradient overlay',
    'Centered, large icon',
    'Plus Jakarta Sans, Bold',
    'Light warm gradient',
    'soft 3D render, subtle shadows, rounded, depth, warm, friendly, Airbnb-style',
    2
  ),
  (
    'Stripe Gradient',
    'stripe-gradient',
    true,
    ARRAY['tech'],
    'Gradient fill with glow',
    16,
    'Colored glow',
    'Gradient',
    'Centered, dark background',
    'Inter, Semibold',
    'Dark gradient',
    'gradient fill, glowing edges, futuristic, sleek, Stripe-style',
    3
  );

-- PRO 프리셋 (5개)
INSERT INTO public.style_presets (name, slug, is_free, best_for_styles, icon_style, corner_radius, shadow_style, color_mode, og_layout, og_typography, og_background, ai_style_modifier, sort_order)
VALUES
  (
    'Linear Dark',
    'linear-dark',
    false,
    ARRAY['tech', 'minimal'],
    'Outline with neon accent',
    12,
    'Subtle neon glow',
    'Dark with accent',
    'Left-aligned, dark background',
    'Inter, Medium',
    'Dark (#0A0A0A) with subtle gradient',
    'dark background, neon accent lines, futuristic, Linear-style',
    4
  ),
  (
    'Vercel Sharp',
    'vercel-sharp',
    false,
    ARRAY['minimal', 'corporate'],
    'Geometric, monochrome',
    0,
    'None',
    'Pure monochrome',
    'Centered, large text',
    'Geist, Bold',
    'Pure black or white',
    'extreme minimalism, geometric, black and white only, Vercel-style',
    5
  ),
  (
    'Glassmorphism',
    'glassmorphism',
    false,
    ARRAY['tech', 'playful'],
    'Frosted glass effect',
    16,
    'Glass blur + subtle border',
    'Translucent gradient',
    'Centered, blur background',
    'Inter, Semibold',
    'Gradient with blur overlay',
    'frosted glass, translucent, blur background, subtle borders, glass morphism',
    6
  ),
  (
    'Duolingo Playful',
    'duolingo-playful',
    false,
    ARRAY['playful'],
    'Bold 3D, chunky',
    24,
    'Hard drop shadow',
    'Bright solid colors',
    'Centered, playful layout',
    'Nunito, Extra Bold',
    'Bright solid color',
    'bright 3D, chunky shapes, hard shadows, playful, cheerful, Duolingo-style',
    7
  ),
  (
    'Figma Clean',
    'figma-clean',
    false,
    ARRAY['corporate', 'minimal'],
    'Clean filled',
    8,
    'Minimal shadow',
    'Clean with accent',
    'Grid layout, balanced',
    'Inter, Regular',
    'Light gray (#F5F5F5)',
    'clean design, balanced composition, minimal shadows, Figma-style',
    8
  );
```

---

## 3. 인증 페이지

### 3.1 `app/(auth)/login/page.tsx`

**Client Component** (`'use client'`)

**상태:**
- `email`: string
- `password`: string
- `isLoading`: boolean
- `error`: string | null

**UI 구성:**
- 이메일 입력 필드
- 비밀번호 입력 필드
- "로그인" 버튼
- "Google로 계속하기" 버튼
- "GitHub로 계속하기" 버튼
- 에러 메시지 표시 영역
- 회원가입 링크

**동작:**
1. 이메일/비밀번호 제출 → `signIn` Server Action 호출
2. 성공 → `/dashboard`로 리다이렉트
3. 실패 → 에러 메시지 표시
4. OAuth → `signInWithOAuth` Server Action → Google/GitHub 인증 페이지로 리다이렉트

### 3.2 `app/(auth)/login/actions.ts`

```typescript
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function signIn({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signInWithOAuth(provider: 'google' | 'github') {
  const supabase = await createClient()
  const headerStore = await headers()
  const origin = headerStore.get('origin') || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}
```

### 3.3 `app/(auth)/signup/page.tsx`

**Client Component** (`'use client'`)

**상태:**
- `email`: string
- `password`: string
- `confirmPassword`: string
- `isLoading`: boolean
- `error`: string | null
- `isSuccess`: boolean

**UI 구성:**
- 이메일 입력 필드
- 비밀번호 입력 필드 (6자 이상)
- 비밀번호 확인 필드
- "이메일로 가입" 버튼
- Google/GitHub OAuth 버튼
- 에러 메시지 표시 영역
- 성공 시: "이메일을 확인하세요" 안내 화면으로 전환

**동작:**
1. 비밀번호 확인 불일치 → 클라이언트 에러
2. 제출 → `signUp` Server Action 호출
3. 성공 → `isSuccess = true`, 이메일 확인 안내 화면 표시
4. OAuth → `signUpWithOAuth` Server Action (내부적으로 signInWithOAuth와 동일)

### 3.4 `app/(auth)/signup/actions.ts`

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signUp({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const supabase = await createClient()
  const headerStore = await headers()
  const origin = headerStore.get('origin') || 'http://localhost:3000'

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function signUpWithOAuth(provider: 'google' | 'github') {
  const supabase = await createClient()
  const headerStore = await headers()
  const origin = headerStore.get('origin') || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}
```

### 3.5 `app/(auth)/auth/confirm/route.ts`

이메일 확인 링크 클릭 시 처리.

```typescript
import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })

    if (!error) {
      redirect(next)
    }
  }

  redirect('/login?error=이메일 확인에 실패했습니다.')
}
```

### 3.6 `app/(auth)/auth/callback/route.ts`

OAuth 콜백 처리.

```typescript
import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(
    `${new URL(request.url).origin}/login?error=OAuth 인증에 실패했습니다.`
  )
}
```

### 3.7 `app/(auth)/auth/signout/route.ts`

```typescript
import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  return NextResponse.redirect(new URL('/', request.url), { status: 302 })
}
```

---

## 4. Auth Guard

### 4.1 `components/layout/auth-guard.tsx`

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface AuthGuardProps {
  children: React.ReactNode
}

export default async function AuthGuard({ children }: AuthGuardProps) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return <>{children}</>
}
```

**사용:** `app/(dashboard)/layout.tsx`에서 `<AuthGuard>`로 children 감싸기.

---

## 5. TypeScript 타입 정의

### 5.1 `types/database.ts`

```typescript
// ── Enum 타입 ──
export type Plan = 'free' | 'pro'
export type StyleDirection = 'minimal' | 'playful' | 'corporate' | 'tech' | 'custom'
export type ColorMode = 'mono' | 'duotone' | 'gradient' | 'vibrant'
export type IconStyle = 'outline' | 'filled' | '3d_soft' | 'flat'
export type CornerStyle = 'sharp' | 'rounded' | 'pill'
export type Platform = 'web' | 'mobile' | 'all'
export type MobileTarget = 'android' | 'ios' | 'both'
export type IconType = 'text' | 'symbol' | 'ai_generated'
export type ProjectStatus = 'draft' | 'generating' | 'completed' | 'failed'

// ── Row 타입 ──
export interface User {
  id: string
  email: string
  plan: Plan
  lemonsqueezy_customer_id: string | null
  lemonsqueezy_subscription_id: string | null
  projects_used_this_month: number
  ai_headlines_used_this_month: number
  ai_icons_used_this_month: number
  usage_reset_at: string
  created_at: string
  updated_at: string
}

export interface BrandProfile {
  id: string
  user_id: string
  name: string
  style_direction: StyleDirection
  primary_color: string
  secondary_colors: string[]
  color_mode: ColorMode
  icon_style: IconStyle
  corner_style: CornerStyle
  typography_mood: string | null
  keywords: string[]
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface StylePreset {
  id: string
  name: string
  slug: string
  is_free: boolean
  best_for_styles: string[]
  icon_style: string | null
  corner_radius: number
  shadow_style: string | null
  color_mode: string | null
  og_layout: string | null
  og_typography: string | null
  og_background: string | null
  ai_style_modifier: string | null
  preview_image_url: string | null
  sort_order: number
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  brand_profile_id: string | null
  style_preset_id: string
  name: string
  description: string | null
  platform: Platform
  mobile_target: MobileTarget | null
  primary_color_override: string | null
  icon_type: IconType | null
  icon_value: string | null
  ai_headline: string | null
  ai_tagline: string | null
  ai_og_description: string | null
  ai_short_slogan: string | null
  assets_zip_url: string | null
  status: ProjectStatus
  created_at: string
  updated_at: string
}

// ── Insert / Update 타입 ──
export interface UserInsert {
  id: string
  email: string
  plan?: Plan
}

export interface UserUpdate {
  email?: string
  plan?: Plan
  lemonsqueezy_customer_id?: string | null
  lemonsqueezy_subscription_id?: string | null
  projects_used_this_month?: number
  ai_headlines_used_this_month?: number
  ai_icons_used_this_month?: number
  usage_reset_at?: string
}

export interface BrandProfileInsert {
  user_id: string
  name: string
  style_direction?: StyleDirection
  primary_color?: string
  secondary_colors?: string[]
  color_mode?: ColorMode
  icon_style?: IconStyle
  corner_style?: CornerStyle
  typography_mood?: string | null
  keywords?: string[]
  is_default?: boolean
}

export interface BrandProfileUpdate {
  name?: string
  style_direction?: StyleDirection
  primary_color?: string
  secondary_colors?: string[]
  color_mode?: ColorMode
  icon_style?: IconStyle
  corner_style?: CornerStyle
  typography_mood?: string | null
  keywords?: string[]
  is_default?: boolean
}

export interface ProjectInsert {
  user_id: string
  style_preset_id: string
  name: string
  platform: Platform
  brand_profile_id?: string | null
  description?: string | null
  mobile_target?: MobileTarget | null
  primary_color_override?: string | null
  icon_type?: IconType | null
  icon_value?: string | null
  ai_headline?: string | null
  ai_tagline?: string | null
  ai_og_description?: string | null
  ai_short_slogan?: string | null
  assets_zip_url?: string | null
  status?: ProjectStatus
}

export interface ProjectUpdate {
  brand_profile_id?: string | null
  style_preset_id?: string
  name?: string
  description?: string | null
  platform?: Platform
  mobile_target?: MobileTarget | null
  primary_color_override?: string | null
  icon_type?: IconType | null
  icon_value?: string | null
  ai_headline?: string | null
  ai_tagline?: string | null
  ai_og_description?: string | null
  ai_short_slogan?: string | null
  assets_zip_url?: string | null
  status?: ProjectStatus
}

// ── Supabase Database 타입 ──
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: UserInsert
        Update: UserUpdate
      }
      brand_profiles: {
        Row: BrandProfile
        Insert: BrandProfileInsert
        Update: BrandProfileUpdate
      }
      style_presets: {
        Row: StylePreset
        Insert: never
        Update: never
      }
      projects: {
        Row: Project
        Insert: ProjectInsert
        Update: ProjectUpdate
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reset_monthly_usage: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ── 플랜 제한 상수 ──
export const PLAN_LIMITS = {
  free: {
    brand_profiles: 1,
    projects_per_month: 3,
    ai_headlines_per_month: 10,
    ai_icons_per_month: 5,
    style_presets: 'free_only' as const,
  },
  pro: {
    brand_profiles: 5,
    projects_per_month: Infinity,
    ai_headlines_per_month: Infinity,
    ai_icons_per_month: Infinity,
    style_presets: 'all' as const,
  },
} as const
```

---

## 기술적 주의사항

### 1. Next.js 15 async API
- `cookies()`, `headers()` → `await` 필수
- `params`, `searchParams` → Promise로 변경
- 기존 Next.js 14 Supabase SSR 예제를 그대로 사용하면 에러 발생

### 2. `getUser()` vs `getSession()`
- `getUser()`: Supabase Auth 서버에 토큰 검증 요청 (안전, 매 요청 네트워크 호출)
- `getSession()`: 로컬 JWT만 확인 (빠르지만, 위변조 가능)
- **보안이 중요한 작업에서는 반드시 `getUser()` 사용**

### 3. Service Role 키 보안
- `lib/supabase/admin.ts`는 서버 전용 파일에서만 import
- `'use client'` 파일에서 import 시 클라이언트 번들에 포함될 위험
- NEXT_PUBLIC_ 접두사 절대 사용 금지

### 4. `SET search_path = ''`
- 모든 `SECURITY DEFINER` 함수에 필수
- search_path 인젝션 공격 방지
- 함수 내 모든 테이블 참조에 `public.` 스키마 접두사 필요

### 5. OAuth 제공자 설정
Supabase Dashboard에서 활성화 필요:
- **Google**: Google Cloud Console에서 OAuth 2.0 Client ID 생성 → Supabase Provider 설정
- **GitHub**: GitHub Developer Settings에서 OAuth App 생성 → Supabase Provider 설정
- Redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`

### 6. Lazy Reset 패턴
- API 요청마다 `supabase.rpc('reset_monthly_usage')` 호출
- `usage_reset_at <= NOW()` 조건에 해당하는 사용자만 리셋
- cron job 불필요, 비활성 사용자는 연산 발생 안 함

---

## 검증 방법

### 검증 1: 이메일 회원가입

```
1. /signup → 이메일/비밀번호 입력 → "이메일로 가입"
2. "이메일을 확인하세요" 화면 표시
3. 이메일 확인 링크 클릭 → /dashboard 리다이렉트
4. Supabase Dashboard > auth.users + public.users에 행 확인
```

### 검증 2: 로그인/로그아웃

```
1. /login → 이메일/비밀번호 → /dashboard 리다이렉트
2. 로그아웃 → / 리다이렉트
3. /dashboard 직접 접근 → /login 리다이렉트
```

### 검증 3: OAuth 인증

```
1. "Google로 계속하기" → Google 인증 → /auth/callback → /dashboard
2. 신규 사용자: public.users 행 자동 생성 확인
3. GitHub도 동일하게 검증
```

### 검증 4: RLS 교차 접근 차단

```
1. 사용자 A: brand_profile 생성
2. 사용자 B (다른 브라우저): brand_profiles 조회 → A의 프로필 보이지 않음
3. 사용자 B: 직접 A의 프로필 ID로 접근 시도 → 빈 결과
```

### 검증 5: Brand Profile 개수 제한

```
1. Free 사용자: 첫 번째 프로필 생성 (성공)
2. 두 번째 프로필 생성 시도 → "Brand profile limit reached" 에러
3. Pro로 업그레이드 후: 5개까지 생성 가능
```

### 검증 6: 미들웨어 세션 갱신

```
1. 로그인 → /dashboard → 페이지 새로고침 반복
2. 세션 유지 확인 (1시간+ 경과 후에도)
3. DevTools > Cookies에서 토큰 갱신 확인
```
