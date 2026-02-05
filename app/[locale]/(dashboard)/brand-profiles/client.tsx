'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Sparkles } from 'lucide-react'
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
import { BRAND_PROFILE_TEMPLATES, type BrandProfileTemplate } from '@/lib/data/brand-profile-templates'

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
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<BrandProfileTemplate | null>(null)

  const limit = PLAN_LIMITS[plan].brand_profiles
  const atLimit = profiles.length >= limit

  useEffect(() => {
    setProfiles(initialProfiles)
  }, [initialProfiles, setProfiles])

  function handleTemplateSelect(template: BrandProfileTemplate) {
    setSelectedTemplate(template)
    openCreateForm()
  }

  function handleOpenCreateForm() {
    setSelectedTemplate(null)
    openCreateForm()
  }

  function handleCloseForm() {
    setSelectedTemplate(null)
    closeForm()
  }

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
      handleCloseForm()
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
      handleCloseForm()
      toast.success('Profile updated')
    }
  }

  async function handleDelete() {
    if (!deleteTarget || isDeleting) return
    setIsDeleting(true)
    try {
      const result = await deleteBrandProfile(deleteTarget.id)
      if (result.error) {
        toast.error(result.error)
        return
      }
      removeProfile(deleteTarget.id)
      setDeleteTarget(null)
      toast.success('Profile deleted')
    } finally {
      setIsDeleting(false)
    }
  }

  // 템플릿에서 기본값 생성
  const getDefaultValues = () => {
    if (editingProfile) return editingProfile
    if (selectedTemplate) {
      return {
        name: '',
        ...selectedTemplate.values,
      }
    }
    return undefined
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
        <Button onClick={handleOpenCreateForm} disabled={atLimit}>
          <Plus className="mr-2 h-4 w-4" /> New Profile
        </Button>
      </div>

      {atLimit && plan === 'free' && (
        <div className="rounded-md border border-warning/30 bg-warning/5 p-3">
          <p className="text-sm text-warning">
            Free plan allows {limit} profiles. <Badge variant="pro" className="ml-1">Upgrade to Pro</Badge> for up to 5.
          </p>
        </div>
      )}

      {profiles.length === 0 ? (
        <div className="space-y-6">
          {/* Template suggestions */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="border-b border-border bg-gradient-to-r from-accent/5 to-transparent px-6 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 ring-4 ring-accent/5">
                    <Sparkles className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Start with a template</h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      Choose a pre-designed style for your industry, or create from scratch
                    </p>
                  </div>
                </div>
              </div>

              {/* Templates grid */}
              <div className="p-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {BRAND_PROFILE_TEMPLATES.slice(0, 4).map((template, idx) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface text-left transition-all hover:border-accent/50 hover:shadow-lg animate-reveal-up"
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      {/* Color bar at top */}
                      <div
                        className="h-2 w-full transition-all group-hover:h-3"
                        style={{ backgroundColor: template.values.primary_color }}
                      />

                      <div className="flex flex-1 flex-col p-4">
                        {/* Icon and color swatch */}
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-2xl">{template.icon}</span>
                          <div className="flex -space-x-1.5">
                            <div
                              className="h-5 w-5 rounded-full ring-2 ring-surface"
                              style={{ backgroundColor: template.values.primary_color }}
                            />
                            {template.values.secondary_colors.slice(0, 2).map((color, i) => (
                              <div
                                key={i}
                                className="h-5 w-5 rounded-full ring-2 ring-surface"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>

                        <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                          {template.name}
                        </span>
                        <span className="mt-1 text-xs text-text-tertiary line-clamp-2">
                          {template.description}
                        </span>

                        {/* Hover indicator */}
                        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                          Use template
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* More templates & scratch option */}
                <div className="mt-6 flex flex-col items-center gap-3 border-t border-border pt-6 sm:flex-row sm:justify-center">
                  <Button variant="outline" onClick={handleOpenCreateForm} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Create from scratch
                  </Button>
                  {BRAND_PROFILE_TEMPLATES.length > 4 && (
                    <span className="text-xs text-text-tertiary">
                      +{BRAND_PROFILE_TEMPLATES.length - 4} more templates available
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleCloseForm()}>
        <DialogContent
          title={editingProfile ? 'Edit Profile' : selectedTemplate ? `New Profile: ${selectedTemplate.name}` : 'New Brand Profile'}
          onClose={handleCloseForm}
        >
          <ProfileForm
            mode={editingProfile ? 'edit' : 'create'}
            defaultValues={getDefaultValues()}
            onSubmit={editingProfile ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
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
