# Phase 10: 랜딩 페이지 + 배포

## 목표

랜딩 페이지 구현, OG 이미지 엔드포인트, Vercel 배포 설정, 환경변수 설정, 프로덕션 체크리스트를 완성한다.

---

## 생성/수정 파일 목록

| 파일 경로 | 작업 | 설명 |
|-----------|------|------|
| `app/page.tsx` | 수정 | 랜딩 페이지 |
| `components/landing/hero.tsx` | 생성 | Hero 섹션 |
| `components/landing/features.tsx` | 생성 | Features 섹션 |
| `components/landing/pricing.tsx` | 생성 | Pricing 섹션 |
| `components/landing/how-it-works.tsx` | 생성 | How it Works 섹션 |
| `components/landing/cta.tsx` | 생성 | CTA 섹션 |
| `app/api/og/route.tsx` | 생성 | OG 이미지 동적 생성 |
| `app/layout.tsx` | 수정 | 메타데이터 추가 |
| `public/logo.svg` | 생성 | 로고 |
| `vercel.json` | 생성 | Vercel 설정 |
| `.env.production` | 생성 | 프로덕션 환경변수 템플릿 |

---

## 1. 랜딩 페이지

### 1.1 전체 구조

```
┌─ Hero ─────────────────────────────────────┐
│  BrandKit                                   │
│  나만의 브랜드 스타일 → 모든 에셋 자동 생성   │
│  [무료로 시작하기]  [데모 보기]              │
└─────────────────────────────────────────────┘

┌─ Features ─────────────────────────────────┐
│  ✨ AI 기반 브랜드 카피                      │
│  🎨 일관된 디자인 시스템                     │
│  📦 플랫폼별 에셋 패키지                     │
└─────────────────────────────────────────────┘

┌─ How It Works ─────────────────────────────┐
│  1. 브랜드 스타일 저장                       │
│  2. 플랫폼 선택                             │
│  3. AI가 모든 에셋 생성                      │
└─────────────────────────────────────────────┘

┌─ Pricing ──────────────────────────────────┐
│  [Free]  [Pro $12/월]                      │
└─────────────────────────────────────────────┘

┌─ CTA ──────────────────────────────────────┐
│  지금 바로 시작하세요                        │
│  [회원가입]                                 │
└─────────────────────────────────────────────┘
```

### 1.2 Hero 섹션 (`components/landing/hero.tsx`)

```typescript
export function Hero() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-4xl text-center">
        <h1 className="text-6xl font-bold tracking-tight">
          나만의 브랜드 스타일 저장
          <br />
          <span className="text-gray-600">모든 에셋 자동 생성</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600">
          브랜드 일관성을 유지하며 Favicon, OG Image, App Icon 등
          <br />
          모든 플랫폼의 브랜드 에셋을 단 몇 분 만에 생성하세요.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">무료로 시작하기</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#demo">데모 보기</Link>
          </Button>
        </div>

        {/* 프리뷰 이미지 또는 비디오 */}
        <div className="mt-12">
          <div className="rounded-lg border bg-gray-50 p-8">
            {/* 스크린샷 또는 애니메이션 */}
            <img
              src="/demo-preview.png"
              alt="BrandKit Demo"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
```

### 1.3 Features 섹션 (`components/landing/features.tsx`)

