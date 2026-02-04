'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { IconTextTab } from './icon-text-tab'
import { IconSymbolTab } from './icon-symbol-tab'
import { IconAiTab } from './icon-ai-tab'
import type { BrandProfile, Plan, User } from '@/types/database'

interface Step4IconProps {
  plan: Plan
  user: User
  brandProfile: BrandProfile | null
}

export function Step4Icon({ plan, user, brandProfile }: Step4IconProps) {
  const [activeTab, setActiveTab] = useState('text')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Choose Icon Symbol</h2>
        <p className="text-sm text-text-secondary">
          Pick a text, symbol, or AI-generated icon for your project.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="symbol">Symbol</TabsTrigger>
          <TabsTrigger value="ai">AI Generate {plan === 'free' && '(Pro)'}</TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <IconTextTab />
        </TabsContent>
        <TabsContent value="symbol">
          <IconSymbolTab />
        </TabsContent>
        <TabsContent value="ai">
          <IconAiTab plan={plan} user={user} brandProfile={brandProfile} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
