import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('landing.footer')
  const tc = useTranslations('common')

  const navigation = {
    product: [
      { key: 'features', href: '#features' },
      { key: 'pricing', href: '#pricing' },
      { key: 'howItWorks', href: '#how-it-works' },
    ],
    account: [
      { key: 'login', href: '/login', useCommon: true },
      { key: 'signup', href: '/signup', useCommon: true },
      { key: 'dashboard', href: '/dashboard' },
    ],
    legal: [
      { key: 'privacy', href: '/privacy' },
      { key: 'terms', href: '/terms' },
    ],
  }

  return (
    <footer className="border-t border-border bg-surface-secondary px-6 py-16 lg:px-8" role="contentinfo">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <span className="font-display text-lg font-bold text-text-primary">{tc('brandName')}</span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
              {t('description')}
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.15em] text-text-tertiary uppercase">
              {t('product')}
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.product.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="text-sm text-text-secondary transition-colors hover:text-text-primary">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.15em] text-text-tertiary uppercase">
              {t('account')}
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.account.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="text-sm text-text-secondary transition-colors hover:text-text-primary">
                    {item.useCommon ? tc(item.key) : t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.15em] text-text-tertiary uppercase">
              {t('legal')}
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="text-sm text-text-secondary transition-colors hover:text-text-primary">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="font-mono text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} {tc('brandName')}. {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
