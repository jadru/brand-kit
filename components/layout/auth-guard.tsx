import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface AuthGuardProps {
  children: React.ReactNode
}

export default async function AuthGuard({ children }: AuthGuardProps) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return <>{children}</>
}
