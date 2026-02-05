import type { PromptExample } from '../types'

// ========================================
// OG Image Examples
// ========================================

export const ogExamples: PromptExample[] = [
  // === Premium SaaS ===
  {
    id: 'linear-style',
    name: 'Linear Style',
    nameKo: '리니어 스타일',
    description: 'Dark gradient with bold typography, technical and premium feel',
    config: {
      og: {
        layout: 'centered',
        visual: 'gradient-blob',
        typography: 'bold-modern',
        mood: 'technical',
      },
    },
    sourceInspiration: 'Linear.app',
  },
  {
    id: 'notion-minimal',
    name: 'Notion Minimal',
    nameKo: '노션 미니멀',
    description: 'Clean white space with elegant type, maximum simplicity',
    config: {
      og: {
        layout: 'minimal-corner',
        visual: 'none',
        typography: 'minimal-clean',
        mood: 'minimal',
      },
    },
    sourceInspiration: 'Notion',
  },
  {
    id: 'vercel-sharp',
    name: 'Vercel Sharp',
    nameKo: '버셀 샤프',
    description: 'High contrast black/white with geometric elements',
    config: {
      og: {
        layout: 'centered',
        visual: 'geometric-shapes',
        typography: 'bold-modern',
        mood: 'technical',
      },
    },
    sourceInspiration: 'Vercel',
  },
  {
    id: 'stripe-gradient',
    name: 'Stripe Gradient',
    nameKo: '스트라이프 그라디언트',
    description: 'Flowing gradient with professional serif typography',
    config: {
      og: {
        layout: 'gradient-wave',
        visual: 'gradient-blob',
        typography: 'elegant-serif',
        mood: 'professional',
      },
    },
    sourceInspiration: 'Stripe',
  },

  // === Consumer / Friendly ===
  {
    id: 'airbnb-warm',
    name: 'Airbnb Warm',
    nameKo: '에어비앤비 따뜻함',
    description: 'Photo background with friendly overlay and approachable type',
    config: {
      og: {
        layout: 'split-horizontal',
        visual: 'photo-background',
        typography: 'playful-rounded',
        mood: 'friendly',
      },
    },
    sourceInspiration: 'Airbnb',
  },
  {
    id: 'spotify-energetic',
    name: 'Spotify Energetic',
    nameKo: '스포티파이 에너제틱',
    description: 'Bold colors with dynamic diagonal composition',
    config: {
      og: {
        layout: 'diagonal-split',
        visual: 'abstract-pattern',
        typography: 'bold-modern',
        mood: 'energetic',
      },
    },
    sourceInspiration: 'Spotify',
  },
  {
    id: 'duolingo-playful',
    name: 'Duolingo Playful',
    nameKo: '듀오링고 플레이풀',
    description: 'Illustration-focused with cheerful rounded typography',
    config: {
      og: {
        layout: 'split-vertical',
        visual: 'illustration',
        typography: 'playful-rounded',
        mood: 'friendly',
      },
    },
    sourceInspiration: 'Duolingo',
  },

  // === Developer / Technical ===
  {
    id: 'github-technical',
    name: 'GitHub Technical',
    nameKo: '깃허브 테크니컬',
    description: 'Developer-focused with mono type and grid pattern',
    config: {
      og: {
        layout: 'left-aligned',
        visual: 'grid-pattern',
        typography: 'technical-mono',
        mood: 'technical',
      },
    },
    sourceInspiration: 'GitHub',
  },
  {
    id: 'supabase-modern',
    name: 'Supabase Modern',
    nameKo: '수파베이스 모던',
    description: 'Dark theme with gradient blobs and modern tech feel',
    config: {
      og: {
        layout: 'centered',
        visual: 'gradient-blob',
        typography: 'bold-modern',
        mood: 'technical',
      },
    },
    sourceInspiration: 'Supabase',
  },
  {
    id: 'raycast-sleek',
    name: 'Raycast Sleek',
    nameKo: '레이캐스트 슬릭',
    description: 'Minimalist dark with subtle geometric accents',
    config: {
      og: {
        layout: 'centered',
        visual: 'geometric-shapes',
        typography: 'minimal-clean',
        mood: 'technical',
      },
    },
    sourceInspiration: 'Raycast',
  },

  // === Creative / Design ===
  {
    id: 'figma-creative',
    name: 'Figma Creative',
    nameKo: '피그마 크리에이티브',
    description: 'Colorful creative expression with geometric shapes',
    config: {
      og: {
        layout: 'diagonal-split',
        visual: 'geometric-shapes',
        typography: 'bold-modern',
        mood: 'creative',
      },
    },
    sourceInspiration: 'Figma',
  },
  {
    id: 'framer-editorial',
    name: 'Framer Editorial',
    nameKo: '프레이머 에디토리얼',
    description: 'Editorial magazine style with mixed typography',
    config: {
      og: {
        layout: 'card-stack',
        visual: 'noise-texture',
        typography: 'editorial',
        mood: 'creative',
      },
    },
    sourceInspiration: 'Framer',
  },
  {
    id: 'dribbble-showcase',
    name: 'Dribbble Showcase',
    nameKo: '드리블 쇼케이스',
    description: 'Portfolio-style with illustration and creative energy',
    config: {
      og: {
        layout: 'split-vertical',
        visual: 'illustration',
        typography: 'playful-rounded',
        mood: 'creative',
      },
    },
    sourceInspiration: 'Dribbble',
  },

  // === Premium / Luxury ===
  {
    id: 'apple-editorial',
    name: 'Apple Editorial',
    nameKo: '애플 에디토리얼',
    description: 'Premium editorial layout with luxurious feel',
    config: {
      og: {
        layout: 'card-stack',
        visual: 'icon-accent',
        typography: 'editorial',
        mood: 'luxurious',
      },
    },
    sourceInspiration: 'Apple',
  },
  {
    id: 'tesla-bold',
    name: 'Tesla Bold',
    nameKo: '테슬라 볼드',
    description: 'Minimal with photo background and bold statement',
    config: {
      og: {
        layout: 'centered',
        visual: 'photo-background',
        typography: 'bold-modern',
        mood: 'bold',
      },
    },
    sourceInspiration: 'Tesla',
  },

  // === Blog / Content ===
  {
    id: 'medium-readable',
    name: 'Medium Readable',
    nameKo: '미디엄 리더블',
    description: 'Content-focused with elegant serif and clean layout',
    config: {
      og: {
        layout: 'left-aligned',
        visual: 'none',
        typography: 'elegant-serif',
        mood: 'professional',
      },
    },
    sourceInspiration: 'Medium',
  },
  {
    id: 'substack-personal',
    name: 'Substack Personal',
    nameKo: '서브스택 퍼스널',
    description: 'Personal touch with handwritten accent',
    config: {
      og: {
        layout: 'minimal-corner',
        visual: 'noise-texture',
        typography: 'handwritten-accent',
        mood: 'friendly',
      },
    },
    sourceInspiration: 'Substack',
  },
]

