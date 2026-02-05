import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Platform, IconType } from '@/types/database'
import type {
  WizardBrandData,
  WizardPlatformData,
  WizardProjectData,
  WizardStyleData,
  WizardIconData,
} from '@/types/wizard'

interface WizardState {
  currentStep: number
  brand: WizardBrandData
  platform: WizardPlatformData
  project: WizardProjectData
  style: WizardStyleData
  icon: WizardIconData

  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setBrand: (data: Partial<WizardBrandData>) => void
  setPlatform: (data: Partial<WizardPlatformData>) => void
  setProject: (data: Partial<WizardProjectData>) => void
  setStyle: (data: Partial<WizardStyleData>) => void
  setIcon: (data: Partial<WizardIconData>) => void
  reset: () => void
  canProceed: (step: number) => boolean
}

const initialState = {
  currentStep: 0,
  brand: { brandProfileId: null, skipBrandProfile: false } as WizardBrandData,
  platform: { platform: 'web' as Platform, mobileTarget: null } as WizardPlatformData,
  project: {
    name: '',
    description: '',
    aiHeadline: null,
    aiTagline: null,
    aiOgDescription: null,
    aiShortSlogan: null,
  } as WizardProjectData,
  style: { stylePresetId: null, primaryColorOverride: null } as WizardStyleData,
  icon: { iconType: null as IconType | null, iconValue: null } as WizardIconData,
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 5) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

      setBrand: (data) => set((s) => ({ brand: { ...s.brand, ...data } })),
      setPlatform: (data) => set((s) => ({ platform: { ...s.platform, ...data } })),
      setProject: (data) => set((s) => ({ project: { ...s.project, ...data } })),
      setStyle: (data) => set((s) => ({ style: { ...s.style, ...data } })),
      setIcon: (data) => set((s) => ({ icon: { ...s.icon, ...data } })),

      reset: () => set(initialState),

      canProceed: (step) => {
        const state = get()
        switch (step) {
          case 0:
            return !!state.brand.brandProfileId || state.brand.skipBrandProfile
          case 1:
            return !!state.platform.platform &&
              (state.platform.platform !== 'mobile' || !!state.platform.mobileTarget)
          case 2:
            return state.project.name.trim().length > 0
          case 3:
            return !!state.style.stylePresetId
          case 4:
            return !!state.icon.iconType && !!state.icon.iconValue
          default:
            return true
        }
      },
    }),
    {
      name: 'brandkit-wizard',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
