import Anthropic from '@anthropic-ai/sdk'
import type { HeadlineResponse } from '@/types/wizard'
import { composeMetadataPrompt, getDefaultPromptConfig } from '@/lib/prompts'
import type { MetadataPromptConfig } from '@/lib/prompts'
import { AI_CONFIG } from '@/lib/config/ai'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// 기본 시스템 프롬프트 (promptConfig 없을 때 사용)
const DEFAULT_SYSTEM_PROMPT = `You are a senior brand copywriter specializing in tech startups and SaaS products.
Your task is to generate SEO-optimized, conversion-focused copy for app/web projects.

## Context
You will receive:
- Project name and description
- Target platform (web/mobile/all)
- Brand profile keywords (if available)

## Output Requirements
Generate exactly 4 items in JSON format:
1. headline: Main headline for landing page (max 60 chars, Korean)
2. tagline: Short memorable tagline (max 30 chars, Korean)
3. ogDescription: Open Graph description for social sharing (max 155 chars, Korean)
4. shortSlogan: Ultra-short slogan for app stores (max 15 chars, Korean)

## Writing Guidelines
- Use active, benefit-driven language
- Avoid generic buzzwords
- Focus on specific value proposition
- Consider SEO keywords naturally
- If brand keywords provided, reflect the brand's tone

## Response Format
Return ONLY valid JSON, no markdown formatting:
{"headline": "...", "tagline": "...", "ogDescription": "...", "shortSlogan": "..."}`

interface GenerateHeadlinesParams {
  projectName: string
  description?: string
  platform: string
  brandKeywords?: string[]
  brandStyleDirection?: string
  promptConfig?: MetadataPromptConfig
}

interface MetadataBrandProfileInput {
  platform: string
  styleDirection?: string
  keywords?: string[]
  language?: MetadataPromptConfig['language']
}

const DEFAULT_METADATA_CONFIG = getDefaultPromptConfig().metadata as MetadataPromptConfig

function normalizeKeywords(keywords?: string[]) {
  return keywords
    ?.map((keyword) => keyword.trim())
    .filter(Boolean) ?? []
}

function inferMetadataAudience(keywords: string[]): MetadataPromptConfig['audience'] {
  const lowerKeywords = keywords.map((keyword) => keyword.toLowerCase())

  if (lowerKeywords.some((keyword) =>
    ['developer', 'dev', 'api', 'sdk', 'engineering', 'code'].some((term) => keyword.includes(term))
  )) {
    return 'developer'
  }

  if (lowerKeywords.some((keyword) =>
    ['design', 'designer', 'creative', 'branding', 'ui', 'ux'].some((term) => keyword.includes(term))
  )) {
    return 'designer'
  }

  if (lowerKeywords.some((keyword) =>
    ['student', 'education', 'learning', 'course'].some((term) => keyword.includes(term))
  )) {
    return 'student'
  }

  if (lowerKeywords.some((keyword) =>
    ['startup', 'founder', 'launch', 'growth'].some((term) => keyword.includes(term))
  )) {
    return 'startup'
  }

  if (lowerKeywords.some((keyword) =>
    ['luxury', 'premium', 'exclusive', 'high-end'].some((term) => keyword.includes(term))
  )) {
    return 'b2c-premium'
  }

  if (lowerKeywords.some((keyword) =>
    ['enterprise', 'compliance', 'governance', 'security', 'integration'].some((term) => keyword.includes(term))
  )) {
    return 'b2b-enterprise'
  }

  if (lowerKeywords.some((keyword) =>
    ['b2b', 'business', 'saas', 'smb', 'team', 'workspace', 'company'].some((term) => keyword.includes(term))
  )) {
    return 'b2b-smb'
  }

  return DEFAULT_METADATA_CONFIG.audience
}

export function brandProfileToMetadataConfig(
  input: MetadataBrandProfileInput
): MetadataPromptConfig {
  const keywords = normalizeKeywords(input.keywords)

  const toneMap: Record<string, MetadataPromptConfig['tone']> = {
    minimal: 'professional',
    playful: 'friendly',
    corporate: 'formal',
    tech: 'technical',
    custom: DEFAULT_METADATA_CONFIG.tone,
  }

  const contentTypeMap: Record<string, MetadataPromptConfig['contentType']> = {
    web: 'product-landing',
    mobile: 'app-store',
    all: 'saas-homepage',
  }

  return {
    ...DEFAULT_METADATA_CONFIG,
    tone: toneMap[input.styleDirection || 'custom'] || DEFAULT_METADATA_CONFIG.tone,
    audience: inferMetadataAudience(keywords),
    contentType: contentTypeMap[input.platform] || DEFAULT_METADATA_CONFIG.contentType,
    focusKeywords: keywords,
    language: input.language || DEFAULT_METADATA_CONFIG.language,
  }
}

/**
 * AI 브랜드 카피 생성
 * Claude를 사용하여 프로젝트에 맞는 헤드라인, 태그라인, OG 설명을 생성합니다.
 */
export async function generateHeadlines(
  params: GenerateHeadlinesParams
): Promise<HeadlineResponse> {
  let systemPrompt: string
  let userPrompt: string

  if (params.promptConfig) {
    const composed = composeMetadataPrompt(params.promptConfig, {
      name: params.projectName,
      description: params.description,
      platform: params.platform,
      brandKeywords: params.brandKeywords,
      brandStyleDirection: params.brandStyleDirection,
    })
    systemPrompt = composed.systemPrompt
    userPrompt = composed.userPrompt
  } else {
    // 기본 방식 (promptConfig 없는 경우)
    systemPrompt = DEFAULT_SYSTEM_PROMPT
    userPrompt = `Project Name: ${params.projectName}
Description: ${params.description || 'No description provided'}
Platform: ${params.platform}
Brand Keywords: ${params.brandKeywords?.join(', ') || 'Not specified'}
Brand Style: ${params.brandStyleDirection || 'Not specified'}

Generate brand copy for this project.`
  }

  const message = await client.messages.create({
    model: AI_CONFIG.claude.model,
    max_tokens: AI_CONFIG.claude.maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  // markdown 코드블록 제거
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  return JSON.parse(cleaned)
}
