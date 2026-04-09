import { createElement, type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

const dictionary = {
  en: {
    metadata: {
      title: {
        default: 'BrandKit - AI Brand Asset Generator | Favicon, OG Image & App Icons',
        template: '%s | BrandKit',
      },
      description:
        'Save one brand profile and let BrandKit generate favicons, OG images, app icons, and social previews for your next launch. Start free and ship a consistent brand system faster.',
      keywords:
        'brand asset generator, favicon generator, og image, app icon, social preview, brand identity, AI copywriting',
      login: {
        title: 'Log in',
        description: 'Sign in to keep your brand profiles, launch assets, and downloads in sync.',
      },
      signup: {
        title: 'Sign up',
        description:
          'Create a free BrandKit account and generate launch-ready brand assets from one saved brand profile.',
      },
      forgotPassword: {
        title: 'Reset password',
        description:
          'Send a secure reset link and get back to your saved brand profiles and launch assets.',
      },
      privacy: {
        title: 'Privacy Policy',
        description: 'Review how BrandKit handles your data, accounts, and generated assets.',
      },
      terms: {
        title: 'Terms of Service',
        description:
          'Read the terms for using BrandKit to create and manage launch-ready brand assets.',
      },
    },
    demo: {
      meta: {
        title: 'Try the BrandKit demo',
        description:
          'Preview how one brand profile turns into favicons, OG images, app icons, and code-ready brand assets. No signup required.',
      },
    },
  },
  ko: {
    metadata: {
      title: {
        default: 'BrandKit - AI 브랜드 에셋 자동 생성 | Favicon, OG Image, 앱 아이콘',
        template: '%s | BrandKit',
      },
      description:
        '브랜드 프로필을 한 번 저장하면 BrandKit이 Favicon, OG Image, 앱 아이콘, 소셜 미리보기까지 다음 출시용 브랜드 에셋을 자동 생성합니다. 무료로 시작하고 더 빠르게 일관된 브랜드를 출시하세요.',
      keywords:
        '브랜드 에셋 생성기, 파비콘 생성기, OG 이미지, 앱 아이콘, 소셜 미리보기, 브랜드 아이덴티티, AI 카피라이팅',
      login: {
        title: '로그인',
        description: '브랜드 프로필, 출시 에셋, 다운로드를 계속 관리하려면 로그인하세요.',
      },
      signup: {
        title: '회원가입',
        description:
          '무료 BrandKit 계정을 만들고 하나의 브랜드 프로필로 출시용 브랜드 에셋을 생성하세요.',
      },
      forgotPassword: {
        title: '비밀번호 재설정',
        description:
          '안전한 재설정 링크를 받아 저장한 브랜드 프로필과 출시 에셋으로 다시 돌아오세요.',
      },
      privacy: {
        title: '개인정보처리방침',
        description: 'BrandKit이 데이터, 계정, 생성된 에셋을 어떻게 다루는지 확인하세요.',
      },
      terms: {
        title: '이용약관',
        description:
          'BrandKit으로 출시용 브랜드 에셋을 생성하고 관리할 때 적용되는 약관을 확인하세요.',
      },
    },
    demo: {
      meta: {
        title: 'BrandKit 데모 체험',
        description:
          '가입 없이 BrandKit을 체험해보세요. AI가 브랜드 에셋을 즉시 생성하는 과정을 확인하세요.',
      },
    },
  },
} as const

function getTranslationValue(locale: 'en' | 'ko', namespace: string | undefined, key: string) {
  const scoped = namespace
    ? (dictionary[locale] as Record<string, unknown>)[namespace]
    : dictionary[locale]

  return key.split('.').reduce<unknown>((value, segment) => {
    if (value && typeof value === 'object') {
      return (value as Record<string, unknown>)[segment]
    }

    return undefined
  }, scoped)
}

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(
    async ({ locale, namespace }: { locale: 'en' | 'ko'; namespace?: string }) => {
      return (key: string) => {
        const value = getTranslationValue(locale, namespace, key)

        if (typeof value !== 'string') {
          throw new Error(`Missing translation for ${locale}.${namespace ?? 'root'}.${key}`)
        }

        return value
      }
    }
  ),
  getMessages: vi.fn(async () => ({})),
  setRequestLocale: vi.fn(),
}))

vi.mock('next/font/google', () => ({
  JetBrains_Mono: () => ({
    variable: 'mock-font-variable',
  }),
}))

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: ReactNode }) => children,
}))

vi.mock('@/components/seo/json-ld', () => ({
  JsonLd: () => null,
}))

vi.mock('@/components/analytics/google-analytics', () => ({
  GoogleAnalytics: () => null,
}))

vi.mock('sonner', () => ({
  Toaster: () => null,
}))

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
  },
}))

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: ReactNode; href: string }) =>
    createElement('a', { href, ...props }, children),
}))

