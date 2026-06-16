'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useI18n } from './I18nProvider'

/**
 * Abertura cinematográfica — dark luxo. Parallax REAL de scroll: o título,
 * a régua e a vinheta se movem em velocidades diferentes conforme a página
 * rola livremente (sem sequestro). Nada empilhado/quebrado: uma única tela
 * cheia, conteúdo centrado, camadas de fundo puramente decorativas.
 */
export function IntroHero() {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // camadas em velocidades distintas → profundidade
  const yTitle = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const yTag = useTransform(scrollYProgress, [0, 1], ['0%', '120%'])
  const ySub = useTransform(scrollYProgress, [0, 1], ['0%', '80%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <section
      ref={ref}
      className="vignette relative flex h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* halo de luz de estúdio + leve textura de piso */}
      <motion.div
        style={{ scale }}
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="studio-glow absolute inset-0" />
        <div className="studio-floor absolute inset-x-0 bottom-0 h-[45vh] [mask-image:linear-gradient(to_top,black,transparent)]" />
      </motion.div>

      {/* partículas de poeira de luz, discretas */}
      <DustField />

      {/* conteúdo */}
      <motion.span
        style={{ y: yTag, opacity }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-[10px] font-medium uppercase tracking-ultra text-champagne sm:text-[11px]"
      >
        {t('hero.tagline')}
      </motion.span>

      <motion.h1
        style={{ y: yTitle, opacity }}
        className="relative z-10 mt-7 max-w-5xl font-display font-medium leading-[0.95] tracking-tight text-platinum"
      >
        <motion.span
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="block text-shine"
          style={{ fontSize: 'clamp(2.75rem, 8vw, 7rem)' }}
        >
          {t('hero.title')}
        </motion.span>
      </motion.h1>

      <motion.p
        style={{ y: ySub, opacity }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="relative z-10 mt-7 max-w-md text-pretty text-sm font-light leading-relaxed text-platinum/55 sm:text-base"
      >
        {t('hero.subtitle')}
      </motion.p>

      <motion.div style={{ opacity }} className="relative z-10 mt-3">
        <div className="rule mx-auto mt-8 w-24" />
      </motion.div>

      {/* indicador de scroll */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-platinum/40 md:bottom-8"
      >
        <span className="text-[9px] uppercase tracking-ultra">{t('hero.scroll')}</span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} strokeWidth={1.5} />
        </motion.span>
      </motion.div>
    </section>
  )
}

/** Poeira de luz flutuante — gerada de forma determinística (sem hidratação). */
function DustField() {
  const dots = Array.from({ length: 28 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280
    const r = seed / 233280
    const r2 = ((i * 4099 + 7919) % 233280) / 233280
    return {
      left: r * 100,
      top: 20 + r2 * 70,
      size: 0.8 + (r % 1) * 1.6,
      delay: r2 * 8,
      dur: 7 + r * 6,
    }
  })
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-champagne/70"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animation: `drift ${d.dur}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
