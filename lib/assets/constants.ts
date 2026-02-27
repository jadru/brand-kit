export const FAVICON_SIZES = {
  png: [16, 32, 48, 180] as const,
  ico: [16, 32, 48] as const,
}

export const PWA_ICON_SIZES = [192, 512] as const

export const ANDROID_MIPMAP_SIZES: Record<string, number> = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
}

export const ANDROID_ADAPTIVE_SIZES: Record<string, Record<string, number>> = {
  foreground: { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 },
  background: { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 },
}

export const IOS_ICON_SIZES = [
  { size: 20, scales: [2, 3], idiom: 'iphone' },
  { size: 29, scales: [2, 3], idiom: 'iphone' },
  { size: 40, scales: [2, 3], idiom: 'iphone' },
  { size: 60, scales: [2, 3], idiom: 'iphone' },
  { size: 20, scales: [1, 2], idiom: 'ipad' },
  { size: 29, scales: [1, 2], idiom: 'ipad' },
  { size: 40, scales: [1, 2], idiom: 'ipad' },
  { size: 76, scales: [1, 2], idiom: 'ipad' },
  { size: 83.5, scales: [2], idiom: 'ipad' },
  { size: 1024, scales: [1], idiom: 'ios-marketing' },
] as const

export const OG_IMAGE_SIZES = {
  og: { width: 1200, height: 630 },
  twitter: { width: 1200, height: 600 },
} as const

export const SPLASH_SIZES = [
  { width: 1170, height: 2532, name: 'iphone-13-pro' },
  { width: 1284, height: 2778, name: 'iphone-13-pro-max' },
  { width: 1179, height: 2556, name: 'iphone-15-pro' },
  { width: 1290, height: 2796, name: 'iphone-15-pro-max' },
  { width: 1125, height: 2436, name: 'iphone-x' },
  { width: 828, height: 1792, name: 'iphone-xr' },
  { width: 1242, height: 2688, name: 'iphone-xs-max' },
  { width: 1242, height: 2208, name: 'iphone-8-plus' },
  { width: 750, height: 1334, name: 'iphone-8' },
  { width: 640, height: 1136, name: 'iphone-se' },
  { width: 2048, height: 2732, name: 'ipad-pro-12.9' },
  { width: 1668, height: 2388, name: 'ipad-pro-11' },
  { width: 1536, height: 2048, name: 'ipad-mini' },
  { width: 480, height: 800, name: 'android-mdpi' },
  { width: 720, height: 1280, name: 'android-hdpi' },
  { width: 1080, height: 2340, name: 'android-tall' },
  { width: 1440, height: 3200, name: 'android-tall-xxxhdpi' },
  { width: 1080, height: 1920, name: 'android-xxhdpi' },
  { width: 1440, height: 2560, name: 'android-xxxhdpi' },
] as const
