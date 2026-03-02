-- ============================================================
-- 011: 프리셋별 전용 아이콘 AI 프롬프트 템플릿
-- ============================================================
-- 각 스타일 프리셋에 최적화된 프롬프트 템플릿을 저장합니다.
-- {description} 플레이스홀더가 사용자 입력으로 치환됩니다.
-- ============================================================

ALTER TABLE public.style_presets
  ADD COLUMN icon_ai_prompt_template TEXT;

-- Notion Minimal: 클린 라인아트, 모노크롬, 극도의 미니멀리즘
UPDATE public.style_presets SET icon_ai_prompt_template =
  '{description}. Clean single-stroke line icon, monochrome black on white, ultra-minimal Notion-style design. Thin precise outlines only, no fill, no gradients, no shadows. Geometric simplicity, maximum whitespace, single centered symbol. Vector-clean edges, perfectly symmetric, app icon composition. High quality render, no text, no letters, no watermark.'
WHERE slug = 'notion-minimal';

-- Airbnb 3D: 소프트 클레이 렌더, 따뜻한 파스텔, 통통한 폼
UPDATE public.style_presets SET icon_ai_prompt_template =
  '{description}. Soft 3D clay render icon, warm pastel color palette, Airbnb-style rounded plush forms. Gentle diffused lighting from above-left, subtle soft shadow on white background. Smooth matte material like Play-Doh or polymer clay, friendly approachable character. Single centered 3D object, slightly rounded square composition. High quality 3D render, no text, no letters, no watermark.'
WHERE slug = 'airbnb-3d';

-- Stripe Gradient: 루미너스 그라디언트, 다크 프리미엄 느낌
UPDATE public.style_presets SET icon_ai_prompt_template =
  '{description}. Sleek gradient-filled icon, smooth color transition from deep indigo-purple to electric blue, Stripe-style premium tech aesthetic. Subtle luminous glow on edges, dark navy or black background. Modern minimalist shape with refined curves, futuristic and polished. Single centered glowing icon, square composition. High quality render, no text, no letters, no watermark.'
WHERE slug = 'stripe-gradient';

-- Linear Dark: 네온 라인 on 다크 배경
UPDATE public.style_presets SET icon_ai_prompt_template =
  '{description}. Thin neon-accent line icon on pure black background, Linear-style dark mode design. Single bright accent color stroke (electric blue or purple) on #0A0A0A, minimal geometric forms. Precise technical linework, subtle glow bloom on strokes, futuristic interface aesthetic. Single centered icon, square composition. High quality render, no text, no letters, no watermark.'
WHERE slug = 'linear-dark';

-- Vercel Sharp: 순수 블랙&화이트, 수학적 기하학, 브루탈리즘
UPDATE public.style_presets SET icon_ai_prompt_template =
  '{description}. Pure black and white geometric icon, Vercel-style brutalist minimalism. Sharp mathematical precision, zero color, zero gradients, zero shadows. Bold negative space, stark high contrast, angular forms with exact 90-degree edges. Single centered monochrome symbol, square composition. High quality vector render, no text, no letters, no watermark.'
WHERE slug = 'vercel-sharp';

-- Glassmorphism: 프로스티드 글라스 레이어
UPDATE public.style_presets SET icon_ai_prompt_template =
  '{description}. Frosted glass effect icon, glassmorphism UI style. Semi-transparent layers with blurred backdrop, subtle white border highlight, soft iridescent color refraction. Translucent overlapping panels on a vibrant gradient background. Modern premium glass aesthetic, smooth rounded corners. Single centered glass icon, square composition. High quality render, no text, no letters, no watermark.'
WHERE slug = 'glassmorphism';

-- Duolingo Playful: 청키 볼드 3D, 비비드 카툰
UPDATE public.style_presets SET icon_ai_prompt_template =
  '{description}. Bright chunky 3D cartoon icon, Duolingo-style bold playful design. Vivid saturated candy colors, thick dark outlines, hard drop shadows offset bottom-right. Bouncy rounded geometric blocks, cheerful energetic character, friendly fun aesthetic. Single centered chunky 3D icon on white background, square composition. High quality render, no text, no letters, no watermark.'
WHERE slug = 'duolingo-playful';

-- Figma Clean: 밸런스드 시스템 디자인, 뉴트럴
UPDATE public.style_presets SET icon_ai_prompt_template =
  '{description}. Clean balanced icon design, Figma-style systematic aesthetic. Neutral tones with one subtle accent color, minimal soft shadow, light airy composition. Precise grid-aligned proportions, harmonious spacing, professional polish. Simple filled shape with rounded corners on white background. Single centered icon, square composition. High quality vector render, no text, no letters, no watermark.'
WHERE slug = 'figma-clean';
