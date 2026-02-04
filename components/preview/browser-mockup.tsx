'use client'

interface BrowserMockupProps {
  title: string
  children: React.ReactNode
}

export function BrowserMockup({ title, children }: BrowserMockupProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-surface-secondary px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 rounded-md bg-surface px-3 py-1 text-xs text-text-tertiary">
          {title}
        </div>
      </div>
      <div className="bg-white">{children}</div>
    </div>
  )
}
