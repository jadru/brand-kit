import { create } from 'zustand'
import type { BrandProfile } from '@/types/database'

interface BrandProfileState {
  profiles: BrandProfile[]
  selectedProfile: BrandProfile | null
  isFormOpen: boolean
  editingProfile: BrandProfile | null

  setProfiles: (profiles: BrandProfile[]) => void
  selectProfile: (profile: BrandProfile | null) => void
  openCreateForm: () => void
  openEditForm: (profile: BrandProfile) => void
  closeForm: () => void
  addProfile: (profile: BrandProfile) => void
  updateProfile: (id: string, profile: BrandProfile) => void
  removeProfile: (id: string) => void
}

export const useBrandProfileStore = create<BrandProfileState>((set) => ({
  profiles: [],
  selectedProfile: null,
  isFormOpen: false,
  editingProfile: null,

  setProfiles: (profiles) => set({ profiles }),
  selectProfile: (profile) => set({ selectedProfile: profile }),
  openCreateForm: () => set({ isFormOpen: true, editingProfile: null }),
  openEditForm: (profile) => set({ isFormOpen: true, editingProfile: profile }),
  closeForm: () => set({ isFormOpen: false, editingProfile: null }),
  addProfile: (profile) =>
    set((state) => ({ profiles: [profile, ...state.profiles] })),
  updateProfile: (id, profile) =>
    set((state) => ({
      profiles: state.profiles.map((p) => (p.id === id ? profile : p)),
    })),
  removeProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
    })),
}))
