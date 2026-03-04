'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import { IconTextTab } from './icon-text-tab'
import { IconSymbolTab } from './icon-symbol-tab'
import { IconAiTab } from './icon-ai-tab'
import type { BrandProfile, Plan, StylePreset, User } from '@/types/database'

interface Step4IconProps {
  plan: Plan
  user: User
  brandProfile: BrandProfile | null
  stylePreset: StylePreset | null
}

export function Step4Icon({ plan, user, brandProfile, stylePreset }: Step4IconProps) {
  const [activeTab, setActiveTab] = useState('text')
  const t = useTranslations('wizard.iconStep')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{t('title')}</h2>
        <p className="text-sm text-text-secondary">
          {t('description')}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="text">{t('tabs.text')}</TabsTrigger>
          <TabsTrigger value="symbol">{t('tabs.symbol')}</TabsTrigger>
          <TabsTrigger value="ai">
            {t('tabs.ai')} {plan === 'free' && t('tabs.aiPro')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <IconTextTab />
        </TabsContent>
        <TabsContent value="symbol">
          <IconSymbolTab />
        </TabsContent>
        <TabsContent value="ai">
          <IconAiTab plan={plan} user={user} brandProfile={brandProfile} stylePreset={stylePreset} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
