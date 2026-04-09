import type {
  BreadcrumbList,
  FAQPage,
  Organization,
  SoftwareApplication,
  WebSite,
  WithContext,
} from 'schema-dts'
import { getSiteUrl, getStructuredDataLocale } from './site-url'

const BASE_URL = getSiteUrl()

export function generateOrganizationSchema(): WithContext<Organization> {
  const sameAs: string[] = []

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BrandKit',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@brandkit.app',
      contactType: 'customer service',
      availableLanguage: ['English', 'Korean'],
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

export function generateWebSiteSchema(locale: string): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BrandKit',
    url: `${BASE_URL}/${locale}`,
    inLanguage: locale === 'ko' ? 'ko-KR' : 'en-US',
    description:
      locale === 'ko' ? 'AI 기반 브랜드 에셋 생성기' : 'AI-powered brand asset generator',
  }
}

export function generateSoftwareApplicationSchema(
  locale: string
): WithContext<SoftwareApplication> {
  const isKorean = locale === 'ko'
  const localizedUrl = `${BASE_URL}/${locale}`

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'BrandKit',
    url: localizedUrl,
    inLanguage: getStructuredDataLocale(locale),
    applicationCategory: 'DesignApplication',
    applicationSubCategory: isKorean
      ? '브랜드 에셋 생성 워크플로우'
      : 'Brand asset generation workflow',
    operatingSystem: 'Web',
    image: `${BASE_URL}/api/og?locale=${locale}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      url: `${localizedUrl}/signup`,
      description: isKorean
        ? '무료 플랜 - 월 3개 프로젝트, 브랜드 프로필 2개로 출시 준비를 시작하세요.'
        : 'Free plan - launch up to 3 projects per month with 2 brand profiles before you upgrade.',
    },
    description: isKorean
      ? '브랜드 프로필을 한 번 저장하면 Favicon, OG Image, 앱 아이콘, 소셜 미리보기까지 출시용 브랜드 에셋을 자동으로 생성하는 AI 브랜드 에셋 워크플로우입니다.'
      : 'AI brand asset workflow that turns one brand profile into favicons, OG images, app icons, and social previews for your next launch.',
    featureList: isKorean
      ? [
          '브랜드 프로필 기반 에셋 생성',
          'Favicon, OG Image, 앱 아이콘 자동 생성',
          '출시용 ZIP 다운로드와 코드 스니펫 제공',
          '영문·국문 브랜드 워크플로우 지원',
        ]
      : [
          'Generate assets from a saved brand profile',
          'Auto-create favicons, OG images, and app icons',
          'Download launch-ready ZIP files with code snippets',
          'Support English and Korean brand workflows',
        ],
  }
}

export interface FaqSchemaItem {
  question: string
  answer: string
}

export function generateFaqPageSchema(
  locale: string,
  items: FaqSchemaItem[]
): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: getStructuredDataLocale(locale),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  locale: string
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}/${locale}${item.url}`,
    })),
  }
}
