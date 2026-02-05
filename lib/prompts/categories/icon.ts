import type {
  PromptCategory,
  IconVisualStyle,
  IconShape,
  IconIndustry,
  IconEmotion,
  IconColorScheme,
} from '../types'

// ========================================
// Visual Style Categories
// ========================================

export const iconVisualStyleCategories: PromptCategory<IconVisualStyle>[] = [
  {
    id: 'outline-thin',
    label: 'Thin Outline',
    labelKo: '얇은 아웃라인',
    description: 'Delicate line art style',
    promptFragment:
      'thin outline style, delicate 1px stroke lines, minimalist line art, no fill, elegant simplicity',
    weight: 10,
  },
  {
    id: 'outline-medium',
    label: 'Medium Outline',
    labelKo: '중간 아웃라인',
    description: 'Balanced line weight',
    promptFragment:
      'medium outline style, balanced 2px stroke weight, clean line art, versatile appearance',
    weight: 10,
  },
  {
    id: 'outline-thick',
    label: 'Thick Outline',
    labelKo: '두꺼운 아웃라인',
    description: 'Bold line art',
    promptFragment:
      'thick bold outline, 3-4px stroke weight, strong presence, impactful silhouette',
    weight: 10,
  },
  {
    id: 'filled-solid',
    label: 'Solid Fill',
    labelKo: '솔리드 채움',
    description: 'Flat solid shapes',
    promptFragment:
      'solid filled shapes, flat design, bold silhouettes, no gradients, confident simplicity',
    incompatibleWith: ['outline-thin', 'outline-medium', 'outline-thick'],
    weight: 10,
  },
  {
    id: 'filled-gradient',
    label: 'Gradient Fill',
    labelKo: '그라디언트 채움',
    description: 'Filled with gradients',
    promptFragment:
      'gradient filled shapes, smooth color transitions, modern depth, dimensional feel',
    incompatibleWith: ['outline-thin', 'outline-medium', 'outline-thick', 'flat-minimal'],
    weight: 10,
  },
  {
    id: 'duotone',
    label: 'Duotone',
    labelKo: '듀오톤',
    description: 'Two-color layered style',
    promptFragment:
      'duotone style, two complementary colors, overlapping shapes with transparency, layered depth',
    weight: 10,
  },
  {
    id: '3d-soft',
    label: '3D Soft',
    labelKo: '3D 소프트',
    description: 'Soft 3D rendering',
    promptFragment:
      'soft 3D render, subtle shadows, rounded forms, clay-like material, gentle lighting, plush feel',
    incompatibleWith: ['flat-minimal', 'sketch-hand-drawn'],
    weight: 15,
  },
  {
    id: '3d-isometric',
    label: '3D Isometric',
    labelKo: '3D 아이소메트릭',
    description: 'Isometric 3D view',
    promptFragment:
      'isometric 3D view, geometric precision, technical illustration style, 30-degree angles, architectural feel',
    incompatibleWith: ['sketch-hand-drawn'],
    weight: 15,
  },
  {
    id: 'glassmorphism',
    label: 'Glassmorphism',
    labelKo: '글래스모피즘',
    description: 'Frosted glass effect',
    promptFragment:
      'glassmorphism style, frosted glass effect, blur backdrop, semi-transparent layers, modern UI aesthetic',
    incompatibleWith: ['flat-minimal', 'sketch-hand-drawn'],
    weight: 15,
  },
  {
    id: 'neumorphism',
    label: 'Neumorphism',
    labelKo: '뉴모피즘',
    description: 'Soft UI embossed style',
    promptFragment:
      'neumorphism soft UI, embossed effect, subtle shadows both sides, soft tactile feel, pressed-in look',
    incompatibleWith: ['flat-minimal', 'sketch-hand-drawn'],
    weight: 15,
  },
  {
    id: 'flat-minimal',
    label: 'Flat Minimal',
    labelKo: '플랫 미니멀',
    description: 'Ultra-flat clean design',
    promptFragment:
      'ultra flat minimal design, no shadows, no gradients, geometric precision, pure simplicity',
    incompatibleWith: ['3d-soft', '3d-isometric', 'glassmorphism', 'neumorphism', 'filled-gradient'],
    weight: 10,
  },
  {
    id: 'sketch-hand-drawn',
    label: 'Hand-drawn Sketch',
    labelKo: '손그림 스케치',
    description: 'Organic hand-drawn feel',
    promptFragment:
      'hand-drawn sketch style, organic imperfect lines, artistic human touch, authentic personality',
    incompatibleWith: ['3d-soft', '3d-isometric', 'glassmorphism', 'neumorphism'],
    weight: 10,
  },
]

