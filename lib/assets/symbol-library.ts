export interface SymbolMetadata {
  id: string
  name: string
  category: string
  lucideIcon: string
  keywords: string[]
}

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'business', label: 'Business' },
  { id: 'tech', label: 'Tech' },
  { id: 'design', label: 'Design' },
  { id: 'social', label: 'Social' },
  { id: 'misc', label: 'Misc' },
] as const

export const symbolLibrary: SymbolMetadata[] = [
  // Business
  { id: 'briefcase', name: 'Briefcase', category: 'business', lucideIcon: 'Briefcase', keywords: ['work', 'job', 'case'] },
  { id: 'chart-bar', name: 'Bar Chart', category: 'business', lucideIcon: 'BarChart3', keywords: ['chart', 'analytics', 'data'] },
  { id: 'target', name: 'Target', category: 'business', lucideIcon: 'Target', keywords: ['goal', 'aim', 'focus'] },
  { id: 'trending-up', name: 'Trending Up', category: 'business', lucideIcon: 'TrendingUp', keywords: ['growth', 'increase', 'profit'] },
  { id: 'wallet', name: 'Wallet', category: 'business', lucideIcon: 'Wallet', keywords: ['money', 'finance', 'payment'] },
  { id: 'building', name: 'Building', category: 'business', lucideIcon: 'Building2', keywords: ['company', 'office', 'corporate'] },
  { id: 'handshake', name: 'Handshake', category: 'business', lucideIcon: 'Handshake', keywords: ['deal', 'agreement', 'partner'] },
  { id: 'clipboard', name: 'Clipboard', category: 'business', lucideIcon: 'ClipboardList', keywords: ['list', 'tasks', 'checklist'] },
  { id: 'pie-chart', name: 'Pie Chart', category: 'business', lucideIcon: 'PieChart', keywords: ['chart', 'data', 'statistics'] },
  { id: 'trophy', name: 'Trophy', category: 'business', lucideIcon: 'Trophy', keywords: ['award', 'winner', 'prize'] },
  // Tech
  { id: 'code', name: 'Code', category: 'tech', lucideIcon: 'Code2', keywords: ['programming', 'develop', 'code'] },
  { id: 'cpu', name: 'CPU', category: 'tech', lucideIcon: 'Cpu', keywords: ['processor', 'chip', 'hardware'] },
  { id: 'zap', name: 'Zap', category: 'tech', lucideIcon: 'Zap', keywords: ['lightning', 'fast', 'power'] },
  { id: 'globe', name: 'Globe', category: 'tech', lucideIcon: 'Globe', keywords: ['world', 'web', 'internet'] },
  { id: 'database', name: 'Database', category: 'tech', lucideIcon: 'Database', keywords: ['data', 'storage', 'server'] },
  { id: 'cloud', name: 'Cloud', category: 'tech', lucideIcon: 'Cloud', keywords: ['cloud', 'hosting', 'saas'] },
  { id: 'terminal', name: 'Terminal', category: 'tech', lucideIcon: 'Terminal', keywords: ['console', 'command', 'cli'] },
  { id: 'shield', name: 'Shield', category: 'tech', lucideIcon: 'Shield', keywords: ['security', 'protection', 'safe'] },
  { id: 'rocket', name: 'Rocket', category: 'tech', lucideIcon: 'Rocket', keywords: ['launch', 'startup', 'speed'] },
  { id: 'wifi', name: 'WiFi', category: 'tech', lucideIcon: 'Wifi', keywords: ['wireless', 'connection', 'network'] },
  // Design
  { id: 'palette', name: 'Palette', category: 'design', lucideIcon: 'Palette', keywords: ['color', 'art', 'paint'] },
  { id: 'pen-tool', name: 'Pen Tool', category: 'design', lucideIcon: 'PenTool', keywords: ['draw', 'vector', 'path'] },
  { id: 'layers', name: 'Layers', category: 'design', lucideIcon: 'Layers', keywords: ['stack', 'overlay', 'depth'] },
  { id: 'image', name: 'Image', category: 'design', lucideIcon: 'Image', keywords: ['photo', 'picture', 'media'] },
  { id: 'figma', name: 'Figma', category: 'design', lucideIcon: 'Figma', keywords: ['design', 'ui', 'prototype'] },
  { id: 'layout', name: 'Layout', category: 'design', lucideIcon: 'LayoutGrid', keywords: ['grid', 'arrange', 'structure'] },
  { id: 'brush', name: 'Brush', category: 'design', lucideIcon: 'Paintbrush', keywords: ['paint', 'art', 'creative'] },
  { id: 'crop', name: 'Crop', category: 'design', lucideIcon: 'Crop', keywords: ['resize', 'trim', 'edit'] },
  { id: 'type', name: 'Type', category: 'design', lucideIcon: 'Type', keywords: ['text', 'font', 'typography'] },
  { id: 'eye', name: 'Eye', category: 'design', lucideIcon: 'Eye', keywords: ['view', 'visible', 'preview'] },
  // Social
  { id: 'share', name: 'Share', category: 'social', lucideIcon: 'Share2', keywords: ['share', 'send', 'distribute'] },
  { id: 'heart', name: 'Heart', category: 'social', lucideIcon: 'Heart', keywords: ['love', 'like', 'favorite'] },
  { id: 'message', name: 'Message', category: 'social', lucideIcon: 'MessageCircle', keywords: ['chat', 'talk', 'comment'] },
  { id: 'users', name: 'Users', category: 'social', lucideIcon: 'Users', keywords: ['people', 'group', 'team'] },
  { id: 'thumbs-up', name: 'Thumbs Up', category: 'social', lucideIcon: 'ThumbsUp', keywords: ['approve', 'good', 'like'] },
  { id: 'mail', name: 'Mail', category: 'social', lucideIcon: 'Mail', keywords: ['email', 'letter', 'inbox'] },
  { id: 'phone', name: 'Phone', category: 'social', lucideIcon: 'Phone', keywords: ['call', 'contact', 'mobile'] },
  { id: 'video', name: 'Video', category: 'social', lucideIcon: 'Video', keywords: ['camera', 'recording', 'stream'] },
  { id: 'at-sign', name: 'At Sign', category: 'social', lucideIcon: 'AtSign', keywords: ['email', 'mention', 'contact'] },
  { id: 'link', name: 'Link', category: 'social', lucideIcon: 'Link', keywords: ['url', 'chain', 'connect'] },
  // Misc
  { id: 'star', name: 'Star', category: 'misc', lucideIcon: 'Star', keywords: ['favorite', 'rating', 'bookmark'] },
  { id: 'bell', name: 'Bell', category: 'misc', lucideIcon: 'Bell', keywords: ['notification', 'alert', 'ring'] },
  { id: 'settings', name: 'Settings', category: 'misc', lucideIcon: 'Settings', keywords: ['gear', 'config', 'preferences'] },
  { id: 'search', name: 'Search', category: 'misc', lucideIcon: 'Search', keywords: ['find', 'look', 'magnify'] },
  { id: 'home', name: 'Home', category: 'misc', lucideIcon: 'Home', keywords: ['house', 'main', 'dashboard'] },
  { id: 'calendar', name: 'Calendar', category: 'misc', lucideIcon: 'Calendar', keywords: ['date', 'schedule', 'event'] },
  { id: 'clock', name: 'Clock', category: 'misc', lucideIcon: 'Clock', keywords: ['time', 'timer', 'watch'] },
  { id: 'bookmark', name: 'Bookmark', category: 'misc', lucideIcon: 'Bookmark', keywords: ['save', 'mark', 'tag'] },
  { id: 'compass', name: 'Compass', category: 'misc', lucideIcon: 'Compass', keywords: ['navigate', 'direction', 'explore'] },
  { id: 'box', name: 'Box', category: 'misc', lucideIcon: 'Box', keywords: ['package', 'product', 'container'] },
]
