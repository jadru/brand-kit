import sharp from 'sharp'
import { getContrastColor } from './colors'
import type { Project, StylePreset } from '@/types/database'

export interface IconSource {
  type: 'text' | 'svg' | 'image'
  value?: string
  buffer?: Buffer
}

export function generateTextSVG(
  text: string,
  bgColor: string,
  textColor: string,
  cornerRadius: number
): string {
  const normalizedText = text.trim().toUpperCase().slice(0, 2)
  const fontSize = normalizedText.length > 1 ? 46 : 60

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${cornerRadius}" fill="${bgColor}" />
  <text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-size="${fontSize}" font-weight="900" fill="${textColor}">${normalizedText}</text>
</svg>`
}

const ICON_PNG_OPTIONS = {
  compressionLevel: 9,
  palette: true,
  quality: 100,
} as const

export async function renderIconToBuffer(
  iconSource: IconSource,
  size: number,
  project: Project,
  stylePreset: StylePreset
): Promise<Buffer> {
  const color = project.primary_color_override || '#000000'
  const radius = stylePreset.corner_radius

  if (iconSource.type === 'text') {
    const svg = generateTextSVG(iconSource.value!, color, getContrastColor(color), radius)
    return sharp(Buffer.from(svg))
      .resize(size, size)
      .png(ICON_PNG_OPTIONS)
      .toBuffer()
  }

  if (iconSource.type === 'svg') {
    return sharp(iconSource.buffer!)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png(ICON_PNG_OPTIONS)
      .toBuffer()
  }

  // image type (AI generated)
  return sharp(iconSource.buffer!)
    .resize(size, size, { fit: 'cover' })
    .png(ICON_PNG_OPTIONS)
    .toBuffer()
}

export async function validateImage(buf: Buffer, w: number, h: number, label: string): Promise<void> {
  if (buf.length === 0) {
    throw new Error(`${label}: empty buffer`)
  }

  const metadata = await sharp(buf).metadata()
  if (metadata.width !== w || metadata.height !== h) {
    throw new Error(`${label}: ${metadata.width}x${metadata.height}, expected ${w}x${h}`)
  }
}
