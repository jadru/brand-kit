import { z } from 'zod'

export const brandProfileSchema = z.object({
  name: z.string()
    .min(1, 'Brand name is required')
    .max(50, 'Must be 50 characters or less'),

  style_direction: z.enum(
    ['minimal', 'playful', 'corporate', 'tech', 'custom'],
    { error: 'Select a style direction' }
  ),

  primary_color: z.string()
    .regex(/^#([0-9a-fA-F]{6})$/, 'Enter a valid HEX color')
    .default('#000000'),

  secondary_colors: z.array(
    z.string().regex(/^#([0-9a-fA-F]{6})$/)
  ).max(3, 'Maximum 3 secondary colors')
   .default([]),

  color_mode: z.enum(['mono', 'duotone', 'gradient', 'vibrant'])
    .default('mono'),

  icon_style: z.enum(['outline', 'filled', '3d_soft', 'flat'])
    .default('outline'),

  corner_style: z.enum(['sharp', 'rounded', 'pill'])
    .default('rounded'),

  typography_mood: z.string().max(100).optional().nullable(),

  keywords: z.array(z.string()).max(10).default([]),

  is_default: z.boolean().default(false),
})

export type BrandProfileFormValues = z.infer<typeof brandProfileSchema>
