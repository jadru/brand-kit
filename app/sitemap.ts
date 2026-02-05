import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brandkit.app'
  const locales = routing.locales

  const publicPages = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/login', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/signup', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
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
