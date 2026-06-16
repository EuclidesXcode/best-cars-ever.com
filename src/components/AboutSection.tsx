'use client'

import { useI18n } from './I18nProvider'

export function AboutSection() {
  const { t } = useI18n()
  return (
    <section
      id="about"
      className="relative scroll-mt-20 border-t border-white/[0.06] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="rule mx-auto mb-10 w-20" />
        <h2 className="mb-6 font-display text-4xl font-medium tracking-tight text-platinum sm:text-5xl">
          {t('about.title')}
        </h2>
        <p className="text-base font-light leading-relaxed text-platinum/60 sm:text-lg">
          {t('about.body')}
        </p>
        <p className="mt-14 text-[10px] uppercase tracking-ultra text-platinum/30">
          © {new Date().getFullYear()} Best Cars Ever
        </p>
      </div>
    </section>
  )
}