vi.mock('@/app/[locale]/(auth)/login/actions', () => ({
  signIn: vi.fn(),
  signInWithOAuth: vi.fn(),
}))

vi.mock('@/app/[locale]/(auth)/signup/actions', () => ({
  signUp: vi.fn(),
  signUpWithOAuth: vi.fn(),
}))

vi.mock('@/app/[locale]/(auth)/forgot-password/actions', () => ({
  sendResetEmail: vi.fn(),
}))

vi.mock('@/app/[locale]/demo/client', () => ({
  DemoClient: () => null,
}))

describe('auth page metadata', () => {
  const authPages = [
    {
      name: 'login',
      load: () => import('@/app/[locale]/(auth)/login/page'),
      expected: {
        title: 'Log in',
        description: 'Sign in to keep your brand profiles, launch assets, and downloads in sync.',
      },
    },
    {
      name: 'signup',
      load: () => import('@/app/[locale]/(auth)/signup/page'),
      expected: {
        title: 'Sign up',
        description:
          'Create a free BrandKit account and generate launch-ready brand assets from one saved brand profile.',
      },
    },
    {
      name: 'forgot-password',
      load: () => import('@/app/[locale]/(auth)/forgot-password/page'),
      expected: {
        title: 'Reset password',
        description:
          'Send a secure reset link and get back to your saved brand profiles and launch assets.',
      },
    },
  ] as const

  it.each(authPages)('exports noindex metadata for $name', async ({ name, load, expected }) => {
    const module = await load()

    expect(module.generateMetadata).toBeTypeOf('function')

    const metadata = await module.generateMetadata?.({
      params: Promise.resolve({ locale: 'en' }),
    })

    expect(metadata).toMatchObject({
      title: expected.title,
      description: expected.description,
      robots: {
        index: false,
        follow: false,
      },
    })
  })
})

describe('homepage metadata', () => {
  it('declares canonical, language alternates, and social metadata for the homepage', async () => {
    const module = await import('@/app/[locale]/page')

    const metadata = await module.generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    })

    expect(metadata).toMatchObject({
      title: 'BrandKit - AI Brand Asset Generator | Favicon, OG Image & App Icons',
      description:
        'Save one brand profile and let BrandKit generate favicons, OG images, app icons, and social previews for your next launch. Start free and ship a consistent brand system faster.',
      alternates: {
        canonical: 'https://brand-kit.jadru.com/en',
        languages: {
          en: 'https://brand-kit.jadru.com/en',
          ko: 'https://brand-kit.jadru.com/ko',
          'x-default': 'https://brand-kit.jadru.com/en',
        },
      },
      openGraph: {
        url: 'https://brand-kit.jadru.com/en',
        title: 'BrandKit - AI Brand Asset Generator | Favicon, OG Image & App Icons',
      },
      twitter: {
        card: 'summary_large_image',
      },
    })
  })
})

describe('legal page metadata', () => {
  it('keeps privacy and terms pages indexable with explicit canonical metadata', async () => {
    const privacy = await import('@/app/[locale]/privacy/page')
    const terms = await import('@/app/[locale]/terms/page')

    const privacyMetadata = await privacy.generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    })
    const termsMetadata = await terms.generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    })

    expect(privacyMetadata).toMatchObject({
      title: 'Privacy Policy',
      description: 'Review how BrandKit handles your data, accounts, and generated assets.',
      alternates: {
        canonical: 'https://brand-kit.jadru.com/en/privacy',
      },
      openGraph: {
        url: 'https://brand-kit.jadru.com/en/privacy',
      },
    })

    expect(termsMetadata).toMatchObject({
      title: 'Terms of Service',
      description:
        'Read the terms for using BrandKit to create and manage launch-ready brand assets.',
      alternates: {
        canonical: 'https://brand-kit.jadru.com/en/terms',
      },
      openGraph: {
        url: 'https://brand-kit.jadru.com/en/terms',
      },
    })
  })
})

describe('demo page metadata', () => {
  it('declares explicit alternates and open graph metadata', async () => {
    const module = await import('@/app/[locale]/demo/page')

    expect(module.generateMetadata).toBeTypeOf('function')

    const metadata = await module.generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    })

    expect(metadata).toMatchObject({
      title: 'Try the BrandKit demo',
      description:
        'Preview how one brand profile turns into favicons, OG images, app icons, and code-ready brand assets. No signup required.',
      alternates: {
        canonical: 'https://brand-kit.jadru.com/en/demo',
        languages: {
          en: 'https://brand-kit.jadru.com/en/demo',
          ko: 'https://brand-kit.jadru.com/ko/demo',
          'x-default': 'https://brand-kit.jadru.com/en/demo',
        },
      },
      openGraph: {
        url: 'https://brand-kit.jadru.com/en/demo',
        title: 'Try the BrandKit demo',
        description:
          'Preview how one brand profile turns into favicons, OG images, app icons, and code-ready brand assets. No signup required.',
      },
    })
  })
})
