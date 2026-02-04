# Phase 06: 에셋 생성 파이프라인

## 목표

플랫폼별 모든 브랜드 에셋(Favicon, OG Image, App Icons, Splash, PWA Manifest, Code Snippets)을 생성하고 ZIP으로 패키징한 후 Supabase Storage에 업로드한다. Sharp로 이미지 처리, Satori로 OG 이미지, JSZip으로 패키징을 구현한다.

---

## 생성/수정 파일 목록

| 파일 경로 | 작업 | 설명 |
|-----------|------|------|
| `app/api/assets/generate/route.ts` | 생성 | 에셋 생성 API (메인 오케스트레이터) |
| `lib/assets/pipeline.ts` | 생성 | 전체 파이프라인 조율 |
| `lib/assets/favicon.ts` | 생성 | Favicon 생성 (SVG, PNG, ICO) |
| `lib/assets/og-image.ts` | 생성 | OG 이미지 + Twitter Card |
| `lib/assets/app-icons.ts` | 생성 | iOS/Android 앱 아이콘 |
| `lib/assets/splash-screen.ts` | 생성 | Splash 스크린 |
| `lib/assets/pwa-manifest.ts` | 생성 | PWA manifest.json |
| `lib/assets/code-snippets.ts` | 생성 | 코드 스니펫 생성 |
| `lib/assets/zip-packager.ts` | 생성 | ZIP 패키징 |
| `lib/assets/constants.ts` | 생성 | 사이즈 매트릭스 상수 |
| `lib/utils/image.ts` | 생성 | Sharp 유틸 함수 |
| `lib/utils/colors.ts` | 생성 | 색상 유틸 함수 |
| `public/fonts/` | 생성 | OG 이미지용 폰트 파일 |

---

## 1. 에셋 사이즈 매트릭스

### 1.1 `lib/assets/constants.ts`

```typescript
// ── Favicon ──
export const FAVICON_SIZES = {
  svg: null,  // 벡터
  png: [16, 32, 48, 180],  // 180은 Apple Touch Icon
  ico: [16, 32, 48],  // multi-resolution ICO
}

// ── PWA Icons ──
export const PWA_ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

// ── Android App Icons (mipmap) ──
export const ANDROID_MIPMAP_SIZES = {
  'mdpi': 48,
  'hdpi': 72,
  'xhdpi': 96,
  'xxhdpi': 144,
  'xxxhdpi': 192,
}

// ── Android Adaptive Icon ──
export const ANDROID_ADAPTIVE_SIZES = {
  foreground: {
    'mdpi': 108,
    'hdpi': 162,
    'xhdpi': 216,
    'xxhdpi': 324,
    'xxxhdpi': 432,
  },
  background: {  // 동일 사이즈
    'mdpi': 108,
    'hdpi': 162,
    'xhdpi': 216,
    'xxhdpi': 324,
    'xxxhdpi': 432,
  },
}

// ── iOS App Icons ──
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
]

// ── OG Images ──
export const OG_IMAGE_SIZES = {
  og: { width: 1200, height: 630 },
  twitter: { width: 1200, height: 600 },
}

// ── Splash Screens ──
export const SPLASH_SIZES = [
  // iOS
  { width: 1170, height: 2532, name: 'iphone-13-pro' },
  { width: 1284, height: 2778, name: 'iphone-13-pro-max' },
  { width: 1125, height: 2436, name: 'iphone-x' },
  { width: 828, height: 1792, name: 'iphone-xr' },
  { width: 1242, height: 2688, name: 'iphone-xs-max' },
  { width: 1242, height: 2208, name: 'iphone-8-plus' },
  { width: 750, height: 1334, name: 'iphone-8' },
  { width: 640, height: 1136, name: 'iphone-se' },
  // iPad
  { width: 2048, height: 2732, name: 'ipad-pro-12.9' },
  { width: 1668, height: 2388, name: 'ipad-pro-11' },
  { width: 1536, height: 2048, name: 'ipad-mini' },
  // Android (common)
  { width: 1080, height: 1920, name: 'android-xxhdpi' },
  { width: 1440, height: 2560, name: 'android-xxxhdpi' },
]
```

---

## 2. 파이프라인 오케스트레이터

