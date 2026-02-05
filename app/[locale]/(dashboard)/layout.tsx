import AuthGuard from '@/components/layout/auth-guard'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NetworkStatusProvider } from '@/components/providers/network-status-provider'
import { createClient } from '@/lib/supabase/server'
import type { Plan } from '@/types/database'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let plan: Plan = 'free'
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single()
    plan = (userData?.plan as Plan) ?? 'free'
  }

  return (
    <AuthGuard>
      <NetworkStatusProvider>
        <div className="flex min-h-screen bg-surface-secondary">
          <Sidebar className="hidden lg:flex" plan={plan} />
          <div className="flex flex-1 flex-col">
            <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
              <div className="flex items-center">
                <MobileNav plan={plan} />
                <span className="ml-4 font-display text-sm font-bold">BrandKit</span>
              </div>
              <ThemeToggle />
            </header>
            {/* Desktop theme toggle - fixed position */}
            <div className="fixed right-4 top-4 z-50 hidden lg:block">
              <ThemeToggle />
            </div>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-6xl">{children}</div>
            </main>
          </div>
        </div>
      </NetworkStatusProvider>
    </AuthGuard>
  )
}
