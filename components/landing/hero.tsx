import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
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
        <nav className="flex items-center justify-between pb-12 pt-6 lg:pt-8">
          <span className="font-display text-xl font-bold tracking-tight">
            BrandKit
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              Sign up
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text */}
          <div className="max-w-2xl pt-8 lg:pt-20">
            {/* Badge */}
            <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-light animate-pulse" />
              <span className="font-mono text-xs tracking-wider text-white/60">
                AI-POWERED BRAND ENGINE
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up delay-1 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              브랜드 스타일 저장.
              <br />
              <span className="text-white/40">에셋 자동 생성.</span>
            </h1>

            {/* Description */}
            <p className="animate-fade-in-up delay-2 mt-8 max-w-lg text-base leading-relaxed text-white/50 sm:text-lg">
              Brand Profile에 컬러와 스타일을 저장하면, AI가 Favicon, OG Image,
              App Icon 등 모든 플랫폼의 에셋을 생성합니다.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-3 mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="group inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-brand transition-all hover:shadow-lg"
              >
                무료로 시작하기
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-8 text-sm font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
              >
                더 알아보기
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up delay-4 mt-16 flex gap-10 pb-16 sm:gap-12 lg:pb-0">
              <div>
                <div className="font-display text-2xl font-bold">12+</div>
                <div className="mt-1 font-mono text-[11px] tracking-wider text-white/40">ASSET TYPES</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold">&lt;60s</div>
                <div className="mt-1 font-mono text-[11px] tracking-wider text-white/40">GENERATION</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold">1-ZIP</div>
                <div className="mt-1 font-mono text-[11px] tracking-wider text-white/40">DOWNLOAD</div>
              </div>
            </div>
          </div>

          {/* Right: Floating asset tiles */}
          <div className="animate-slide-in-right delay-3 relative hidden lg:block">
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