### 2.1 `lib/assets/pipeline.ts`

```typescript
import { generateFavicons } from './favicon'
import { generateOgImages } from './og-image'
import { generateAppIcons } from './app-icons'
import { generateSplashScreens } from './splash-screen'
import { generatePWAManifest } from './pwa-manifest'
import { generateCodeSnippets } from './code-snippets'
import { createZip } from './zip-packager'
import { uploadToStorage } from '@/lib/supabase/storage'
import type { Project, BrandProfile, StylePreset } from '@/types/database'

interface PipelineInput {
  project: Project
  brandProfile: BrandProfile | null
  stylePreset: StylePreset
  userId: string
}

export async function runAssetPipeline(input: PipelineInput) {
  const { project, brandProfile, stylePreset, userId } = input

  // 아이콘 소스 resolve
  const iconSource = await resolveIconSource(project)

  const results = {
    favicons: null as any,
    ogImages: null as any,
    appIcons: null as any,
    splashScreens: null as any,
    pwaManifest: null as any,
    codeSnippets: null as any,
  }

  // ── 순차 생성 (메모리 관리) ──
  // 병렬 생성 시 Sharp 메모리 스파이크 → OOM
  // 따라서 순차 처리 권장

  if (project.platform === 'web' || project.platform === 'all') {
    results.favicons = await generateFavicons({ iconSource, project, stylePreset })
    results.ogImages = await generateOgImages({ project, brandProfile, stylePreset })
    results.pwaManifest = await generatePWAManifest({ project, iconSource })
  }

  if (project.platform === 'mobile' || project.platform === 'all') {
    results.appIcons = await generateAppIcons({
      iconSource,
      project,
      stylePreset,
      mobileTarget: project.mobile_target,
    })
    results.splashScreens = await generateSplashScreens({
      iconSource,
      project,
      stylePreset,
      mobileTarget: project.mobile_target,
    })
  }

  results.codeSnippets = await generateCodeSnippets({ project, results })

  // ── ZIP 패키징 ──
  const zipBuffer = await createZip({ project, results })

  // ── Supabase Storage 업로드 ──
  const storageUrl = await uploadToStorage({
    userId,
    projectId: project.id,
    buffer: zipBuffer,
    filename: 'assets.zip',
  })

  return { storageUrl, results }
}

async function resolveIconSource(project: Project) {
  if (project.icon_type === 'text') {
    return {
      type: 'text' as const,
      value: project.icon_value!,
    }
  } else if (project.icon_type === 'symbol') {
    // SVG 파일 경로 → Buffer로 읽기
    const svgPath = `/public/icons/symbols/${project.icon_value}.svg`
    const svgBuffer = await fs.readFile(svgPath)
    return {
      type: 'svg' as const,
      buffer: svgBuffer,
    }
  } else {
    // AI 생성 이미지 URL → fetch
    const response = await fetch(project.icon_value!)
    const buffer = Buffer.from(await response.arrayBuffer())
    return {
      type: 'image' as const,
      buffer,
    }
  }
}
```

---

## 3. Favicon 생성

### 3.1 `lib/assets/favicon.ts`

```typescript
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { FAVICON_SIZES } from './constants'

interface FaviconInput {
  iconSource: IconSource
  project: Project
  stylePreset: StylePreset
}

export async function generateFavicons(input: FaviconInput) {
  const { iconSource, project, stylePreset } = input
  const results: Record<string, Buffer> = {}

  // ── SVG Favicon ──
  if (iconSource.type === 'text' || iconSource.type === 'svg') {
    const svgString = iconSource.type === 'text'
      ? generateTextSVG(iconSource.value, project, stylePreset)
      : iconSource.buffer.toString()

    results['favicon.svg'] = Buffer.from(svgString)
  }

  // ── PNG Favicons ──
  const baseImage = await renderIconToBuffer(iconSource, 512, project, stylePreset)

  for (const size of FAVICON_SIZES.png) {
    const resized = await sharp(baseImage)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()

    if (size === 180) {
      results['apple-touch-icon.png'] = resized
    } else {
      results[`favicon-${size}x${size}.png`] = resized
    }
  }

  // ── ICO Favicon (multi-resolution) ──
  const icoBuffers = await Promise.all(
    FAVICON_SIZES.ico.map(async (size) => {
      return sharp(baseImage)
        .resize(size, size)
        .png()
        .toBuffer()
    })
  )

  const icoBuffer = await pngToIco(icoBuffers)
  results['favicon.ico'] = icoBuffer

  return results
}

function generateTextSVG(
  text: string,
  project: Project,
  stylePreset: StylePreset
): string {
  const color = project.primary_color_override || '#000000'
  const radius = stylePreset.corner_radius

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="${radius}" fill="${color}" />
      <text
        x="50"
        y="50"
        text-anchor="middle"
        dominant-baseline="central"
        font-family="sans-serif"
        font-size="50"
        font-weight="bold"
        fill="white"
      >
        ${text}
      </text>
    </svg>
  `.trim()
}
```

---

## 4. OG 이미지 생성 (Satori)

### 4.1 `lib/assets/og-image.ts`

```typescript
import satori from 'satori'
import sharp from 'sharp'
import { readFile } from 'fs/promises'
import { OG_IMAGE_SIZES } from './constants'

