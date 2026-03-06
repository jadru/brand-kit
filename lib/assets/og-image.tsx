import satori from 'satori'
import sharp from 'sharp'
import { OG_IMAGE_SIZES } from './constants'
import { resolveOgStyles, type ResolvedOgStyles } from './style-resolver'
import { resolveProjectIconSource } from './icon-source'
import { generateOgBackground } from '@/lib/ai/fal'
import { generateWithRetry } from '@/lib/utils/errors'
import { validateImage } from '@/lib/utils/image'
import type { Project, BrandProfile, StylePreset } from '@/types/database'
import React from 'react'

// ========================================
// Font Loading
// ========================================

const FONT_URLS: Record<string, Record<number, string>> = {
  Inter: {
    400: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
    500: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf',
    600: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf',
    700: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf',
  },
  Geist: {
    700: 'https://fonts.gstatic.com/s/geist/v3/gyBhhwUxId8mMGZKNImSPbcZm7h9NNQ.ttf',
  },
  'Plus Jakarta Sans': {
    700: 'https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KU7NShXUEKi4Rw.ttf',
  },
  Nunito: {
    800: 'https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDIkhdTQ3j6zbXWjgeg.ttf',
  },
}

const fontCache = new Map<string, Buffer>()

async function loadFont(family: string, weight: number): Promise<Buffer> {
  const key = `${family}-${weight}`
  const cached = fontCache.get(key)
  if (cached) return cached

  const familyUrls = FONT_URLS[family]
  const url = familyUrls?.[weight] || FONT_URLS.Inter![700]!

  const response = await fetch(url)
  if (!response.ok) {
    const fallbackResponse = await fetch(FONT_URLS.Inter![700]!)
    if (!fallbackResponse.ok) throw new Error(`Failed to load font: ${family} ${weight}`)
    const buffer = Buffer.from(await fallbackResponse.arrayBuffer())
    fontCache.set(key, buffer)
    return buffer
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  fontCache.set(key, buffer)
  return buffer
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

interface OgIconRender {
  mode: 'text' | 'image'
  value: string
}

function textIcon(value: string): OgIconRender {
  return {
    mode: 'text',
    value: value.trim().charAt(0).toUpperCase() || 'S',
  }
}

function iconToRenderValue(iconSource: Awaited<ReturnType<typeof resolveProjectIconSource>>): OgIconRender {
  if (iconSource.type === 'text') {
    return textIcon(iconSource.value || 'S')
  }

  if (!iconSource.buffer) {
    return textIcon('S')
  }

  const mimeType = iconSource.type === 'svg' ? 'image/svg+xml' : 'image/png'
  return {
    mode: 'image',
    value: `data:${mimeType};base64,${iconSource.buffer.toString('base64')}`,
  }
}

function renderIconElement(icon: OgIconRender, fallbackColor: string, size: number) {
  if (icon.mode === 'text') {
    return React.createElement(
      'div',
      {
        style: {
          width: `${size}px`,
          height: `${size}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${Math.max(size * 0.58, 28)}px`,
          fontWeight: 700,
          color: '#FFFFFF',
          fontFamily: 'Inter',
          backgroundColor: fallbackColor,
          borderRadius: `${size === 120 ? '28px' : '20px'}`,
        },
      },
      icon.value
    )
  }

  return React.createElement('img', {
    src: icon.value,
    width: size,
    height: size,
    alt: 'Project icon',
    style: {
      borderRadius: size === 120 ? '28px' : '20px',
      objectFit: 'contain',
      backgroundColor: fallbackColor,
    },
  })
}

export async function generateOgImages(input: OgImageInput): Promise<OgImageResult> {
  const { project, brandProfile, stylePreset } = input
  const results: Record<string, Buffer> = {}
  const warnings: string[] = []
  const imagePngOptions = { compressionLevel: 9, effort: 10 } as const

  const resolved = resolveOgStyles(stylePreset, brandProfile, project)
  const fontData = await loadFont(resolved.fontFamily, resolved.fontWeight)

  const fonts = [
    { name: resolved.fontFamily, data: fontData, weight: resolved.fontWeight as 100, style: 'normal' as const },
  ]

  const ogWidth = OG_IMAGE_SIZES.og.width
  const ogHeight = OG_IMAGE_SIZES.og.height
  const twitterWidth = OG_IMAGE_SIZES.twitter.width
  const twitterHeight = OG_IMAGE_SIZES.twitter.height

  // OG icon resolution (텍스트/심볼/AI 이미지)
  let iconForRender = textIcon(project.name)
  try {
    const iconSource = await resolveProjectIconSource({ project, brandProfile, stylePreset })
    iconForRender = iconToRenderValue(iconSource)
  } catch {
    warnings.push('icon_fallback')
  }

  // AI 배경 생성 시도 (og_ai_style_modifier가 있는 경우)
  const hasAiModifier = !!(stylePreset.og_ai_style_modifier || stylePreset.ai_style_modifier)
  let aiBgBuffer: Buffer | null = null

  if (hasAiModifier) {
    try {
      aiBgBuffer = await generateWithRetry(
        () => generateOgBackground({
          project,
          brandProfile,
          stylePreset,
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
      renderOgTemplate(project, textOverlayStyles, iconForRender),
      { width: ogWidth, height: ogHeight, fonts }
    )
    const ogTextPng = await sharp(Buffer.from(ogTextSvg)).png(imagePngOptions).toBuffer()
    results['og.png'] = await sharp(aiBgBuffer)
      .composite([{ input: ogTextPng }])
      .png(imagePngOptions)
      .toBuffer()
    await validateImage(results['og.png'], ogWidth, ogHeight, 'og.png')

    // Twitter Card (1200x600) — 같은 AI 배경을 리사이즈하여 재사용
    const twitterBg = await sharp(aiBgBuffer)
      .resize(twitterWidth, twitterHeight, { fit: 'cover' })
      .png(imagePngOptions)
      .toBuffer()
    const twitterTextSvg = await satori(
      renderOgTemplate(project, textOverlayStyles, iconForRender),
      { width: twitterWidth, height: twitterHeight, fonts }
    )
    const twitterTextPng = await sharp(Buffer.from(twitterTextSvg)).png(imagePngOptions).toBuffer()
    results['twitter-card.png'] = await sharp(twitterBg)
      .composite([{ input: twitterTextPng }])
      .png(imagePngOptions)
      .toBuffer()
  } else {
    // 폴백: 기존 CSS 그라디언트 방식
    const ogSvg = await satori(
      renderOgTemplate(project, resolved, iconForRender),
      { width: ogWidth, height: ogHeight, fonts }
    )
    results['og.png'] = await sharp(Buffer.from(ogSvg)).png(imagePngOptions).toBuffer()
    await validateImage(results['og.png'], ogWidth, ogHeight, 'og.png')

    const twitterSvg = await satori(
      renderOgTemplate(project, resolved, iconForRender),
      { width: twitterWidth, height: twitterHeight, fonts }
    )
    results['twitter-card.png'] = await sharp(Buffer.from(twitterSvg)).png(imagePngOptions).toBuffer()
  }

  return { files: results, warnings }
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}

function getSubtitle(project: Project): string {
  return truncateText(project.ai_headline || project.description || '', 120)
}

function getTitleFontSize(title: string, variant: 'regular' | 'large'): string {
  const length = title.trim().length

  if (variant === 'large') {
    if (length <= 15) return '96px'
    if (length <= 30) return '84px'
    if (length <= 50) return '72px'
    return '60px'
  }

  if (length <= 15) return '72px'
  if (length <= 30) return '56px'
  if (length <= 50) return '44px'
  return '36px'
}

// ========================================
// Template Renderer (dispatch by layout)
// ========================================

function renderOgTemplate(project: Project, style: ResolvedOgStyles, icon: OgIconRender) {
  switch (style.layout) {
    case 'left-aligned':
      return renderLeftAligned(project, style, icon)
    case 'centered-large-text':
      return renderCenteredLargeText(project, style)
    case 'grid-balanced':
      return renderGridBalanced(project, style, icon)
    case 'centered':
    default:
      return renderCentered(project, style)
  }
}

// ========================================
// Layout: Centered
// ========================================

function renderCentered(project: Project, style: ResolvedOgStyles) {
  const subtitle = getSubtitle(project)
  const titleFontSize = getTitleFontSize(project.name, 'regular')

  const textContent = React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      padding: style.glassOverlay ? '48px 64px' : '0',
      ...(style.glassOverlay ? {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.2)',
      } : {}),
      ...(style.hardShadow ? {
        backgroundColor: style.background === style.textColor ? 'transparent' : undefined,
        boxShadow: '6px 6px 0 rgba(0,0,0,0.2)',
        borderRadius: '16px',
        padding: '48px 64px',
      } : {}),
    },
  },
    React.createElement('div', {
      style: {
        fontSize: titleFontSize,
        fontWeight: style.fontWeight,
        fontFamily: style.fontFamily,
        color: style.textColor,
        textAlign: 'center' as const,
        lineHeight: 1.2,
        wordBreak: 'break-word' as const,
        maxWidth: '1040px',
        marginBottom: subtitle ? '20px' : '0',
      },
    }, project.name),
    subtitle ? React.createElement('div', {
      style: {
        fontSize: '28px',
        fontFamily: style.fontFamily,
        color: style.secondaryTextColor,
        textAlign: 'center' as const,
        lineHeight: 1.4,
        wordBreak: 'break-word' as const,
        maxWidth: '900px',
        maxHeight: '80px',
        overflow: 'hidden',
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
      background: style.background,
      padding: '80px',
    },
  }, textContent)
}

// ========================================
// Layout: Left-Aligned
// ========================================

function renderLeftAligned(project: Project, style: ResolvedOgStyles, icon: OgIconRender) {
  const subtitle = getSubtitle(project)
  const titleFontSize = getTitleFontSize(project.name, 'regular')

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
        fontSize: titleFontSize,
        fontWeight: style.fontWeight,
        fontFamily: style.fontFamily,
        color: style.textColor,
        lineHeight: 1.15,
        wordBreak: 'break-word' as const,
        maxWidth: '720px',
        marginBottom: subtitle ? '16px' : '0',
      },
    }, project.name),
    subtitle ? React.createElement('div', {
      style: {
        fontSize: '24px',
        fontFamily: style.fontFamily,
        color: style.secondaryTextColor,
        lineHeight: 1.45,
        wordBreak: 'break-word' as const,
        maxWidth: '640px',
        maxHeight: '84px',
        overflow: 'hidden',
      },
    }, subtitle) : null,
  )

  const accentColor = style.accentColor || style.textColor
  const accentElement = React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '120px',
      height: '120px',
      borderRadius: '24px',
      marginLeft: '60px',
      flexShrink: 0,
      backgroundColor: accentColor,
    },
  }, renderIconElement(icon, accentColor, 120))

  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: style.background,
      padding: '80px',
    },
  }, textBlock, accentElement)
}

