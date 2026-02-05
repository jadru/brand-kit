'use client'

import { useTranslations } from 'next-intl'
import { Star, Shield, Clock, Zap } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    content: 'testimonials.items.1.content',
    author: 'testimonials.items.1.author',
    role: 'testimonials.items.1.role',
    avatar: 'J',
    color: '#6366F1',
    highlight: false,
  },
  {
    id: 2,
    content: 'testimonials.items.2.content',
    author: 'testimonials.items.2.author',
    role: 'testimonials.items.2.role',
    avatar: 'S',
    color: '#EC4899',
    highlight: true,
  },
  {
    id: 3,
    content: 'testimonials.items.3.content',
    author: 'testimonials.items.3.author',
    role: 'testimonials.items.3.role',
    avatar: 'M',
    color: '#10B981',
    highlight: false,
  },
  {
    id: 4,
    content: 'testimonials.items.4.content',
    author: 'testimonials.items.4.author',
    role: 'testimonials.items.4.role',
    avatar: 'A',
    color: '#F97316',
    highlight: false,
  },
]

export function Testimonials() {
  const t = useTranslations('landing')

  return (
    <section className="relative overflow-hidden bg-surface-secondary px-6 py-24 lg:px-8 lg:py-32">
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-40" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 font-mono text-xs tracking-[0.15em] text-accent uppercase">
            <Star className="h-3 w-3 fill-accent" />
            {t('testimonials.sectionLabel')}
          </div>
          <h2 className="font-display text-3xl font-bold tracking-headline text-text-primary sm:text-4xl lg:text-5xl">
            {t('testimonials.headline')}{' '}
            <span className="text-gradient">{t('testimonials.headlineSub')}</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            {t('testimonials.description')}
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial.id}
              className={`
                group relative overflow-hidden rounded-2xl border bg-surface p-6
                card-interactive animate-reveal-up
                ${testimonial.highlight
                  ? 'border-accent/30 ring-1 ring-accent/10'
                  : 'border-border hover:border-border-hover'
                }
              `}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Highlight glow */}
              {testimonial.highlight && (
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition-all group-hover:bg-accent/20" />
              )}

              {/* Stars */}
              <div className="relative mb-4 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400 transition-transform group-hover:scale-110"
                    style={{ transitionDelay: `${i * 30}ms` }}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="relative text-sm leading-relaxed text-text-secondary">
                <span className="text-2xl leading-none text-text-tertiary">&ldquo;</span>
                {t(testimonial.content)}
                <span className="text-2xl leading-none text-text-tertiary">&rdquo;</span>
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="relative flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md transition-transform group-hover:scale-105"
                  style={{ backgroundColor: testimonial.color }}
                >
                  {testimonial.avatar}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ boxShadow: `0 0 16px ${testimonial.color}40` }}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {t(testimonial.author)}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {t(testimonial.role)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {[
            { icon: Shield, label: t('testimonials.trustBadge1') },
            { icon: Clock, label: t('testimonials.trustBadge2') },
            { icon: Zap, label: t('testimonials.trustBadge3') },
          ].map((badge, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 transition-all hover:border-accent/30 hover:shadow-sm"
            >
              <badge.icon className="h-4 w-4 text-text-tertiary transition-colors group-hover:text-accent" />
              <span className="text-sm font-medium text-text-secondary transition-colors group-hover:text-text-primary">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
