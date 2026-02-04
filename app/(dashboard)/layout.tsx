import AuthGuard from '@/components/layout/auth-guard'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-surface-secondary">
        <Sidebar className="hidden lg:flex" />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center border-b border-border bg-surface px-4 lg:hidden">
            <MobileNav />
            <span className="ml-4 font-display text-sm font-bold">BrandKit</span>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
