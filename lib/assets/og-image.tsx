import satori from 'satori'
import sharp from 'sharp'
import { OG_IMAGE_SIZES } from './constants'
import { resolveOgStyles, type ResolvedOgStyles } from './style-resolver'
import { generateOgBackground } from '@/lib/ai/fal'
import { generateWithRetry } from '@/lib/utils/errors'
import type { Project, BrandProfile, StylePreset } from '@/types/database'
import React from 'react'

// ========================================
// Font Loading
// ========================================

// Google Fonts CDN URLs for each font/weight combination
const FONT_URLS: Record<string, Record<number, string>> = {
  'Inter': {
    400: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
    500: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf',
    600: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf',
    700: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
  },
  'Geist': {
    700: 'https://fonts.gstatic.com/s/geist/v3/gyBhhwUxId8mMGZKNImSPbcZm7h9NNQ.ttf',
  },
  'Plus Jakarta Sans': {
    700: 'https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KU7NShXUEKi4Rw.ttf',
  },
  'Nunito': {
    800: 'https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDIkhdTQ3j6zbXWjgeg.ttf',
  },
}

// Module-level cache to avoid re-fetching fonts within the same invocation
const fontCache = new Map<string, Buffer>()

async function loadFont(family: string, weight: number): Promise<Buffer> {
  const key = `${family}-${weight}`
  const cached = fontCache.get(key)
  if (cached) return cached

  const familyUrls = FONT_URLS[family]
  const url = familyUrls?.[weight] || FONT_URLS['Inter']![700]!

  const res = await fetch(url)
  if (!res.ok) {
    // Fallback to Inter 700
    const fallbackRes = await fetch(FONT_URLS['Inter']![700]!)
    if (!fallbackRes.ok) throw new Error(`Failed to load font: ${family} ${weight}`)
    const buf = Buffer.from(await fallbackRes.arrayBuffer())
    fontCache.set(key, buf)
    return buf
  }

  const buf = Buffer.from(await res.arrayBuffer())
  fontCache.set(key, buf)
  return buf
}

// ========================================
// Main Generator
// ========================================

interface OgImageInput {
  project: Project
  brandProfile: BrandProfile | null
  stylePreset: StylePreset
}

interface OgImageResult {
  files: Record<string, Buffer>
  warnings: string[]
}

export async function generateOgImages(input: OgImageInput): Promise<OgImageResult> {
  const { project, brandProfile, stylePreset } = input
  const results: Record<string, Buffer> = {}
  const warnings: string[] = []

  const resolved = resolveOgStyles(stylePreset, brandProfile, project)
  const fontData = await loadFont(resolved.fontFamily, resolved.fontWeight)

  const fonts = [
    { name: resolved.fontFamily, data: fontData, weight: resolved.fontWeight as 100, style: 'normal' as const },
  ]

  const ogWidth = OG_IMAGE_SIZES.og.width
  const ogHeight = OG_IMAGE_SIZES.og.height
  const twitterWidth = OG_IMAGE_SIZES.twitter.width
  const twitterHeight = OG_IMAGE_SIZES.twitter.height

  // AI 배경 생성 시도 (og_ai_style_modifier가 있는 경우)
  const hasAiModifier = !!(stylePreset.og_ai_style_modifier || stylePreset.ai_style_modifier)
  let aiBgBuffer: Buffer | null = null

  if (hasAiModifier) {
    try {
      aiBgBuffer = await generateWithRetry(
        () => generateOgBackground({
          project, brandProfile, stylePreset,
          width: ogWidth, height: ogHeight,
        }),
        2,
        1500
      )
    } catch (error) {
      console.warn('AI OG background generation failed after retries, falling back to gradient:', error)
      warnings.push('ai_bg_fallback')
    }
  }

  if (aiBgBuffer) {
    // 하이브리드 렌더링: AI 배경 + 텍스트 오버레이 합성
    const textOverlayStyles = { ...resolved, background: 'transparent' }

    // OG Image (1200x630)
    const ogTextSvg = await satori(
      renderOgTemplate(project, textOverlayStyles),
      { width: ogWidth, height: ogHeight, fonts }
    )
    const ogTextPng = await sharp(Buffer.from(ogTextSvg)).png().toBuffer()
    results['og.png'] = await sharp(aiBgBuffer)
      .composite([{ input: ogTextPng }])
      .png()
      .toBuffer()

    // Twitter Card (1200x600) — 같은 AI 배경을 리사이즈하여 재사용
    const twitterBg = await sharp(aiBgBuffer)
      .resize(twitterWidth, twitterHeight, { fit: 'cover' })
      .png()
      .toBuffer()
    const twitterTextSvg = await satori(
      renderOgTemplate(project, textOverlayStyles),
      { width: twitterWidth, height: twitterHeight, fonts }
    )
    const twitterTextPng = await sharp(Buffer.from(twitterTextSvg)).png().toBuffer()
    results['twitter-card.png'] = await sharp(twitterBg)
      .composite([{ input: twitterTextPng }])
      .png()
      .toBuffer()
  } else {
    // 폴백: 기존 CSS 그라디언트 방식
    const ogSvg = await satori(
      renderOgTemplate(project, resolved),
      { width: ogWidth, height: ogHeight, fonts }
    )
    results['og.png'] = await sharp(Buffer.from(ogSvg)).png().toBuffer()

    const twitterSvg = await satori(
      renderOgTemplate(project, resolved),
      { width: twitterWidth, height: twitterHeight, fonts }
    )
    results['twitter-card.png'] = await sharp(Buffer.from(twitterSvg)).png().toBuffer()
  }

  return { files: results, warnings }
}

