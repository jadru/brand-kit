import sharp from 'sharp'
import { ANDROID_MIPMAP_SIZES, ANDROID_ADAPTIVE_SIZES, IOS_ICON_SIZES } from './constants'
import { renderIconToBuffer, type IconSource } from '@/lib/utils/image'
import { hexToRgb } from '@/lib/utils/colors'
import { resolveSplashStyles } from './style-resolver'
import type { Project, StylePreset, BrandProfile, MobileTarget } from '@/types/database'

interface AppIconInput {
  iconSource: IconSource
  project: Project
  brandProfile: BrandProfile | null
  stylePreset: StylePreset
  mobileTarget: MobileTarget | null
}

export async function generateAppIcons(input: AppIconInput) {
  const { iconSource, project, brandProfile, stylePreset, mobileTarget } = input
  const results: Record<string, Buffer> = {}
  const baseImage = await renderIconToBuffer(iconSource, 1024, project, stylePreset, brandProfile)

  const resolved = resolveSplashStyles(stylePreset, brandProfile, project)
  const bgColorHex = resolved.background.color1
  const bgRgb = hexToRgb(bgColorHex)

  // Android
  if (mobileTarget === 'android' || mobileTarget === 'both') {
    for (const [density, size] of Object.entries(ANDROID_MIPMAP_SIZES)) {
      results[`android/mipmap-${density}/ic_launcher.png`] =
        await sharp(baseImage).resize(size, size).png().toBuffer()
    }
    for (const [density, size] of Object.entries(ANDROID_ADAPTIVE_SIZES.foreground)) {
      results[`android/mipmap-${density}/ic_launcher_foreground.png`] =
        await sharp(baseImage).resize(size, size).png().toBuffer()

      // Adaptive background: gradient or solid based on style
      let bgBuffer: Buffer
      if (resolved.background.type === 'gradient' && resolved.background.color2) {
        const gradientSvg = Buffer.from(
          `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${resolved.background.color1}"/>
              <stop offset="100%" stop-color="${resolved.background.color2}"/>
            </linearGradient></defs>
            <rect width="${size}" height="${size}" fill="url(#bg)"/>
          </svg>`
        )
        bgBuffer = await sharp(gradientSvg).png().toBuffer()
      } else {
        bgBuffer = await sharp({
          create: { width: size, height: size, channels: 4, background: { ...bgRgb, alpha: 255 } },
        }).png().toBuffer()
      }
      results[`android/mipmap-${density}/ic_launcher_background.png`] = bgBuffer
    }
  }

  // iOS
  if (mobileTarget === 'ios' || mobileTarget === 'both') {
    for (const { size, scales } of IOS_ICON_SIZES) {
      for (const scale of scales) {
        const pixelSize = Math.round(size * scale)
        results[`ios/AppIcon.appiconset/icon-${size}@${scale}x.png`] =
          await sharp(baseImage).resize(pixelSize, pixelSize).png().toBuffer()
      }
    }
    results['ios/AppIcon.appiconset/Contents.json'] = Buffer.from(
      JSON.stringify(generateContentsJson(), null, 2)
    )
  }

  return results
}

function generateContentsJson() {
  return {
    images: IOS_ICON_SIZES.flatMap(({ size, scales, idiom }) =>
      scales.map((scale) => ({
        size: `${size}x${size}`,
        idiom,
        filename: `icon-${size}@${scale}x.png`,
        scale: `${scale}x`,
      }))
    ),
    info: { version: 1, author: 'brandkit' },
  }
}
