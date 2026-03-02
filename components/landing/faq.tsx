'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, HelpCircle, Mail, ArrowRight } from 'lucide-react'

const faqItems = [
  { id: '1', questionKey: 'faq.items.1.question', answerKey: 'faq.items.1.answer' },
  { id: '2', questionKey: 'faq.items.2.question', answerKey: 'faq.items.2.answer' },
  { id: '3', questionKey: 'faq.items.3.question', answerKey: 'faq.items.3.answer' },
  { id: '4', questionKey: 'faq.items.4.question', answerKey: 'faq.items.4.answer' },
  { id: '5', questionKey: 'faq.items.5.question', answerKey: 'faq.items.5.answer' },
  { id: '6', questionKey: 'faq.items.6.question', answerKey: 'faq.items.6.answer' },
]

function FAQItem({
  questionKey,
  answerKey,
  isOpen,
  onToggle,
  index,
}: {
  questionKey: string
  answerKey: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const t = useTranslations('landing')
  const contentRef = useRef<HTMLDivElement>(null)
  const panelHeight = isOpen ? `${contentRef.current?.scrollHeight ?? 0}px` : '0px'

  return (
    <div
      className={`
        group overflow-hidden rounded-xl border bg-surface
        transition-all duration-300 ease-out
        animate-reveal-up
        ${isOpen
          ? 'border-accent/30 shadow-md ring-1 ring-accent/5'
          : 'border-border hover:border-border-hover hover:shadow-sm'
        }
      `}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span
            className={`
              flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
              text-xs font-semibold transition-colors
              ${isOpen
                ? 'bg-accent text-white'
                : 'bg-surface-secondary text-text-tertiary group-hover:bg-accent/10 group-hover:text-accent'
              }
            `}
          >
            {index + 1}
          </span>
          <span
            className={`
              text-sm font-medium transition-colors sm:text-base
              ${isOpen ? 'text-text-primary' : 'text-text-primary'}
            `}
          >
            {t(questionKey)}
          </span>
        </div>
        <div
          className={`
            flex h-8 w-8 shrink-0 items-center justify-center rounded-full
            transition-all duration-300
            ${isOpen
              ? 'bg-accent/10 rotate-180'
              : 'bg-surface-secondary group-hover:bg-accent/5'
            }
          `}
        >
          <ChevronDown
            className={`h-4 w-4 transition-colors ${
              isOpen ? 'text-accent' : 'text-text-tertiary group-hover:text-accent'
            }`}
          />
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ height: panelHeight }}
      >
        <div ref={contentRef} className="px-6 pb-5">
          <div className="ml-10 border-l-2 border-accent/20 pl-4">
            <p className="text-sm leading-relaxed text-text-secondary">
              {t(answerKey)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FAQ() {
  const t = useTranslations('landing')
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section id="faq" className="relative px-6 py-24 lg:px-8 lg:py-32">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-1/4 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        {/* Section header */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 font-mono text-xs tracking-[0.15em] text-accent uppercase">
            <HelpCircle className="h-3 w-3" />
            {t('faq.sectionLabel')}
          </div>
          <h2 className="font-display text-3xl font-bold tracking-headline text-text-primary sm:text-4xl lg:text-5xl">
            {t('faq.headline')}{' '}
            <span className="text-text-tertiary">{t('faq.headlineSub')}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
            {t('faq.description')}
          </p>
        </div>

        {/* FAQ items */}
        <div className="mt-12 space-y-3">
          {faqItems.map((item, idx) => (
            <FAQItem
              key={item.id}
              questionKey={item.questionKey}
              answerKey={item.answerKey}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
              index={idx}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 animate-reveal-up" style={{ animationDelay: '500ms' }}>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface via-surface to-accent/5 p-8 text-center">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <Mail className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">{t('faq.contactTitle')}</h3>
              <p className="mx-auto mt-2 max-w-md text-text-secondary">{t('faq.contactDescription')}</p>
              <a
                href="mailto:support@brandkit.app"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-surface-secondary px-6 py-2.5 text-sm font-medium text-text-primary transition-all hover:bg-accent hover:text-white"
              >
                {t('faq.contactCta')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
