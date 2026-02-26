import type { Project } from '@/types/database'

export async function generatePWAManifest(input: { project: Project }) {
  const { project } = input
  const manifest = {
    name: project.name,
    short_name: project.ai_short_slogan || project.name.substring(0, 12),
    description: project.ai_og_description || project.description || '',
    start_url: '/',
    display: 'standalone',
    background_color: project.primary_color_override || '#FFFFFF',
    theme_color: project.primary_color_override || '#000000',
    icons: [
      { src: './icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: './icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
  return { 'manifest.json': Buffer.from(JSON.stringify(manifest, null, 2)) }
}
