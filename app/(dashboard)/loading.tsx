import { LoadingSpinner } from '@/components/shared/loading-spinner'

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
