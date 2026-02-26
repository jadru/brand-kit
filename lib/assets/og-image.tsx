import satori from 'satori'
import sharp from 'sharp'
import { readFile } from 'fs/promises'
import path from 'path'
import { OG_IMAGE_SIZES } from './constants'
import { getContrastColor } from '@/lib/utils/colors'
import { validateImage } from '@/lib/utils/image'
import type { Project, BrandProfile, StylePreset } from '@/types/database'
import React from 'react'

interface OgImageInput {
  project: Project
  brandProfile: BrandProfile | null
  stylePreset: StylePreset
}

export async function generateOgImages(input: OgImageInput) {
  const { project, brandProfile } = input
  const results: Record<string, Buffer> = {}
  const imagePngOptions = { compressionLevel: 9, effort: 10 } as const

  const fontPath = path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf')

  let fontData: Buffer
  try {
    fontData = await readFile(fontPath)
  } catch (err) {
    throw new Error(
      `Failed to load font file at public/fonts/Inter-Bold.ttf: ${err instanceof Error ? err.message : String(err)}`
    )
  }

  if (fontData.length === 0) {
    throw new Error('Font file public/fonts/Inter-Bold.ttf is empty')
  }

  const fonts = [{ name: 'Inter', data: fontData, weight: 700 as const, style: 'normal' as const }]

  // OG Image (1200x630)
  const ogSvg = await satori(
    renderOgTemplate(project, brandProfile),
    { width: OG_IMAGE_SIZES.og.width, height: OG_IMAGE_SIZES.og.height, fonts }
  )
  results['og.png'] = await sharp(Buffer.from(ogSvg)).png(imagePngOptions).toBuffer()
  await validateImage(results['og.png'], OG_IMAGE_SIZES.og.width, OG_IMAGE_SIZES.og.height, 'og.png')

  // Twitter Card (1200x600)
  const twitterSvg = await satori(
    renderOgTemplate(project, brandProfile),
    { width: OG_IMAGE_SIZES.twitter.width, height: OG_IMAGE_SIZES.twitter.height, fonts }
  )
  results['twitter-card.png'] = await sharp(Buffer.from(twitterSvg)).png(imagePngOptions).toBuffer()
  return results
}

function getTitleFontSize(title: string): string {
  const length = title.trim().length
  if (length <= 15) return '72px'
  if (length <= 30) return '56px'
  if (length <= 50) return '44px'
  return '36px'
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}

function renderOgTemplate(
  project: Project,
  brandProfile: BrandProfile | null,
) {
  const bgColor = project.primary_color_override || brandProfile?.primary_color || '#000000'
  const textColor = getContrastColor(bgColor)
  const titleFontSize = getTitleFontSize(project.name)
  const subtitle = truncateText(project.ai_headline || project.description || '', 120)

  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: bgColor,
      padding: '80px',
    },
  },
    React.createElement('div', {
      style: {
        fontSize: titleFontSize,
        fontWeight: 700,
        color: textColor,
        textAlign: 'center' as const,
        lineHeight: 1.1,
        wordBreak: 'break-word' as const,
        marginBottom: '24px',
        maxWidth: '1040px',
      },
    }, project.name),
    React.createElement('div', {
      style: {
        fontSize: '30px',
        lineHeight: 1.25,
        color: textColor,
        opacity: 0.9,
        textAlign: 'center' as const,
        wordBreak: 'break-word' as const,
        maxWidth: '980px',
        maxHeight: '80px',
        overflow: 'hidden',
      },
    }, subtitle)
  )
}
