import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, Home } from 'lucide-react'

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="dot-pattern absolute inset-0" />
      <div className="relative text-center">
        <p className="font-display text-[8rem] font-bold leading-none tracking-tighter text-border sm:text-[12rem]">
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-text-primary sm:text-3xl">
          {t('title')}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-text-secondary">
          {t('description')}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="group inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-brand-foreground transition-all hover:shadow-md"
          >
            <Home className="mr-2 h-4 w-4" />
            {t('home')}
          </Link>
          <Link
            href="/login"
            className="group inline-flex h-11 items-center justify-center rounded-full border border-border bg-surface px-6 text-sm font-medium text-text-primary transition-all hover:border-border-hover hover:bg-surface-secondary"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            로그인
          </Link>
        </div>
      </div>
    </div>
  )
}
