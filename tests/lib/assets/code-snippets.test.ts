import { describe, it, expect } from 'vitest'
import { generateCodeSnippets } from '@/lib/assets/code-snippets'
import type { Project } from '@/types/database'

function createProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p1',
    user_id: 'u1',
    brand_profile_id: null,
    style_preset_id: 's1',
    name: "O'Brien \\ <App>",
    description: 'Best "app" & <platform>',
    platform: 'all',
    mobile_target: 'both',
    primary_color_override: null,
    icon_type: 'text',
    icon_value: 'OA',
    ai_headline: null,
    ai_tagline: `It's "great"`,
    ai_og_description: null,
    ai_short_slogan: null,
    assets_zip_url: null,
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('generateCodeSnippets', () => {
  it('should escape TS and XML/HTML special characters', async () => {
    const snippets = await generateCodeSnippets({ project: createProject() })

    const nextjs = snippets['snippets/nextjs-metadata.ts'].toString('utf8')
    const html = snippets['snippets/html-head.html'].toString('utf8')
    const plist = snippets['snippets/ios-info.plist'].toString('utf8')
    const androidXml = snippets['snippets/android-strings.xml'].toString('utf8')

    expect(nextjs).toContain("title: 'O\\'Brien \\\\ <App>'")
    expect(nextjs).toContain("description: 'Best \"app\" & <platform>'")

    expect(html).toContain('<title>O&#39;Brien \\ &lt;App&gt;</title>')
    expect(html).toContain('content="Best &quot;app&quot; &amp; &lt;platform&gt;"')

    expect(plist).toContain('<string>O&#39;Brien \\ &lt;App&gt;</string>')
    expect(androidXml).toContain('<string name="app_name">O&#39;Brien \\ &lt;App&gt;</string>')
  })
})
