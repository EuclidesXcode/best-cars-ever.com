'use client'

import { useI18n } from './I18nProvider'

export function AboutSection() {
  const { t } = useI18n()
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-white/10 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="mb-5 text-3xl font-black sm:text-5xl">{t('about.title')}</h2>
        <p className="text-base leading-relaxed text-white/70 sm:text-lg">
          {t('about.body')}
        </p>
        <p className="mt-10 text-sm text-white/40">
          © {new Date().getFullYear()} Best Cars Ever
        </p>
      </div>
    </section>
  )
}
