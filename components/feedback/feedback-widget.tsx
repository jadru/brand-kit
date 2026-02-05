'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageSquare, X, Send, ThumbsUp, ThumbsDown, Meh, Sparkles } from 'lucide-react'

interface FeedbackWidgetProps {
  locale?: 'en' | 'ko'
  onSubmit?: (data: { type: 'positive' | 'neutral' | 'negative'; message: string }) => void
  position?: 'bottom-right' | 'bottom-left'
}

const content = {
  en: {
    trigger: 'Feedback',
    title: 'Send feedback',
    subtitle: 'Help us improve BrandKit',
    placeholder: 'What can we do better?',
    submit: 'Send',
    thanks: 'Thanks!',
    thanksSubtitle: 'We appreciate your input',
    sentimentLabel: 'How do you feel?',
  },
  ko: {
    trigger: '피드백',
    title: '피드백 보내기',
    subtitle: 'BrandKit 개선에 도움을 주세요',
    placeholder: '어떤 점을 개선하면 좋을까요?',
    submit: '전송',
    thanks: '감사합니다!',
    thanksSubtitle: '소중한 의견 감사합니다',
    sentimentLabel: '어떠셨나요?',
  },
}

export function FeedbackWidget({
  locale = 'en',
  onSubmit,
  position = 'bottom-right',
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative' | null>(null)
  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const t = content[locale]

  // Focus trap handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
        return
      }

      if (e.key === 'Tab') {
        const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(
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
    [isOpen]
  )

  // Add/remove keyboard listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  const handleOpen = () => {
    setIsOpen(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true)
        // Focus the close button when panel opens
        closeButtonRef.current?.focus()
      })
    })
  }

  const handleClose = useCallback(() => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsOpen(false)
      setSentiment(null)
      setMessage('')
      // Return focus to trigger button
      triggerRef.current?.focus()
    }, 300)
  }, [])

  const handleSubmit = () => {
    if (!sentiment || !message.trim()) return

    onSubmit?.({ type: sentiment, message: message.trim() })
    setIsSubmitted(true)

    setTimeout(() => {
      setIsAnimating(false)
      setTimeout(() => {
        setIsOpen(false)
        setIsSubmitted(false)
        setSentiment(null)
        setMessage('')
        // Return focus to trigger button
        triggerRef.current?.focus()
      }, 300)
    }, 2000)
  }

  const positionClasses = position === 'bottom-right' ? 'right-4 bottom-4' : 'left-4 bottom-4'

  const sentimentButtons = [
    {
      type: 'negative' as const,
      icon: ThumbsDown,
      activeColor:
        'bg-gradient-to-br from-rose-500 to-red-600 border-rose-400/50 text-white shadow-lg shadow-rose-500/25',
      label: locale === 'ko' ? '별로' : 'Poor',
    },
    {
      type: 'neutral' as const,
      icon: Meh,
      activeColor:
        'bg-gradient-to-br from-amber-400 to-yellow-500 border-amber-400/50 text-zinc-900 shadow-lg shadow-amber-500/25',
      label: locale === 'ko' ? '보통' : 'Okay',
    },
    {
      type: 'positive' as const,
      icon: ThumbsUp,
      activeColor:
        'bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-400/50 text-white shadow-lg shadow-emerald-500/25',
      label: locale === 'ko' ? '좋아요' : 'Great',
    },
  ]

  return (
    <div className={`fixed z-40 ${positionClasses}`}>
      {/* Trigger button */}
      {!isOpen && (
        <button
          ref={triggerRef}
          onClick={handleOpen}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-accent px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-xl hover:shadow-accent/30 active:scale-95"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <MessageSquare className="h-4 w-4" />
          <span className="relative">{t.trigger}</span>
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-widget-title"
          className={`w-80 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isAnimating ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'
          }`}
        >
          {/* Top gradient line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

          {/* Noise texture */}
          <div className="noise pointer-events-none absolute inset-0 opacity-30" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <h3
                id="feedback-widget-title"
                className="font-display text-sm font-semibold tracking-tight text-white"
              >
                {t.title}
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                {t.subtitle}
              </p>
            </div>
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              aria-label={locale === 'ko' ? '닫기' : 'Close feedback panel'}
              className="rounded-lg p-2 text-white/30 transition-all hover:bg-white/10 hover:text-white/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 p-4">
            {isSubmitted ? (
              <div className="animate-fade-in py-6 text-center">
                <div className="relative mx-auto mb-3 w-fit">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-xl" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-gradient-to-br from-emerald-400 to-green-500">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="font-display text-base font-semibold text-white">{t.thanks}</p>
                <p className="mt-0.5 text-xs text-white/40">{t.thanksSubtitle}</p>
              </div>
            ) : (
              <>
                {/* Sentiment selector */}
                <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {t.sentimentLabel}
                </p>

                <div
                  className="mb-4 flex justify-center gap-3"
                  role="group"
                  aria-label={t.sentimentLabel}
                >
                  {sentimentButtons.map(({ type, icon: Icon, activeColor, label }) => (
                    <button
                      key={type}
                      onClick={() => setSentiment(type)}
                      aria-pressed={sentiment === type}
                      aria-label={label}
                      className={`group flex flex-col items-center gap-1.5 transition-all duration-200 ${
                        sentiment === type ? 'scale-105' : 'hover:scale-105'
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all ${
                          sentiment === type
                            ? activeColor
                            : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`font-mono text-[9px] uppercase tracking-wider transition-colors ${
                          sentiment === type ? 'text-white/80' : 'text-white/30'
                        }`}
                        aria-hidden="true"
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Message input */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.placeholder}
                  className="mb-4 h-24 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-white/25 transition-all focus:border-accent/50 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-accent/30"
                />

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={!sentiment || !message.trim()}
                  aria-label={locale === 'ko' ? '피드백 전송' : 'Send feedback'}
                  className="btn-glow group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
                >
                  <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  {t.submit}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackWidget
