/**
 * Welcome Email Template
 * Sent to new users after signup
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  userName?: string
  locale?: 'en' | 'ko'
}

const content = {
  en: {
    preview: 'Welcome to BrandKit - Your AI Brand Asset Generator',
    greeting: 'Welcome to BrandKit!',
    intro:
      "We're excited to have you on board. BrandKit helps you save your brand style and auto-generate all brand assets with AI.",
    features: [
      'Save your brand colors, fonts, and style guidelines',
      'Generate consistent brand assets in seconds',
      'Export ready-to-use files for any platform',
    ],
    cta: 'Get Started',
    closing: 'Start creating beautiful brand assets today!',
    footer: 'BrandKit - AI Brand Asset Generator',
  },
  ko: {
    preview: 'BrandKit에 오신 것을 환영합니다 - AI 브랜드 에셋 생성기',
    greeting: 'BrandKit에 오신 것을 환영합니다!',
    intro:
      '함께하게 되어 기쁩니다. BrandKit은 브랜드 스타일을 저장하고 AI로 모든 브랜드 에셋을 자동 생성합니다.',
    features: [
      '브랜드 색상, 폰트, 스타일 가이드라인 저장',
      '몇 초 만에 일관된 브랜드 에셋 생성',
      '모든 플랫폼에 바로 사용 가능한 파일로 내보내기',
    ],
    cta: '시작하기',
    closing: '오늘부터 아름다운 브랜드 에셋을 만들어보세요!',
    footer: 'BrandKit - AI 브랜드 에셋 생성기',
  },
}

export function WelcomeEmail({ userName, locale = 'en' }: WelcomeEmailProps) {
  const t = content[locale]
  const name = userName || (locale === 'ko' ? '사용자' : 'there')

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{t.greeting}</Heading>

          <Text style={text}>
            {locale === 'ko' ? `안녕하세요 ${name}님,` : `Hi ${name},`}
          </Text>

          <Text style={text}>{t.intro}</Text>

          <Section style={featureSection}>
            {t.features.map((feature, index) => (
              <Text key={index} style={featureItem}>
                ✓ {feature}
              </Text>
            ))}
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href={process.env.NEXT_PUBLIC_APP_URL || 'https://brandkit.ai'}>
              {t.cta}
            </Button>
          </Section>

          <Text style={text}>{t.closing}</Text>

          <Hr style={hr} />

          <Text style={footer}>{t.footer}</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#0a0a0b',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  backgroundColor: '#18181b',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  maxWidth: '560px',
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '600',
  lineHeight: '36px',
  margin: '0 0 24px',
}

const text = {
  color: '#a1a1aa',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const featureSection = {
  margin: '24px 0',
}

const featureItem = {
  color: '#e4e4e7',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '0',
}

const buttonSection = {
  margin: '32px 0',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#6366f1',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
}

const hr = {
  borderColor: '#27272a',
  margin: '32px 0',
}

const footer = {
  color: '#71717a',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  textAlign: 'center' as const,
}

export default WelcomeEmail
