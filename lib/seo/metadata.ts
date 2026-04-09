import type { Metadata } from 'next'
import { buildLocalizedAlternates, buildLocalizedUrl, getOpenGraphLocale } from './site-url'

interface IndexablePageMetadataOptions {
  locale: string
  title: string
  description: string
  path?: string
}

interface NoIndexMetadataOptions {
  locale: string
  path: string
  title: string
  description: string
}

export function generateIndexablePageMetadata({
  locale,
  title,
  description,
  path = '',
}: IndexablePageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, path),
    openGraph: {
      type: 'website',
      locale: getOpenGraphLocale(locale),
      url: buildLocalizedUrl(locale, path),
      siteName: 'BrandKit',
      title,
      description,
      images: [
        {
          url: `/api/og?locale=${locale}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?locale=${locale}`],
    },
  }
}

export function generateNoIndexMetadata({
  locale,
  path,
  title,
  description,
}: NoIndexMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, path),
    openGraph: {
      type: 'website',
      locale: getOpenGraphLocale(locale),
      url: buildLocalizedUrl(locale, path),
      siteName: 'BrandKit',
      title,
      description,
      images: [
        {
          url: `/api/og?locale=${locale}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?locale=${locale}`],
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        'max-image-preview': 'none',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}
