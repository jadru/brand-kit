import Link from 'next/link'

const navigation = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'How it works', href: '#' },
  ],
  account: [
    { name: 'Log in', href: '/login' },
    { name: 'Sign up', href: '/signup' },
    { name: 'Dashboard', href: '/dashboard' },
  ],
  legal: [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-secondary px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <span className="font-display text-lg font-bold text-text-primary">BrandKit</span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
              브랜드 스타일을 저장하고, AI가 모든 플랫폼의 에셋을 자동으로 생성합니다.
            </p>
            <p className="mt-4 font-mono text-xs text-text-tertiary">
              Built with Next.js, Supabase & Claude
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.15em] text-text-tertiary uppercase">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-text-secondary transition-colors hover:text-text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.15em] text-text-tertiary uppercase">
              Account
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.account.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-text-secondary transition-colors hover:text-text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.15em] text-text-tertiary uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-text-secondary transition-colors hover:text-text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="font-mono text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} BrandKit. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="font-mono text-xs text-text-tertiary">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
