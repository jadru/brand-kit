import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { JsonLd } from '@/components/seo/json-ld'
import { generateIndexablePageMetadata } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/json-ld'
import { DemoClient } from './client'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'demo' })

  return generateIndexablePageMetadata({
    locale,
    title: t('meta.title'),
    description: t('meta.description'),
    path: '/demo',
  })
}

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema(
          [
            { name: 'BrandKit', url: '' },
            { name: locale === 'ko' ? '데모' : 'Demo', url: '/demo' },
          ],
          locale
        )}
      />
      <DemoClient />
    </>
  )
}
