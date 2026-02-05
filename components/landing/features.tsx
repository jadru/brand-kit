import { useTranslations } from 'next-intl'
import { Sparkles, Palette, Package, Code, Zap, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon
  key: string
  span?: string
  highlight?: boolean
}

const features: Feature[] = [
  {
    icon: Sparkles,
    key: 'aiCopy',
    span: 'md:col-span-2',
    highlight: true,
  },
  {
    icon: Palette,
    key: 'designSystem',
  },
  {
    icon: Package,
    key: 'platformAssets',
  },
  {
    icon: Code,
    key: 'developerFriendly',
  },
  {
    icon: Zap,
    key: 'fastGeneration',
  },
  {
    icon: Shield,
    key: 'secureStorage',
    span: 'md:col-span-2',
  },
]

export function Features() {
  const t = useTranslations('landing.features')

  return (
    <section id="features" className="relative px-6 py-24 lg:px-8 lg:py-32">
      <div className="dot-pattern absolute inset-0" />
      <div className="gradient-mesh-light absolute inset-0" />
      <div className="relative mx-auto max-w-7xl">
        {/* Section label */}
        <div className="animate-fade-in-up mb-4 font-mono text-xs tracking-[0.2em] text-accent uppercase">
          {t('sectionLabel')}
        </div>
        <h2 className="animate-fade-in-up delay-1 max-w-2xl font-display text-3xl font-bold tracking-headline text-text-primary sm:text-4xl lg:text-5xl">
          {t('headline')}
          <br className="hidden sm:block" />
          <span className="text-text-tertiary">{t('headlineSub')}</span>
        </h2>

        {/* Bento grid */}
        <div className="mt-16 grid gap-4 md:grid-cols-4">
          {features.map((feature, idx) => (
            <div
              key={feature.key}
              className={`animate-fade-in-up card-interactive group relative overflow-hidden rounded-2xl border bg-surface p-6 lg:p-8 ${
                feature.highlight
                  ? 'border-accent/20 shadow-sm hover:border-accent/40'
                  : 'border-border hover:border-border-hover'
              } ${feature.span || 'md:col-span-1'}`}
              style={{ animationDelay: `${(idx + 2) * 100}ms` }}
            >
              {feature.highlight && (
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent" />
              )}

              <div className={`relative mb-5 inline-flex items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-110 ${
                feature.highlight
                  ? 'h-12 w-12 bg-accent/10 text-accent group-hover:bg-accent/15'
                  : 'h-10 w-10 bg-surface-tertiary text-text-secondary group-hover:bg-accent/10 group-hover:text-accent'
              }`}>
                <feature.icon className={feature.highlight ? 'h-6 w-6' : 'h-5 w-5'} />
              </div>

              <h3 className="relative font-display text-lg font-semibold text-text-primary">
                {t(`${feature.key}.title`)}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-text-secondary">
                {t(`${feature.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
