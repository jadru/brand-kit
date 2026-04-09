import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'

describe('sitemap', () => {
  it('includes only indexable public pages for every locale', () => {
    const entries = sitemap()
    const paths = entries.map((entry) => new URL(entry.url).pathname).sort()

    expect(paths).toEqual([
      '/en',
      '/en/demo',
      '/en/privacy',
      '/en/terms',
      '/ko',
      '/ko/demo',
      '/ko/privacy',
      '/ko/terms',
    ])
  })

  it('excludes auth pages from the sitemap', () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname)

    expect(paths).not.toContain('/en/login')
    expect(paths).not.toContain('/en/signup')
    expect(paths).not.toContain('/ko/login')
    expect(paths).not.toContain('/ko/signup')
  })
})
