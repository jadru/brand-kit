import { routing } from '@/i18n/routing'

const DEFAULT_SITE_URL = 'https://brand-kit.jadru.com'

function normalizePath(path: string): string {
  if (!path) return ''
  return path.startsWith('/') ? path : `/${path}`
}

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  return DEFAULT_SITE_URL
}

export function getOpenGraphLocale(locale: string): string {
  return locale === 'ko' ? 'ko_KR' : 'en_US'
}

export function getStructuredDataLocale(locale: string): string {
  return locale === 'ko' ? 'ko-KR' : 'en-US'
}

export function buildLocalizedUrl(locale: string, path = ''): string {
  return `${getSiteUrl()}/${locale}${normalizePath(path)}`
}

export function buildLocalizedAlternates(locale: string, path = '') {
  const normalizedPath = normalizePath(path)
  const defaultLocale = routing.defaultLocale ?? routing.locales[0]

  return {
    canonical: buildLocalizedUrl(locale, normalizedPath),
    languages: Object.fromEntries([
      ...routing.locales.map((entryLocale) => [
        entryLocale,
        buildLocalizedUrl(entryLocale, normalizedPath),
      ]),
      ['x-default', buildLocalizedUrl(defaultLocale, normalizedPath)],
    ]),
  }
}