```typescript
const features = [
  {
    icon: <Sparkles />,
    title: 'AI 기반 브랜드 카피',
    description: 'Claude API로 SEO 최적화된 헤드라인, 태그라인, OG 설명을 자동 생성합니다.',
  },
  {
    icon: <Palette />,
    title: '일관된 디자인 시스템',
    description: 'Brand Profile에 스타일을 저장하고 여러 프로젝트에 일관되게 적용하세요.',
  },
  {
    icon: <Package />,
    title: '플랫폼별 에셋 패키지',
    description: 'Web, iOS, Android 각 플랫폼에 필요한 모든 에셋을 한 번에 생성합니다.',
  },
  {
    icon: <Code />,
    title: '개발자 친화적',
    description: 'Next.js, React, HTML 등 프레임워크별 코드 스니펫을 함께 제공합니다.',
  },
  {
    icon: <Zap />,
    title: '빠른 생성 속도',
    description: '최대 1분 내로 모든 에셋과 ZIP 패키지를 생성합니다.',
  },
  {
    icon: <Shield />,
    title: '안전한 저장소',
    description: 'Supabase Storage에 안전하게 저장되며 언제든 재다운로드할 수 있습니다.',
  },
]

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          강력한 기능들
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 1.4 How It Works 섹션 (`components/landing/how-it-works.tsx`)

```typescript
const steps = [
  {
    number: '01',
    title: '브랜드 스타일 저장',
    description: 'Brand Profile에 컬러, 스타일 방향, 키워드를 저장하세요.',
  },
  {
    number: '02',
    title: '플랫폼 선택',
    description: 'Web, Mobile, 또는 All 중 필요한 플랫폼을 선택하세요.',
  },
  {
    number: '03',
    title: 'AI가 모든 에셋 생성',
    description: 'Claude가 카피를 작성하고, Sharp가 이미지를 생성합니다.',
  },
  {
    number: '04',
    title: '다운로드 & 적용',
    description: 'ZIP 파일로 다운로드하고 코드 스니펫으로 즉시 적용하세요.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          사용 방법
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-6xl font-bold text-gray-200 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 1.5 Pricing 섹션 (`components/landing/pricing.tsx`)

```typescript
const plans = [
  {
    name: 'Free',
    price: '$0',
    interval: '영구 무료',
    features: [
      '월 3개 프로젝트',
      'Brand Profile 1개',
      'AI 헤드라인 월 10회',
      'Free 스타일 3개',
      '기본 에셋 생성',
    ],
    cta: '무료로 시작하기',
    href: '/signup',
  },
  {
    name: 'Pro',
    price: '$12',
    interval: '월',
    features: [
      '무제한 프로젝트',
      'Brand Profile 5개',
      'AI 헤드라인 무제한',
      'AI 아이콘 생성 월 50회',
      '전체 스타일 8개+',
      '우선 지원',
    ],
    cta: 'Pro로 시작하기',
    href: '/signup',
    popular: true,
  },
]

export function Pricing() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          합리적인 가격
        </h2>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={cn(
                plan.popular && 'border-brand ring-2 ring-brand'
              )}
            >
              <CardHeader>
                {plan.popular && (
                  <Badge className="mb-2 w-fit">인기</Badge>
                )}
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-brand" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6"
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 1.6 CTA 섹션 (`components/landing/cta.tsx`)

```typescript
export function CTA() {
  return (
    <section className="py-20 px-4 bg-brand text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          지금 바로 시작하세요
        </h2>
        <p className="text-xl mb-8 opacity-90">
          브랜드 에셋 생성에 드는 시간을 획기적으로 줄이세요.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/signup">무료로 시작하기</Link>
        </Button>
        <p className="mt-4 text-sm opacity-75">
          신용카드 불필요 • 언제든 취소 가능
        </p>
      </div>
    </section>
  )
}
```

---

## 2. OG 이미지 동적 생성

### 2.1 `app/api/og/route.tsx`

```typescript
import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'BrandKit'
  const description =
    searchParams.get('description') ||
    '나만의 브랜드 스타일 → 모든 에셋 자동 생성'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 'bold' }}>{title}</div>
        <div style={{ fontSize: 32, marginTop: 24, opacity: 0.9 }}>
          {description}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

### 2.2 Root Layout 메타데이터 (`app/layout.tsx`)

```typescript
export const metadata: Metadata = {
  title: {
    default: 'BrandKit - AI Brand Asset Generator',
    template: '%s | BrandKit',
  },
  description: '나만의 브랜드 스타일 저장 → 플랫폼 선택 → 모든 브랜드 에셋 자동 생성',
  keywords: [
    'brand assets',
    'favicon generator',
    'og image',
    'app icon',
    'brand identity',
    'AI copywriting',
  ],
  authors: [{ name: 'BrandKit' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://brandkit.app',
    siteName: 'BrandKit',
    title: 'BrandKit - AI Brand Asset Generator',
    description: '나만의 브랜드 스타일 저장 → 모든 에셋 자동 생성',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'BrandKit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrandKit',
    description: '나만의 브랜드 스타일 → 모든 에셋 자동 생성',
    images: ['/api/og'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}
```

---

## 3. Vercel 배포

### 3.1 `vercel.json`

```json
{
  "buildCommand": "yarn build",
  "devCommand": "yarn dev",
  "installCommand": "yarn install",
  "framework": "nextjs",
  "regions": ["icn1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, OPTIONS" }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/github",
      "destination": "https://github.com/your-username/brandkit",
      "permanent": false
    }
  ]
}
```

### 3.2 배포 명령어

```bash
# Vercel CLI 설치
yarn global add vercel

# 로그인
vercel login

# 프로젝트 연결
vercel link

# 환경변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add FAL_KEY
vercel env add LEMONSQUEEZY_API_KEY
vercel env add LEMONSQUEEZY_STORE_ID
vercel env add LEMONSQUEEZY_WEBHOOK_SECRET
vercel env add LEMONSQUEEZY_PRO_VARIANT_ID

# 프리뷰 배포
vercel

# 프로덕션 배포
vercel --prod
```

