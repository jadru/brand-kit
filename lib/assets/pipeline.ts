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

/**
 * 에셋 생성 파이프라인
 *
 * 최적화 전략:
 * - 경량 작업 (PWA manifest, code snippets): 병렬 실행
 * - 이미지 생성 작업 (favicons, OG images, app icons): 메모리 관리를 위해 순차 실행
 */
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
  const warnings: string[] = []

  const isWeb = project.platform === 'web' || project.platform === 'all'
  const isMobile = project.platform === 'mobile' || project.platform === 'all'

  // Phase 1: 경량 작업 병렬 실행 (메모리 사용량 적음)
  const lightweightTasks: Promise<void>[] = []

  if (isWeb) {
    lightweightTasks.push(
      generatePWAManifest({ project }).then((r) => {
        results.pwaManifest = r
      })
    )
  }

  lightweightTasks.push(
    generateCodeSnippets({ project }).then((r) => {
      results.codeSnippets = r
    })
  )

  // Phase 2: 이미지 생성 작업 순차 실행 (메모리 관리)
  // 경량 작업과 병렬로 시작하되, 이미지 작업끼리는 순차 실행
  const imageTask = (async () => {
    if (isWeb) {
      results.favicons = await generateFavicons({ iconSource, project, brandProfile, stylePreset })
      const ogResult = await generateOgImages({ project, brandProfile, stylePreset })
      results.ogImages = ogResult.files
      warnings.push(...ogResult.warnings)
    }

    if (isMobile) {
      results.appIcons = await generateAppIcons({
        iconSource,
        project,
        brandProfile,
        stylePreset,
        mobileTarget: project.mobile_target,
      })
      results.splashScreens = await generateSplashScreens({
        iconSource,
        project,
        brandProfile,
        stylePreset,
        mobileTarget: project.mobile_target,
      })
    }
  })()

  // 모든 작업 완료 대기
  await Promise.all([...lightweightTasks, imageTask])

  const zipBuffer = await createZip({ project, results })
  const storageUrl = await uploadToStorage({
    userId,
    projectId: project.id,
    buffer: zipBuffer,
    filename: 'assets.zip',
  })

  return { storageUrl, results, warnings }
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
