import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generateNoIndexMetadata } from '@/lib/seo/metadata'
import LoginPageClient from './login-client'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return generateNoIndexMetadata({
    locale,
    path: '/login',
    title: t('login.title'),
    description: t('login.description'),
  })
}

export default function LoginPage() {
  return <LoginPageClient />
}
