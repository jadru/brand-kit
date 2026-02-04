-- FREE presets (3)
INSERT INTO public.style_presets (name, slug, is_free, best_for_styles, icon_style, corner_radius, shadow_style, color_mode, og_layout, og_typography, og_background, ai_style_modifier, sort_order)
VALUES
  (
    'Notion Minimal',
    'notion-minimal',
    true,
    ARRAY['minimal'],
    'Outline / Line art',
    8,
    'None',
    'Monochrome',
    'Left-aligned, icon beside text',
    'Inter, Medium',
    'Pure white (#FFFFFF)',
    'clean lines, simple shapes, whitespace, understated, elegant simplicity, Notion-style',
    1
  ),
  (
    'Airbnb 3D',
    'airbnb-3d',
    true,
    ARRAY['playful'],
    '3D with soft shadows',
    22,
    'Soft drop shadow',
    'Solid with gradient overlay',
    'Centered, large icon',
    'Plus Jakarta Sans, Bold',
    'Light warm gradient',
    'soft 3D render, subtle shadows, rounded, depth, warm, friendly, Airbnb-style',
    2
  ),
  (
    'Stripe Gradient',
    'stripe-gradient',
    true,
    ARRAY['tech'],
    'Gradient fill with glow',
    16,
    'Colored glow',
    'Gradient',
    'Centered, dark background',
    'Inter, Semibold',
    'Dark gradient',
    'gradient fill, glowing edges, futuristic, sleek, Stripe-style',
    3
  );

-- PRO presets (5)
INSERT INTO public.style_presets (name, slug, is_free, best_for_styles, icon_style, corner_radius, shadow_style, color_mode, og_layout, og_typography, og_background, ai_style_modifier, sort_order)
VALUES
  (
    'Linear Dark',
    'linear-dark',
    false,
    ARRAY['tech', 'minimal'],
    'Outline with neon accent',
    12,
    'Subtle neon glow',
    'Dark with accent',
    'Left-aligned, dark background',
    'Inter, Medium',
    'Dark (#0A0A0A) with subtle gradient',
    'dark background, neon accent lines, futuristic, Linear-style',
    4
  ),
  (
    'Vercel Sharp',
    'vercel-sharp',
    false,
    ARRAY['minimal', 'corporate'],
    'Geometric, monochrome',
    0,
    'None',
    'Pure monochrome',
    'Centered, large text',
    'Geist, Bold',
    'Pure black or white',
    'extreme minimalism, geometric, black and white only, Vercel-style',
    5
  ),
  (
    'Glassmorphism',
    'glassmorphism',
    false,
    ARRAY['tech', 'playful'],
    'Frosted glass effect',
    16,
    'Glass blur + subtle border',
    'Translucent gradient',
    'Centered, blur background',
    'Inter, Semibold',
    'Gradient with blur overlay',
    'frosted glass, translucent, blur background, subtle borders, glass morphism',
    6
  ),
  (
    'Duolingo Playful',
    'duolingo-playful',
    false,
    ARRAY['playful'],
    'Bold 3D, chunky',
    24,
    'Hard drop shadow',
    'Bright solid colors',
    'Centered, playful layout',
    'Nunito, Extra Bold',
    'Bright solid color',
    'bright 3D, chunky shapes, hard shadows, playful, cheerful, Duolingo-style',
    7
  ),
  (
    'Figma Clean',
    'figma-clean',
    false,
    ARRAY['corporate', 'minimal'],
    'Clean filled',
    8,
    'Minimal shadow',
    'Clean with accent',
    'Grid layout, balanced',
    'Inter, Regular',
    'Light gray (#F5F5F5)',
    'clean design, balanced composition, minimal shadows, Figma-style',
    8
  );
