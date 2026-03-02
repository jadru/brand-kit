-- Add OG AI style modifier and icon negative prompt fields to style_presets
ALTER TABLE public.style_presets ADD COLUMN og_ai_style_modifier TEXT;
ALTER TABLE public.style_presets ADD COLUMN icon_ai_negative_prompt TEXT;

-- Update all 8 presets with expanded AI modifiers

-- FREE presets
UPDATE public.style_presets SET
  ai_style_modifier = 'clean minimal line art icon, single thin stroke, monochrome flat design, Notion-inspired simplicity, geometric precision, ample whitespace, no gradients, no shadows, elegant understated professional, Notion-style',
  og_ai_style_modifier = 'abstract minimal background, vast white space with a single thin geometric line accent, subtle light gray to white gradient, editorial negative space, extremely clean and empty, no objects, no patterns, ultra-minimalist composition, Notion-inspired aesthetic',
  icon_ai_negative_prompt = 'cluttered, busy, colorful, vibrant, gradients, 3d, shadows, depth, text, letters, words, watermark, photo-realistic, complex details, organic shapes'
WHERE slug = 'notion-minimal';

UPDATE public.style_presets SET
  ai_style_modifier = 'soft 3D rendered icon, clay-like material with gentle lighting, rounded puffy forms, subtle warm shadows, depth and dimension, smooth surfaces, warm color palette, friendly approachable character, Airbnb-style premium 3D aesthetic',
  og_ai_style_modifier = 'warm soft 3D abstract landscape, gentle pastel gradient flowing from warm peach to soft rose, floating rounded organic shapes with soft shadows, ambient diffused lighting, clay render aesthetic, dreamy shallow depth of field, cozy inviting atmosphere, Airbnb-inspired warmth',
  icon_ai_negative_prompt = 'sharp edges, angular, dark, grungy, text, letters, words, watermark, flat 2D design, harsh lighting, cold colors, realistic photo'
WHERE slug = 'airbnb-3d';

UPDATE public.style_presets SET
  ai_style_modifier = 'sleek gradient-filled icon, smooth color transitions from deep purple to electric blue, glowing luminous edges, futuristic and premium feel, neon-like accent highlights, modern tech aesthetic, Stripe-style refined gradient design',
  og_ai_style_modifier = 'dark cosmic gradient background, deep midnight blue transitioning to rich purple aurora, subtle glowing light streaks and rays, futuristic abstract atmosphere, smooth silk-like color transitions, ethereal glow effect, premium tech aesthetic, Stripe-inspired dark elegance',
  icon_ai_negative_prompt = 'bright white background, cluttered, cartoonish, childish, text, letters, words, watermark, realistic photo, matte flat, no glow'
WHERE slug = 'stripe-gradient';

-- PRO presets
UPDATE public.style_presets SET
  ai_style_modifier = 'dark minimal icon with neon accent lines, thin luminous stroke on deep black, futuristic interface aesthetic, subtle glow effect, precise geometric forms, technical minimalism, Linear-style dark mode design',
  og_ai_style_modifier = 'deep dark matte background with subtle neon accent lines, minimal geometric grid pattern fading into darkness, faint glowing edges and hairline traces of light, deep space technical feel, ultra-clean dark composition, Linear-inspired dark interface aesthetic',
  icon_ai_negative_prompt = 'bright colors, colorful, busy, organic shapes, natural, text, letters, words, watermark, illustration style, cartoon, 3D, rounded soft'
WHERE slug = 'linear-dark';

UPDATE public.style_presets SET
  ai_style_modifier = 'extreme minimalist geometric icon, pure black and white only, sharp mathematical precision, stark high contrast, bold negative space, no color, no gradients, brutalist aesthetic, Vercel-style monochrome perfection',
  og_ai_style_modifier = 'pure monochrome abstract composition, stark geometric shapes in absolute black and white, extreme high contrast, sharp mathematical angular forms, brutalist minimalist aesthetic, bold negative space, Vercel-inspired monochrome precision',
  icon_ai_negative_prompt = 'color, gradient, soft, rounded, organic, curves, text, letters, words, watermark, 3D, shadows, depth, decoration, ornament'
WHERE slug = 'vercel-sharp';

UPDATE public.style_presets SET
  ai_style_modifier = 'frosted glass effect icon, translucent layers with blur backdrop, semi-transparent overlapping panels, modern glassmorphism UI aesthetic, subtle refraction and light diffusion, iridescent edge highlights, glass morphism style',
  og_ai_style_modifier = 'vibrant gradient background with frosted glass panel overlays, bokeh light orbs floating in soft focus, translucent overlapping rectangular shapes with blurred edges, soft diffused light layers, modern premium UI glassmorphism aesthetic, iridescent color reflections',
  icon_ai_negative_prompt = 'flat, opaque, dull, dark, solid, matte, text, letters, words, watermark, realistic, harsh edges, sharp contrast'
WHERE slug = 'glassmorphism';

UPDATE public.style_presets SET
  ai_style_modifier = 'bright chunky 3D icon, bold geometric blocks with hard drop shadows, playful cartoon aesthetic, vivid saturated colors, bouncy rounded forms, cheerful energetic character, thick outlines, Duolingo-style fun 3D design',
  og_ai_style_modifier = 'bright vivid solid color background, chunky 3D abstract shapes floating with hard drop shadows, playful geometric building blocks scattered, bold cartoon aesthetic, cheerful energetic composition, saturated candy-like colors, Duolingo-inspired playful exuberance',
  icon_ai_negative_prompt = 'muted, dark, desaturated, minimalist, serious, corporate, text, letters, words, watermark, realistic, subtle, thin lines, monochrome'
WHERE slug = 'duolingo-playful';

UPDATE public.style_presets SET
  ai_style_modifier = 'clean balanced icon design, minimal subtle shadow, neutral professional composition, harmonious proportions, systematic design grid alignment, light and airy feel, Figma-style clean design system aesthetic',
  og_ai_style_modifier = 'light neutral off-white background, subtle geometric grid lines barely visible, clean thin accent lines, perfectly balanced whitespace composition, faint pastel accent color rectangular shapes, design system precision aesthetic, Figma-inspired clean systematic layout',
  icon_ai_negative_prompt = 'dark, busy, heavy gradients, 3D, organic, chaotic, text, letters, words, watermark, loud colors, harsh shadows, complex details'
WHERE slug = 'figma-clean';
