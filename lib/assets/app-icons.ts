import sharp from 'sharp'
import { ANDROID_MIPMAP_SIZES, ANDROID_ADAPTIVE_SIZES, IOS_ICON_SIZES } from './constants'
import { renderIconToBuffer, type IconSource } from '@/lib/utils/image'
import { hexToRgb } from '@/lib/utils/colors'
import type { Project, StylePreset, MobileTarget } from '@/types/database'

interface AppIconInput {
  iconSource: IconSource
  project: Project
  stylePreset: StylePreset
  mobileTarget: MobileTarget | null
}

export async function generateAppIcons(input: AppIconInput) {
  const { iconSource, project, stylePreset, mobileTarget } = input
  const results: Record<string, Buffer> = {}
  const baseImage = await renderIconToBuffer(iconSource, 1024, project, stylePreset)
  const bgColorHex = project.primary_color_override || '#FFFFFF'
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
      results[`android/mipmap-${density}/ic_launcher_background.png`] =
        await sharp({ create: { width: size, height: size, channels: 4, background: { ...bgRgb, alpha: 255 } } })
          .png().toBuffer()
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
