import sharp from 'sharp'
import type { Project, StylePreset, BrandProfile } from '@/types/database'
import { resolveIconStyles, type ResolvedIconStyles } from '@/lib/assets/style-resolver'
import { getContrastColor } from '@/lib/utils/colors'

export interface IconSource {
  type: 'text' | 'svg' | 'image'
  value?: string
  buffer?: Buffer
}

export function generateTextSVG(
  text: string,
  bgColor: string,
  textColor: string,
  cornerRadius: number,
  resolved?: ResolvedIconStyles,
): string {
  if (!resolved) {
    // Legacy path (no resolved styles)
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${cornerRadius}" fill="${bgColor}" />
  <text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-size="${text.length > 1 ? 36 : 50}" font-weight="bold" fill="${textColor}">${text}</text>
</svg>`
  }

  const defs: string[] = []
  if (resolved.background.defs) defs.push(resolved.background.defs)
  if (resolved.shadow.svgFilter) defs.push(resolved.shadow.svgFilter)

  const defsStr = defs.length > 0 ? `<defs>${defs.join('')}</defs>` : ''
  const filterAttr = resolved.shadow.svgFilterId ? ` filter="url(#${resolved.shadow.svgFilterId})"` : ''
  const fill = resolved.background.fill
  const tColor = resolved.textColor

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  ${defsStr}
  <rect width="100" height="100" rx="${cornerRadius}" fill="${fill}"${filterAttr} />
  <text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-size="${text.length > 1 ? 36 : 50}" font-weight="bold" fill="${tColor}">${text}</text>
</svg>`
}

export async function renderIconToBuffer(
  iconSource: IconSource,
  size: number,
  project: Project,
  stylePreset: StylePreset,
  brandProfile?: BrandProfile | null,
): Promise<Buffer> {
  const resolved = resolveIconStyles(stylePreset, brandProfile || null, project)
  const color = project.primary_color_override || brandProfile?.primary_color || '#000000'
  const radius = resolved.cornerRadius

  if (iconSource.type === 'text') {
    const textColor = resolved.background.type === 'dark'
      ? resolved.textColor
      : getContrastColor(color)
    const svg = generateTextSVG(iconSource.value!, color, textColor, radius, resolved)
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

  // image type (AI generated) - apply corner radius masking
  const resized = await sharp(iconSource.buffer!)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toBuffer()

  if (radius > 0) {
    // Scale corner radius proportionally (base 100 viewBox → target size)
    const scaledRadius = Math.round((radius / 100) * size)
    const maskSvg = Buffer.from(
      `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${scaledRadius}" fill="white"/></svg>`
    )
    return sharp(resized)
      .composite([{ input: maskSvg, blend: 'dest-in' }])
      .png()
      .toBuffer()
  }

  return resized
}