interface OgImageInput {
  project: Project
  brandProfile: BrandProfile | null
  stylePreset: StylePreset
}

export async function generateOgImages(input: OgImageInput) {
  const { project, brandProfile, stylePreset } = input
  const results: Record<string, Buffer> = {}

  // 폰트 로드 (Inter)
  const fontData = await readFile('./public/fonts/Inter-Bold.ttf')

  // ── OG Image (1200x630) ──
  const ogSvg = await satori(
    renderOgTemplate(project, brandProfile, stylePreset),
    {
      width: OG_IMAGE_SIZES.og.width,
      height: OG_IMAGE_SIZES.og.height,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  )

  const ogPng = await sharp(Buffer.from(ogSvg)).png().toBuffer()
  results['og.png'] = ogPng

  // ── Twitter Card (1200x600) ──
  const twitterSvg = await satori(
    renderTwitterTemplate(project, brandProfile, stylePreset),
    {
      width: OG_IMAGE_SIZES.twitter.width,
      height: OG_IMAGE_SIZES.twitter.height,
      fonts: [{ name: 'Inter', data: fontData, weight: 700, style: 'normal' }],
    }
  )

  const twitterPng = await sharp(Buffer.from(twitterSvg)).png().toBuffer()
  results['twitter-card.png'] = twitterPng

  return results
}

function renderOgTemplate(
  project: Project,
  brandProfile: BrandProfile | null,
  stylePreset: StylePreset
) {
  const bgColor = project.primary_color_override || brandProfile?.primary_color || '#000000'
  const textColor = '#FFFFFF'

  // Satori JSX (Flexbox 기반, Grid 미지원)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: bgColor,
        padding: '80px',
      }}
    >
      <div
        style={{
          fontSize: '64px',
          fontWeight: 700,
          color: textColor,
          textAlign: 'center',
          marginBottom: '24px',
        }}
      >
        {project.name}
      </div>
      <div
        style={{
          fontSize: '32px',
          color: textColor,
          opacity: 0.9,
          textAlign: 'center',
        }}
      >
        {project.ai_headline || project.description}
      </div>
    </div>
  )
}

