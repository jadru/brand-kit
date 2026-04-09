import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Pricing } from '@/components/landing/pricing'
import { Testimonials } from '@/components/landing/testimonials'
import { FAQ } from '@/components/landing/faq'
import { CTA } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'
import { JsonLd } from '@/components/seo/json-ld'
import {
  generateBreadcrumbSchema,
  generateFaqPageSchema,
  generateSoftwareApplicationSchema,
} from '@/lib/seo/json-ld'
import { getLandingFaqItems } from '@/lib/seo/faq'
import { generateIndexablePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return generateIndexablePageMetadata({
    locale,
    title: t('title.default'),
    description: t('description'),
  })
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'landing' })
  const faqItems = getLandingFaqItems(t)

  return (
    <main id="main-content">
      <JsonLd data={generateBreadcrumbSchema([{ name: 'BrandKit', url: '' }], locale)} />
      <JsonLd data={generateSoftwareApplicationSchema(locale)} />
      <JsonLd data={generateFaqPageSchema(locale, faqItems)} />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
