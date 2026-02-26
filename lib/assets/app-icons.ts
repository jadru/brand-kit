import sharp from 'sharp'
import { ANDROID_MIPMAP_SIZES, ANDROID_ADAPTIVE_SIZES, IOS_ICON_SIZES } from './constants'
import { renderIconToBuffer, validateImage, type IconSource } from '@/lib/utils/image'
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
  const iconPngOptions = { compressionLevel: 9, palette: true, quality: 100 } as const
  const imagePngOptions = { compressionLevel: 9, effort: 10 } as const

  const baseImage = await renderIconToBuffer(iconSource, 1024, project, stylePreset)
  const bgColorHex = project.primary_color_override || '#FFFFFF'
  const bgRgb = hexToRgb(bgColorHex)

  // Android
  if (mobileTarget === 'android' || mobileTarget === 'both') {
    for (const [density, size] of Object.entries(ANDROID_MIPMAP_SIZES)) {
      results[`android/mipmap-${density}/ic_launcher.png`] =
        await sharp(baseImage).resize(size, size).png(iconPngOptions).toBuffer()
    }

    for (const [density, size] of Object.entries(ANDROID_ADAPTIVE_SIZES.foreground)) {
      const safeZoneSize = Math.round(size * (66 / 108))
      const foregroundIcon = await sharp(baseImage)
        .resize(safeZoneSize, safeZoneSize)
        .png(iconPngOptions)
        .toBuffer()

      results[`android/mipmap-${density}/ic_launcher_foreground.png`] =
        await sharp({
          create: {
            width: size,
            height: size,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          },
        })
          .composite([{ input: foregroundIcon, gravity: 'centre' }])
          .png(iconPngOptions)
          .toBuffer()

      results[`android/mipmap-${density}/ic_launcher_background.png`] =
        await sharp({ create: { width: size, height: size, channels: 4, background: { ...bgRgb, alpha: 255 } } })
          .png(imagePngOptions)
          .toBuffer()
    }
  }

  // iOS
  if (mobileTarget === 'ios' || mobileTarget === 'both') {
    for (const { size, scales } of IOS_ICON_SIZES) {
      for (const scale of scales) {
        const pixelSize = Math.round(size * scale)
        results[`ios/AppIcon.appiconset/icon-${size}@${scale}x.png`] =
          await sharp(baseImage).resize(pixelSize, pixelSize).png(iconPngOptions).toBuffer()
      }
    }
    const iosMarketingIcon = results['ios/AppIcon.appiconset/icon-1024@1x.png']
    if (iosMarketingIcon) {
      await validateImage(iosMarketingIcon, 1024, 1024, 'ios/AppIcon.appiconset/icon-1024@1x.png')
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
