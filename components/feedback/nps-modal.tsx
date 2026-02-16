'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Sparkles, ArrowRight } from 'lucide-react'

interface NPSModalProps {
  locale?: 'en' | 'ko'
  onSubmit?: (score: number, feedback?: string) => void
  onDismiss?: () => void
  storageKey?: string
  showAfterDays?: number
}

const content = {
  en: {
    title: 'Quick Feedback',
    subtitle: 'How likely are you to recommend BrandKit?',
    low: 'Not likely',
    high: 'Very likely',
    feedbackLabel: 'Any thoughts to share?',
    feedbackPlaceholder: 'What could we do better...',
    submit: 'Submit',
    thanks: 'Thanks!',
    thanksSubtitle: 'Your feedback helps us improve',
    dismiss: 'Later',
  },
  ko: {
    title: '피드백',
    subtitle: 'BrandKit을 추천할 의향이 얼마나 되시나요?',
    low: '추천하지 않음',
    high: '적극 추천',
    feedbackLabel: '의견을 공유해주세요',
    feedbackPlaceholder: '개선할 점을 알려주세요...',
    submit: '제출',
    thanks: '감사합니다!',
    thanksSubtitle: '피드백이 서비스 개선에 도움이 됩니다',
    dismiss: '나중에',
  },
}

export function NPSModal({
  locale = 'en',
  onSubmit,
  onDismiss,
  storageKey = 'brandkit_nps_last_shown',
  showAfterDays = 7,
}: NPSModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const lastFocusableRef = useRef<HTMLButtonElement>(null)

  const t = content[locale]

  const handleDismiss = useCallback(() => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsOpen(false)
      // Restore focus to trigger element
      triggerRef.current?.focus()
    }, 300)
    onDismiss?.()
  }, [onDismiss])

  // Focus trap handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        e.preventDefault()
        handleDismiss()
        return
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    },
    [isOpen, handleDismiss]
  )

  // Add/remove keyboard listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  useEffect(() => {
    const checkShouldShow = () => {
      const lastShown = localStorage.getItem(storageKey)
      if (!lastShown) return true

      const lastShownDate = new Date(lastShown)
      const daysSince = (Date.now() - lastShownDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysSince >= showAfterDays
    }

    const timer = setTimeout(() => {
      if (checkShouldShow()) {
        // Store current focus for restoration
        triggerRef.current = document.activeElement as HTMLElement
        setIsOpen(true)
        localStorage.setItem(storageKey, new Date().toISOString())
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsAnimating(true)
            // Focus the first focusable element in modal
            firstFocusableRef.current?.focus()
          })
        })
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [storageKey, showAfterDays])

  const handleSubmit = () => {
    if (selectedScore === null) return

    setIsSubmitted(true)
    onSubmit?.(selectedScore, feedback || undefined)

    setTimeout(() => {
      setIsAnimating(false)
      setTimeout(() => {
        setIsOpen(false)
        // Restore focus to trigger element
        triggerRef.current?.focus()
      }, 300)
    }, 2000)
  }

  const getScoreColor = (score: number, isSelected: boolean) => {
    if (!isSelected)
      return 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'

    if (score <= 6)
      return 'bg-gradient-to-br from-rose-500 to-red-600 border-rose-400/50 text-white shadow-lg shadow-rose-500/20'
    if (score <= 8)
      return 'bg-gradient-to-br from-amber-400 to-yellow-500 border-amber-400/50 text-zinc-900 shadow-lg shadow-amber-500/20'
    return 'bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-400/50 text-white shadow-lg shadow-emerald-500/20'
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nps-modal-title"
        className={`fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isAnimating
            ? '-translate-y-1/2 scale-100 opacity-100'
            : '-translate-y-[45%] scale-95 opacity-0'
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl backdrop-blur-xl">
          {/* Gradient mesh background */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-violet-500/5" />

          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

          {/* Noise texture */}
          <div className="noise pointer-events-none absolute inset-0 opacity-30" />

          {/* Close button */}
          <button
            ref={firstFocusableRef}
            onClick={handleDismiss}
            className="absolute right-3 top-3 z-10 rounded-lg p-2 text-white/30 transition-all hover:bg-white/10 hover:text-white/60"
            aria-label={locale === 'ko' ? '닫기' : 'Close modal'}
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative z-10 p-6">
            {isSubmitted ? (
              <div className="animate-fade-in py-8 text-center">
                <div className="relative mx-auto mb-4 w-fit">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-xl" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-gradient-to-br from-emerald-400 to-green-500">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                </div>
                <p className="font-display text-xl font-bold tracking-tight text-white">
                  {t.thanks}
                </p>
                <p className="mt-1 text-sm text-white/40">{t.thanksSubtitle}</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-6 pr-8">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent-light/60">
                    {t.title}
                  </div>
                  <h2
                    id="nps-modal-title"
                    className="font-display text-lg font-semibold tracking-tight text-white"
                  >
                    {t.subtitle}
                  </h2>
                </div>

                {/* Score buttons */}
                <div className="mb-6">
                  <div className="mb-3 grid grid-cols-11 gap-1.5" role="group" aria-label={locale === 'ko' ? '추천 점수 선택' : 'Select recommendation score'}>
                    {Array.from({ length: 11 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedScore(i)}
                        aria-label={locale === 'ko' ? `${i}점 (10점 만점)` : `Score ${i} out of 10`}
                        aria-pressed={selectedScore === i}
                        className={`flex aspect-square items-center justify-center rounded-lg border font-mono text-sm font-semibold transition-all duration-200 ${getScoreColor(i, selectedScore === i)} ${
                          selectedScore === i ? 'scale-110' : 'hover:scale-105'
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-white/30">
                    <span>{t.low}</span>
                    <span>{t.high}</span>
                  </div>
                </div>

                {/* Feedback textarea - appears with animation */}
                {selectedScore !== null && (
                  <div className="animate-fade-in-up mb-6">
                    <label className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {t.feedbackLabel}
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder={t.feedbackPlaceholder}
                      className="h-24 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-white/25 transition-all focus:border-accent/50 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-accent/30"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleDismiss}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-xs font-medium uppercase tracking-wider text-white/40 transition-all hover:bg-white/10 hover:text-white/60"
                  >
                    {t.dismiss}
                  </button>
                  <button
                    ref={lastFocusableRef}
                    onClick={handleSubmit}
                    disabled={selectedScore === null}
                    className="btn-glow group flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
                  >
                    {t.submit}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default NPSModal
