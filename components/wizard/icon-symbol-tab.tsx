'use client'

import { useState, useMemo } from 'react'
import * as LucideIcons from 'lucide-react'
import { useWizardStore } from '@/store/wizard-store'
import { symbolLibrary, categories } from '@/lib/assets/symbol-library'
import { Select } from '@/components/ui/select'
import { cn } from '@/lib/utils/cn'

type LucideIconComponent = React.FC<{ className?: string }>

function getLucideIcon(name: string): LucideIconComponent | null {
  const icons = LucideIcons as Record<string, unknown>
  const icon = icons[name]
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
    return icon as LucideIconComponent
  }
  return null
}

export function IconSymbolTab() {
  const { icon, setIcon } = useWizardStore()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredSymbols = useMemo(() => {
    if (selectedCategory === 'all') return symbolLibrary
    return symbolLibrary.filter((s) => s.category === selectedCategory)
  }, [selectedCategory])

  function handleSelect(symbolId: string) {
    setIcon({ iconType: 'symbol', iconValue: symbolId })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        Choose a symbol from the library for your icon.
      </p>

      <Select
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        options={categories.map((c) => ({ value: c.id, label: c.label }))}
      />

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10">
        {filteredSymbols.map((symbol) => {
          const IconComponent = getLucideIcon(symbol.lucideIcon)
          const isSelected = icon.iconType === 'symbol' && icon.iconValue === symbol.id

          return (
            <button
              key={symbol.id}
              type="button"
              onClick={() => handleSelect(symbol.id)}
              title={symbol.name}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-lg border transition-all',
                isSelected
                  ? 'border-brand bg-brand/10 ring-2 ring-brand'
                  : 'border-border bg-surface hover:border-border-hover'
              )}
            >
              {IconComponent ? (
                <IconComponent className={cn('h-5 w-5', isSelected ? 'text-brand' : 'text-text-secondary')} />
              ) : (
                <span className="text-xs text-text-tertiary">?</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
