'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight,
  Download,
  Lock,
  Image,
  FileCode,
  Smartphone,
  Globe,
  Sparkles,
  Check,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BRAND_PROFILE_TEMPLATES } from '@/lib/data/brand-profile-templates'

const DEMO_BRAND = BRAND_PROFILE_TEMPLATES[0] // Modern SaaS template

const DEMO_ASSETS = [
  { name: 'OG Image', size: '1200×630', icon: Image, format: 'PNG' },
  { name: 'Favicon', size: '32×32', icon: Globe, format: 'ICO' },
  { name: 'Apple Touch Icon', size: '180×180', icon: Smartphone, format: 'PNG' },
  { name: 'Android Icon', size: '512×512', icon: Smartphone, format: 'PNG' },
  { name: 'Twitter Card', size: '1200×600', icon: Image, format: 'PNG' },
  { name: 'Meta Tags', size: '-', icon: FileCode, format: 'HTML' },
]

export function DemoClient() {
  const t = useTranslations('demo')
  const [showSignupModal, setShowSignupModal] = useState(false)

  const handleDownload = () => {
    setShowSignupModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="font-display text-xl font-bold tracking-tight">
            BrandKit
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <Sparkles className="h-3 w-3 text-accent" />
              {t('demoBadge')}
            </Badge>
            <Link href="/signup">
              <Button size="sm" className="btn-glow">{t('signupCta')}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Preview */}
          <div className="animate-fade-in-up">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              LIVE PREVIEW
            </div>
            <h1 className="font-display text-3xl font-bold tracking-headline text-text-primary sm:text-4xl lg:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              {t('description')}
            </p>

            {/* Brand Preview */}
            <Card className="mt-8 overflow-hidden border-border card-interactive">
              <CardContent className="p-0">
                {/* Header */}
                <div className="border-b border-border bg-surface-secondary/50 px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold text-white shadow-lg"
                      style={{ backgroundColor: DEMO_BRAND.values.primary_color }}
                    >
                      {t('sampleBrand.name').charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">
                        {t('sampleBrand.name')}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {t('sampleBrand.style')}: <span className="font-medium">{DEMO_BRAND.name}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Color palette */}
                  <div>
                    <p className="mb-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                      {t('colorPalette')}
                    </p>
                    <div className="flex gap-2">
                      <div className="group relative">
                        <div
                          className="h-12 w-12 rounded-xl shadow-md ring-2 ring-border transition-transform group-hover:scale-110"
                          style={{ backgroundColor: DEMO_BRAND.values.primary_color }}
                        />
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100">
                          Primary
                        </span>
                      </div>
                      {DEMO_BRAND.values.secondary_colors.map((color, i) => (
                        <div key={i} className="group relative">
                          <div
                            className="h-12 w-12 rounded-xl shadow-sm transition-transform group-hover:scale-110"
                            style={{ backgroundColor: color }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="mt-8">
                    <p className="mb-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                      {t('keywords')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {DEMO_BRAND.values.keywords.map((keyword, idx) => (
                        <Badge
                          key={keyword}
                          variant="secondary"
                          className="animate-reveal-up px-3 py-1"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OG Preview */}
            <Card className="mt-4 overflow-hidden card-interactive">
              <CardContent className="p-4">
                <p className="mb-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  {t('ogPreview')}
                </p>
                <div
                  className="relative aspect-[1200/630] overflow-hidden rounded-xl shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${DEMO_BRAND.values.primary_color} 0%, ${DEMO_BRAND.values.secondary_colors[0]} 100%)`,
                  }}
                >
                  {/* Noise texture */}
                  <div className="noise pointer-events-none absolute inset-0" />
                  <div className="relative flex h-full flex-col items-center justify-center p-8 text-center text-white">
                    <div className="text-3xl font-bold tracking-tight drop-shadow-lg sm:text-4xl">
                      {t('sampleBrand.name')}
                    </div>
                    <div className="mt-3 text-base opacity-90 drop-shadow">
                      {t('sampleBrand.tagline')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Assets */}
          <div className="animate-fade-in-up delay-2">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary">
              {t('generatedAssets')}
            </h2>
            <p className="mt-2 text-text-secondary">
              {t('assetsDescription')}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {DEMO_ASSETS.map((asset, idx) => (
                <Card
                  key={asset.name}
                  className="group overflow-hidden card-interactive animate-reveal-up"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-secondary text-text-secondary transition-all group-hover:bg-accent/10 group-hover:text-accent group-hover:scale-105">
                      <asset.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-primary">{asset.name}</p>
                      <p className="text-xs text-text-tertiary">
                        {asset.size} • {asset.format}
                      </p>
                    </div>
                    <Check className="h-4 w-4 text-success opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Download CTA */}
            <Card className="mt-8 overflow-hidden border-accent/30 bg-gradient-to-br from-surface via-surface to-accent/5">
              <CardContent className="relative p-6 text-center">
                {/* Background glow */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />

                <div className="relative">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 ring-4 ring-accent/5">
                    <Download className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">
                    {t('downloadTitle')}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-text-secondary">
                    {t('downloadDescription')}
                  </p>
                  <Button onClick={handleDownload} className="mt-5 w-full btn-glow">
                    <Download className="mr-2 h-4 w-4" />
                    {t('downloadCta')}
                  </Button>
                  <p className="mt-4 text-xs text-text-tertiary">
                    {t('freeNote')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Signup Modal */}
      {showSignupModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSignupModal(false)
          }}
        >
          <Card className="w-full max-w-md animate-reveal-up overflow-hidden shadow-2xl">
            <CardContent className="relative p-0">
              {/* Close button */}
              <button
                onClick={() => setShowSignupModal(false)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-secondary text-text-tertiary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header gradient */}
              <div
                className="h-24 w-full"
                style={{
                  background: `linear-gradient(135deg, ${DEMO_BRAND.values.primary_color} 0%, ${DEMO_BRAND.values.secondary_colors[0]} 100%)`,
                }}
              >
                <div className="noise pointer-events-none absolute inset-0 h-24" />
              </div>

              {/* Content */}
              <div className="relative px-6 pb-6 pt-12 text-center">
                {/* Icon overlapping header */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface shadow-xl ring-4 ring-surface">
                    <Lock className="h-7 w-7 text-accent" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-text-primary">
                  {t('modal.title')}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-text-secondary">
                  {t('modal.description')}
                </p>

                <div className="mt-6 space-y-3">
                  <Link href="/signup" className="block">
                    <Button className="w-full btn-glow">
                      {t('modal.signupCta')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login" className="block">
                    <Button variant="outline" className="w-full">
                      {t('modal.loginCta')}
                    </Button>
                  </Link>
                </div>

                <button
                  onClick={() => setShowSignupModal(false)}
                  className="mt-5 text-sm text-text-tertiary transition-colors hover:text-text-secondary"
                >
                  {t('modal.close')}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
