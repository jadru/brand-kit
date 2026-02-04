'use client'

interface PhoneMockupProps {
  children: React.ReactNode
  device?: 'iphone' | 'android'
}

export function PhoneMockup({ children, device = 'iphone' }: PhoneMockupProps) {
  return (
    <div className="inline-block">
      <div className={`relative rounded-[2.5rem] border-4 border-gray-800 bg-gray-800 p-2 shadow-xl ${device === 'android' ? 'rounded-[1.5rem]' : ''}`}>
        {device === 'iphone' && (
          <div className="absolute left-1/2 top-0 z-10 h-6 w-24 -translate-x-1/2 rounded-b-xl bg-gray-800" />
        )}
        <div className="h-[480px] w-[240px] overflow-hidden rounded-[2rem] bg-white">
          {children}
        </div>
      </div>
    </div>
  )
}