// ========================================
// Shape Categories
// ========================================

export const iconShapeCategories: PromptCategory<IconShape>[] = [
  {
    id: 'circle',
    label: 'Circle',
    labelKo: '원형',
    description: 'Circular container',
    promptFragment: 'circular shape container, perfectly round boundary, infinite continuous feel',
  },
  {
    id: 'rounded-square',
    label: 'Rounded Square',
    labelKo: '둥근 사각형',
    description: 'Square with rounded corners',
    promptFragment:
      'rounded square shape, soft corners, standard app icon format, friendly but structured',
  },
  {
    id: 'squircle',
    label: 'Squircle',
    labelKo: '스퀘클',
    description: 'iOS-style super ellipse',
    promptFragment:
      'squircle shape, iOS-style superellipse, smooth continuous curvature, premium app feel',
  },
  {
    id: 'hexagon',
    label: 'Hexagon',
    labelKo: '육각형',
    description: 'Six-sided polygon',
    promptFragment:
      'hexagonal shape, six-sided polygon, technical geometric feel, honeycomb association',
  },
  {
    id: 'sharp-square',
    label: 'Sharp Square',
    labelKo: '날카로운 사각형',
    description: 'Square with no rounding',
    promptFragment:
      'sharp square shape, precise 90-degree corners, no rounding, bold decisive character',
  },
  {
    id: 'organic-blob',
    label: 'Organic Blob',
    labelKo: '유기적 블롭',
    description: 'Fluid organic shape',
    promptFragment:
      'organic blob shape, fluid asymmetric boundary, natural flowing form, unique personality',
  },
  {
    id: 'shield',
    label: 'Shield',
    labelKo: '방패',
    description: 'Shield/badge shape',
    promptFragment:
      'shield badge shape, protective emblem form, trustworthy appearance, security association',
  },
  {
    id: 'diamond',
    label: 'Diamond',
    labelKo: '다이아몬드',
    description: '45-degree rotated square',
    promptFragment:
      'diamond shape, 45-degree rotated square, dynamic angular orientation, premium feel',
  },
]

// ========================================
// Industry Categories
// ========================================

