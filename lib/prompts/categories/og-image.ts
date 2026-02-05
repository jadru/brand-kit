import type {
  PromptCategory,
  OgLayoutStyle,
  OgVisualElement,
  OgTypographyStyle,
  OgMoodTone,
} from '../types'

// ========================================
// Layout Categories
// ========================================

export const ogLayoutCategories: PromptCategory<OgLayoutStyle>[] = [
  {
    id: 'centered',
    label: 'Centered',
    labelKo: '중앙 정렬',
    description: 'Title and subtitle centered on the canvas',
    promptFragment:
      'centered layout with text positioned in the middle of the canvas, balanced composition, symmetric visual hierarchy',
  },
  {
    id: 'left-aligned',
    label: 'Left Aligned',
    labelKo: '왼쪽 정렬',
    description: 'Content aligned to the left with visual element on right',
    promptFragment:
      'left-aligned text content with visual element or whitespace on the right, asymmetric balance, editorial feel',
  },
  {
    id: 'split-vertical',
    label: 'Split Vertical',
    labelKo: '세로 분할',
    description: 'Two-column layout with text and visual',
    promptFragment:
      'vertical split layout, text content on one side, visual element on the other, clear dividing line, two-column structure',
    incompatibleWith: ['gradient-wave'],
  },
  {
    id: 'split-horizontal',
    label: 'Split Horizontal',
    labelKo: '가로 분할',
    description: 'Top and bottom sections',
    promptFragment:
      'horizontal split with distinct top and bottom sections, header-body structure, layered composition',
  },
  {
    id: 'gradient-wave',
    label: 'Gradient Wave',
    labelKo: '그라디언트 웨이브',
    description: 'Flowing gradient background with wave patterns',
    promptFragment:
      'flowing gradient background with organic wave patterns, dynamic movement feel, smooth color transitions, modern aesthetic',
    incompatibleWith: ['split-vertical', 'grid-pattern'],
  },
  {
    id: 'diagonal-split',
    label: 'Diagonal Split',
    labelKo: '대각선 분할',
    description: 'Dynamic diagonal division',
    promptFragment:
      'diagonal split composition creating dynamic visual tension, angled dividing line, energetic asymmetry',
  },
  {
    id: 'card-stack',
    label: 'Card Stack',
    labelKo: '카드 스택',
    description: 'Layered card effect with depth',
    promptFragment:
      'layered card stack effect with subtle shadows and depth, 3D perspective, floating elements, material design influence',
  },
  {
    id: 'minimal-corner',
    label: 'Minimal Corner',
    labelKo: '미니멀 코너',
    description: 'Minimalist with text in corner',
    promptFragment:
      'minimalist design with text positioned in corner, maximum whitespace, editorial feel, bold negative space usage',
  },
]

// ========================================
// Visual Element Categories
// ========================================

export const ogVisualCategories: PromptCategory<OgVisualElement>[] = [
  {
    id: 'none',
    label: 'None',
    labelKo: '없음',
    description: 'Clean text-only design',
    promptFragment:
      'clean text-only design, no decorative elements, pure typography focus, maximum readability',
  },
  {
    id: 'geometric-shapes',
    label: 'Geometric Shapes',
    labelKo: '기하학적 도형',
    description: 'Abstract geometric patterns',
    promptFragment:
      'abstract geometric shapes, circles, rectangles, lines as decorative elements, mathematical precision, structured patterns',
  },
  {
    id: 'abstract-pattern',
    label: 'Abstract Pattern',
    labelKo: '추상 패턴',
    description: 'Organic abstract patterns',
    promptFragment:
      'organic abstract patterns, flowing shapes, artistic background elements, non-representational forms',
  },
  {
    id: 'illustration',
    label: 'Illustration',
    labelKo: '일러스트',
    description: 'Custom illustration or icon',
    promptFragment:
      'include illustration or custom icon graphic, visual storytelling element, unique character or mascot potential',
    incompatibleWith: ['photo-background'],
  },
  {
    id: 'photo-background',
    label: 'Photo Background',
    labelKo: '사진 배경',
    description: 'Background image with text overlay',
    promptFragment:
      'photo background with text overlay, image with darkened or blurred treatment for text readability, cinematic feel',
    incompatibleWith: ['illustration', 'gradient-blob'],
  },
  {
    id: 'icon-accent',
    label: 'Icon Accent',
    labelKo: '아이콘 포인트',
    description: 'Small icon as accent element',
    promptFragment:
      'small icon or logo as accent element, supporting visual without dominating, subtle brand reinforcement',
  },
  {
    id: 'gradient-blob',
    label: 'Gradient Blob',
    labelKo: '그라디언트 블롭',
    description: 'Soft gradient blob shapes',
    promptFragment:
      'soft gradient blob shapes, organic color transitions, modern glassmorphism feel, ethereal floating elements',
    incompatibleWith: ['photo-background'],
  },
  {
    id: 'grid-pattern',
    label: 'Grid Pattern',
    labelKo: '그리드 패턴',
    description: 'Subtle grid or dot pattern',
    promptFragment:
      'subtle grid or dot pattern background, technical precision feel, engineering aesthetic, systematic order',
    incompatibleWith: ['gradient-wave'],
  },
  {
    id: 'noise-texture',
    label: 'Noise Texture',
    labelKo: '노이즈 텍스처',
    description: 'Grainy noise texture overlay',
    promptFragment:
      'subtle noise or grain texture overlay, tactile premium feel, vintage print quality, analog warmth',
  },
]

