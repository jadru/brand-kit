'use client'

import { PhoneMockup } from './phone-mockup'

interface MobilePreviewProps {
  projectName: string
  bgColor: string
  mobileTarget: string | null
}

export function MobilePreview({ projectName, bgColor, mobileTarget }: MobilePreviewProps) {
  const showIos = mobileTarget === 'ios' || mobileTarget === 'both'
  const showAndroid = mobileTarget === 'android' || mobileTarget === 'both'

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-text-secondary">App Icon & Splash Preview</h3>

      <div className="flex flex-wrap justify-center gap-8">
        {showIos && (
          <div className="text-center">
            <PhoneMockup device="iphone">
              <div className="flex h-full flex-col items-center justify-center" style={{ backgroundColor: bgColor }}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white">
                  {projectName.charAt(0)}
                </div>
                <p className="mt-3 text-sm font-medium text-white">{projectName}</p>
              </div>
            </PhoneMockup>
            <p className="mt-2 text-xs text-text-tertiary">iOS</p>
          </div>
        )}

        {showAndroid && (
          <div className="text-center">
            <PhoneMockup device="android">
              <div className="flex h-full flex-col items-center justify-center" style={{ backgroundColor: bgColor }}>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white">
                  {projectName.charAt(0)}
                </div>
                <p className="mt-3 text-sm font-medium text-white">{projectName}</p>
              </div>
            </PhoneMockup>
            <p className="mt-2 text-xs text-text-tertiary">Android</p>
          </div>
        )}
      </div>
    </div>
  )
}
