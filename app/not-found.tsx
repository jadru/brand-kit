import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="dot-pattern absolute inset-0" />
      <div className="relative text-center">
        <p className="font-display text-[8rem] font-bold leading-none tracking-tighter text-border sm:text-[12rem]">
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-text-primary sm:text-3xl">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-text-secondary">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link
          href="/"
          className="group mt-8 inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-brand-foreground transition-all hover:shadow-md"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
