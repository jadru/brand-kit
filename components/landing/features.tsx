import { Sparkles, Palette, Package, Code, Zap, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  span?: string
  highlight?: boolean
}

const features: Feature[] = [
  {
    icon: Sparkles,
    title: 'AI 기반 브랜드 카피',
    description:
      'Claude API로 SEO 최적화된 헤드라인, 태그라인, OG 설명을 자동 생성합니다. 브랜드 톤에 맞는 카피를 즉시 받아보세요.',
    span: 'md:col-span-2',
    highlight: true,
  },
  {
    icon: Palette,
    title: '일관된 디자인 시스템',
    description:
      'Brand Profile에 스타일을 저장하고 여러 프로젝트에 일관되게 적용하세요.',
  },
  {
    icon: Package,
    title: '플랫폼별 에셋 패키지',
    description:
      'Web, iOS, Android 각 플랫폼에 필요한 모든 에셋을 한 번에 생성합니다.',
  },
  {
    icon: Code,
    title: '개발자 친화적',
    description:
      'Next.js, React, HTML 등 프레임워크별 코드 스니펫을 함께 제공합니다.',
  },
  {
    icon: Zap,
    title: '빠른 생성 속도',
    description: '최대 1분 내로 모든 에셋과 ZIP 패키지를 생성합니다.',
  },
  {
    icon: Shield,
    title: '안전한 저장소',
    description:
      'Supabase Storage에 안전하게 저장되며 언제든 재다운로드할 수 있습니다.',
    span: 'md:col-span-2',
  },
]

export function Features() {
  return (
    <section id="features" className="relative px-6 py-24 lg:px-8 lg:py-32">
      <div className="dot-pattern absolute inset-0" />
      <div className="gradient-mesh-light absolute inset-0" />
      <div className="relative mx-auto max-w-7xl">
        {/* Section label */}
        <div className="animate-fade-in-up mb-4 font-mono text-xs tracking-[0.2em] text-accent uppercase">
          Features
        </div>
        <h2 className="animate-fade-in-up delay-1 max-w-2xl font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
          브랜드 에셋 생성에 필요한
          <br className="hidden sm:block" />
          <span className="text-text-tertiary">모든 것을 하나로.</span>
        </h2>

        {/* Bento grid */}
        <div className="mt-16 grid gap-4 md:grid-cols-4">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className={`animate-fade-in-up group relative overflow-hidden rounded-2xl border bg-surface p-6 transition-all duration-200 lg:p-8 ${
                feature.highlight
                  ? 'border-accent/20 shadow-sm hover:border-accent/40 hover:shadow-lg'
                  : 'border-border hover:border-border-hover hover:shadow-md'
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
                {feature.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
