import sharp from 'sharp'
import { SPLASH_SIZES } from './constants'
import { renderIconToBuffer, type IconSource } from '@/lib/utils/image'
import { hexToRgb } from '@/lib/utils/colors'
import { resolveSplashStyles } from './style-resolver'
import type { Project, StylePreset, BrandProfile, MobileTarget } from '@/types/database'

interface SplashInput {
  iconSource: IconSource
  project: Project
  brandProfile: BrandProfile | null
  stylePreset: StylePreset
  mobileTarget: MobileTarget | null
}

export async function generateSplashScreens(input: SplashInput) {
  const { iconSource, project, brandProfile, stylePreset, mobileTarget } = input
  const results: Record<string, Buffer> = {}
  const imagePngOptions = { compressionLevel: 9, effort: 10 } as const

  const iconSize = 200
  const iconBuffer = await renderIconToBuffer(iconSource, iconSize, project, stylePreset, brandProfile)
  const resolved = resolveSplashStyles(stylePreset, brandProfile, project)

  for (const { width, height, name } of SPLASH_SIZES) {
    if (mobileTarget === 'android' && (name.startsWith('iphone') || name.startsWith('ipad'))) continue
    if (mobileTarget === 'ios' && name.startsWith('android')) continue

    let bgBuffer: Buffer

    if (resolved.background.type === 'gradient' && resolved.background.color2) {
      // Create gradient background via SVG
      const gradientSvg = Buffer.from(
        `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${resolved.background.color1}"/>
              <stop offset="100%" stop-color="${resolved.background.color2}"/>
            </linearGradient>
          </defs>
          <rect width="${width}" height="${height}" fill="url(#bg)"/>
        </svg>`
      )
      bgBuffer = await sharp(gradientSvg).png().toBuffer()
    } else {
      // Solid background
      const bgRgb = hexToRgb(resolved.background.color1)
      bgBuffer = await sharp({
        create: { width, height, channels: 4, background: { ...bgRgb, alpha: 255 } },
      }).png().toBuffer()
    }

    results[`splash/${name}.png`] = await sharp(bgBuffer)
      .composite([{ input: iconBuffer, gravity: 'centre' }])
      .png(imagePngOptions)
      .toBuffer()
  }

  return results
}
