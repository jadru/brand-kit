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
    title: t('terms.title'),
    description: t('terms.description'),
    locale,
    path: '/terms',
  })
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return <LegalDocumentPage document={getLegalDocument(locale, 'terms')} />
}
