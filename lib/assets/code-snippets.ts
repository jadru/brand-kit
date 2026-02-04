import type { Project } from '@/types/database'

export async function generateCodeSnippets(input: { project: Project }) {
  const { project } = input
  const snippets: Record<string, string> = {}
  const desc = project.ai_og_description || project.description || ''

  snippets['nextjs-metadata.ts'] = [
    '// app/layout.tsx',
    "import type { Metadata } from 'next'",
    '',
    'export const metadata: Metadata = {',
    `  title: '${project.name}',`,
    `  description: '${desc}',`,
    '  icons: {',
    "    icon: '/favicon.svg',",
    "    apple: '/apple-touch-icon.png',",
    '  },',
    '  openGraph: {',
    `    title: '${project.name}',`,
    `    description: '${desc}',`,
    "    images: ['/og.png'],",
    '  },',
    '  twitter: {',
    "    card: 'summary_large_image',",
    `    title: '${project.name}',`,
    `    description: '${project.ai_tagline || ''}',`,
    "    images: ['/twitter-card.png'],",
    '  },',
    '}',
  ].join('\n')

  snippets['html-head.html'] = [
    '<!-- index.html -->',
    '<head>',
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `  <title>${project.name}</title>`,
    `  <meta name="description" content="${desc}" />`,
    '  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />',
    '  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
    `  <meta property="og:title" content="${project.name}" />`,
    `  <meta property="og:description" content="${desc}" />`,
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
      `<string>${project.name}</string>`,
      '<key>CFBundleName</key>',
      `<string>${project.name}</string>`,
    ].join('\n')
  }

  if (project.mobile_target === 'android' || project.mobile_target === 'both') {
    snippets['android-strings.xml'] = [
      '<!-- android/app/src/main/res/values/strings.xml -->',
      '<resources>',
      `  <string name="app_name">${project.name}</string>`,
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