function renderTwitterTemplate(
  project: Project,
  brandProfile: BrandProfile | null,
  stylePreset: StylePreset
) {
  // OG와 동일하지만 비율 조정
  return renderOgTemplate(project, brandProfile, stylePreset)
}
```

### 4.2 OG 이미지 폰트 준비

```
public/fonts/
├── Inter-Bold.ttf
├── Inter-Regular.ttf
└── Inter-SemiBold.ttf
```

**폰트 다운로드:** Google Fonts에서 Inter 폰트를 `.ttf` 형식으로 다운로드

---

## 5. 앱 아이콘 생성

### 5.1 `lib/assets/app-icons.ts`

```typescript
import sharp from 'sharp'
import { ANDROID_MIPMAP_SIZES, ANDROID_ADAPTIVE_SIZES, IOS_ICON_SIZES } from './constants'

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

  // ── Android ──
  if (mobileTarget === 'android' || mobileTarget === 'both') {
    // mipmap
    for (const [density, size] of Object.entries(ANDROID_MIPMAP_SIZES)) {
      const resized = await sharp(baseImage)
        .resize(size, size)
        .png()
        .toBuffer()
      results[`android/mipmap-${density}/ic_launcher.png`] = resized
    }

    // adaptive foreground/background
    for (const [density, size] of Object.entries(ANDROID_ADAPTIVE_SIZES.foreground)) {
      const fg = await sharp(baseImage)
        .resize(size, size)
        .png()
        .toBuffer()
      results[`android/mipmap-${density}/ic_launcher_foreground.png`] = fg

      // Background: 단색
      const bg = await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: project.primary_color_override || '#FFFFFF',
        },
      })
        .png()
        .toBuffer()
      results[`android/mipmap-${density}/ic_launcher_background.png`] = bg
    }
  }

  // ── iOS ──
  if (mobileTarget === 'ios' || mobileTarget === 'both') {
    for (const { size, scales, idiom } of IOS_ICON_SIZES) {
      for (const scale of scales) {
        const pixelSize = size * scale
        const resized = await sharp(baseImage)
          .resize(pixelSize, pixelSize)
          .png()
          .toBuffer()

        const filename = `ios/AppIcon.appiconset/icon-${size}@${scale}x.png`
        results[filename] = resized
      }
    }

    // Contents.json (iOS Asset Catalog)
    results['ios/AppIcon.appiconset/Contents.json'] = Buffer.from(
      JSON.stringify(generateContentsJson(IOS_ICON_SIZES), null, 2)
    )
  }

  return results
}

function generateContentsJson(sizes: typeof IOS_ICON_SIZES) {
  return {
    images: sizes.flatMap(({ size, scales, idiom }) =>
      scales.map((scale) => ({
        size: `${size}x${size}`,
        idiom,
        filename: `icon-${size}@${scale}x.png`,
        scale: `${scale}x`,
      }))
    ),
    info: {
      version: 1,
      author: 'brandkit',
    },
  }
}
```

---

## 6. Splash Screen 생성

### 6.1 `lib/assets/splash-screen.ts`

```typescript
import sharp from 'sharp'
import { SPLASH_SIZES } from './constants'

export async function generateSplashScreens(input: AppIconInput) {
  const { iconSource, project, stylePreset, mobileTarget } = input
  const results: Record<string, Buffer> = {}

  const iconSize = 200
  const iconBuffer = await renderIconToBuffer(iconSource, iconSize, project, stylePreset)

  for (const { width, height, name } of SPLASH_SIZES) {
    // 필터링 (mobileTarget)
    if (mobileTarget === 'android' && name.startsWith('iphone')) continue
    if (mobileTarget === 'android' && name.startsWith('ipad')) continue
    if (mobileTarget === 'ios' && name.startsWith('android')) continue

    const bgColor = project.primary_color_override || '#FFFFFF'

    const splash = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: bgColor,
      },
    })
      .composite([
        {
          input: iconBuffer,
          gravity: 'center',
        },
      ])
      .png()
      .toBuffer()

    results[`splash/${name}.png`] = splash
  }

  return results
}
```

---

## 7. PWA Manifest

### 7.1 `lib/assets/pwa-manifest.ts`

```typescript
export async function generatePWAManifest(input: {
  project: Project
  iconSource: IconSource
}) {
  const { project } = input

  const manifest = {
    name: project.name,
    short_name: project.ai_short_slogan || project.name.substring(0, 12),
    description: project.ai_og_description || project.description || '',
    start_url: '/',
    display: 'standalone',
    background_color: project.primary_color_override || '#FFFFFF',
    theme_color: project.primary_color_override || '#000000',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }

  return {
    'manifest.json': Buffer.from(JSON.stringify(manifest, null, 2)),
  }
}
```

---

## 8. 코드 스니펫

### 8.1 `lib/assets/code-snippets.ts`

```typescript
export async function generateCodeSnippets(input: {
  project: Project
  results: any
}) {
  const { project } = input
  const snippets: Record<string, string> = {}

  // ── Next.js (App Router) ──
  snippets['nextjs-metadata.ts'] = `
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${project.name}',
  description: '${project.ai_og_description || project.description || ''}',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: '${project.name}',
    description: '${project.ai_og_description || ''}',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '${project.name}',
    description: '${project.ai_tagline || ''}',
    images: ['/twitter-card.png'],
  },
}
`.trim()

  // ── React (CRA / Vite) ──
  snippets['react-helmet.tsx'] = `
// App.tsx
import { Helmet } from 'react-helmet'

<Helmet>
  <title>${project.name}</title>
  <meta name="description" content="${project.ai_og_description || ''}" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta property="og:image" content="/og.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="/twitter-card.png" />
</Helmet>
`.trim()

  // ── HTML (Static) ──
  snippets['html-head.html'] = `
<!-- index.html -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.name}</title>
  <meta name="description" content="${project.ai_og_description || ''}" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta property="og:title" content="${project.name}" />
  <meta property="og:description" content="${project.ai_og_description || ''}" />
  <meta property="og:image" content="/og.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="/twitter-card.png" />
  <link rel="manifest" href="/manifest.json" />
</head>
`.trim()

  // ── iOS Info.plist ──
  if (project.mobile_target === 'ios' || project.mobile_target === 'both') {
    snippets['ios-info.plist'] = `
<!-- ios/App/App/Info.plist -->
<key>CFBundleDisplayName</key>
<string>${project.name}</string>
<key>CFBundleName</key>
<string>${project.name}</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
`.trim()
  }

  // ── Android strings.xml ──
  if (project.mobile_target === 'android' || project.mobile_target === 'both') {
    snippets['android-strings.xml'] = `
<!-- android/app/src/main/res/values/strings.xml -->
<resources>
  <string name="app_name">${project.name}</string>
</resources>
`.trim()
  }

  return Object.fromEntries(
    Object.entries(snippets).map(([filename, content]) => [
      `snippets/${filename}`,
      Buffer.from(content),
    ])
  )
}
```

---

## 9. ZIP 패키징

### 9.1 `lib/assets/zip-packager.ts`

```typescript
import JSZip from 'jszip'

