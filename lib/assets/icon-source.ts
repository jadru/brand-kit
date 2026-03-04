import * as LucideIcons from 'lucide-react'
import type { IconSource } from '@/lib/utils/image'
import { resolveIconStyles } from './style-resolver'
import { symbolLibrary } from './symbol-library'
import type { Project, BrandProfile, StylePreset } from '@/types/database'

interface IconSourceResolverParams {
  project: Project
  brandProfile: BrandProfile | null
  stylePreset: StylePreset
}

type LucideIconNode = Array<[string, Record<string, string>]>

interface LucideComponentLike {
  render: (
    props: { size?: number; strokeWidth?: number; color?: string },
    ref: unknown
  ) => {
    props?: {
      iconNode?: LucideIconNode
    }
  }
}

function getSymbolIconComponent(symbolId: string) {
  const symbol = symbolLibrary.find((item) => item.id === symbolId)
  if (!symbol) return null

  const icons = LucideIcons as Record<string, unknown>
  const icon = icons[symbol.lucideIcon]
  if (
    typeof icon === 'object' &&
    icon !== null &&
    'render' in icon &&
    typeof (icon as { render?: unknown }).render === 'function'
  ) {
    return icon as LucideComponentLike
  }

  return null
}

function resolveSymbolSvgFallback(project: Project, _brandProfile: BrandProfile | null, _stylePreset: StylePreset): IconSource {
  const fallback = (project.name || 'S').charAt(0).toUpperCase()
  return { type: 'text', value: fallback }
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function serializeLucideIconNode(iconNode: LucideIconNode): string {
  return iconNode
    .map(([tag, attrs]) => {
      const serializedAttrs = Object.entries(attrs)
        .filter(([key]) => key !== 'key')
        .map(([key, value]) => `${key}="${escapeXml(String(value))}"`)
        .join(' ')

      return serializedAttrs.length > 0
        ? `<${tag} ${serializedAttrs} />`
        : `<${tag} />`
    })
    .join('')
}

function normalizeLucideInnerSvg(component: LucideComponentLike) {
  const rendered = component.render({ size: 24, strokeWidth: 2.2 }, null)
  const iconNode = rendered.props?.iconNode
  if (!Array.isArray(iconNode)) return null
  return serializeLucideIconNode(iconNode)
}

export async function resolveProjectIconSource(params: IconSourceResolverParams): Promise<IconSource> {
  const { project, brandProfile, stylePreset } = params

  if (project.icon_type === 'text') {
    const value = project.icon_value || 'A'
    return { type: 'text', value: value.toUpperCase() }
  }

  if (project.icon_type === 'symbol') {
    const iconId = project.icon_value?.trim()
    if (!iconId) {
      return resolveSymbolSvgFallback(project, brandProfile, stylePreset)
    }

    const iconComponent = getSymbolIconComponent(iconId)
    if (!iconComponent) {
      return resolveSymbolSvgFallback(project, brandProfile, stylePreset)
    }

    const resolved = resolveIconStyles(stylePreset, brandProfile, project)
    const inner = normalizeLucideInnerSvg(iconComponent)
    if (!inner) {
      return resolveSymbolSvgFallback(project, brandProfile, stylePreset)
    }

    const defs = [
      resolved.background.defs,
      resolved.shadow.svgFilter,
    ].filter(Boolean).join('\n')

    const filterAttr = resolved.shadow.svgFilterId ? ` filter="url(#${resolved.shadow.svgFilterId})"` : ''
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>${defs}</defs>
      <rect width="100" height="100" rx="${resolved.cornerRadius}" fill="${resolved.background.fill}"${filterAttr} />
      <g transform="translate(14 14) scale(3)" fill="none" stroke="${resolved.textColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        ${inner}
      </g>
    </svg>`

    return { type: 'svg', buffer: Buffer.from(svgString) }
  }

  if (!project.icon_value) {
    throw new Error('AI-generated icon URL is missing')
  }

  let response: Response
  try {
    response = await fetch(project.icon_value)
  } catch (error) {
    throw new Error(
      `Failed to fetch AI-generated icon from ${project.icon_value}: ${error instanceof Error ? error.message : String(error)}`
    )
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch AI-generated icon: HTTP ${response.status} from ${project.icon_value}${response.status === 403 ? ' (URL may have expired)' : ''}`
    )
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  if (buffer.length === 0) {
    throw new Error(`AI-generated icon from ${project.icon_value} returned empty data`)
  }

  return { type: 'image', buffer }
}

export function isSymbolIconId(value: string | null) {
  if (!value) return false
  return symbolLibrary.some((item) => item.id === value)
}
