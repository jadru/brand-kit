import { setRequestLocale, getTranslations } from 'next-intl/server'
import { DemoClient } from './client'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'demo' })

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <DemoClient />
}
