import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { getCurrentUser } from '@/lib/queries'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

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
      <body className="bg-ink text-white">
        <Providers initialUser={user}>{children}</Providers>
      </body>
    </html>
  )
}
