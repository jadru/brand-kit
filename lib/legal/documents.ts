export type LegalDocumentType = 'privacy' | 'terms'

export interface LegalSection {
  title: string
  paragraphs: readonly string[]
  bullets?: readonly string[]
}

export interface LegalDocument {
  backLabel: string
  title: string
  lastUpdatedLabel: string
  lastUpdated: string
  sections: readonly LegalSection[]
}

const legalDocuments = {
  en: {
    privacy: {
      backLabel: 'Back to home',
      title: 'Privacy Policy',
      lastUpdatedLabel: 'Last updated:',
      lastUpdated: 'January 1, 2024',
      sections: [
        {
          title: '1. Information We Collect',
          paragraphs: [
            'BrandKit collects the following information to provide the service:',
          ],
          bullets: [
            'Email address for account creation and login',
            'Billing information for paid subscriptions',
            'Usage data such as project creation and asset generation activity',
          ],
        },
        {
          title: '2. How We Use Information',
          paragraphs: [
            'We use collected information for the following purposes:',
          ],
          bullets: [
            'Delivering the service and managing accounts',
            'Processing payments and managing subscriptions',
            'Improving the product and developing new features',
            'Responding to support requests and customer inquiries',
          ],
        },
        {
          title: '3. Retention and Deletion',
          paragraphs: [
            'Personal information is retained while your account is active and deleted within 30 days of an account deletion request, unless a longer retention period is required by law.',
          ],
        },
        {
          title: '4. Sharing with Third Parties',
          paragraphs: [
            'BrandKit does not share personal information with third parties except in the following cases:',
          ],
          bullets: [
            'When you give prior consent',
            'When disclosure is required by law or a lawful request from an investigative authority',
          ],
        },
        {
          title: '5. Contact',
          paragraphs: [
            'For privacy-related questions, contact support@brandkit.app.',
          ],
        },
      ],
    },
    terms: {
      backLabel: 'Back to home',
      title: 'Terms of Service',
      lastUpdatedLabel: 'Last updated:',
      lastUpdated: 'January 1, 2024',
      sections: [
        {
          title: '1. Service Overview',
          paragraphs: [
            'BrandKit is an AI-powered brand asset generation service. These terms describe the conditions, procedures, rights, obligations, and responsibilities related to using BrandKit.',
          ],
        },
        {
          title: '2. Accounts and Registration',
          paragraphs: [
            'You can create an account using email or social login providers such as Google and GitHub. You are responsible for providing accurate information and maintaining account security.',
          ],
        },
        {
          title: '3. Acceptable Use',
          paragraphs: [
            'You agree to the following while using the service:',
          ],
          bullets: [
            'Use the service only for lawful purposes',
            'Do not infringe on the intellectual property rights of others',
            'Do not interfere with the normal operation of the service',
            'Do not share your account with other people',
          ],
        },
        {
          title: '4. Intellectual Property',
          paragraphs: [
            'Assets generated through BrandKit belong to the member who created them. The BrandKit service itself, including its software, design system, and logos, remains the property of BrandKit.',
          ],
        },
        {
          title: '5. Billing and Refunds',
          paragraphs: [
            'Paid services are offered as subscriptions and renew automatically on the billing date. Refund requests may be made within 7 days of payment, but refunds can be limited for services already used.',
          ],
        },
        {
          title: '6. Service Changes and Interruptions',
          paragraphs: [
            'BrandKit may change the service to improve it. Material changes will be announced in advance when possible, and members will be notified if the service must be interrupted for unavoidable reasons.',
          ],
        },
        {
          title: '7. Disclaimer',
          paragraphs: [
            'BrandKit is not liable for indirect, incidental, or consequential damages arising from use of the service. We do not guarantee the accuracy or fitness of AI-generated content.',
          ],
        },
        {
          title: '8. Contact',
          paragraphs: [
            'For questions about these terms, contact support@brandkit.app.',
          ],
        },
      ],
    },
  },
  ko: {
    privacy: {
      backLabel: '홈으로 돌아가기',
      title: '개인정보처리방침',
      lastUpdatedLabel: '최종 수정일:',
      lastUpdated: '2024년 1월 1일',
      sections: [
        {
          title: '1. 수집하는 개인정보',
          paragraphs: [
            'BrandKit은 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:',
          ],
          bullets: [
            '이메일 주소 (계정 생성 및 로그인)',
            '결제 정보 (유료 구독 시)',
            '서비스 이용 기록 (프로젝트 생성, 에셋 생성 등)',
          ],
        },
        {
          title: '2. 개인정보의 이용 목적',
          paragraphs: [
            '수집된 개인정보는 다음의 목적으로 이용됩니다:',
          ],
          bullets: [
            '서비스 제공 및 계정 관리',
            '결제 처리 및 구독 관리',
            '서비스 개선 및 신규 기능 개발',
            '고객 지원 및 문의 응대',
          ],
        },
        {
          title: '3. 개인정보의 보관 및 파기',
          paragraphs: [
            '개인정보는 서비스 이용 기간 동안 보관되며, 계정 삭제 요청 시 30일 이내에 파기됩니다. 단, 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관됩니다.',
          ],
        },
        {
          title: '4. 개인정보의 제3자 제공',
          paragraphs: [
            'BrandKit은 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:',
          ],
          bullets: [
            '이용자가 사전에 동의한 경우',
            '법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우',
          ],
        },
        {
          title: '5. 문의',
          paragraphs: [
            '개인정보 처리에 관한 문의사항은 support@brandkit.app으로 연락해 주세요.',
          ],
        },
      ],
    },
    terms: {
      backLabel: '홈으로 돌아가기',
      title: '이용약관',
      lastUpdatedLabel: '최종 수정일:',
      lastUpdated: '2024년 1월 1일',
      sections: [
        {
          title: '1. 서비스 개요',
          paragraphs: [
            'BrandKit은 AI 기반 브랜드 에셋 생성 서비스입니다. 본 약관은 BrandKit 서비스 이용에 관한 조건 및 절차, 회사와 회원의 권리, 의무 및 책임사항을 규정합니다.',
          ],
        },
        {
          title: '2. 회원가입 및 계정',
          paragraphs: [
            '회원가입은 이메일 주소 또는 소셜 로그인(Google, GitHub)을 통해 가능합니다. 회원은 정확한 정보를 제공해야 하며, 계정 보안에 대한 책임이 있습니다.',
          ],
        },
        {
          title: '3. 서비스 이용',
          paragraphs: [
            '회원은 다음 사항을 준수해야 합니다:',
          ],
          bullets: [
            '서비스를 합법적인 목적으로만 사용',
            '타인의 지적재산권을 침해하지 않음',
            '서비스의 정상적인 운영을 방해하지 않음',
            '계정을 타인과 공유하지 않음',
          ],
        },
        {
          title: '4. 지적재산권',
          paragraphs: [
            'BrandKit 서비스를 통해 생성된 에셋의 저작권은 해당 회원에게 귀속됩니다. 단, BrandKit 서비스 자체의 소프트웨어, 디자인, 로고 등에 대한 지적재산권은 BrandKit에 귀속됩니다.',
          ],
        },
        {
          title: '5. 결제 및 환불',
          paragraphs: [
            '유료 서비스는 구독 형태로 제공되며, 결제일에 자동으로 갱신됩니다. 환불은 결제 후 7일 이내에 요청 시 가능하며, 이미 사용한 서비스에 대해서는 환불이 제한될 수 있습니다.',
          ],
        },
        {
          title: '6. 서비스 변경 및 중단',
          paragraphs: [
            'BrandKit은 서비스 개선을 위해 서비스 내용을 변경할 수 있으며, 중요한 변경 사항은 사전에 공지합니다. 불가피한 사유로 서비스가 중단될 경우 회원에게 통지합니다.',
          ],
        },
        {
          title: '7. 면책조항',
          paragraphs: [
            'BrandKit은 서비스 이용으로 발생하는 간접적, 부수적, 결과적 손해에 대해 책임지지 않습니다. AI 생성 콘텐츠의 정확성이나 적합성에 대한 보증을 제공하지 않습니다.',
          ],
        },
        {
          title: '8. 문의',
          paragraphs: [
            '이용약관에 관한 문의사항은 support@brandkit.app으로 연락해 주세요.',
          ],
        },
      ],
    },
  },
} as const

export function getLegalDocument(
  locale: string,
  type: LegalDocumentType
): LegalDocument {
  const normalizedLocale = locale === 'ko' ? 'ko' : 'en'
  return legalDocuments[normalizedLocale][type]
}