// ========================================
// Icon Examples
// ========================================

export const iconExamples: PromptExample[] = [
  // === Productivity ===
  {
    id: 'slack-friendly',
    name: 'Slack Friendly',
    nameKo: '슬랙 프렌들리',
    description: 'Colorful rounded friendly icon for team communication',
    config: {
      icon: {
        visualStyle: 'filled-solid',
        shape: 'rounded-square',
        emotion: 'friendly',
        colorScheme: 'vibrant-multi',
        industry: 'productivity',
        complexity: 'moderate',
      },
    },
    sourceInspiration: 'Slack',
  },
  {
    id: 'notion-outline',
    name: 'Notion Outline',
    nameKo: '노션 아웃라인',
    description: 'Thin line outline style for productivity tool',
    config: {
      icon: {
        visualStyle: 'outline-thin',
        shape: 'rounded-square',
        emotion: 'sophisticated',
        colorScheme: 'monochrome',
        industry: 'productivity',
        complexity: 'simple',
      },
    },
    sourceInspiration: 'Notion',
  },
  {
    id: 'todoist-energetic',
    name: 'Todoist Energetic',
    nameKo: '투두이스트 에너제틱',
    description: 'Bold and energetic task management icon',
    config: {
      icon: {
        visualStyle: 'filled-solid',
        shape: 'circle',
        emotion: 'energetic',
        colorScheme: 'duotone',
        industry: 'productivity',
        complexity: 'simple',
      },
    },
    sourceInspiration: 'Todoist',
  },

  // === Developer Tools ===
  {
    id: 'linear-3d',
    name: 'Linear 3D',
    nameKo: '리니어 3D',
    description: 'Soft 3D gradient icon for developer tool',
    config: {
      icon: {
        visualStyle: '3d-soft',
        shape: 'squircle',
        emotion: 'innovative',
        colorScheme: 'gradient-linear',
        industry: 'developer-tools',
        complexity: 'moderate',
      },
    },
    sourceInspiration: 'Linear',
  },
  {
    id: 'github-minimal',
    name: 'GitHub Minimal',
    nameKo: '깃허브 미니멀',
    description: 'Flat minimal icon for code hosting',
    config: {
      icon: {
        visualStyle: 'flat-minimal',
        shape: 'circle',
        emotion: 'trustworthy',
        colorScheme: 'monochrome',
        industry: 'developer-tools',
        complexity: 'simple',
      },
    },
    sourceInspiration: 'GitHub',
  },
  {
    id: 'raycast-glass',
    name: 'Raycast Glass',
    nameKo: '레이캐스트 글라스',
    description: 'Glassmorphism style for launcher app',
    config: {
      icon: {
        visualStyle: 'glassmorphism',
        shape: 'rounded-square',
        emotion: 'innovative',
        colorScheme: 'gradient-radial',
        industry: 'developer-tools',
        complexity: 'moderate',
      },
    },
    sourceInspiration: 'Raycast',
  },

  // === Fintech ===
  {
    id: 'stripe-minimal',
    name: 'Stripe Minimal',
    nameKo: '스트라이프 미니멀',
    description: 'Clean minimal monochrome for payments',
    config: {
      icon: {
        visualStyle: 'flat-minimal',
        shape: 'rounded-square',
        emotion: 'trustworthy',
        colorScheme: 'monochrome',
        industry: 'fintech',
        complexity: 'simple',
      },
    },
    sourceInspiration: 'Stripe',
  },
  {
    id: 'robinhood-bold',
    name: 'Robinhood Bold',
    nameKo: '로빈후드 볼드',
    description: 'Bold and confident for investing app',
    config: {
      icon: {
        visualStyle: 'filled-solid',
        shape: 'squircle',
        emotion: 'bold',
        colorScheme: 'gradient-linear',
        industry: 'fintech',
        complexity: 'simple',
      },
    },
    sourceInspiration: 'Robinhood',
  },

  // === Creative Tools ===
  {
    id: 'figma-duotone',
    name: 'Figma Duotone',
    nameKo: '피그마 듀오톤',
    description: 'Two-color layered design for design tool',
    config: {
      icon: {
        visualStyle: 'duotone',
        shape: 'circle',
        emotion: 'creative',
        colorScheme: 'duotone',
        industry: 'creative-tools',
        complexity: 'moderate',
      },
    },
    sourceInspiration: 'Figma',
  },
  {
    id: 'canva-playful',
    name: 'Canva Playful',
    nameKo: '캔바 플레이풀',
    description: 'Playful and colorful for easy design',
    config: {
      icon: {
        visualStyle: 'filled-gradient',
        shape: 'circle',
        emotion: 'playful',
        colorScheme: 'vibrant-multi',
        industry: 'creative-tools',
        complexity: 'simple',
      },
    },
    sourceInspiration: 'Canva',
  },

  // === AI/ML ===
  {
    id: 'openai-premium',
    name: 'OpenAI Premium',
    nameKo: 'OpenAI 프리미엄',
    description: 'Premium feel for AI company',
    config: {
      icon: {
        visualStyle: 'filled-solid',
        shape: 'hexagon',
        emotion: 'premium',
        colorScheme: 'monochrome',
        industry: 'ai-ml',
        complexity: 'moderate',
      },
    },
    sourceInspiration: 'OpenAI',
  },
  {
    id: 'anthropic-sophisticated',
    name: 'Anthropic Sophisticated',
    nameKo: '앤트로픽 세련됨',
    description: 'Sophisticated and trustworthy AI icon',
    config: {
      icon: {
        visualStyle: 'neumorphism',
        shape: 'squircle',
        emotion: 'sophisticated',
        colorScheme: 'pastel',
        industry: 'ai-ml',
        complexity: 'moderate',
      },
    },
    sourceInspiration: 'Anthropic',
  },

  // === Social ===
  {
    id: 'discord-energetic',
    name: 'Discord Energetic',
    nameKo: '디스코드 에너제틱',
    description: 'Energetic and friendly for social platform',
    config: {
      icon: {
        visualStyle: 'filled-solid',
        shape: 'rounded-square',
        emotion: 'energetic',
        colorScheme: 'duotone',
        industry: 'social-media',
        complexity: 'moderate',
      },
    },
    sourceInspiration: 'Discord',
  },

  // === Gaming ===
  {
    id: 'steam-isometric',
    name: 'Steam Isometric',
    nameKo: '스팀 아이소메트릭',
    description: 'Isometric 3D for gaming platform',
    config: {
      icon: {
        visualStyle: '3d-isometric',
        shape: 'sharp-square',
        emotion: 'bold',
        colorScheme: 'gradient-linear',
        industry: 'gaming',
        complexity: 'detailed',
      },
    },
    sourceInspiration: 'Steam',
  },

  // === E-commerce ===
  {
    id: 'shopify-friendly',
    name: 'Shopify Friendly',
    nameKo: '쇼피파이 프렌들리',
    description: 'Friendly and trustworthy for commerce',
    config: {
      icon: {
        visualStyle: 'filled-solid',
        shape: 'shield',
        emotion: 'friendly',
        colorScheme: 'brand-colors',
        industry: 'e-commerce',
        complexity: 'simple',
      },
    },
    sourceInspiration: 'Shopify',
  },
]

