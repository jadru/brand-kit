'use client'

import { useEffect } from 'react'
import { useWizardStore } from '@/store/wizard-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function IconTextTab() {
  const { icon, setIcon, project } = useWizardStore()

  const defaultLetter = project.name?.charAt(0)?.toUpperCase() || 'A'
  const currentValue = icon.iconType === 'text' ? (icon.iconValue || defaultLetter) : defaultLetter

  useEffect(() => {
    if (icon.iconType !== 'text') {
      setIcon({ iconType: 'text', iconValue: defaultLetter })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(value: string) {
    const trimmed = value.slice(0, 2).toUpperCase()
    setIcon({ iconType: 'text', iconValue: trimmed })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        Use one or two letters as your icon. The first letter of your project name is used by default.
      </p>

      <div className="flex items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="iconLetter">Letter(s)</Label>
          <Input
            id="iconLetter"
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            className="w-20 text-center text-lg font-bold"
            maxLength={2}
          />
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-secondary text-2xl font-bold text-text-primary">
          {currentValue}
        </div>
      </div>
    </div>
  )
}
