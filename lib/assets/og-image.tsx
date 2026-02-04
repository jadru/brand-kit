import satori from 'satori'
import sharp from 'sharp'
import { readFile } from 'fs/promises'
import path from 'path'
import { OG_IMAGE_SIZES } from './constants'
import { getContrastColor } from '@/lib/utils/colors'
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

  let fontData: Buffer
  try {
    fontData = await readFile(path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf'))
  } catch {
    // Fallback: use a system-like default if font not available
    fontData = Buffer.alloc(0)
  }

  const fonts = fontData.length > 0
    ? [{ name: 'Inter', data: fontData, weight: 700 as const, style: 'normal' as const }]
    : []

  // OG Image (1200x630)
  const ogSvg = await satori(
    renderOgTemplate(project, brandProfile),
    { width: OG_IMAGE_SIZES.og.width, height: OG_IMAGE_SIZES.og.height, fonts }
  )
  results['og.png'] = await sharp(Buffer.from(ogSvg)).png().toBuffer()

  // Twitter Card (1200x600)
  const twitterSvg = await satori(
    renderOgTemplate(project, brandProfile),
    { width: OG_IMAGE_SIZES.twitter.width, height: OG_IMAGE_SIZES.twitter.height, fonts }
  )
  results['twitter-card.png'] = await sharp(Buffer.from(twitterSvg)).png().toBuffer()

  return results
}

function renderOgTemplate(
  project: Project,
  brandProfile: BrandProfile | null,
) {
  const bgColor = project.primary_color_override || brandProfile?.primary_color || '#000000'
  const textColor = getContrastColor(bgColor)

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
        fontSize: '64px',
        fontWeight: 700,
        color: textColor,
        textAlign: 'center' as const,
        marginBottom: '24px',
      },
    }, project.name),
    React.createElement('div', {
      style: {
        fontSize: '32px',
        color: textColor,
        opacity: 0.9,
        textAlign: 'center' as const,
      },
    }, project.ai_headline || project.description || '')
  )
}
