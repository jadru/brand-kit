import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('privacy.title'),
    description: t('privacy.description'),
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="group mb-8 inline-flex items-center text-sm text-text-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          홈으로 돌아가기
        </Link>

        <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          개인정보처리방침
        </h1>
        <p className="mt-4 text-text-secondary">최종 수정일: 2024년 1월 1일</p>

        <div className="mt-12 space-y-8 text-text-secondary">
          <section>
            <h2 className="font-display text-xl font-semibold text-text-primary">1. 수집하는 개인정보</h2>
            <p className="mt-3 leading-relaxed">
              BrandKit은 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>이메일 주소 (계정 생성 및 로그인)</li>
              <li>결제 정보 (유료 구독 시)</li>
              <li>서비스 이용 기록 (프로젝트 생성, 에셋 생성 등)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-text-primary">2. 개인정보의 이용 목적</h2>
            <p className="mt-3 leading-relaxed">
              수집된 개인정보는 다음의 목적으로 이용됩니다:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>서비스 제공 및 계정 관리</li>
              <li>결제 처리 및 구독 관리</li>
              <li>서비스 개선 및 신규 기능 개발</li>
              <li>고객 지원 및 문의 응대</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-text-primary">3. 개인정보의 보관 및 파기</h2>
            <p className="mt-3 leading-relaxed">
              개인정보는 서비스 이용 기간 동안 보관되며, 계정 삭제 요청 시 30일 이내에 파기됩니다.
              단, 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관됩니다.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-text-primary">4. 개인정보의 제3자 제공</h2>
            <p className="mt-3 leading-relaxed">
              BrandKit은 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-text-primary">5. 문의</h2>
            <p className="mt-3 leading-relaxed">
              개인정보 처리에 관한 문의사항은 support@brandkit.app으로 연락해 주세요.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
