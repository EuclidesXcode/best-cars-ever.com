'use client'

import { useEffect, useState } from 'react'
import { Clock, Trophy, Info, User as UserIcon, LogOut } from 'lucide-react'
import { useI18n } from './I18nProvider'
import { useAuth } from './AuthProvider'
import { signOut } from '@/lib/actions'
import type { TranslationKey } from '@/lib/dictionaries'

const ITEMS: { id: string; icon: typeof Clock; label: TranslationKey }[] = [
  { id: 'timeline', icon: Clock, label: 'nav.timeline' },
  { id: 'ranking', icon: Trophy, label: 'nav.ranking' },
  { id: 'about', icon: Info, label: 'nav.about' },
]

/** Barra de navegação inferior estilo app — só no mobile. */
export function BottomNav({ onSignIn }: { onSignIn: () => void }) {
  const { t } = useI18n()
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('timeline')

  useEffect(() => {
    const ids = ['timeline', 'ranking', 'about']
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5] }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink/90 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {ITEMS.map(({ id, icon: Icon, label }) => {
          const active = activeSection === id
          return (
            <button
              key={id}
              onClick={() => go(id)}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                active ? 'text-gold' : 'text-white/50'
              }`}
            >
              <Icon size={22} className={active ? 'scale-110 transition-transform' : ''} />
              {t(label)}
            </button>
          )
        })}

        {user ? (
          <form action={signOut} className="flex flex-1">
            <button
              type="submit"
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-white/50"
            >
              <LogOut size={22} />
              {t('auth.signOut')}
            </button>
          </form>
        ) : (
          <button
            onClick={onSignIn}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-white/50"
          >
            <UserIcon size={22} />
            {t('nav.account')}
          </button>
        )}
      </div>
    </nav>
  )
}