export async function createZip(input: {
  project: Project
  results: any
}) {
  const { project, results } = input
  const zip = new JSZip()

  // ── Favicons ──
  if (results.favicons) {
    const faviconFolder = zip.folder('web/favicons')!
    for (const [filename, buffer] of Object.entries(results.favicons)) {
      faviconFolder.file(filename, buffer as Buffer)
    }
  }

  // ── OG Images ──
  if (results.ogImages) {
    const ogFolder = zip.folder('web/og-images')!
    for (const [filename, buffer] of Object.entries(results.ogImages)) {
      ogFolder.file(filename, buffer as Buffer)
    }
  }

  // ── PWA Manifest ──
  if (results.pwaManifest) {
    const pwaFolder = zip.folder('web/pwa')!
    for (const [filename, buffer] of Object.entries(results.pwaManifest)) {
      pwaFolder.file(filename, buffer as Buffer)
    }
  }

  // ── App Icons ──
  if (results.appIcons) {
    const iconFolder = zip.folder('mobile/icons')!
    for (const [path, buffer] of Object.entries(results.appIcons)) {
      iconFolder.file(path, buffer as Buffer)
    }
  }

  // ── Splash Screens ──
  if (results.splashScreens) {
    const splashFolder = zip.folder('mobile/splash')!
    for (const [path, buffer] of Object.entries(results.splashScreens)) {
      splashFolder.file(path, buffer as Buffer)
    }
  }

  // ── Code Snippets ──
  if (results.codeSnippets) {
    const codeFolder = zip.folder('code-snippets')!
    for (const [path, buffer] of Object.entries(results.codeSnippets)) {
      codeFolder.file(path, buffer as Buffer)
    }
  }

  // ── README ──
  zip.file('README.md', generateReadme(project))

  return await zip.generateAsync({ type: 'nodebuffer' })
}

function generateReadme(project: Project): string {
  return `
# ${project.name} - Brand Assets

Generated by BrandKit

## Contents

- **web/favicons/** - Favicon (SVG, PNG, ICO)
- **web/og-images/** - OG Image & Twitter Card
- **web/pwa/** - PWA Manifest
- **mobile/icons/** - iOS/Android App Icons
- **mobile/splash/** - Splash Screens
- **code-snippets/** - Framework-specific snippets

## Usage

Copy the assets to your project's public directory and use the code snippets for integration.

---

Generated on ${new Date().toISOString()}
`.trim()
}
```

---

## 10. Supabase Storage 업로드

### 10.1 `lib/supabase/storage.ts`

```typescript
import { supabaseAdmin } from './admin'

