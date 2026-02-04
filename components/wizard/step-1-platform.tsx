'use client'

import { Globe, Smartphone, Monitor } from 'lucide-react'
import { useWizardStore } from '@/store/wizard-store'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import type { Platform, MobileTarget } from '@/types/database'

const PLATFORMS: { value: Platform; label: string; description: string; icon: React.ElementType }[] = [
  { value: 'web', label: 'Web', description: 'Website & web app', icon: Globe },
  { value: 'mobile', label: 'Mobile', description: 'Android / iOS app', icon: Smartphone },
  { value: 'all', label: 'All', description: 'Web + Mobile', icon: Monitor },
]

const MOBILE_TARGETS: { value: MobileTarget; label: string }[] = [
  { value: 'android', label: 'Android only' },
  { value: 'ios', label: 'iOS only' },
  { value: 'both', label: 'Both (Android + iOS)' },
]

export function Step1Platform() {
  const { platform, setPlatform } = useWizardStore()

  function handlePlatformSelect(value: Platform) {
    if (value === 'web') {
      setPlatform({ platform: value, mobileTarget: null })
    } else if (value === 'all') {
      setPlatform({ platform: value, mobileTarget: 'both' })
    } else {
      setPlatform({ platform: value, mobileTarget: platform.mobileTarget || 'both' })
    }
  }

  const showMobileOptions = platform.platform === 'mobile' || platform.platform === 'all'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Choose Platform</h2>
        <p className="text-sm text-text-secondary">
          Select the target platform for your project assets.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {PLATFORMS.map((p) => {
          const isSelected = platform.platform === p.value
          return (
            <button key={p.value} type="button" onClick={() => handlePlatformSelect(p.value)}>
              <Card className={cn(
                'transition-all',
                isSelected ? 'ring-2 ring-brand border-brand' : 'hover:border-border-hover'
              )}>
                <CardContent className="flex flex-col items-center gap-2 pt-6 pb-4">
                  <p.icon className={cn('h-8 w-8', isSelected ? 'text-brand' : 'text-text-tertiary')} />
                  <span className="text-sm font-medium">{p.label}</span>
                  <span className="text-xs text-text-tertiary">{p.description}</span>
                </CardContent>
              </Card>
            </button>
          )
        })}
      </div>

      {showMobileOptions && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-text-secondary">Mobile target</p>
          <div className="flex flex-col gap-2">
            {MOBILE_TARGETS.map((target) => (
              <label key={target.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mobileTarget"
                  checked={platform.mobileTarget === target.value}
                  onChange={() => setPlatform({ mobileTarget: target.value })}
                  disabled={platform.platform === 'all'}
                  className="text-brand"
                />
                <span className="text-sm text-text-primary">{target.label}</span>
              </label>
            ))}
          </div>
          {platform.platform === 'all' && (
            <p className="text-xs text-text-tertiary">
              &quot;All&quot; platform automatically targets both Android and iOS.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
