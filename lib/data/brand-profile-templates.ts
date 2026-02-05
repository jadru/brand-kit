import type { BrandProfileFormValues } from '@/lib/validations/brand-profile'

export interface BrandProfileTemplate {
  id: string
  name: string
  description: string
  category: 'saas' | 'ecommerce' | 'agency' | 'startup' | 'personal'
  icon: string
  values: Omit<BrandProfileFormValues, 'name' | 'is_default'>
}

export const BRAND_PROFILE_TEMPLATES: BrandProfileTemplate[] = [
  {
    id: 'saas-modern',
    name: 'Modern SaaS',
    description: 'Clean, professional look for software products',
    category: 'saas',
    icon: '💻',
    values: {
      style_direction: 'tech',
      primary_color: '#6366F1', // Indigo
      secondary_colors: ['#818CF8', '#A5B4FC'],
      color_mode: 'gradient',
      icon_style: 'filled',
      corner_style: 'rounded',
      keywords: ['modern', 'professional', 'innovative', 'reliable'],
    },
  },
  {
    id: 'saas-minimal',
    name: 'Minimal SaaS',
    description: 'Minimalist design for productivity tools',
    category: 'saas',
    icon: '✨',
    values: {
      style_direction: 'minimal',
      primary_color: '#171717', // Neutral-900
      secondary_colors: ['#404040', '#737373'],
      color_mode: 'mono',
      icon_style: 'outline',
      corner_style: 'rounded',
      keywords: ['minimal', 'clean', 'focused', 'simple'],
    },
  },
  {
    id: 'ecommerce-vibrant',
    name: 'Vibrant E-commerce',
    description: 'Bold colors for online retail stores',
    category: 'ecommerce',
    icon: '🛒',
    values: {
      style_direction: 'playful',
      primary_color: '#F97316', // Orange-500
      secondary_colors: ['#FB923C', '#FDBA74'],
      color_mode: 'vibrant',
      icon_style: 'filled',
      corner_style: 'pill',
      keywords: ['bold', 'energetic', 'friendly', 'trustworthy'],
    },
  },
  {
    id: 'ecommerce-luxury',
    name: 'Luxury Brand',
    description: 'Elegant design for premium products',
    category: 'ecommerce',
    icon: '💎',
    values: {
      style_direction: 'corporate',
      primary_color: '#1C1917', // Stone-900
      secondary_colors: ['#D4AF37', '#A8A29E'], // Gold accent
      color_mode: 'duotone',
      icon_style: 'outline',
      corner_style: 'sharp',
      keywords: ['luxury', 'premium', 'elegant', 'exclusive'],
    },
  },
  {
    id: 'agency-creative',
    name: 'Creative Agency',
    description: 'Bold, creative look for design agencies',
    category: 'agency',
    icon: '🎨',
    values: {
      style_direction: 'playful',
      primary_color: '#EC4899', // Pink-500
      secondary_colors: ['#8B5CF6', '#06B6D4'], // Purple + Cyan
      color_mode: 'gradient',
      icon_style: '3d_soft',
      corner_style: 'rounded',
      keywords: ['creative', 'bold', 'innovative', 'artistic'],
    },
  },
  {
    id: 'startup-tech',
    name: 'Tech Startup',
    description: 'Modern, trustworthy startup look',
    category: 'startup',
    icon: '🚀',
    values: {
      style_direction: 'tech',
      primary_color: '#3B82F6', // Blue-500
      secondary_colors: ['#60A5FA', '#93C5FD'],
      color_mode: 'gradient',
      icon_style: 'filled',
      corner_style: 'rounded',
      keywords: ['innovative', 'fast', 'reliable', 'cutting-edge'],
    },
  },
  {
    id: 'startup-green',
    name: 'Eco-Friendly Startup',
    description: 'Sustainable, eco-conscious brand',
    category: 'startup',
    icon: '🌱',
    values: {
      style_direction: 'minimal',
      primary_color: '#10B981', // Emerald-500
      secondary_colors: ['#34D399', '#6EE7B7'],
      color_mode: 'duotone',
      icon_style: 'flat',
      corner_style: 'rounded',
      keywords: ['sustainable', 'eco-friendly', 'natural', 'green'],
    },
  },
  {
    id: 'personal-developer',
    name: 'Developer Portfolio',
    description: 'Dark theme for developer personal brands',
    category: 'personal',
    icon: '👨‍💻',
    values: {
      style_direction: 'tech',
      primary_color: '#22C55E', // Green-500
      secondary_colors: ['#0F172A', '#1E293B'], // Slate background
      color_mode: 'mono',
      icon_style: 'outline',
      corner_style: 'rounded',
      keywords: ['developer', 'technical', 'professional', 'modern'],
    },
  },
]

export const TEMPLATE_CATEGORIES = [
  { id: 'saas', name: 'SaaS', icon: '💻' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'agency', name: 'Agency', icon: '🎨' },
  { id: 'startup', name: 'Startup', icon: '🚀' },
  { id: 'personal', name: 'Personal', icon: '👤' },
] as const

export function getTemplatesByCategory(category: string) {
  return BRAND_PROFILE_TEMPLATES.filter((t) => t.category === category)
}
