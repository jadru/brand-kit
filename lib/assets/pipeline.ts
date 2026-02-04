import { generateFavicons } from './favicon'
import { generateOgImages } from './og-image'
import { generateAppIcons } from './app-icons'
import { generateSplashScreens } from './splash-screen'
import { generatePWAManifest } from './pwa-manifest'
import { generateCodeSnippets } from './code-snippets'
import { createZip } from './zip-packager'
import { uploadToStorage } from '@/lib/supabase/storage'
import { type IconSource } from '@/lib/utils/image'
import type { Project, BrandProfile, StylePreset } from '@/types/database'

interface PipelineInput {
  project: Project
  brandProfile: BrandProfile | null
  stylePreset: StylePreset
  userId: string
}

export async function runAssetPipeline(input: PipelineInput) {
  const { project, brandProfile, stylePreset, userId } = input
  const iconSource = await resolveIconSource(project)

  const results = {
    favicons: null as Record<string, Buffer> | null,
    ogImages: null as Record<string, Buffer> | null,
    appIcons: null as Record<string, Buffer> | null,
    splashScreens: null as Record<string, Buffer> | null,
    pwaManifest: null as Record<string, Buffer> | null,
    codeSnippets: null as Record<string, Buffer> | null,
  }

  // Sequential to manage memory
  if (project.platform === 'web' || project.platform === 'all') {
    results.favicons = await generateFavicons({ iconSource, project, stylePreset })
    results.ogImages = await generateOgImages({ project, brandProfile, stylePreset })
    results.pwaManifest = await generatePWAManifest({ project })
  }

  if (project.platform === 'mobile' || project.platform === 'all') {
    results.appIcons = await generateAppIcons({
      iconSource, project, stylePreset,
      mobileTarget: project.mobile_target,
    })
    results.splashScreens = await generateSplashScreens({
      iconSource, project, stylePreset,
      mobileTarget: project.mobile_target,
    })
  }

  results.codeSnippets = await generateCodeSnippets({ project })

  const zipBuffer = await createZip({ project, results })
  const storageUrl = await uploadToStorage({
    userId, projectId: project.id, buffer: zipBuffer, filename: 'assets.zip',
  })

  return { storageUrl, results }
}

async function resolveIconSource(project: Project): Promise<IconSource> {
  if (project.icon_type === 'text') {
    return { type: 'text', value: project.icon_value! }
  }

  if (project.icon_type === 'symbol') {
    // Symbol icons use Lucide components at render time.
    // For asset generation, render the symbol as a simple circle + letter fallback.
    return { type: 'text', value: project.icon_value?.charAt(0)?.toUpperCase() || 'S' }
  }

  // AI generated image
  const response = await fetch(project.icon_value!)
  const buffer = Buffer.from(await response.arrayBuffer())
  return { type: 'image', buffer }
}
