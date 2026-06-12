'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import type { CarWithStats } from '@/lib/types'
import { useI18n } from './I18nProvider'

/**
 * Home cinematográfica em carrossel CONTÍNUO: todos os carros vivem numa fita
 * que se arrasta fluidamente (segue o dedo/mouse). Ao soltar, encaixa no mais
 * próximo com momentum. Cada carro escala e some conforme se afasta do centro,
 * então eles deslizam e dissolvem — nunca aparecem "do nada".
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

  // Espaçamento horizontal entre carros, em px (responsivo via ResizeObserver).
  const [gap, setGap] = useState(560)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const measure = () => {
      const w = containerRef.current?.clientWidth ?? 1200
      // carros bem espaçados no desktop, mais juntos no mobile
      setGap(Math.min(640, Math.max(300, w * 0.46)))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // x = deslocamento da fita (px). 0 → carro 0 centralizado; -gap → carro 1, etc.
  const x = useMotionValue(0)

  // índice ativo derivado da posição da fita
  const indexFromX = useCallback(
    (val: number) => {
      const i = Math.round(-val / gap)
      return Math.max(0, Math.min(n - 1, i))
    },
    [gap, n]
  )

  useMotionValueEvent(x, 'change', (v) => {
    const i = indexFromX(v)
    setIndex((cur) => (cur !== i ? i : cur))
  })

  // encaixa (snap) num índice com mola suave
  const snapTo = useCallback(
    (i: number, velocity = 0) => {
      const clamped = Math.max(0, Math.min(n - 1, i))
      animate(x, -clamped * gap, {
        type: 'spring',
        stiffness: 260,
        damping: 34,
        velocity,
      })
    },
    [gap, n, x]
  )

  const go = useCallback(
    (d: 1 | -1) => snapTo(index + d),
    [index, snapTo]
  )

  // re-encaixa quando o gap muda (resize) para manter o carro centralizado
  useEffect(() => {
    x.set(-index * gap)
  }, [gap]) // eslint-disable-line react-hooks/exhaustive-deps

  // teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // scroll horizontal/vertical avança um carro de cada vez
  const wheelLock = useRef(false)
  function onWheel(e: React.WheelEvent) {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    if (wheelLock.current || Math.abs(delta) < 12) return
    wheelLock.current = true
    go(delta > 0 ? 1 : -1)
    setTimeout(() => (wheelLock.current = false), 350)
  }

  // ---- ARRASTO FLUIDO: a fita segue o ponteiro em tempo real ----
  const drag = useRef<{
    startX: number
    startVal: number
    lastX: number
    lastT: number
    vel: number
    moved: boolean
  } | null>(null)

  function onPointerDown(e: React.PointerEvent) {
    x.stop() // interrompe qualquer mola em curso
    drag.current = {
      startX: e.clientX,
      startVal: x.get(),
      lastX: e.clientX,
      lastT: performance.now(),
      vel: 0,
      moved: false,
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 4) d.moved = true
    // resistência (borracha) nas pontas
    let target = d.startVal + dx
    const min = -(n - 1) * gap
    if (target > 0) target = target * 0.35
    if (target < min) target = min + (target - min) * 0.35
    x.set(target)

    const now = performance.now()
    const dt = now - d.lastT
    if (dt > 0) d.vel = ((e.clientX - d.lastX) / dt) * 1000 // px/s
    d.lastX = e.clientX
    d.lastT = now
  }

  function onPointerUp() {
    const d = drag.current
    drag.current = null
    if (!d) return
    // projeta a posição com o momentum e encaixa no carro mais próximo
    const projected = x.get() + d.vel * 0.12
    let i = Math.round(-projected / gap)
    i = Math.max(0, Math.min(n - 1, i))
    snapTo(i, d.vel)
  }

  return (
    <div
      ref={containerRef}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative h-[100svh] touch-pan-y select-none overflow-hidden"
    >
      <Backdrop />

      {/* ---------- FITA DE CARROS (desliza com o arrasto) ---------- */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        {cars.map((c, i) => (
          <CarSlide
            key={c.id}
            car={c}
            i={i}
            x={x}
            gap={gap}
            onSelect={() => {
              if (i === index) onSelect(c)
              else snapTo(i)
            }}
          />
        ))}
      </div>

      {/* ---------- INFO FIXA NO CENTRO (atualiza com o índice) ---------- */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 mt-12 flex flex-col items-center px-6 text-center sm:mt-20">
        <motion.div
          key={cars[index].id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-4xl font-black leading-none drop-shadow-lg sm:text-6xl lg:text-7xl">
            {cars[index].name}
          </h2>
          <div className="mt-2 flex items-center gap-3 text-white/70">
            <span className="text-base tabular-nums">{cars[index].year}</span>
            {cars[index].review_count > 0 && (
              <span className="flex items-center gap-1 text-gold">
                <Star size={15} className="fill-gold text-gold" />
                {cars[index].avg_rating.toFixed(1)}
              </span>
            )}
          </div>
          <button
            onClick={() => onSelect(cars[index])}
            className="pointer-events-auto mt-4 rounded-full bg-gradient-to-r from-accent to-gold px-7 py-2.5 text-sm font-semibold text-black shadow-[0_8px_30px_-6px_rgba(245,179,1,0.5)] transition-transform active:scale-95 sm:hover:scale-105"
          >
            {t('car.rate')}
          </button>
        </motion.div>
      </div>

      {/* manufacturer/decade no topo, fixo */}
      <div className="pointer-events-none absolute inset-x-0 top-[16vh] z-10 text-center">
        <motion.span
          key={cars[index].id + '-m'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-medium uppercase tracking-[0.35em] text-gold"
        >
          {cars[index].manufacturer} · {cars[index].decade}s
        </motion.span>
      </div>

      {/* SETAS */}
      <NavArrow side="left" disabled={index === 0} onClick={() => go(-1)} />
      <NavArrow side="right" disabled={index === n - 1} onClick={() => go(1)} />

      {/* TRILHA DE PROGRESSO */}
      <div className="absolute bottom-20 left-1/2 z-20 flex max-w-[90vw] -translate-x-1/2 items-center gap-1.5 md:bottom-8">
        {cars.map((c, i) => {
          const decadeStart = i === 0 || cars[i - 1].decade !== c.decade
          return (
            <button
              key={c.id}
              onClick={() => snapTo(i)}
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
                  i === index ? 'w-7 bg-gold' : 'w-1.5 bg-white/25 group-hover:bg-white/50'
                }`}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Um carro na fita. Sua posição, escala e opacidade derivam continuamente da
 * distância entre o centro da tela e este slide — por isso ele desliza e
 * dissolve suavemente em vez de aparecer/sumir de repente.
 */
function CarSlide({
  car,
  i,
  x,
  gap,
  onSelect,
}: {
  car: CarWithStats
  i: number
  x: MotionValue<number>
  gap: number
  onSelect: () => void
}) {
  // posição deste slide relativa ao centro (0 = centralizado)
  const offset = useTransform(x, (v) => v + i * gap)
  const translateX = offset
  const scale = useTransform(offset, [-gap, 0, gap], [0.62, 1, 0.62])
  const opacity = useTransform(
    offset,
    [-gap * 1.4, -gap * 0.5, 0, gap * 0.5, gap * 1.4],
    [0, 0.35, 1, 0.35, 0]
  )
  const blurPx = useTransform(offset, [-gap, 0, gap], [3, 0, 3])
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`)
  const zIndex = useTransform(offset, (o) => (Math.abs(o) < gap * 0.5 ? 5 : 1))

  return (
    <motion.button
      onClick={onSelect}
      aria-label={`${car.manufacturer} ${car.name}`}
      className="group absolute"
      style={{ x: translateX, scale, opacity, zIndex }}
    >
      <motion.div className="relative" style={{ filter }}>
        {/* sombra de chão */}
        <div
          className="pointer-events-none absolute bottom-2 left-1/2 h-8 w-[65%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-2xl"
          aria-hidden
        />
        <div className="relative h-44 w-[20rem] sm:h-60 sm:w-[40rem] lg:h-64 lg:w-[46rem]">
          <Image
            src={car.image_url}
            alt={`${car.manufacturer} ${car.name}`}
            fill
            priority={i < 3}
            sizes="(max-width:640px) 20rem, (max-width:1024px) 40rem, 46rem"
            className="object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)]"
            draggable={false}
          />
        </div>
        {/* reflexo no chão */}
        <div
          className="pointer-events-none absolute left-0 top-[calc(100%-1.5rem)] h-28 w-full -scale-y-100 opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent_65%)]"
          aria-hidden
        >
          <div className="relative h-44 w-[20rem] sm:h-60 sm:w-[40rem] lg:h-64 lg:w-[46rem]">
            <Image src={car.image_url} alt="" fill sizes="46rem" className="object-contain blur-[3px]" draggable={false} />
          </div>
        </div>
      </motion.div>
    </motion.button>
  )
}

/** Fundo escuro premium: chão em perspectiva + linha/curva sutil + brilho. */
function Backdrop() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 [perspective:1000px] [perspective-origin:50%_35%]">
        <div
          className="carbon-floor absolute left-1/2 top-[58%] h-[120vh] w-[260vw] -translate-x-1/2 origin-top opacity-60"
          style={{ transform: 'rotateX(76deg)' }}
        />
      </div>
      <div className="horizon-fade pointer-events-none absolute inset-x-0 top-0 h-[68vh]" />

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
        <path d="M -50 560 Q 720 380 1490 560" fill="none" stroke="url(#tl)" strokeWidth="2" />
      </svg>

      <div className="stage-glow pointer-events-none absolute inset-x-0 top-[18%] h-[60vh]" />
    </div>
  )
}

function NavArrow({
  side,
  disabled,
  onClick,
}: {
  side: 'left' | 'right'
  disabled?: boolean
  onClick: () => void
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={side === 'left' ? 'anterior' : 'próximo'}
      className={`absolute top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/15 bg-white/5 p-3 text-white/50 backdrop-blur transition-colors hover:bg-white/10 hover:text-white disabled:opacity-20 md:block ${
        side === 'left' ? 'left-6' : 'right-6'
      }`}
    >
      <Icon size={22} />
    </button>
  )
}
