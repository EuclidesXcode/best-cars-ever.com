'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useI18n } from './I18nProvider'
import { APPLE_EASE } from '@/lib/useCountUp'

/**
 * Faixa de transição "capítulo" — costura o hero à timeline. Texto editorial
 * grande que entra com parallax + reveal por linha, dando ritmo narrativo
 * (padrão Apple: o produto é apresentado antes de aparecer).
 */
export function ChapterIntro() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['12%', '-12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0])

  return (
    <section ref={ref} className="relative flex min-h-[80svh] items-center justify-center overflow-hidden px-6">
      <motion.div style={{ y, opacity }} className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: APPLE_EASE }}
          className="text-[10px] font-medium uppercase tracking-ultra text-champagne"
        >
          {t('chapter.label')}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, delay: 0.1, ease: APPLE_EASE }}
          className="mt-5 font-display font-medium leading-[1.02] tracking-tight text-platinum"
          style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}
        >
          {t('chapter.title')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, delay: 0.25, ease: APPLE_EASE }}
          className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-platinum/55 sm:text-base"
        >
          {t('chapter.body')}
        </motion.p>

        <div className="rule mx-auto mt-9 w-20" />
      </motion.div>
    </section>
  )
}
