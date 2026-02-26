import type { Project } from '@/types/database'

function escTsString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
}

function escXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function generateCodeSnippets(input: { project: Project }) {
  const { project } = input
  const snippets: Record<string, string> = {}
  const desc = project.ai_og_description || project.description || ''
  const safeNameTs = escTsString(project.name)
  const safeDescTs = escTsString(desc)
  const safeTaglineTs = escTsString(project.ai_tagline || '')
  const safeNameXml = escXml(project.name)
  const safeDescXml = escXml(desc)

  snippets['nextjs-metadata.ts'] = [
    '// app/layout.tsx',
    "import type { Metadata } from 'next'",
    '',
    'export const metadata: Metadata = {',
    `  title: '${safeNameTs}',`,
    `  description: '${safeDescTs}',`,
    '  icons: {',
    "    icon: '/favicon.svg',",
    "    apple: '/apple-touch-icon.png',",
    '  },',
    '  openGraph: {',
    `    title: '${safeNameTs}',`,
    `    description: '${safeDescTs}',`,
    "    images: ['/og.png'],",
    '  },',
    '  twitter: {',
    "    card: 'summary_large_image',",
    `    title: '${safeNameTs}',`,
    `    description: '${safeTaglineTs}',`,
    "    images: ['/twitter-card.png'],",
    '  },',
    '}',
  ].join('\n')

  snippets['html-head.html'] = [
    '<!-- index.html -->',
    '<head>',
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `  <title>${safeNameXml}</title>`,
    `  <meta name="description" content="${safeDescXml}" />`,
    '  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />',
    '  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
    `  <meta property="og:title" content="${safeNameXml}" />`,
    `  <meta property="og:description" content="${safeDescXml}" />`,
    '  <meta property="og:image" content="/og.png" />',
    '  <meta name="twitter:card" content="summary_large_image" />',
    '  <meta name="twitter:image" content="/twitter-card.png" />',
    '  <link rel="manifest" href="/manifest.json" />',
    '</head>',
  ].join('\n')

  if (project.mobile_target === 'ios' || project.mobile_target === 'both') {
    snippets['ios-info.plist'] = [
      '<!-- ios/App/App/Info.plist -->',
      '<key>CFBundleDisplayName</key>',
      `<string>${safeNameXml}</string>`,
      '<key>CFBundleName</key>',
      `<string>${safeNameXml}</string>`,
    ].join('\n')
  }

  if (project.mobile_target === 'android' || project.mobile_target === 'both') {
    snippets['android-strings.xml'] = [
      '<!-- android/app/src/main/res/values/strings.xml -->',
      '<resources>',
      `  <string name="app_name">${safeNameXml}</string>`,
      '</resources>',
    ].join('\n')
  }

  return Object.fromEntries(
    Object.entries(snippets).map(([filename, content]) => [
      `snippets/${filename}`,
      Buffer.from(content),
    ])
  )
}
