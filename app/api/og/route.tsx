import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'BrandKit'
  const description =
    searchParams.get('description') ||
    '나만의 브랜드 스타일 → 모든 에셋 자동 생성'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#09090b',
          color: '#fafafa',
          fontFamily: 'sans-serif',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            B
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, opacity: 0.7 }}>
            BrandKit
          </div>
        </div>
        <div
          style={{
            fontSize: '56px',
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '28px',
            marginTop: '24px',
            opacity: 0.7,
            textAlign: 'center',
          }}
        >
          {description}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