// ========================================
// Template Renderer (dispatch by layout)
// ========================================

function renderOgTemplate(project: Project, s: ResolvedOgStyles) {
  switch (s.layout) {
    case 'left-aligned':
      return renderLeftAligned(project, s)
    case 'centered-large-text':
      return renderCenteredLargeText(project, s)
    case 'grid-balanced':
      return renderGridBalanced(project, s)
    case 'centered':
    default:
      return renderCentered(project, s)
  }
}

// ========================================
// Layout: Centered (Airbnb 3D, Stripe Gradient, Glassmorphism, Duolingo)
// ========================================

function renderCentered(project: Project, s: ResolvedOgStyles) {
  const subtitle = project.ai_headline || project.description || ''

  const textContent = React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      padding: s.glassOverlay ? '48px 64px' : '0',
      ...(s.glassOverlay ? {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.2)',
      } : {}),
      ...(s.hardShadow ? {
        backgroundColor: s.background === s.textColor ? 'transparent' : undefined,
        boxShadow: '6px 6px 0 rgba(0,0,0,0.2)',
        borderRadius: '16px',
        padding: '48px 64px',
      } : {}),
    },
  },
    React.createElement('div', {
      style: {
        fontSize: '56px',
        fontWeight: s.fontWeight,
        fontFamily: s.fontFamily,
        color: s.textColor,
        textAlign: 'center' as const,
        lineHeight: 1.2,
        marginBottom: subtitle ? '20px' : '0',
      },
    }, project.name),
    subtitle ? React.createElement('div', {
      style: {
        fontSize: '28px',
        fontFamily: s.fontFamily,
        color: s.secondaryTextColor,
        textAlign: 'center' as const,
        lineHeight: 1.4,
        maxWidth: '800px',
      },
    }, subtitle) : null,
  )

  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: s.background,
      padding: '80px',
    },
  }, textContent)
}

// ========================================
// Layout: Left-Aligned (Notion Minimal, Linear Dark)
// ========================================

function renderLeftAligned(project: Project, s: ResolvedOgStyles) {
  const subtitle = project.ai_headline || project.description || ''

  // Left text block
  const textBlock = React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      flex: 1,
    },
  },
    React.createElement('div', {
      style: {
        fontSize: '52px',
        fontWeight: s.fontWeight,
        fontFamily: s.fontFamily,
        color: s.textColor,
        lineHeight: 1.2,
        marginBottom: subtitle ? '16px' : '0',
      },
    }, project.name),
    subtitle ? React.createElement('div', {
      style: {
        fontSize: '24px',
        fontFamily: s.fontFamily,
        color: s.secondaryTextColor,
        lineHeight: 1.5,
        maxWidth: '600px',
      },
    }, subtitle) : null,
  )

  // Right accent element
  const accentElement = s.accentColor ? React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '120px',
      height: '120px',
      borderRadius: '24px',
      backgroundColor: s.accentColor,
      marginLeft: '60px',
      flexShrink: 0,
    },
  },
    React.createElement('div', {
      style: {
        fontSize: '48px',
        fontWeight: 700,
        color: '#FFFFFF',
        fontFamily: s.fontFamily,
      },
    }, project.name.charAt(0).toUpperCase()),
  ) : null

  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: s.background,
      padding: '80px',
    },
  }, textBlock, accentElement)
}

// ========================================
// Layout: Centered Large Text (Vercel Sharp)
// ========================================

function renderCenteredLargeText(project: Project, s: ResolvedOgStyles) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: s.background,
      padding: '80px',
    },
  },
    React.createElement('div', {
      style: {
        fontSize: '96px',
        fontWeight: s.fontWeight,
        fontFamily: s.fontFamily,
        color: s.textColor,
        textAlign: 'center' as const,
        lineHeight: 1.1,
        letterSpacing: '-2px',
      },
    }, project.name),
  )
}

// ========================================
// Layout: Grid Balanced (Figma Clean)
// ========================================

function renderGridBalanced(project: Project, s: ResolvedOgStyles) {
  const subtitle = project.ai_headline || project.description || ''

  // Left: Text content
  const leftColumn = React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      flex: 1,
      paddingRight: '40px',
    },
  },
    React.createElement('div', {
      style: {
        fontSize: '48px',
        fontWeight: s.fontWeight || 400,
        fontFamily: s.fontFamily,
        color: s.textColor,
        lineHeight: 1.25,
        marginBottom: subtitle ? '16px' : '0',
      },
    }, project.name),
    subtitle ? React.createElement('div', {
      style: {
        fontSize: '22px',
        fontFamily: s.fontFamily,
        color: s.secondaryTextColor,
        lineHeight: 1.5,
      },
    }, subtitle) : null,
  )

  // Right: Decorative card stack
  const rightColumn = React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      width: '320px',
      flexShrink: 0,
      gap: '12px',
    },
  },
    // Decorative cards
    React.createElement('div', {
      style: {
        display: 'flex',
        width: '200px',
        height: '200px',
        borderRadius: '20px',
        backgroundColor: s.accentColor || '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      },
    },
      React.createElement('div', {
        style: {
          fontSize: '72px',
          fontWeight: 700,
          color: '#FFFFFF',
          fontFamily: s.fontFamily,
        },
      }, project.name.charAt(0).toUpperCase()),
    ),
  )

  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: s.background,
      padding: '80px',
    },
  }, leftColumn, rightColumn)
}
