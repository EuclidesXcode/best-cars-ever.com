import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from '@/components/Providers'
import { getCurrentUser } from '@/lib/queries'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

// Publisher ID do Google AdSense (ex.: ca-pub-1234567890123456).
// Definido em .env.local como NEXT_PUBLIC_ADSENSE_CLIENT.
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

export const metadata: Metadata = {
  title: 'Best Cars Ever — The Supercar Timeline',
  description:
    'An interactive timeline of the greatest supercars from the 70s to today. Rate them and shape each decade’s ranking.',
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {ADSENSE_CLIENT && (
          <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
        )}
      </head>
      <body className="bg-ink text-white">
        <Providers initialUser={user}>{children}</Providers>

        {/* Google AdSense (Auto Ads) — só carrega se o publisher ID existir. */}
        {ADSENSE_CLIENT && (
          <Script
            id="adsense-init"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        )}
      </body>
    </html>
  )
}
