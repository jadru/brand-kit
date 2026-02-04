import sharp from 'sharp'
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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${cornerRadius}" fill="${bgColor}" />
  <text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-size="${text.length > 1 ? 36 : 50}" font-weight="bold" fill="${textColor}">${text}</text>
</svg>`
}

export async function renderIconToBuffer(
  iconSource: IconSource,
  size: number,
  project: Project,
  stylePreset: StylePreset
): Promise<Buffer> {
  const color = project.primary_color_override || '#000000'
  const radius = stylePreset.corner_radius

  if (iconSource.type === 'text') {
    const svg = generateTextSVG(iconSource.value!, color, '#FFFFFF', radius)
    return sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toBuffer()
  }

  if (iconSource.type === 'svg') {
    return sharp(iconSource.buffer!)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  }

  // image type (AI generated)
  return sharp(iconSource.buffer!)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toBuffer()
}