export const iconIndustryCategories: PromptCategory<IconIndustry>[] = [
  {
    id: 'saas',
    label: 'SaaS',
    labelKo: 'SaaS',
    description: 'Software as a Service',
    promptFragment:
      'SaaS software aesthetic, cloud-connected feel, subscription service imagery, modern digital product',
  },
  {
    id: 'fintech',
    label: 'Fintech',
    labelKo: '핀테크',
    description: 'Financial technology',
    promptFragment:
      'fintech financial aesthetic, currency/chart elements, secure trustworthy feel, wealth management vibe',
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    labelKo: '헬스케어',
    description: 'Health and medical',
    promptFragment:
      'healthcare medical aesthetic, clean clinical feel, caring professional imagery, wellness focus',
  },
  {
    id: 'education',
    label: 'Education',
    labelKo: '교육',
    description: 'Learning and education',
    promptFragment:
      'education learning aesthetic, knowledge growth imagery, academic feel, enlightenment symbolism',
  },
  {
    id: 'e-commerce',
    label: 'E-commerce',
    labelKo: '이커머스',
    description: 'Online shopping',
    promptFragment:
      'e-commerce retail aesthetic, shopping cart/bag imagery, commercial friendly, purchase motivation',
  },
  {
    id: 'social-media',
    label: 'Social Media',
    labelKo: '소셜 미디어',
    description: 'Social networking',
    promptFragment:
      'social media aesthetic, connection/community imagery, vibrant engaging feel, sharing culture',
  },
  {
    id: 'gaming',
    label: 'Gaming',
    labelKo: '게이밍',
    description: 'Games and entertainment',
    promptFragment:
      'gaming entertainment aesthetic, playful dynamic imagery, exciting colorful feel, adventure spirit',
  },
  {
    id: 'productivity',
    label: 'Productivity',
    labelKo: '생산성',
    description: 'Work and productivity tools',
    promptFragment:
      'productivity tool aesthetic, efficiency focused, organized professional imagery, task completion vibe',
  },
  {
    id: 'creative-tools',
    label: 'Creative Tools',
    labelKo: '크리에이티브 툴',
    description: 'Design and creative apps',
    promptFragment:
      'creative tool aesthetic, artistic expressive, design-focused imagery, maker spirit',
  },
  {
    id: 'developer-tools',
    label: 'Developer Tools',
    labelKo: '개발자 도구',
    description: 'Development and coding',
    promptFragment:
      'developer tool aesthetic, code-inspired elements, technical precise imagery, builder mindset',
  },
  {
    id: 'ai-ml',
    label: 'AI/ML',
    labelKo: 'AI/ML',
    description: 'Artificial intelligence',
    promptFragment:
      'AI machine learning aesthetic, neural network imagery, futuristic intelligent feel, cutting-edge tech',
  },
  {
    id: 'sustainability',
    label: 'Sustainability',
    labelKo: '지속가능성',
    description: 'Green and eco-friendly',
    promptFragment:
      'sustainability eco aesthetic, nature elements, green environmental feel, earth-conscious imagery',
  },
  {
    id: 'real-estate',
    label: 'Real Estate',
    labelKo: '부동산',
    description: 'Property and housing',
    promptFragment:
      'real estate property aesthetic, home building imagery, solid trustworthy feel, investment quality',
  },
  {
    id: 'travel',
    label: 'Travel',
    labelKo: '여행',
    description: 'Travel and tourism',
    promptFragment:
      'travel tourism aesthetic, adventure exploration imagery, exciting wanderlust feel, discovery spirit',
  },
  {
    id: 'food-beverage',
    label: 'Food & Beverage',
    labelKo: '음식 & 음료',
    description: 'Food and dining',
    promptFragment:
      'food beverage aesthetic, appetizing imagery, warm inviting feel, culinary delight',
  },
]

// ========================================
// Emotion Categories
// ========================================

