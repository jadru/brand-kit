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
    title: t('terms.title'),
    description: t('terms.description'),
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default function TermsPage() {
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
          이용약관
        </h1>
        <p className="mt-4 text-text-secondary">최종 수정일: 2024년 1월 1일</p>

        <div className="mt-12 space-y-8 text-text-secondary">
          <section>
            <h2 className="font-display text-xl font-semibold text-text-primary">1. 서비스 개요</h2>
            <p className="mt-3 leading-relaxed">
              BrandKit은 AI 기반 브랜드 에셋 생성 서비스입니다. 본 약관은 BrandKit 서비스 이용에 관한
              조건 및 절차, 회사와 회원의 권리, 의무 및 책임사항을 규정합니다.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-text-primary">2. 회원가입 및 계정</h2>
            <p className="mt-3 leading-relaxed">
              회원가입은 이메일 주소 또는 소셜 로그인(Google, GitHub)을 통해 가능합니다.
              회원은 정확한 정보를 제공해야 하며, 계정 보안에 대한 책임이 있습니다.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-text-primary">3. 서비스 이용</h2>
            <p className="mt-3 leading-relaxed">
              회원은 다음 사항을 준수해야 합니다:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>서비스를 합법적인 목적으로만 사용</li>
              <li>타인의 지적재산권을 침해하지 않음</li>
              <li>서비스의 정상적인 운영을 방해하지 않음</li>
              <li>계정을 타인과 공유하지 않음</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-text-primary">4. 지적재산권</h2>
            <p className="mt-3 leading-relaxed">
              BrandKit 서비스를 통해 생성된 에셋의 저작권은 해당 회원에게 귀속됩니다.
              단, BrandKit 서비스 자체의 소프트웨어, 디자인, 로고 등에 대한 지적재산권은
              BrandKit에 귀속됩니다.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-text-primary">5. 결제 및 환불</h2>
            <p className="mt-3 leading-relaxed">
              유료 서비스는 구독 형태로 제공되며, 결제일에 자동으로 갱신됩니다.
              환불은 결제 후 7일 이내에 요청 시 가능하며, 이미 사용한 서비스에 대해서는
              환불이 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-text-primary">6. 서비스 변경 및 중단</h2>
            <p className="mt-3 leading-relaxed">
              BrandKit은 서비스 개선을 위해 서비스 내용을 변경할 수 있으며,
              중요한 변경 사항은 사전에 공지합니다. 불가피한 사유로 서비스가 중단될 경우
              회원에게 통지합니다.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-text-primary">7. 면책조항</h2>
            <p className="mt-3 leading-relaxed">
              BrandKit은 서비스 이용으로 발생하는 간접적, 부수적, 결과적 손해에 대해
              책임지지 않습니다. AI 생성 콘텐츠의 정확성이나 적합성에 대한 보증을 제공하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-text-primary">8. 문의</h2>
            <p className="mt-3 leading-relaxed">
              이용약관에 관한 문의사항은 support@brandkit.app으로 연락해 주세요.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
