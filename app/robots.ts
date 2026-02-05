import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brandkit.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/*/dashboard/',
          '/*/dashboard',
          '/*/projects/',
          '/*/projects',
          '/*/brand-profiles/',
          '/*/brand-profiles',
          '/*/settings/',
          '/*/settings',
          '/*/onboarding/',
          '/*/onboarding',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
