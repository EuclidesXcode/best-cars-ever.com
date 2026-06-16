'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useI18n } from './I18nProvider'
import { useCountUp, APPLE_EASE } from '@/lib/useCountUp'

/**
 * Abertura cinematográfica padrão Apple: reveal coreografado palavra-a-palavra,
 * contadores de stats que animam, scrim de gradiente, parallax de scroll real.
 * Conteúdo com "peso" — números que ancoram o site como algo sério.
 */
export function IntroHero({
  carCount,
  decadeCount,
  reviewCount,
}: {
  carCount: number
  decadeCount: number
  reviewCount: number
}) {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const yTitle = useTransform(scrollYProgress, [0, 1], ['0%', '36%'])
  const yTag = useTransform(scrollYProgress, [0, 1], ['0%', '110%'])
  const ySub = useTransform(scrollYProgress, [0, 1], ['0%', '70%'])
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  const titleWords = t('hero.title').split(' ')

  return (
    <section
      ref={ref}
      className="vignette relative flex h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* halo de luz de estúdio + textura de piso */}
      <motion.div style={{ scale }} className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="studio-glow absolute inset-0" />
        <div className="studio-floor absolute inset-x-0 bottom-0 h-[45vh] [mask-image:linear-gradient(to_top,black,transparent)]" />
      </motion.div>

      <DustField />

      {/* tagline */}
      <motion.span
        style={{ y: yTag, opacity }}
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: APPLE_EASE }}
        className="relative z-10 text-[10px] font-medium uppercase tracking-ultra text-champagne sm:text-[11px]"
      >
        {t('hero.tagline')}
      </motion.span>

      {/* título — reveal palavra-a-palavra */}
      <motion.h1
        style={{ y: yTitle, opacity }}
        className="relative z-10 mt-3 flex max-w-5xl flex-wrap justify-center gap-x-[0.25em] font-display font-medium leading-[0.92] tracking-tight"
      >
        {titleWords.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.1em]">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: APPLE_EASE }}
              className="inline-block text-shine"
              style={{ fontSize: 'clamp(2.75rem, 8vw, 7rem)' }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      {/* subtítulo */}
      <motion.p
        style={{ y: ySub, opacity }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: APPLE_EASE }}
        className="relative z-10 mt-5 max-w-md text-pretty text-sm font-light leading-relaxed text-platinum/55 sm:text-base"
      >
        {t('hero.subtitle')}
      </motion.p>

      {/* CONTADORES — dão "peso" e seriedade */}
      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: APPLE_EASE }}
        className="relative z-10 mt-5 flex items-center gap-8 sm:gap-12"
      >
        <Stat value={carCount} label={t('hero.statCars')} />
        <span className="h-8 w-px bg-white/10" aria-hidden />
        <Stat value={decadeCount} label={t('hero.statDecades')} />
        <span className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
        <Stat value={reviewCount} label={t('hero.statReviews')} className="hidden sm:flex" />
      </motion.div>

      {/* indicador de scroll — só a seta, colado embaixo, sem texto que colida */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-platinum/35"
        aria-label={t('hero.scroll')}
      >
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="block"
        >
          <ChevronDown size={20} strokeWidth={1.5} />
        </motion.span>
      </motion.div>
    </section>
  )
}

function Stat({
  value,
  label,
  suffix = '',
  className = '',
}: {
  value: number
  label: string
  suffix?: string
  className?: string
}) {
  const [n, ref] = useCountUp(value)
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`flex flex-col items-center ${className}`}
    >
      <span className="font-display text-3xl font-medium tabular-nums text-platinum sm:text-4xl">
        {n}
        {suffix}
      </span>
      <span className="mt-1 text-[8px] uppercase tracking-[0.25em] text-platinum/40 sm:text-[9px]">
        {label}
      </span>
    </div>
  )
}

/** Poeira de luz flutuante — determinística (sem mismatch de hidratação). */
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
