import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'

export function Hero() {
  const t = useTranslations('landing.hero')
  const tc = useTranslations('common')

  return (
    <section className="relative min-h-screen overflow-hidden bg-brand text-brand-foreground">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern" />

      {/* Gradient mesh */}
      <div className="absolute inset-0 gradient-mesh-dark" />

      {/* Noise texture */}
      <div className="noise absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Nav */}
        <nav className="flex items-center justify-between pb-12 pt-6 lg:pt-8" aria-label={tc('mainNavigation')}>
          <span className="font-display text-xl font-bold tracking-tight">
            {tc('brandName')}
          </span>
          <div className="flex items-center gap-3">
            <LocaleSwitcher variant="minimal" className="text-white/70 hover:text-white" />
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {tc('login')}
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              {tc('signup')}
            </Link>
            <Link
              href="/demo"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              {t('ctaDemo')}
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text */}
          <div className="max-w-2xl pt-8 lg:pt-20">
            {/* Badge */}
            <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-light animate-pulse-glow" />
              <span className="font-mono text-xs tracking-wider text-white/60">
                {t('badge')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up delay-1 font-display text-3xl font-bold leading-[0.95] tracking-headline sm:text-4xl md:text-5xl lg:text-6xl">
              {t('headline')}
              <br />
              <span className="text-white/40">{t('headlineSub')}</span>
            </h1>

            {/* Description */}
            <p className="animate-fade-in-up delay-2 mt-8 max-w-lg text-base leading-relaxed text-white/50 sm:text-lg">
              {t('description')}
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-3 mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="btn-glow group inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-brand transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                data-analytics="hero_cta_primary"
              >
                {t('ctaPrimary')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/demo"
                className="link-underline inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-8 text-sm font-medium text-white/70 transition-all hover:border-white/25 hover:text-white"
                data-analytics="hero_cta_demo"
              >
                {t('ctaDemo')}
              </Link>
              <Link
                href="#features"
                className="link-underline inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-8 text-sm font-medium text-white/70 transition-all hover:border-white/25 hover:text-white"
                data-analytics="hero_cta_secondary"
              >
                {t('ctaSecondary')}
              </Link>
            </div>
            {/* Trust indicators */}
            <div className="animate-fade-in-up delay-4 mt-6 flex items-center gap-4 text-xs text-white/40">
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                <span>{t('trustNoCreditCard')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                <span>{t('trustFreePlan')}</span>
              </div>
            </div>
          </div>

          {/* Right: Floating asset tiles - decorative */}
          <div className="animate-slide-in-right delay-3 relative hidden lg:block" aria-hidden="true">
            <div className="relative h-[540px]">
              {/* OG Image tile */}
              <div className="animate-float absolute left-0 top-8 w-72 rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-md">
                <div className="aspect-[1200/630] w-full rounded-lg bg-gradient-to-br from-accent/40 to-accent-dark/30" />
                <div className="mt-2 flex items-center justify-between px-1">
                  <span className="font-mono text-[10px] tracking-wider text-white/40">OG-IMAGE.PNG</span>
                  <span className="font-mono text-[10px] text-white/30">1200 &times; 630</span>
                </div>
              </div>

              {/* Favicon tile */}
              <div className="animate-float absolute right-4 top-32 w-44 rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-md" style={{ animationDelay: '1s' }}>
                <div className="mx-auto aspect-square w-20 rounded-lg bg-gradient-to-br from-accent-light/50 to-accent/40" />
                <div className="mt-2 text-center font-mono text-[10px] tracking-wider text-white/40">FAVICON.ICO</div>
              </div>

              {/* App Icon tile */}
              <div className="animate-float absolute left-16 top-[280px] w-52 rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-md" style={{ animationDelay: '2s' }}>
                <div className="mx-auto aspect-square w-24 rounded-2xl bg-gradient-to-br from-violet-500/40 to-accent/30" />
                <div className="mt-2 text-center font-mono text-[10px] tracking-wider text-white/40">APP-ICON.PNG</div>
              </div>

              {/* Code snippet tile */}
              <div className="animate-float absolute right-0 top-[380px] w-64 rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md" style={{ animationDelay: '3s' }}>
                <div className="space-y-1.5">
                  <div className="h-2 w-32 rounded-full bg-white/10" />
                  <div className="h-2 w-48 rounded-full bg-accent/20" />
                  <div className="h-2 w-40 rounded-full bg-white/10" />
                  <div className="h-2 w-24 rounded-full bg-white/10" />
                </div>
                <div className="mt-2 font-mono text-[10px] tracking-wider text-white/40">META-TAGS.HTML</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  )
}
