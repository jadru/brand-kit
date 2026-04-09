import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generateNoIndexMetadata } from '@/lib/seo/metadata'
import SignupPageClient from './signup-client'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return generateNoIndexMetadata({
    locale,
    path: '/signup',
    title: t('signup.title'),
    description: t('signup.description'),
  })
}

export default function SignupPage() {
  return <SignupPageClient />
}
