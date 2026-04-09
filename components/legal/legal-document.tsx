import { ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { LegalDocument } from '@/lib/legal/documents'

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <main id="main-content" className="bg-surface min-h-screen px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="group text-text-secondary hover:text-accent mb-8 inline-flex items-center text-sm transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          {document.backLabel}
        </Link>

        <h1 className="font-display text-text-primary text-3xl font-bold tracking-tight sm:text-4xl">
          {document.title}
        </h1>
        <p className="text-text-secondary mt-4">
          {document.lastUpdatedLabel} {document.lastUpdated}
        </p>

        <div className="text-text-secondary mt-12 space-y-8">
          {document.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-text-primary text-xl font-semibold">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