export async function uploadToStorage(params: {
  userId: string
  projectId: string
  buffer: Buffer
  filename: string
}) {
  const { userId, projectId, buffer, filename } = params
  const path = `${userId}/${projectId}/${filename}`

  const { data, error } = await supabaseAdmin.storage
    .from('project-assets')
    .upload(path, buffer, {
      contentType: 'application/zip',
      upsert: true,
    })

  if (error) throw error

  // Signed URL (24시간 유효)
  const { data: urlData } = await supabaseAdmin.storage
    .from('project-assets')
    .createSignedUrl(path, 86400)

  return urlData!.signedUrl
}
```

### 10.2 Supabase Storage 버킷 생성 (수동)

```sql
-- Supabase Dashboard > Storage > Create Bucket
-- Bucket name: project-assets
-- Public: false
```

**Storage Policy:**

```sql
-- 본인만 업로드
CREATE POLICY "Users can upload own assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 본인만 다운로드
CREATE POLICY "Users can download own assets"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 11. API Route (`app/api/assets/generate/route.ts`)

```typescript
export const maxDuration = 300  // Vercel Pro: 300초

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { projectId } = body

  // 프로젝트 조회
  const { data: project } = await supabase
    .from('projects')
    .select('*, brand_profiles(*), style_presets(*)')
    .eq('id', projectId)
    .single()

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  // 상태 업데이트: generating
  await supabase
    .from('projects')
    .update({ status: 'generating' })
    .eq('id', projectId)

  try {
    const { storageUrl } = await runAssetPipeline({
      project,
      brandProfile: project.brand_profiles,
      stylePreset: project.style_presets,
      userId: user.id,
    })

    // 상태 업데이트: completed + ZIP URL 저장
    await supabase
      .from('projects')
      .update({ status: 'completed', assets_zip_url: storageUrl })
      .eq('id', projectId)

    return NextResponse.json({ success: true, url: storageUrl })
  } catch (error) {
    await supabase
      .from('projects')
      .update({ status: 'failed' })
      .eq('id', projectId)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## 기술적 주의사항

### 1. Sharp 메모리 관리
- 순차 처리: 한 번에 하나씩 생성
- Buffer 즉시 해제: `buffer = null` 명시
- Vercel Pro 1GB 메모리 제한 고려

### 2. Satori 제약
- Flexbox만 지원 (Grid 미지원)
- 제한된 CSS 속성
- 폰트는 `.ttf`/`.woff` ArrayBuffer로 로드

### 3. ICO 생성
- `png-to-ico`는 multi-resolution ICO 지원
- 16, 32, 48px 세 가지 포함 권장

### 4. Supabase Storage Signed URL
- 만료 시간 설정 (86400초 = 24시간)
- 재다운로드 시 새 Signed URL 생성

---

## 검증 방법

### 검증 1: Favicon 생성

```
1. 텍스트 아이콘 "T" → favicon.svg, favicon.ico, 여러 PNG 생성
2. 심볼 아이콘 → SVG 컬러 적용 확인
3. ICO 파일: Windows에서 정상 표시
```

### 검증 2: OG 이미지

```
1. 프로젝트명 + 헤드라인 → 1200x630 PNG 생성
2. Twitter Card 1200x600 생성
3. Brand Profile 컬러 배경 적용
```

### 검증 3: 앱 아이콘

```
1. iOS: AppIcon.appiconset + Contents.json 확인
2. Android: mipmap-* 디렉토리별 PNG 확인
3. Adaptive Icon: foreground + background 분리
```

### 검증 4: ZIP 구조

```
web/
├── favicons/
├── og-images/
└── pwa/
mobile/
├── icons/
└── splash/
code-snippets/
README.md
```

### 검증 5: Supabase Storage

```
1. 업로드 성공 → Storage Browser에서 확인
2. Signed URL 다운로드 → ZIP 정상 압축 해제
3. RLS 정책: 다른 사용자 접근 차단
```
