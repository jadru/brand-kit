import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WizardShell } from '@/components/wizard/wizard-shell'
import type { User } from '@/types/database'

export default async function NewProjectPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: userData }, { data: brandProfiles }, { data: stylePresets }] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('brand_profiles').select('*').eq('user_id', user.id).order('created_at'),
    supabase.from('style_presets').select('*').order('sort_order'),
  ])

  if (!userData) redirect('/login')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">New Project</h1>
        <p className="text-sm text-text-secondary">Create brand assets in a few steps.</p>
      </div>

      <WizardShell
        brandProfiles={brandProfiles ?? []}
        stylePresets={stylePresets ?? []}
        user={userData as User}
      />
    </div>
  )
}
