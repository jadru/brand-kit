/**
 * Project Complete Email Template
 * Sent when a brand asset generation project is completed
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

interface ProjectCompleteEmailProps {
  userName?: string
  projectName: string
  assetsGenerated: number
  locale?: 'en' | 'ko'
}

const content = {
  en: {
    preview: 'Your brand assets are ready!',
    greeting: 'Great news!',
    cta: 'View Project',
    footer: 'BrandKit - AI Brand Asset Generator',
  },
  ko: {
    preview: '브랜드 에셋이 준비되었습니다!',
    greeting: '좋은 소식입니다!',
    cta: '프로젝트 보기',
    footer: 'BrandKit - AI 브랜드 에셋 생성기',
  },
}

export function ProjectCompleteEmail({
  userName,
  projectName,
  assetsGenerated,
  locale = 'en',
}: ProjectCompleteEmailProps) {
  const t = content[locale]
  const name = userName || (locale === 'ko' ? '사용자' : 'there')

  const message =
    locale === 'ko'
      ? `"${projectName}" 프로젝트의 브랜드 에셋 ${assetsGenerated}개가 성공적으로 생성되었습니다. 지금 바로 다운로드하세요.`
      : `Your project "${projectName}" has been completed with ${assetsGenerated} brand assets generated successfully. Download them now!`

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

          <Text style={text}>{message}</Text>

          <Section style={statsSection}>
            <Text style={statLabel}>
              {locale === 'ko' ? '생성된 에셋' : 'Assets Generated'}
            </Text>
            <Text style={statValue}>{assetsGenerated}</Text>
          </Section>

          <Section style={buttonSection}>
            <Button
              style={button}
              href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://brandkit.ai'}/projects`}
            >
              {t.cta}
            </Button>
          </Section>

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

const statsSection = {
  backgroundColor: '#27272a',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const statLabel = {
  color: '#71717a',
  fontSize: '14px',
  margin: '0 0 4px',
}

const statValue = {
  color: '#6366f1',
  fontSize: '36px',
  fontWeight: '700',
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

export default ProjectCompleteEmail
