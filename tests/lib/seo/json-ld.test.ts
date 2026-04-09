import { describe, expect, it } from 'vitest'
import * as seoJsonLd from '@/lib/seo/json-ld'

describe('generateOrganizationSchema', () => {
  it('omits empty sameAs profiles', () => {
    const schema = seoJsonLd.generateOrganizationSchema()

    expect(schema).not.toHaveProperty('sameAs')
  })
})

describe('generateSoftwareApplicationSchema', () => {
  it('does not include unverifiable aggregate rating data and includes product URLs', () => {
    const schema = seoJsonLd.generateSoftwareApplicationSchema('en')

    expect(schema).not.toHaveProperty('aggregateRating')
    expect(schema).toMatchObject({
      url: 'https://brand-kit.jadru.com/en',
      offers: {
        url: 'https://brand-kit.jadru.com/en/signup',
      },
    })
  })
})

describe('generateFaqPageSchema', () => {
  it('builds faq rich result data from translated question-answer pairs', () => {
    expect(typeof seoJsonLd.generateFaqPageSchema).toBe('function')

    const schema = seoJsonLd.generateFaqPageSchema?.('en', [
      {
        question: 'What does BrandKit generate?',
        answer: 'It generates favicons, OG images, app icons, and more.',
      },
      {
        question: 'Can I use the assets commercially?',
        answer: 'Yes. Commercial use is allowed.',
      },
    ])

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: 'en-US',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What does BrandKit generate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It generates favicons, OG images, app icons, and more.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use the assets commercially?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Commercial use is allowed.',
          },
        },
      ],
    })
  })
})

describe('generateBreadcrumbSchema', () => {
  it('builds absolute localized urls for breadcrumb items', () => {
    const schema = seoJsonLd.generateBreadcrumbSchema(
      [
        { name: 'Home', url: '' },
        { name: 'Demo', url: '/demo' },
      ],
      'en'
    )

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://brand-kit.jadru.com/en',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Demo',
          item: 'https://brand-kit.jadru.com/en/demo',
        },
      ],
    })
  })
})
