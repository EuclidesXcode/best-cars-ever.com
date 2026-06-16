'use client'

import { useEffect, useState } from 'react'
import { User as UserIcon, LogOut } from 'lucide-react'
import { useI18n } from './I18nProvider'
import { useAuth } from './AuthProvider'
import { LanguageSwitcher } from './LanguageSwitcher'
import { signOut } from '@/lib/actions'

export function TopBar({ onSignIn }: { onSignIn: () => void }) {
  const { t } = useI18n()
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-ink/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="text-lg font-black tracking-tight"
        >
          BEST CARS <span className="text-gradient">EVER</span>
        </a>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {user ? (
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm transition-colors hover:bg-white/10"
                title={user.email ?? ''}
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">{t('auth.signOut')}</span>
              </button>
            </form>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-gold px-4 py-2 text-sm font-semibold text-black transition-transform active:scale-95"
            >
              <UserIcon size={16} />
              <span className="hidden sm:inline">{t('review.signIn')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
