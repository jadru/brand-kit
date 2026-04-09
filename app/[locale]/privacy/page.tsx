import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { LegalDocumentPage } from '@/components/legal/legal-document'
import { getLegalDocument } from '@/lib/legal/documents'
import { generateIndexablePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return generateIndexablePageMetadata({
    title: t('privacy.title'),
    description: t('privacy.description'),
    locale,
    path: '/privacy',
  })
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return <LegalDocumentPage document={getLegalDocument(locale, 'privacy')} />
}
