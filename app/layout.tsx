import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jet',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'BrandKit - AI Brand Asset Generator',
    template: '%s | BrandKit',
  },
  description: '나만의 브랜드 스타일 저장 → 플랫폼 선택 → 모든 브랜드 에셋 자동 생성',
  keywords: [
    'brand assets',
    'favicon generator',
    'og image',
    'app icon',
    'brand identity',
    'AI copywriting',
  ],
  authors: [{ name: 'BrandKit' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'BrandKit',
    title: 'BrandKit - AI Brand Asset Generator',
    description: '나만의 브랜드 스타일 저장 → 모든 에셋 자동 생성',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'BrandKit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrandKit',
    description: '나만의 브랜드 스타일 → 모든 에셋 자동 생성',
    images: ['/api/og'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
