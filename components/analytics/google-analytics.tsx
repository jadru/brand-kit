'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  measurementId?: string
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!gaId || process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      <Script id="ga4-consent" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'wait_for_update': 500
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });

          // Check for existing consent
          try {
            const consent = localStorage.getItem('brandkit_cookie_consent');
            if (consent) {
              const parsed = JSON.parse(consent);
              if (parsed.status === 'accepted') {
                gtag('consent', 'update', {
                  'analytics_storage': 'granted',
                  'ad_storage': 'granted'
                });
              }
            }
          } catch (e) {}
        `}
      </Script>
    </>
  )
}
