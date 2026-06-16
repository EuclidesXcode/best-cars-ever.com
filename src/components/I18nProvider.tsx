'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Locale } from '@/lib/types'
import { dictionaries, type TranslationKey } from '@/lib/dictionaries'

interface I18nContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = 'bce-locale'

function detectInitialLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en'
  const lang = navigator.language.slice(0, 2).toLowerCase()
  if (lang === 'pt' || lang === 'es') return lang
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Começa em 'en' (igual ao SSR) e só troca após montar, para o primeiro
  // paint do cliente bater com o HTML do servidor (evita erro de hidratação).
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    const next = stored ?? detectInitialLocale()
    if (next !== 'en') setLocaleState(next)
    document.documentElement.lang = next
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
    document.documentElement.lang = l
  }, [])

  const t = useCallback(
    (key: TranslationKey) => dictionaries[locale][key] ?? key,
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
