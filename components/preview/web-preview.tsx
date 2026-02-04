'use client'

import { BrowserMockup } from './browser-mockup'
import { SocialCardPreview } from './social-card-preview'

interface WebPreviewProps {
  projectName: string
  headline: string | null
  description: string | null
  bgColor: string
}

export function WebPreview({ projectName, headline, description, bgColor }: WebPreviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-text-secondary mb-3">Favicon Preview</h3>
        <BrowserMockup title={projectName}>
          <div className="flex items-center gap-2 p-4">
            <div
              className="flex h-8 w-8 items-center justify-center rounded text-xs font-bold text-white"
              style={{ backgroundColor: bgColor }}
            >
              {projectName.charAt(0)}
            </div>
            <span className="text-sm text-text-primary">{projectName}</span>
          </div>
        </BrowserMockup>
      </div>

      <div>
        <h3 className="text-sm font-medium text-text-secondary mb-3">Social Sharing</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <SocialCardPreview
            title={projectName}
            description={headline || description || ''}
            type="og"
            bgColor={bgColor}
          />
          <SocialCardPreview
            title={projectName}
            description={headline || description || ''}
            type="twitter"
            bgColor={bgColor}
          />
        </div>
      </div>
    </div>
  )
}
