'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { useI18n } from './I18nProvider'
import { LOCALES } from '@/lib/dictionaries'

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const current = LOCALES.find((l) => l.code === locale)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm backdrop-blur transition-colors hover:bg-white/10"
        aria-label="Change language"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{current?.flag} {current?.label}</span>
        <span className="sm:hidden">{current?.flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-ink/95 shadow-2xl backdrop-blur-xl">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code)
                setOpen(false)
              }}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-white/10"
            >
              <span>
                {l.flag} {l.label}
              </span>
              {l.code === locale && <Check size={16} className="text-gold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
