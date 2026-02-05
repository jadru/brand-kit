import { useTranslations } from 'next-intl'

const stepNumbers = ['01', '02', '03', '04']

export function HowItWorks() {
  const t = useTranslations('landing.howItWorks')

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-surface-secondary px-6 py-24 lg:px-8 lg:py-32">
      <div className="grid-pattern-light absolute inset-0" />
      <div className="relative mx-auto max-w-7xl">
        {/* Section label */}
        <div className="animate-fade-in-up mb-4 font-mono text-xs tracking-[0.2em] text-accent uppercase">
          {t('sectionLabel')}
        </div>
        <h2 className="animate-fade-in-up delay-1 font-display text-3xl font-bold tracking-headline text-text-primary sm:text-4xl lg:text-5xl">
          {t('headline')}
          <br className="hidden sm:block" />
          <span className="text-text-tertiary">{t('headlineSub')}</span>
        </h2>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-7 hidden lg:block">
            <div className="h-px bg-gradient-to-r from-accent/30 via-border to-border" />
          </div>

          <div className="grid gap-6 lg:grid-cols-4 lg:gap-0">
            {stepNumbers.map((number, idx) => (
              <div
                key={number}
                className="animate-fade-in-up group relative lg:pr-8"
                style={{ animationDelay: `${(idx + 1) * 150}ms` }}
              >
                {/* Step indicator */}
                <div className="relative mb-6 flex items-center gap-4 lg:mb-8 lg:flex-col lg:items-start lg:gap-0">
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-accent/40 bg-surface font-mono text-sm font-bold text-accent shadow-sm transition-all duration-200 group-hover:border-accent group-hover:shadow-md">
                    {number}
                  </div>
                  {/* Mobile connecting line */}
                  {idx < stepNumbers.length - 1 && (
                    <div className="absolute left-7 top-14 h-[calc(100%+0.5rem)] w-px bg-gradient-to-b from-accent/20 to-border lg:hidden" />
                  )}
                </div>

                {/* Content */}
                <div className="pl-[4.5rem] lg:mt-6 lg:pl-0">
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    {t(`steps.${idx + 1}.title`)}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
                    {t(`steps.${idx + 1}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
