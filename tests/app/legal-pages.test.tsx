import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('legal pages', () => {
  it('renders english privacy content for the english locale', async () => {
    const module = await import('@/app/[locale]/privacy/page')
    const element = await module.default({
      params: Promise.resolve({ locale: 'en' }),
    } as never)
    const html = renderToStaticMarkup(element)

    expect(html).toContain('Privacy Policy')
    expect(html).toContain('Last updated:')
    expect(html).not.toContain('개인정보처리방침')
  })

  it('renders english terms content for the english locale', async () => {
    const module = await import('@/app/[locale]/terms/page')
    const element = await module.default({
      params: Promise.resolve({ locale: 'en' }),
    } as never)
    const html = renderToStaticMarkup(element)

    expect(html).toContain('Terms of Service')
    expect(html).toContain('Last updated:')
    expect(html).not.toContain('이용약관')
  })
})
