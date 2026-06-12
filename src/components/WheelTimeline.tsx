'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import type { CarWithStats } from '@/lib/types'
import { useI18n } from './I18nProvider'

/**
 * Home cinematográfica: fundo escuro premium, uma linha/curva sutil cruzando a
 * tela e o carro recortado flutuando grande no centro, com reflexo no chão.
 * Navega lateralmente entre os carros (←/→, setas, arrasto, scroll, teclado).
 */
export function WheelTimeline({
  cars,
  onSelect,
}: {
  cars: CarWithStats[]
  onSelect: (car: CarWithStats) => void
}) {
  const { t, locale } = useI18n()
  const n = cars.length
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1) // direção da transição (1 = avança, -1 = volta)
  const car = cars[index]

  const go = useCallback(
    (d: 1 | -1) => {
      setDir(d)
      setIndex((i) => (i + d + n) % n)
    },
    [n]
  )

  // teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // scroll horizontal/vertical avança
  const wheelLock = useRef(false)
  function onWheel(e: React.WheelEvent) {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    if (wheelLock.current || Math.abs(delta) < 12) return
    wheelLock.current = true
    go(delta > 0 ? 1 : -1)
    setTimeout(() => (wheelLock.current = false), 450)
  }

  // arrasto / swipe
  const drag = useRef<{ x: number } | null>(null)
  function onPointerDown(e: React.PointerEvent) {
    drag.current = { x: e.clientX }
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1)
    drag.current = null
  }

  const prev = cars[(index - 1 + n) % n]
  const next = cars[(index + 1) % n]

  return (
    <div
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="relative h-[100svh] touch-pan-y select-none overflow-hidden"
    >
      <Backdrop index={index} />

      {/* CARROS VIZINHOS — fantasmas nas laterais, sumindo como a linha */}
      <GhostCar car={prev} side="left" onClick={() => go(-1)} />
      <GhostCar car={next} side="right" onClick={() => go(1)} />

      {/* CARRO + INFO — reserva espaço embaixo para não colidir com a trilha */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-44 md:pb-32">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={car.id}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 120, scale: 0.92 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d: number) => ({ opacity: 0, x: d * -120, scale: 0.92 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {/* decade label */}
            <span className="mb-1 text-xs font-medium uppercase tracking-[0.35em] text-gold">
              {car.manufacturer} · {car.decade}s
            </span>

            {/* carro flutuando + reflexo */}
            <button
              onClick={() => onSelect(car)}
              className="group relative -mb-4"
              aria-label={`${car.manufacturer} ${car.name}`}
            >
              {/* sombra elíptica no chão (como se o carro estivesse pousado) */}
              <div
                className="pointer-events-none absolute bottom-2 left-1/2 h-8 w-[65%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-2xl"
                aria-hidden
              />
              <div className="relative h-44 w-[20rem] sm:h-60 sm:w-[40rem] lg:h-64 lg:w-[46rem]">
                <Image
                  src={car.image_url}
                  alt={`${car.manufacturer} ${car.name}`}
                  fill
                  priority
                  sizes="(max-width:640px) 20rem, (max-width:1024px) 40rem, 46rem"
                  className="object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              {/* reflexo espelhado no chão */}
              <div
                className="pointer-events-none absolute left-0 top-[calc(100%-1.5rem)] h-28 w-full -scale-y-100 opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent_65%)]"
                aria-hidden
              >
                <div className="relative h-44 w-[20rem] sm:h-60 sm:w-[40rem] lg:h-64 lg:w-[46rem]">
                  <Image
                    src={car.image_url}
                    alt=""
                    fill
                    sizes="46rem"
                    className="object-contain blur-[3px]"
                  />
                </div>
              </div>
            </button>

            {/* nome + meta */}
            <h2 className="text-center text-4xl font-black leading-none drop-shadow-lg sm:text-6xl lg:text-7xl">
              {car.name}
            </h2>
            <div className="mt-2 flex items-center gap-3 text-white/70">
              <span className="text-base tabular-nums">{car.year}</span>
              {car.review_count > 0 && (
                <span className="flex items-center gap-1 text-gold">
                  <Star size={15} className="fill-gold text-gold" />
                  {car.avg_rating.toFixed(1)}
                </span>
              )}
            </div>

            <button
              onClick={() => onSelect(car)}
              className="mt-4 rounded-full bg-gradient-to-r from-accent to-gold px-7 py-2.5 text-sm font-semibold text-black shadow-[0_8px_30px_-6px_rgba(245,179,1,0.5)] transition-transform active:scale-95 sm:hover:scale-105"
            >
              {t('car.rate')}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* SETAS LATERAIS */}
      <NavArrow side="left" label={prev.name} onClick={() => go(-1)} />
      <NavArrow side="right" label={next.name} onClick={() => go(1)} />

      {/* TRILHA DE PROGRESSO embaixo */}
      <div className="absolute bottom-20 left-1/2 z-20 flex max-w-[90vw] -translate-x-1/2 items-center gap-1.5 md:bottom-8">
        {cars.map((c, i) => {
          const decadeStart = i === 0 || cars[i - 1].decade !== c.decade
          return (
            <button
              key={c.id}
              onClick={() => {
                setDir(i > index ? 1 : -1)
                setIndex(i)
              }}
              aria-label={c.name}
              className="group relative flex flex-col items-center"
            >
              {decadeStart && (
                <span className="absolute -top-5 text-[9px] font-bold tracking-widest text-gold/60">
                  {c.decade}s
                </span>
              )}
              <span
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? 'w-7 bg-gold'
                    : 'w-1.5 bg-white/25 group-hover:bg-white/50'
                }`}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Fundo escuro premium: chão em perspectiva + linha/curva sutil + brilho. */
function Backdrop({ index }: { index: number }) {
  return (
    <div className="absolute inset-0">
      {/* chão em perspectiva */}
      <div className="absolute inset-0 [perspective:1000px] [perspective-origin:50%_35%]">
        <div
          className="carbon-floor absolute left-1/2 top-[58%] h-[120vh] w-[260vw] -translate-x-1/2 origin-top opacity-60"
          style={{ transform: 'rotateX(76deg)' }}
        />
      </div>
      {/* névoa do horizonte para esconder a borda do chão */}
      <div className="horizon-fade pointer-events-none absolute inset-x-0 top-0 h-[68vh]" />

      {/* linha/curva sutil cruzando a tela (a "timeline") */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="tl" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(225,6,0,0)" />
            <stop offset="50%" stopColor="rgba(225,6,0,0.6)" />
            <stop offset="100%" stopColor="rgba(225,6,0,0)" />
          </linearGradient>
        </defs>
        <motion.path
          d="M -50 560 Q 720 380 1490 560"
          fill="none"
          stroke="url(#tl)"
          strokeWidth="2"
          initial={false}
          animate={{ d: 'M -50 560 Q 720 380 1490 560' }}
        />
      </svg>

      {/* halo de luz central sob o carro */}
      <div className="stage-glow pointer-events-none absolute inset-x-0 top-[18%] h-[60vh]" />
    </div>
  )
}

/** Carro vizinho fantasma: encostado na borda, transparente e sumindo como a linha. */
function GhostCar({
  car,
  side,
  onClick,
}: {
  car: CarWithStats
  side: 'left' | 'right'
  onClick: () => void
}) {
  const isLeft = side === 'left'
  return (
    <button
      onClick={onClick}
      aria-hidden
      tabIndex={-1}
      className={`pointer-events-auto absolute top-1/2 z-0 hidden h-56 w-[34rem] -translate-y-1/2 md:block lg:h-64 lg:w-[40rem] ${
        isLeft ? '-left-[6%]' : '-right-[6%]'
      }`}
    >
      <motion.div
        key={car.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ duration: 0.6 }}
        className="relative h-full w-full"
        style={{
          // dissolve em direção à borda da tela, como a linha do tempo
          WebkitMaskImage: `linear-gradient(to ${isLeft ? 'left' : 'right'}, black 35%, transparent 95%)`,
          maskImage: `linear-gradient(to ${isLeft ? 'left' : 'right'}, black 35%, transparent 95%)`,
        }}
      >
        <Image
          src={car.image_url}
          alt=""
          fill
          sizes="40rem"
          className="object-contain blur-[1px] grayscale"
        />
      </motion.div>
    </button>
  )
}

function NavArrow({
  side,
  label,
  onClick,
}: {
  side: 'left' | 'right'
  label: string
  onClick: () => void
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`group absolute top-1/2 z-20 hidden -translate-y-1/2 items-center gap-2 text-white/40 transition-colors hover:text-white md:flex ${
        side === 'left' ? 'left-6 flex-row' : 'right-6 flex-row-reverse'
      }`}
    >
      <span className="rounded-full border border-white/15 bg-white/5 p-3 backdrop-blur transition-colors group-hover:bg-white/10">
        <Icon size={22} />
      </span>
      <span className="max-w-[7rem] truncate text-xs uppercase tracking-wide opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </button>
  )
}
