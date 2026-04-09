import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getSiteUrl } from '@/lib/seo/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()
  const locales = routing.locales

  const publicPages = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/demo', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/privacy', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/terms', changeFrequency: 'monthly' as const, priority: 0.3 },
  ]

  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const page of publicPages) {
      const url = `${baseUrl}/${locale}${page.path}`
      const alternateLanguages = Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}${page.path}`])
      )

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: alternateLanguages,
        },
      })
    }
  }

  return entries
}