// ========================================
// Typography Categories
// ========================================

export const ogTypographyCategories: PromptCategory<OgTypographyStyle>[] = [
  {
    id: 'bold-modern',
    label: 'Bold Modern',
    labelKo: '볼드 모던',
    description: 'Heavy weight, impactful',
    promptFragment:
      'bold modern typography, heavy weight sans-serif, high visual impact, strong presence, commanding headlines',
  },
  {
    id: 'elegant-serif',
    label: 'Elegant Serif',
    labelKo: '우아한 세리프',
    description: 'Classic serif elegance',
    promptFragment:
      'elegant serif typography, classic refined letterforms, timeless sophistication, editorial quality',
  },
  {
    id: 'technical-mono',
    label: 'Technical Mono',
    labelKo: '테크니컬 모노',
    description: 'Monospace, developer-focused',
    promptFragment:
      'monospace typography, technical developer aesthetic, code-inspired precision, terminal-style clarity',
  },
  {
    id: 'playful-rounded',
    label: 'Playful Rounded',
    labelKo: '플레이풀 라운드',
    description: 'Friendly rounded letterforms',
    promptFragment:
      'playful rounded typography, friendly approachable letterforms, soft edges, cheerful personality',
  },
  {
    id: 'minimal-clean',
    label: 'Minimal Clean',
    labelKo: '미니멀 클린',
    description: 'Light weight, airy',
    promptFragment:
      'minimal clean typography, light weight, generous letter spacing, breathing room, zen-like clarity',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    labelKo: '에디토리얼',
    description: 'Magazine-style mixed weights',
    promptFragment:
      'editorial typography, mixed weights and sizes, magazine-style hierarchy, sophisticated pairing',
  },
  {
    id: 'handwritten-accent',
    label: 'Handwritten Accent',
    labelKo: '핸드라이팅 포인트',
    description: 'Script accent with sans body',
    promptFragment:
      'handwritten script accent with clean body text, personal touch, human feel, authentic expression',
  },
]

// ========================================
// Mood/Tone Categories
// ========================================

export const ogMoodCategories: PromptCategory<OgMoodTone>[] = [
  {
    id: 'professional',
    label: 'Professional',
    labelKo: '프로페셔널',
    description: 'Corporate, trustworthy',
    promptFragment:
      'professional corporate feel, trustworthy, established, reliable appearance, business-appropriate',
  },
  {
    id: 'creative',
    label: 'Creative',
    labelKo: '크리에이티브',
    description: 'Artistic, expressive',
    promptFragment:
      'creative artistic expression, unique visual approach, standout design, memorable impression',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    labelKo: '미니멀',
    description: 'Clean, simple, focused',
    promptFragment:
      'minimal clean aesthetic, essential elements only, maximum clarity, distraction-free focus',
  },
  {
    id: 'energetic',
    label: 'Energetic',
    labelKo: '에너제틱',
    description: 'Dynamic, exciting',
    promptFragment:
      'energetic dynamic feel, vibrant colors, movement and excitement, high-energy presence',
  },
  {
    id: 'luxurious',
    label: 'Luxurious',
    labelKo: '럭셔리',
    description: 'Premium, high-end',
    promptFragment:
      'luxurious premium aesthetic, high-end materials feel, sophisticated elegance, exclusive quality',
  },
  {
    id: 'friendly',
    label: 'Friendly',
    labelKo: '프렌들리',
    description: 'Approachable, warm',
    promptFragment:
      'friendly approachable warmth, inviting design, welcoming feel, inclusive personality',
  },
  {
    id: 'technical',
    label: 'Technical',
    labelKo: '테크니컬',
    description: 'Precise, data-driven',
    promptFragment:
      'technical precision, data-driven aesthetic, analytical clean look, engineering mindset',
  },
  {
    id: 'bold',
    label: 'Bold',
    labelKo: '볼드',
    description: 'Strong, confident',
    promptFragment:
      'bold confident statement, strong visual presence, commanding attention, unapologetic impact',
  },
]

// ========================================
// Export All Categories
// ========================================

export const allOgCategories = {
  layout: ogLayoutCategories,
  visual: ogVisualCategories,
  typography: ogTypographyCategories,
  mood: ogMoodCategories,
}
