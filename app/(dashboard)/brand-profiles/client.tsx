'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ProfileCard } from '@/components/brand-profile/profile-card'
import { ProfileForm } from '@/components/brand-profile/profile-form'
import { DeleteDialog } from '@/components/brand-profile/delete-dialog'
import { useBrandProfileStore } from '@/store/brand-profile-store'
import { createBrandProfile, updateBrandProfile, deleteBrandProfile } from './actions'
import type { BrandProfile, Plan } from '@/types/database'
import type { BrandProfileFormValues } from '@/lib/validations/brand-profile'
import { PLAN_LIMITS } from '@/types/database'

interface BrandProfilesClientProps {
  initialProfiles: BrandProfile[]
  plan: Plan
}

export function BrandProfilesClient({ initialProfiles, plan }: BrandProfilesClientProps) {
  const {
    profiles, setProfiles, isFormOpen, editingProfile,
    openCreateForm, openEditForm, closeForm,
    addProfile, updateProfile, removeProfile,
  } = useBrandProfileStore()

  const [deleteTarget, setDeleteTarget] = useState<BrandProfile | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const limit = PLAN_LIMITS[plan].brand_profiles
  const atLimit = profiles.length >= limit

  useEffect(() => {
    setProfiles(initialProfiles)
  }, [initialProfiles, setProfiles])

  async function handleCreate(data: BrandProfileFormValues) {
    setIsSubmitting(true)
    const result = await createBrandProfile(data)
    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error)
      return
    }
    if (result.data) {
      addProfile(result.data)
      closeForm()
      toast.success('Profile created')
    }
  }

  async function handleUpdate(data: BrandProfileFormValues) {
    if (!editingProfile) return
    setIsSubmitting(true)
    const result = await updateBrandProfile(editingProfile.id, data)
    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error)
      return
    }
    if (result.data) {
      updateProfile(editingProfile.id, result.data)
      closeForm()
      toast.success('Profile updated')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteBrandProfile(deleteTarget.id)
    if (result.error) {
      toast.error(result.error)
      return
    }
    removeProfile(deleteTarget.id)
    setDeleteTarget(null)
    toast.success('Profile deleted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Brand Profiles</h1>
          <p className="text-sm text-text-secondary">
            {profiles.length}/{limit} profiles
          </p>
        </div>
        <Button onClick={openCreateForm} disabled={atLimit}>
          <Plus className="mr-2 h-4 w-4" /> New Profile
        </Button>
      </div>

      {atLimit && plan === 'free' && (
        <div className="rounded-md border border-warning/30 bg-warning/5 p-3">
          <p className="text-sm text-warning">
            Free plan allows 1 profile. <Badge variant="pro" className="ml-1">Upgrade to Pro</Badge> for up to 5.
          </p>
        </div>
      )}

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-text-secondary">No brand profiles yet.</p>
            <Button onClick={openCreateForm} className="mt-4">
              Create your first profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onEdit={openEditForm}
              onDelete={(id) => setDeleteTarget(profiles.find(p => p.id === id) ?? null)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent
          title={editingProfile ? 'Edit Profile' : 'New Brand Profile'}
          onClose={closeForm}
        >
          <ProfileForm
            mode={editingProfile ? 'edit' : 'create'}
            defaultValues={editingProfile ?? undefined}
            onSubmit={editingProfile ? handleUpdate : handleCreate}
            onCancel={closeForm}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        profileName={deleteTarget?.name ?? ''}
        onConfirm={handleDelete}
      />
    </div>
  )
}