// ========================================
// Layout: Centered Large Text
// ========================================

function renderCenteredLargeText(project: Project, style: ResolvedOgStyles) {
  const titleFontSize = getTitleFontSize(project.name, 'large')

  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: style.background,
      padding: '80px',
    },
  },
    React.createElement('div', {
      style: {
        fontSize: titleFontSize,
        fontWeight: style.fontWeight,
        fontFamily: style.fontFamily,
        color: style.textColor,
        textAlign: 'center' as const,
        lineHeight: 1.08,
        letterSpacing: '-2px',
        wordBreak: 'break-word' as const,
        maxWidth: '1080px',
      },
    }, project.name),
  )
}

// ========================================
// Layout: Grid Balanced
// ========================================

function renderGridBalanced(project: Project, style: ResolvedOgStyles, icon: OgIconRender) {
  const subtitle = getSubtitle(project)

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
        fontSize: getTitleFontSize(project.name, 'regular'),
        fontWeight: style.fontWeight || 400,
        fontFamily: style.fontFamily,
        color: style.textColor,
        lineHeight: 1.18,
        wordBreak: 'break-word' as const,
        maxWidth: '640px',
        marginBottom: subtitle ? '16px' : '0',
      },
    }, project.name),
    subtitle ? React.createElement('div', {
      style: {
        fontSize: '22px',
        fontFamily: style.fontFamily,
        color: style.secondaryTextColor,
        lineHeight: 1.45,
        wordBreak: 'break-word' as const,
        maxHeight: '84px',
        overflow: 'hidden',
      },
    }, subtitle) : null,
  )

  const rightColumn = React.createElement(
    'div',
    {
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
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          width: '200px',
          height: '200px',
          borderRadius: '20px',
          backgroundColor: style.accentColor || '#E5E7EB',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
      },
      renderIconElement(icon, style.accentColor || '#E5E7EB', 140),
    ),
  )

  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: style.background,
      padding: '80px',
    },
  }, leftColumn, rightColumn)
}
