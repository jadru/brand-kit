const steps = [
  {
    number: '01',
    title: '브랜드 스타일 저장',
    description: 'Brand Profile에 컬러, 스타일 방향, 키워드를 저장하세요.',
  },
  {
    number: '02',
    title: '플랫폼 선택',
    description: 'Web, Mobile, 또는 All 중 필요한 플랫폼을 선택하세요.',
  },
  {
    number: '03',
    title: 'AI가 모든 에셋 생성',
    description: 'Claude가 카피를 작성하고, Sharp가 이미지를 생성합니다.',
  },
  {
    number: '04',
    title: '다운로드 & 적용',
    description: 'ZIP 파일로 다운로드하고 코드 스니펫으로 즉시 적용하세요.',
  },
]

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-surface-secondary px-6 py-24 lg:px-8 lg:py-32">
      <div className="grid-pattern-light absolute inset-0" />
      <div className="relative mx-auto max-w-7xl">
        {/* Section label */}
        <div className="animate-fade-in-up mb-4 font-mono text-xs tracking-[0.2em] text-accent uppercase">
          How it works
        </div>
        <h2 className="animate-fade-in-up delay-1 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
          4단계로 완성하는
          <br className="hidden sm:block" />
          <span className="text-text-tertiary">브랜드 에셋.</span>
        </h2>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-7 hidden lg:block">
            <div className="h-px bg-gradient-to-r from-accent/30 via-border to-border" />
          </div>

          <div className="grid gap-6 lg:grid-cols-4 lg:gap-0">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className="animate-fade-in-up group relative lg:pr-8"
                style={{ animationDelay: `${(idx + 1) * 150}ms` }}
              >
                {/* Step indicator */}
                <div className="relative mb-6 flex items-center gap-4 lg:mb-8 lg:flex-col lg:items-start lg:gap-0">
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-accent/40 bg-surface font-mono text-sm font-bold text-accent shadow-sm transition-all duration-200 group-hover:border-accent group-hover:shadow-md">
                    {step.number}
                  </div>
                  {/* Mobile connecting line */}
                  {idx < steps.length - 1 && (
                    <div className="absolute left-7 top-14 h-[calc(100%+0.5rem)] w-px bg-gradient-to-b from-accent/20 to-border lg:hidden" />
                  )}
                </div>

                {/* Content */}
                <div className="pl-[4.5rem] lg:mt-6 lg:pl-0">
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
                    {step.description}
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
