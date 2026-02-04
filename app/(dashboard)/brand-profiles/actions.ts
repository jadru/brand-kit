'use server'

import { createClient } from '@/lib/supabase/server'
import { brandProfileSchema } from '@/lib/validations/brand-profile'
import { revalidatePath } from 'next/cache'

export async function createBrandProfile(formData: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = brandProfileSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { data, error } = await supabase
    .from('brand_profiles')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single()

  if (error) {
    if (error.message.includes('Brand profile limit reached')) {
      return { error: 'Brand profile limit reached. Upgrade to Pro for more.' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard/brand-profiles')
  return { data }
}

export async function updateBrandProfile(id: string, formData: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = brandProfileSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { data, error } = await supabase
    .from('brand_profiles')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard/brand-profiles')
  return { data }
}

export async function deleteBrandProfile(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('brand_profiles')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/brand-profiles')
  return { success: true }
}
