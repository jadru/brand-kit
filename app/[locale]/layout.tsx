import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { Toaster } from 'sonner'
import { routing } from '@/i18n/routing'
import { JsonLd } from '@/components/seo/json-ld'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/json-ld'
import { getSiteUrl } from '@/lib/seo/site-url'
import '../globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jet',
  weight: ['400', '500'],
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  const baseUrl = getSiteUrl()

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t('title.default'),
      template: t('title.template'),
    },
    description: t('description'),
    keywords: t('keywords').split(', '),
    authors: [{ name: 'BrandKit' }],
    creator: 'BrandKit',
    publisher: 'BrandKit',
    applicationName: 'BrandKit',
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      other: {
        'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || '',
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        {/* Skip Link for Accessibility */}
        <a
          href="#main-content"
          className="focus:bg-accent sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none"
        >
          {locale === 'ko' ? '본문으로 건너뛰기' : 'Skip to main content'}
        </a>
        <GoogleAnalytics />
        <JsonLd data={generateOrganizationSchema()} />
        <JsonLd data={generateWebSiteSchema(locale)} />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  )
}
