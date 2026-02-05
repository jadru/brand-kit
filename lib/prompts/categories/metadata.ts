import type {
  PromptCategory,
  MetadataTone,
  MetadataAudience,
  MetadataContentType,
  MetadataUrgency,
} from '../types'

// ========================================
// Tone Categories
// ========================================

export const metadataToneCategories: PromptCategory<MetadataTone>[] = [
  {
    id: 'formal',
    label: 'Formal',
    labelKo: '포멀',
    description: 'Professional business tone',
    promptFragment:
      'Use formal professional language. Write in a business-appropriate tone with proper grammar. Avoid slang or casual expressions. Maintain corporate credibility.',
  },
  {
    id: 'casual',
    label: 'Casual',
    labelKo: '캐주얼',
    description: 'Relaxed conversational',
    promptFragment:
      'Use casual conversational language. Write like talking to a friend. Natural flow, contractions allowed. Approachable and relatable.',
  },
  {
    id: 'technical',
    label: 'Technical',
    labelKo: '테크니컬',
    description: 'Developer/technical audience',
    promptFragment:
      'Use technical precise language. Include relevant technical terms. Be concise and accurate. Respect reader intelligence.',
  },
  {
    id: 'creative',
    label: 'Creative',
    labelKo: '크리에이티브',
    description: 'Artistic expressive',
    promptFragment:
      'Use creative expressive language. Be artistic and unique. Use metaphors and vivid descriptions. Stand out from generic copy.',
  },
  {
    id: 'inspirational',
    label: 'Inspirational',
    labelKo: '영감을 주는',
    description: 'Motivating uplifting',
    promptFragment:
      'Use inspirational motivating language. Be uplifting and encouraging. Focus on possibilities and positive outcomes. Empower the reader.',
  },
  {
    id: 'urgent',
    label: 'Urgent',
    labelKo: '긴급한',
    description: 'Time-sensitive action',
    promptFragment:
      'Use urgent action-oriented language. Create sense of immediacy. Include call-to-action elements. Drive immediate response.',
    incompatibleWith: ['casual'],
  },
  {
    id: 'friendly',
    label: 'Friendly',
    labelKo: '친근한',
    description: 'Warm approachable',
    promptFragment:
      'Use friendly warm language. Be approachable and welcoming. Create sense of connection. Build rapport with reader.',
  },
  {
    id: 'authoritative',
    label: 'Authoritative',
    labelKo: '권위있는',
    description: 'Expert confident',
    promptFragment:
      'Use authoritative expert language. Write with confidence and expertise. Establish credibility. Position as industry leader.',
  },
  {
    id: 'professional',
    label: 'Professional',
    labelKo: '프로페셔널',
    description: 'Polished and business-appropriate',
    promptFragment:
      'Use professional polished language. Balance authority with approachability. Maintain business credibility while being relatable.',
  },
]

// ========================================
// Audience Categories
// ========================================

export const metadataAudienceCategories: PromptCategory<MetadataAudience>[] = [
  {
    id: 'b2b-enterprise',
    label: 'B2B Enterprise',
    labelKo: 'B2B 엔터프라이즈',
    description: 'Large business decision-makers',
    promptFragment:
      'Target enterprise decision-makers. Focus on ROI, scalability, security, and integration capabilities. Address compliance and governance needs.',
  },
  {
    id: 'b2b-smb',
    label: 'B2B SMB',
    labelKo: 'B2B 중소기업',
    description: 'Small-medium business owners',
    promptFragment:
      'Target SMB owners and managers. Emphasize value, ease of use, quick implementation, and cost-effectiveness. Highlight time savings.',
  },
  {
    id: 'b2c-general',
    label: 'B2C General',
    labelKo: 'B2C 일반',
    description: 'General consumer audience',
    promptFragment:
      'Target general consumers. Use accessible language. Focus on benefits and lifestyle improvement. Make it personally relevant.',
  },
  {
    id: 'b2c-premium',
    label: 'B2C Premium',
    labelKo: 'B2C 프리미엄',
    description: 'Affluent consumers',
    promptFragment:
      'Target premium consumers. Emphasize quality, exclusivity, and superior experience. Appeal to discerning taste.',
  },
  {
    id: 'developer',
    label: 'Developer',
    labelKo: '개발자',
    description: 'Software developers',
    promptFragment:
      'Target developers. Include technical details, API references, and developer experience benefits. Speak their language.',
  },
  {
    id: 'designer',
    label: 'Designer',
    labelKo: '디자이너',
    description: 'Creative professionals',
    promptFragment:
      'Target designers and creatives. Emphasize visual quality, design flexibility, and creative possibilities. Appeal to aesthetic sensibility.',
  },
  {
    id: 'startup',
    label: 'Startup',
    labelKo: '스타트업',
    description: 'Founders and startup teams',
    promptFragment:
      'Target startup founders. Focus on speed, agility, growth potential, and competitive advantages. Understand resource constraints.',
  },
  {
    id: 'student',
    label: 'Student',
    labelKo: '학생',
    description: 'Students and learners',
    promptFragment:
      'Target students and learners. Emphasize affordability, learning benefits, and accessibility. Support educational journey.',
  },
]

