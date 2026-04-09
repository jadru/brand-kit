import { describe, expect, it } from 'vitest'
import en from '@/messages/en.json'
import ko from '@/messages/ko.json'

describe('metadata copy', () => {
  it('uses more descriptive homepage title copy', () => {
    expect(en.metadata.title.default.length).toBeGreaterThanOrEqual(50)
    expect(ko.metadata.title.default.length).toBeGreaterThanOrEqual(35)
    expect(ko.metadata.title.default).toContain('Favicon')
    expect(ko.metadata.title.default).toContain('OG Image')
  })

  it('uses fuller homepage descriptions with a call to action', () => {
    expect(en.metadata.description.length).toBeGreaterThanOrEqual(120)
    expect(en.metadata.description.toLowerCase()).toContain('start free')
    expect(ko.metadata.description.length).toBeGreaterThanOrEqual(55)
    expect(ko.metadata.description).toContain('무료')
  })

  it('adds forgot-password metadata copy in both locales', () => {
    expect(en.metadata).toHaveProperty('forgotPassword.title')
    expect(en.metadata).toHaveProperty('forgotPassword.description')
    expect(ko.metadata).toHaveProperty('forgotPassword.title')
    expect(ko.metadata).toHaveProperty('forgotPassword.description')
  })

  it('positions the homepage for launch-ready brand assets in both locales', () => {
    expect(en.metadata.description.toLowerCase()).toContain('brand profile')
    expect(en.metadata.description.toLowerCase()).toContain('launch')
    expect(ko.metadata.description).toContain('브랜드 프로필')
    expect(ko.metadata.description).toContain('출시')
  })

  it('avoids unverifiable trust-badge claims in public landing copy', () => {
    expect(en.landing.testimonials.trustBadge1.toLowerCase()).not.toContain('soc 2')
    expect(en.landing.testimonials.trustBadge2).not.toContain('99.9')
    expect(ko.landing.testimonials.trustBadge1).not.toContain('SOC 2')
    expect(ko.landing.testimonials.trustBadge2).not.toContain('99.9')
  })
})
