import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    interval: '영구 무료',
    description: '개인 프로젝트에 충분한 기본 기능',
    features: [
      '월 3개 프로젝트',
      'Brand Profile 1개',
      'AI 헤드라인 월 10회',
      'Free 스타일 프리셋',
      '기본 에셋 생성',
    ],
    cta: '무료로 시작하기',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    interval: '월',
    description: '팀과 프로 사용자를 위한 무제한 기능',
    features: [
      '무제한 프로젝트',
      'Brand Profile 5개',
      'AI 헤드라인 무제한',
      'AI 아이콘 생성 월 50회',
      '전체 스타일 프리셋',
      '우선 지원',
    ],
    cta: 'Pro로 시작하기',
    href: '/signup',
    popular: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="relative px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section label */}
        <div className="animate-fade-in-up mb-4 font-mono text-xs tracking-[0.2em] text-accent uppercase">
          Pricing
        </div>
        <h2 className="animate-fade-in-up delay-1 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
          심플한 가격,
          <br className="hidden sm:block" />
          <span className="text-text-tertiary">강력한 기능.</span>
        </h2>
        <p className="animate-fade-in-up delay-2 mt-4 max-w-lg text-text-secondary">
          무료로 시작하고, 필요할 때 Pro로 업그레이드하세요. 신용카드 불필요.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2 md:max-w-4xl">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`animate-fade-in-up relative overflow-hidden rounded-2xl border p-8 transition-all duration-200 lg:p-10 ${
                plan.popular
                  ? 'border-accent/50 bg-brand text-brand-foreground shadow-xl glow-ring'
                  : 'border-border bg-surface hover:border-border-hover hover:shadow-md'
              }`}
            >
              {/* Pro card subtle gradient overlay */}
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
              )}

              {plan.popular && (
                <span className="absolute -top-px left-8 inline-flex items-center rounded-b-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                  Most popular
                </span>
              )}

              <div className="relative flex items-baseline gap-2">
                <h3 className={`font-display text-xl font-semibold ${plan.popular ? 'text-white' : 'text-text-primary'}`}>
                  {plan.name}
                </h3>
              </div>

              <p className={`relative mt-2 text-sm ${plan.popular ? 'text-white/60' : 'text-text-secondary'}`}>
                {plan.description}
              </p>

              <div className="relative mt-6 flex items-baseline">
                <span className={`font-display text-5xl font-bold tracking-tighter ${plan.popular ? 'text-white' : 'text-text-primary'}`}>
                  {plan.price}
                </span>
                <span className={`ml-2 text-sm ${plan.popular ? 'text-white/50' : 'text-text-tertiary'}`}>
                  /{plan.interval}
                </span>
              </div>

              <div className={`relative my-8 h-px ${plan.popular ? 'bg-white/10' : 'bg-border'}`} />

              <ul className="relative space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className={`flex items-center gap-3 text-sm ${plan.popular ? 'text-white/80' : 'text-text-secondary'}`}>
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      plan.popular ? 'bg-accent/20 text-accent-light' : 'bg-accent/10 text-accent'
                    }`}>
                      <Check className="h-3 w-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`group relative mt-8 flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-white text-brand shadow-sm hover:shadow-lg active:scale-[0.98]'
                    : 'border border-border bg-surface text-text-primary hover:bg-surface-secondary active:scale-[0.98]'
                }`}
              >
                {plan.cta}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
