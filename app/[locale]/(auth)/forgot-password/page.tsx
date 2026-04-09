import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generateNoIndexMetadata } from '@/lib/seo/metadata'
import ForgotPasswordPageClient from './forgot-password-client'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return generateNoIndexMetadata({
    locale,
    path: '/forgot-password',
    title: t('forgotPassword.title'),
    description: t('forgotPassword.description'),
  })
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />
}