// ========================================
// Metadata Examples
// ========================================

export const metadataExamples: PromptExample[] = [
  // === SaaS / Product ===
  {
    id: 'startup-launch',
    name: 'Startup Launch',
    nameKo: '스타트업 런칭',
    description: 'Exciting product launch copy for startups',
    config: {
      metadata: {
        tone: 'inspirational',
        audience: 'startup',
        contentType: 'product-landing',
        urgency: 'announcement',
        language: 'ko',
      },
    },
  },
  {
    id: 'enterprise-saas',
    name: 'Enterprise SaaS',
    nameKo: '엔터프라이즈 SaaS',
    description: 'Professional B2B messaging for enterprise',
    config: {
      metadata: {
        tone: 'authoritative',
        audience: 'b2b-enterprise',
        contentType: 'saas-homepage',
        urgency: 'evergreen',
        language: 'ko',
      },
    },
  },
  {
    id: 'smb-friendly',
    name: 'SMB Friendly',
    nameKo: 'SMB 친화적',
    description: 'Approachable copy for small business tools',
    config: {
      metadata: {
        tone: 'friendly',
        audience: 'b2b-smb',
        contentType: 'product-landing',
        urgency: 'evergreen',
        language: 'ko',
      },
    },
  },

  // === Developer ===
  {
    id: 'developer-tool',
    name: 'Developer Tool',
    nameKo: '개발자 도구',
    description: 'Technical developer-focused copy',
    config: {
      metadata: {
        tone: 'technical',
        audience: 'developer',
        contentType: 'documentation',
        urgency: 'evergreen',
        language: 'ko',
      },
    },
  },
  {
    id: 'api-product',
    name: 'API Product',
    nameKo: 'API 제품',
    description: 'Precise technical copy for API products',
    config: {
      metadata: {
        tone: 'technical',
        audience: 'developer',
        contentType: 'product-landing',
        urgency: 'evergreen',
        language: 'en',
      },
    },
  },

  // === Consumer ===
  {
    id: 'mobile-app',
    name: 'Mobile App',
    nameKo: '모바일 앱',
    description: 'App store listing optimized copy',
    config: {
      metadata: {
        tone: 'friendly',
        audience: 'b2c-general',
        contentType: 'app-store',
        urgency: 'evergreen',
        language: 'ko',
      },
    },
  },
  {
    id: 'premium-consumer',
    name: 'Premium Consumer',
    nameKo: '프리미엄 소비자',
    description: 'Upscale copy for premium consumer products',
    config: {
      metadata: {
        tone: 'creative',
        audience: 'b2c-premium',
        contentType: 'product-landing',
        urgency: 'evergreen',
        language: 'ko',
      },
    },
  },

  // === Content ===
  {
    id: 'blog-seo',
    name: 'Blog SEO',
    nameKo: '블로그 SEO',
    description: 'SEO-optimized blog article metadata',
    config: {
      metadata: {
        tone: 'casual',
        audience: 'b2c-general',
        contentType: 'blog-article',
        urgency: 'timely',
        language: 'ko',
      },
    },
  },
  {
    id: 'portfolio-creative',
    name: 'Portfolio Creative',
    nameKo: '포트폴리오 크리에이티브',
    description: 'Creative copy for designer portfolios',
    config: {
      metadata: {
        tone: 'creative',
        audience: 'designer',
        contentType: 'portfolio',
        urgency: 'evergreen',
        language: 'ko',
      },
    },
  },

  // === Marketing ===
  {
    id: 'promo-urgent',
    name: 'Promo Urgent',
    nameKo: '프로모션 긴급',
    description: 'Urgent promotional copy with action focus',
    config: {
      metadata: {
        tone: 'urgent',
        audience: 'b2c-general',
        contentType: 'e-commerce',
        urgency: 'promotional',
        language: 'ko',
      },
    },
  },
  {
    id: 'product-announcement',
    name: 'Product Announcement',
    nameKo: '제품 발표',
    description: 'Exciting new feature announcement',
    config: {
      metadata: {
        tone: 'inspirational',
        audience: 'b2c-general',
        contentType: 'saas-homepage',
        urgency: 'announcement',
        language: 'ko',
      },
    },
  },

  // === Social ===
  {
    id: 'social-profile',
    name: 'Social Profile',
    nameKo: '소셜 프로필',
    description: 'Ultra-concise social media bio',
    config: {
      metadata: {
        tone: 'casual',
        audience: 'b2c-general',
        contentType: 'social-profile',
        urgency: 'evergreen',
        language: 'ko',
      },
    },
  },

  // === Education ===
  {
    id: 'student-friendly',
    name: 'Student Friendly',
    nameKo: '학생 친화적',
    description: 'Accessible copy for educational products',
    config: {
      metadata: {
        tone: 'friendly',
        audience: 'student',
        contentType: 'app-store',
        urgency: 'evergreen',
        language: 'ko',
      },
    },
  },
]

// ========================================
// Utility Functions
// ========================================

export function getExamplesByCategory(
  category: 'og' | 'icon' | 'metadata'
): PromptExample[] {
  switch (category) {
    case 'og':
      return ogExamples
    case 'icon':
      return iconExamples
    case 'metadata':
      return metadataExamples
  }
}

export function getExampleById(id: string): PromptExample | undefined {
  return getAllExamples().find((e) => e.id === id)
}

export function getAllExamples(): PromptExample[] {
  return [...ogExamples, ...iconExamples, ...metadataExamples]
}

export function getExamplesByInspiration(source: string): PromptExample[] {
  return getAllExamples().filter(
    (e) => e.sourceInspiration?.toLowerCase().includes(source.toLowerCase())
  )
}

export function getExamplesByMood(mood: string): PromptExample[] {
  return ogExamples.filter((e) => e.config.og?.mood === mood)
}

export function getExamplesByIndustry(industry: string): PromptExample[] {
  return iconExamples.filter((e) => e.config.icon?.industry === industry)
}

export function getExamplesByTone(tone: string): PromptExample[] {
  return metadataExamples.filter((e) => e.config.metadata?.tone === tone)
}
