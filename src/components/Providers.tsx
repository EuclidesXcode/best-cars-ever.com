'use client'

import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { I18nProvider } from './I18nProvider'
import { AuthProvider } from './AuthProvider'

export function Providers({
  initialUser,
  children,
}: {
  initialUser: User | null
  children: ReactNode
}) {
  return (
    <I18nProvider>
      <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
    </I18nProvider>
  )
}