// ========================================
// Content Type Categories
// ========================================

export const metadataContentTypeCategories: PromptCategory<MetadataContentType>[] = [
  {
    id: 'product-landing',
    label: 'Product Landing',
    labelKo: '제품 랜딩',
    description: 'Product launch page',
    promptFragment:
      'Write for product landing page. Focus on key features, benefits, and conversion. Include strong value proposition. Drive sign-ups.',
  },
  {
    id: 'saas-homepage',
    label: 'SaaS Homepage',
    labelKo: 'SaaS 홈페이지',
    description: 'SaaS main website',
    promptFragment:
      'Write for SaaS homepage. Highlight core solution, target pain points, and social proof elements. Build trust quickly.',
  },
  {
    id: 'blog-article',
    label: 'Blog Article',
    labelKo: '블로그 아티클',
    description: 'Blog post or article',
    promptFragment:
      'Write for blog article. Be informative and engaging. Consider SEO keywords and readability. Provide genuine value.',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    labelKo: '포트폴리오',
    description: 'Personal or agency portfolio',
    promptFragment:
      'Write for portfolio. Showcase expertise and unique value. Be concise and impactful. Let work speak.',
  },
  {
    id: 'documentation',
    label: 'Documentation',
    labelKo: '문서',
    description: 'Technical documentation',
    promptFragment:
      'Write for documentation. Be clear, accurate, and helpful. Use structured formatting. Enable quick scanning.',
  },
  {
    id: 'e-commerce',
    label: 'E-commerce',
    labelKo: '이커머스',
    description: 'Online store product',
    promptFragment:
      'Write for e-commerce. Focus on product benefits, specifications, and purchase motivation. Reduce friction.',
  },
  {
    id: 'app-store',
    label: 'App Store',
    labelKo: '앱 스토어',
    description: 'Mobile app listing',
    promptFragment:
      'Write for app store listing. Be concise. Highlight key features in limited characters. Mobile-focused benefits.',
  },
  {
    id: 'social-profile',
    label: 'Social Profile',
    labelKo: '소셜 프로필',
    description: 'Social media bio/profile',
    promptFragment:
      'Write for social profile. Ultra-concise. Memorable and shareable. Include personality. Make every word count.',
  },
]

// ========================================
// Urgency Categories
// ========================================

export const metadataUrgencyCategories: PromptCategory<MetadataUrgency>[] = [
  {
    id: 'evergreen',
    label: 'Evergreen',
    labelKo: '에버그린',
    description: 'Timeless content',
    promptFragment:
      'Write evergreen content. Avoid time-sensitive language. Focus on lasting value. No expiration dates.',
  },
  {
    id: 'timely',
    label: 'Timely',
    labelKo: '시의적절',
    description: 'Current relevance',
    promptFragment:
      'Include timely relevance. Reference current trends or needs without being dated. Balance freshness with longevity.',
  },
  {
    id: 'promotional',
    label: 'Promotional',
    labelKo: '프로모션',
    description: 'Sale or promotion',
    promptFragment:
      'Write promotional content. Highlight offers, discounts, or limited-time benefits. Create urgency without desperation.',
    incompatibleWith: ['evergreen'],
  },
  {
    id: 'announcement',
    label: 'Announcement',
    labelKo: '발표',
    description: 'New launch or update',
    promptFragment:
      'Write announcement content. Create excitement for what is new. Be newsworthy. Mark this moment.',
  },
]

// ========================================
// Export All Categories
// ========================================

export const allMetadataCategories = {
  tone: metadataToneCategories,
  audience: metadataAudienceCategories,
  contentType: metadataContentTypeCategories,
  urgency: metadataUrgencyCategories,
}