---

## 4. 환경변수 체크리스트

### 4.1 `.env.production` (템플릿)

```bash
# ── Supabase (필수) ──
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# ── AI Services (필수) ──
ANTHROPIC_API_KEY=
FAL_KEY=

# ── LemonSqueezy (필수) ──
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
LEMONSQUEEZY_PRO_VARIANT_ID=

# ── App URL (필수) ──
NEXT_PUBLIC_APP_URL=https://brandkit.app
```

---

## 5. 프로덕션 체크리스트

### 5.1 Supabase

- [ ] RLS 정책 활성화 (모든 테이블)
- [ ] Storage 버킷 생성 (`project-assets`)
- [ ] Storage 정책 설정 (본인만 업로드/다운로드)
- [ ] Google OAuth 제공자 활성화
- [ ] GitHub OAuth 제공자 활성화
- [ ] 이메일 템플릿 커스터마이징 (선택)
- [ ] Custom domain 설정 (선택)

### 5.2 LemonSqueezy

- [ ] Store 생성
- [ ] Pro 플랜 Product 생성
- [ ] Variant ID 복사
- [ ] Webhook URL 설정: `https://brandkit.app/api/webhooks/lemonsqueezy`
- [ ] Webhook Secret 복사
- [ ] 테스트 모드 → 라이브 모드 전환

### 5.3 Vercel

- [ ] 프로젝트 생성 및 연결
- [ ] 환경변수 모두 설정
- [ ] Custom domain 연결
- [ ] SSL 자동 설정 확인
- [ ] Vercel Pro 플랜 구독 (300초 타임아웃 필요)

### 5.4 보안

- [ ] `.env.local`이 `.gitignore`에 포함
- [ ] Service Role 키가 서버 전용 파일에서만 사용
- [ ] CORS 설정 (필요 시)
- [ ] Rate Limiting (선택)

### 5.5 성능

- [ ] 이미지 최적화 (Next.js Image)
- [ ] 폰트 최적화 (next/font)
- [ ] API Route `maxDuration` 설정
- [ ] Sharp `serverExternalPackages` 설정

### 5.6 모니터링

- [ ] Vercel Analytics 활성화
- [ ] Vercel Speed Insights 활성화
- [ ] Sentry 통합 (선택)
- [ ] 에러 로깅 확인

---

## 6. 배포 후 검증

### 6.1 E2E 테스트

```
1. 회원가입 → 이메일 확인 → 로그인
2. Brand Profile 생성
3. 프로젝트 위자드 전체 플로우 (Step 0-5)
4. 에셋 생성 → ZIP 다운로드
5. Pro 업그레이드 → LemonSqueezy 체크아웃
6. 구독 취소 → 다운그레이드 확인
```

### 6.2 성능 테스트

```
1. Lighthouse 스코어 (Performance > 90)
2. OG 이미지 생성 속도 (< 1초)
3. 에셋 생성 속도 (< 60초)
4. 페이지 로드 속도 (< 2초)
```

### 6.3 크로스 브라우저 테스트

```
- Chrome (최신)
- Safari (최신)
- Firefox (최신)
- Edge (최신)
- iOS Safari
- Android Chrome
```

---

## 기술적 주의사항

### 1. 동적 OG 이미지
- Edge Runtime 사용 (빠른 응답)
- Query Parameter로 동적 생성
- 캐싱 헤더 설정 (선택)

### 2. Vercel Pro 필수
- 300초 함수 타임아웃 (에셋 생성)
- Hobby 플랜은 10초 제한

### 3. Custom Domain
- Vercel에서 도메인 연결
- SSL 자동 설정 (Let's Encrypt)
- `NEXT_PUBLIC_APP_URL` 환경변수 업데이트

### 4. 환경변수 우선순위
- Vercel Dashboard > Env Variables (최우선)
- `.env.production` (프로덕션 빌드)
- `.env.local` (로컬 개발)

---

## 최종 확인

### 배포 전

- [ ] 모든 환경변수 설정 완료
- [ ] `.env.local`이 Git에 커밋되지 않음
- [ ] `yarn build` 로컬에서 성공
- [ ] TypeScript 에러 없음
- [ ] ESLint 에러 없음

### 배포 후

- [ ] 프로덕션 URL 접속 확인
- [ ] 회원가입/로그인 동작
- [ ] 에셋 생성 동작
- [ ] LemonSqueezy 결제 동작
- [ ] OG 이미지 표시 (SNS 공유 시)

### 런칭

- [ ] Product Hunt 제출 준비
- [ ] SNS 공유 이미지 생성
- [ ] 블로그 포스트 작성 (선택)
- [ ] 피드백 수집 채널 오픈
