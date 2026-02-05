'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useWizardStore } from '@/store/wizard-store'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ProfileForm } from '@/components/brand-profile/profile-form'
import { PlanGate } from '@/components/shared/plan-gate'
import { cn } from '@/lib/utils/cn'
import { PLAN_LIMITS, type BrandProfile, type Plan } from '@/types/database'
import type { BrandProfileFormValues } from '@/lib/validations/brand-profile'
import { createBrandProfile } from '@/app/[locale]/(dashboard)/brand-profiles/actions'

interface Step0BrandProps {
  profiles: BrandProfile[]
  plan: Plan
}

export function Step0Brand({ profiles, plan }: Step0BrandProps) {
  const { brand, setBrand } = useWizardStore()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [localProfiles, setLocalProfiles] = useState(profiles)
  const [isCreating, setIsCreating] = useState(false)

  const profileLimit = PLAN_LIMITS[plan].brand_profiles
  const canCreateMore = localProfiles.length < profileLimit

  function handleSelectProfile(id: string) {
    setBrand({ brandProfileId: id, skipBrandProfile: false })
  }

  function handleSkip() {
    setBrand({ brandProfileId: null, skipBrandProfile: true })
  }

  async function handleCreateProfile(data: BrandProfileFormValues) {
    setIsCreating(true)
    try {
      const result = await createBrandProfile(data)
      if (result.error) {
        toast.error(result.error)
        return
      }
      if (result.data) {
        setLocalProfiles((prev) => [...prev, result.data!])
        setBrand({ brandProfileId: result.data.id, skipBrandProfile: false })
        setShowCreateForm(false)
        toast.success('Brand profile created')
      }
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Select Brand Profile</h2>
        <p className="text-sm text-text-secondary">
          Choose a brand profile to apply consistent styling, or proceed without one.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {localProfiles.map((profile) => (
          <button
            key={profile.id}
            type="button"
            onClick={() => handleSelectProfile(profile.id)}
            aria-label={`${profile.name} 브랜드 프로필 선택`}
            aria-pressed={brand.brandProfileId === profile.id}
            className="text-left"
          >
            <Card className={cn(
              'transition-all',
              brand.brandProfileId === profile.id
                ? 'ring-2 ring-brand border-brand'
                : 'hover:border-border-hover'
            )}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-md border border-border"
                    style={{ backgroundColor: profile.primary_color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{profile.name}</p>
                    <p className="text-xs text-text-tertiary capitalize">{profile.style_direction}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}

        {canCreateMore ? (
          <button type="button" onClick={() => setShowCreateForm(true)} aria-label="새 브랜드 프로필 생성" className="text-left">
            <Card className="border-dashed transition-all hover:border-brand">
              <CardContent className="flex items-center justify-center gap-2 pt-4">
                <Plus className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
                <span className="text-sm text-text-secondary">New Brand</span>
              </CardContent>
            </Card>
          </button>
        ) : (
          <PlanGate feature="Additional brand profiles" currentPlan={plan} requiredPlan="pro">
            <button type="button" onClick={() => setShowCreateForm(true)} aria-label="새 브랜드 프로필 생성" className="text-left">
              <Card className="border-dashed transition-all hover:border-brand">
                <CardContent className="flex items-center justify-center gap-2 pt-4">
                  <Plus className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
                  <span className="text-sm text-text-secondary">New Brand</span>
                </CardContent>
              </Card>
            </button>
          </PlanGate>
        )}
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={brand.skipBrandProfile}
          onChange={(e) => {
            if (e.target.checked) handleSkip()
            else setBrand({ skipBrandProfile: false })
          }}
          className="rounded border-border"
        />
        <span className="text-sm text-text-secondary">Proceed without a brand profile (this project only)</span>
      </label>

      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent title="New Brand Profile" onClose={() => setShowCreateForm(false)}>
          <ProfileForm
            mode="create"
            onSubmit={handleCreateProfile}
            onCancel={() => setShowCreateForm(false)}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
