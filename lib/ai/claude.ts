import Anthropic from '@anthropic-ai/sdk'
import type { HeadlineResponse } from '@/types/wizard'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const SYSTEM_PROMPT = `You are a senior brand copywriter specializing in tech startups and SaaS products.
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
}

export async function generateHeadlines(
  params: GenerateHeadlinesParams
): Promise<HeadlineResponse> {
  const userPrompt = `Project Name: ${params.projectName}
Description: ${params.description || 'No description provided'}
Platform: ${params.platform}
Brand Keywords: ${params.brandKeywords?.join(', ') || 'Not specified'}
Brand Style: ${params.brandStyleDirection || 'Not specified'}

Generate brand copy for this project.`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  // markdown 코드블록 제거
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  return JSON.parse(cleaned)
}
