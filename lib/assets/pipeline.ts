import { generateFavicons } from './favicon'
import { generateOgImages } from './og-image'
import { generateAppIcons } from './app-icons'
import { generateSplashScreens } from './splash-screen'
import { generatePWAManifest } from './pwa-manifest'
import { generateCodeSnippets } from './code-snippets'
import { createZip } from './zip-packager'
import { uploadToStorage } from '@/lib/supabase/storage'
import { logger } from '@/lib/utils/logger'
import { resolveProjectIconSource } from './icon-source'
import type { Project, BrandProfile, StylePreset, PipelineStage } from '@/types/database'

interface PipelineInput {
  project: Project
  brandProfile: BrandProfile | null
  stylePreset: StylePreset
  userId: string
  onStage?: (stage: PipelineStage) => void
}

/**
 * 에셋 생성 파이프라인
 *
 * 최적화 전략:
 * - 경량 작업 (PWA manifest, code snippets): 병렬 실행
 * - 이미지 생성 작업 (favicons, OG images, app icons): 메모리 관리를 위해 순차 실행
 */
export async function runAssetPipeline(input: PipelineInput) {
  const { project, brandProfile, stylePreset, userId, onStage } = input
  const pipelineStartedAt = Date.now()

  logger.info('asset.pipeline.start', {
    projectId: project.id,
    platform: project.platform,
    mobileTarget: project.mobile_target,
  })

  onStage?.('icon_resolve')
  const iconSource = await resolveProjectIconSource({ project, brandProfile, stylePreset })

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

  const lightweightTasks: Promise<void>[] = []

  if (isWeb) {
    lightweightTasks.push(
      generatePWAManifest({ project }).then((manifest) => {
        results.pwaManifest = manifest
      })
    )
  }

  lightweightTasks.push(
    generateCodeSnippets({ project }).then((snippets) => {
      results.codeSnippets = snippets
    })
  )

  const imageTask = (async () => {
    if (isWeb) {
      onStage?.('favicons')
      const faviconsStart = Date.now()
      results.favicons = await generateFavicons({ iconSource, project, brandProfile, stylePreset })
      logger.debug('asset.pipeline.favicons.done', {
        durationMs: Date.now() - faviconsStart,
        files: Object.keys(results.favicons).length,
      })

      onStage?.('og')
      const ogStart = Date.now()
      const ogResult = await generateOgImages({ project, brandProfile, stylePreset })
      results.ogImages = ogResult.files
      warnings.push(...ogResult.warnings)
      logger.debug('asset.pipeline.og.done', {
        durationMs: Date.now() - ogStart,
        files: Object.keys(results.ogImages).length,
      })
    }

    if (isMobile) {
      onStage?.('app_icons')
      const appIconsStart = Date.now()
      results.appIcons = await generateAppIcons({
        iconSource,
        project,
        brandProfile,
        stylePreset,
        mobileTarget: project.mobile_target,
      })
      logger.debug('asset.pipeline.app_icons.done', {
        durationMs: Date.now() - appIconsStart,
        files: Object.keys(results.appIcons).length,
      })

      onStage?.('splash')
      const splashStart = Date.now()
      results.splashScreens = await generateSplashScreens({
        iconSource,
        project,
        brandProfile,
        stylePreset,
        mobileTarget: project.mobile_target,
      })
      logger.debug('asset.pipeline.splash.done', {
        durationMs: Date.now() - splashStart,
        files: Object.keys(results.splashScreens).length,
      })
    }
  })()

  await Promise.all([...lightweightTasks, imageTask])

  onStage?.('zip')
  const zipStart = Date.now()
  const zipBuffer = await createZip({ project, results })
  logger.debug('asset.pipeline.zip.done', {
    durationMs: Date.now() - zipStart,
    bytes: zipBuffer.length,
  })

  onStage?.('upload')
  const uploadStart = Date.now()
  const storageUrl = await uploadToStorage({
    userId,
    projectId: project.id,
    buffer: zipBuffer,
    filename: 'assets.zip',
  })

  logger.info('asset.pipeline.completed', {
    projectId: project.id,
    durationMs: Date.now() - pipelineStartedAt,
    uploadDurationMs: Date.now() - uploadStart,
  })

  return { storageUrl, results, warnings }
}
