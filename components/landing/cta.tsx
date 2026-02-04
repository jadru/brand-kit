import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-brand px-6 py-24 text-white lg:px-8 lg:py-32">
      {/* Different gradient direction from hero to differentiate */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent" />
      <div className="absolute inset-0 grid-pattern" />
      <div className="noise absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Pill badge */}
        <div className="animate-fade-in-up mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-accent-light" />
          <span className="font-mono text-xs tracking-wider text-white/60">
            START BUILDING TODAY
          </span>
        </div>

        <h2 className="animate-fade-in-up delay-1 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          지금 바로
          <br />
          <span className="text-white/40">시작하세요.</span>
        </h2>
        <p className="animate-fade-in-up delay-2 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/50">
          브랜드 에셋 생성에 드는 시간과 비용을 획기적으로 줄이세요.
          무료 플랜으로 바로 시작할 수 있습니다.
        </p>
        <div className="animate-fade-in-up delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-brand shadow-sm transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
          >
            무료로 시작하기
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <p className="animate-fade-in-up delay-4 mt-4 font-mono text-xs tracking-wider text-white/30">
          NO CREDIT CARD REQUIRED
        </p>
      </div>
    </section>
  )
}