export const iconEmotionCategories: PromptCategory<IconEmotion>[] = [
  {
    id: 'trustworthy',
    label: 'Trustworthy',
    labelKo: '신뢰감',
    description: 'Reliable and dependable',
    promptFragment:
      'trustworthy reliable feel, stable balanced composition, professional confidence, dependable character',
  },
  {
    id: 'innovative',
    label: 'Innovative',
    labelKo: '혁신적',
    description: 'Cutting-edge and forward',
    promptFragment:
      'innovative cutting-edge feel, forward-thinking modern, unique distinctive, breakthrough spirit',
  },
  {
    id: 'friendly',
    label: 'Friendly',
    labelKo: '친근함',
    description: 'Approachable and warm',
    promptFragment:
      'friendly approachable feel, warm inviting, accessible welcoming, likeable personality',
  },
  {
    id: 'premium',
    label: 'Premium',
    labelKo: '프리미엄',
    description: 'High-end luxury',
    promptFragment:
      'premium luxury feel, high-end sophisticated, exclusive refined, quality excellence',
  },
  {
    id: 'energetic',
    label: 'Energetic',
    labelKo: '활기찬',
    description: 'Dynamic and active',
    promptFragment:
      'energetic dynamic feel, active movement, vibrant exciting, momentum and drive',
  },
  {
    id: 'calm',
    label: 'Calm',
    labelKo: '차분한',
    description: 'Peaceful and serene',
    promptFragment:
      'calm peaceful feel, serene tranquil, soft soothing, mindful presence',
  },
  {
    id: 'playful',
    label: 'Playful',
    labelKo: '장난스러운',
    description: 'Fun and lighthearted',
    promptFragment:
      'playful fun feel, lighthearted joyful, whimsical cheerful, delightful spirit',
  },
  {
    id: 'serious',
    label: 'Serious',
    labelKo: '진지한',
    description: 'Professional and formal',
    promptFragment:
      'serious professional feel, formal authoritative, business focused, no-nonsense approach',
  },
  {
    id: 'bold',
    label: 'Bold',
    labelKo: '대담한',
    description: 'Strong and confident',
    promptFragment:
      'bold confident feel, strong impactful, commanding presence, fearless character',
  },
  {
    id: 'sophisticated',
    label: 'Sophisticated',
    labelKo: '세련된',
    description: 'Elegant and refined',
    promptFragment:
      'sophisticated elegant feel, refined cultured, tasteful upscale, discerning quality',
  },
  {
    id: 'creative',
    label: 'Creative',
    labelKo: '창의적',
    description: 'Artistic and expressive',
    promptFragment:
      'creative artistic feel, expressive unique, imaginative design, artistic expression',
  },
]

// ========================================
// Color Scheme Categories
// ========================================

export const iconColorSchemeCategories: PromptCategory<IconColorScheme>[] = [
  {
    id: 'monochrome',
    label: 'Monochrome',
    labelKo: '모노크롬',
    description: 'Single color variations',
    promptFragment:
      'monochrome single color, tints and shades of one hue, unified color story',
  },
  {
    id: 'duotone',
    label: 'Duotone',
    labelKo: '듀오톤',
    description: 'Two complementary colors',
    promptFragment:
      'duotone two colors, complementary color pair, balanced contrast, harmonious pairing',
  },
  {
    id: 'gradient-linear',
    label: 'Linear Gradient',
    labelKo: '선형 그라디언트',
    description: 'Smooth linear color transition',
    promptFragment:
      'linear gradient, smooth directional color flow, modern depth, dimensional progression',
  },
  {
    id: 'gradient-radial',
    label: 'Radial Gradient',
    labelKo: '방사형 그라디언트',
    description: 'Circular gradient effect',
    promptFragment:
      'radial gradient, circular color emanation, centered glow effect, focal point emphasis',
  },
  {
    id: 'vibrant-multi',
    label: 'Vibrant Multi',
    labelKo: '비비드 멀티',
    description: 'Multiple vibrant colors',
    promptFragment:
      'vibrant multicolor, rainbow spectrum, energetic diverse palette, celebration of color',
  },
  {
    id: 'pastel',
    label: 'Pastel',
    labelKo: '파스텔',
    description: 'Soft muted tones',
    promptFragment:
      'pastel soft colors, muted gentle tones, light airy palette, delicate softness',
  },
  {
    id: 'dark-mode',
    label: 'Dark Mode',
    labelKo: '다크 모드',
    description: 'Dark background optimized',
    promptFragment:
      'dark mode optimized, light elements on dark, high contrast night theme, OLED friendly',
  },
  {
    id: 'brand-colors',
    label: 'Brand Colors',
    labelKo: '브랜드 컬러',
    description: 'Uses provided brand colors',
    promptFragment:
      'using specified brand colors, consistent with brand identity, cohesive color system',
  },
]

// ========================================
// Export All Categories
// ========================================

export const allIconCategories = {
  visualStyle: iconVisualStyleCategories,
  shape: iconShapeCategories,
  industry: iconIndustryCategories,
  emotion: iconEmotionCategories,
  colorScheme: iconColorSchemeCategories,
}
