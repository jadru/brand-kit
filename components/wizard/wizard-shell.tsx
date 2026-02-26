'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useWizardStore } from '@/store/wizard-store'
import { createClient } from '@/lib/supabase/client'
import { StepIndicator } from './step-indicator'
import { Step0Brand } from './step-0-brand'
import { Step1Platform } from './step-1-platform'
import { Step2ProjectInfo } from './step-2-project-info'
import { Step3Style } from './step-3-style'
import { Step4Icon } from './step-4-icon'
import { Step5Preview } from './step-5-preview'
import { Button } from '@/components/ui/button'
import type { BrandProfile, StylePreset, User, Plan } from '@/types/database'

interface WizardShellProps {
  brandProfiles: BrandProfile[]
  stylePresets: StylePreset[]
  user: User
}

const STEPS = [
  { label: 'Brand', description: 'Select brand profile' },
  { label: 'Platform', description: 'Choose target platform' },
  { label: 'Project', description: 'Enter project info' },
  { label: 'Style', description: 'Pick style preset' },
  { label: 'Icon', description: 'Choose icon symbol' },
  { label: 'Done', description: 'Preview & download' },
]

export function WizardShell({ brandProfiles, stylePresets, user }: WizardShellProps) {
  const store = useWizardStore()
  const { currentStep, setStep, nextStep, prevStep, canProceed, brand } = store
  const containerRef = useRef<HTMLDivElement>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [currentStep])

  const plan = user.plan as Plan
  const selectedProfile = brandProfiles.find((p) => p.id === brand.brandProfileId) ?? null

  // Resolve primary color from brand profile or style override
  const primaryColor =
    store.style.primaryColorOverride ||
    selectedProfile?.primary_color ||
    '#6366f1'

  function handleStepClick(step: number) {
    if (step < currentStep) setStep(step)
  }

  async function handleFinish() {
    setIsSaving(true)
    setSaveError(null)

    try {
      const supabase = createClient()

      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          brand_profile_id: store.brand.brandProfileId,
          style_preset_id: store.style.stylePresetId!,
          name: store.project.name,
          description: store.project.description || null,
          platform: store.platform.platform,
          mobile_target: store.platform.mobileTarget,
          primary_color_override: store.style.primaryColorOverride,
          icon_type: store.icon.iconType,
          icon_value: store.icon.iconValue,
          ai_headline: store.project.aiHeadline,
          ai_tagline: store.project.aiTagline,
          ai_og_description: store.project.aiOgDescription,
          ai_short_slogan: store.project.aiShortSlogan,
          status: 'draft' as const,
        })
        .select()
        .single()

      if (error || !project) {
        setSaveError('프로젝트 저장에 실패했습니다.')
        setIsSaving(false)
        return
      }

      // Increment usage
      await supabase.rpc('increment_usage', {
        p_user_id: user.id,
        p_field_name: 'projects_used_this_month',
      })

      setProjectId(project.id)
      store.reset()
      nextStep()
    } catch {
      setSaveError('프로젝트 저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  function handleNext() {
    if (currentStep === 4) {
      handleFinish()
    } else {
      nextStep()
    }
  }

  function renderStep() {
    switch (currentStep) {
      case 0:
        return <Step0Brand profiles={brandProfiles} plan={plan} />
      case 1:
        return <Step1Platform />
      case 2:
        return <Step2ProjectInfo user={user} brandProfile={selectedProfile} />
      case 3:
        return <Step3Style presets={stylePresets} brandProfile={selectedProfile} plan={plan} />
      case 4: {
        const selectedPreset = stylePresets.find((p) => p.id === store.style.stylePresetId) ?? null
        return <Step4Icon plan={plan} user={user} brandProfile={selectedProfile} stylePreset={selectedPreset} />
      }
      case 5:
        return (
          <Step5Preview
            projectId={projectId}
            projectName={store.project.name}
            platform={store.platform.platform}
            mobileTarget={store.platform.mobileTarget}
            primaryColor={primaryColor}
            headline={store.project.aiHeadline}
            description={store.project.description || null}
            aiOgDescription={store.project.aiOgDescription}
            aiTagline={store.project.aiTagline}
          />
        )
      default:
        return null
    }
  }

  return (
    <div ref={containerRef} className="space-y-8">
      <StepIndicator
        steps={STEPS}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      <div className="min-h-[300px]">
        {renderStep()}
      </div>

      {saveError && (
        <p className="text-center text-sm text-status-error">{saveError}</p>
      )}

      {currentStep < 5 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0 || isSaving}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed(currentStep) || isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {currentStep === 4 ? 'Generate Assets' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  )
}
