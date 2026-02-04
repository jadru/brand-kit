'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
interface CodePreviewProps {
  project: {
    name: string
    platform: string
    mobile_target: string | null
    ai_og_description: string | null
    ai_tagline: string | null
    description: string | null
  }
}

const FRAMEWORKS = [
  { value: 'nextjs', label: 'Next.js (App Router)' },
  { value: 'html', label: 'HTML (Static)' },
] as const

function generateSnippet(framework: string, project: CodePreviewProps['project']): string {
  const desc = project.ai_og_description || project.description || ''

  if (framework === 'nextjs') {
    return `// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${project.name}',
  description: '${desc}',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: '${project.name}',
    description: '${desc}',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '${project.name}',
    description: '${project.ai_tagline || ''}',
    images: ['/twitter-card.png'],
  },
}`
  }

  return `<!-- index.html -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.name}</title>
  <meta name="description" content="${desc}" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta property="og:title" content="${project.name}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="/og.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="manifest" href="/manifest.json" />
</head>`
}

export function CodePreview({ project }: CodePreviewProps) {
  const [framework, setFramework] = useState('nextjs')
  const [copied, setCopied] = useState(false)

  const code = generateSnippet(framework, project)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-secondary">Code Snippets</h3>
        <Select
          value={framework}
          onValueChange={setFramework}
          options={FRAMEWORKS.map((f) => ({ value: f.value, label: f.label }))}
        />
      </div>

      <div className="relative">
        <pre className="overflow-x-auto rounded-lg border border-border bg-gray-950 p-4 text-sm text-gray-300">
          <code>{code}</code>
        </pre>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="absolute right-2 top-2 h-8 w-8 text-gray-400 hover:text-white"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
