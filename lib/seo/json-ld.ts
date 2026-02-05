import type { Organization, WebSite, SoftwareApplication, BreadcrumbList, WithContext } from 'schema-dts'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://brandkit.app'

export function generateOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BrandKit',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@brandkit.app',
      contactType: 'customer service',
      availableLanguage: ['English', 'Korean'],
    },
  }
}

export function generateWebSiteSchema(locale: string): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BrandKit',
    url: `${BASE_URL}/${locale}`,
    inLanguage: locale === 'ko' ? 'ko-KR' : 'en-US',
    description: locale === 'ko'
      ? 'AI 기반 브랜드 에셋 생성기'
      : 'AI-powered brand asset generator',
  }
}

export function generateSoftwareApplicationSchema(locale: string): WithContext<SoftwareApplication> {
  const isKorean = locale === 'ko'

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'BrandKit',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: isKorean
        ? '무료 플랜 - 월 3개 프로젝트, 1개 브랜드 프로필'
        : 'Free plan - 3 projects/month, 1 brand profile',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100',
      bestRating: '5',
      worstRating: '1',
    },
    description: isKorean
      ? 'AI 기반 브랜드 에셋 생성기. Favicon, OG Image, App Icon 등 모든 플랫폼의 브랜드 에셋을 자동으로 생성합니다.'
      : 'AI-powered brand asset generator. Automatically generate Favicon, OG Image, App Icon and all platform brand assets.',
    featureList: isKorean
      ? [
          'AI 기반 브랜드 카피 생성',
          '플랫폼별 에셋 패키지',
          '브랜드 프로필 관리',
          '코드 스니펫 제공',
        ]
      : [
          'AI-powered brand copy generation',
          'Platform-specific asset packages',
          'Brand profile management',
          'Code snippets included',
        ],
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
