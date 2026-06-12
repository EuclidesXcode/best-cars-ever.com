'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import type { CarWithStats } from '@/lib/types'
import { useI18n } from './I18nProvider'

/**
 * Linha do tempo circular — um aro gigante do qual só se vê o arco superior.
 * Rolar/arrastar gira o aro; o carro que chega ao foco (topo, 12h) cresce.
 * Clicar nesse ponto abre o detalhe.
 */
export function WheelTimeline({
  cars,
  onSelect,
}: {
  cars: CarWithStats[]
  onSelect: (car: CarWithStats) => void
}) {
  const { t, locale } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)

  // Janela angular ocupada pela timeline inteira (graus).
  const SPAN = 150
  const step = cars.length > 1 ? SPAN / (cars.length - 1) : 0
  // Ângulo base de cada carro (centralizado em 0 = topo).
  const angleOf = (i: number) => -SPAN / 2 + i * step

  // rotation: quanto o aro girou. 0 → primeiro carro no foco.
  const rotation = useMotionValue(SPAN / 2)
  const smooth = useSpring(rotation, { stiffness: 90, damping: 20, mass: 0.6 })

  const [focusIndex, setFocusIndex] = useState(0)

  // Índice em foco = o carro cujo (ângulo + rotação) está mais perto de 0.
  const computeFocus = useCallback(
    (rot: number) => {
      let best = 0
      let bestDist = Infinity
      for (let i = 0; i < cars.length; i++) {
        const d = Math.abs(angleOf(i) + rot)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      }
      return best
    },
    [cars.length] // eslint-disable-line react-hooks/exhaustive-deps
  )

  useMotionValueEvent(smooth, 'change', (v) => {
    setFocusIndex(computeFocus(v))
  })

  const clamp = (r: number) => Math.max(-SPAN / 2, Math.min(SPAN / 2, r))

  // ---- Navegação por scroll ----
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    function onWheel(e: WheelEvent) {
      const delta = (e.deltaY || e.deltaX) * 0.12
      const next = rotation.get() - delta
      const atTop = next >= SPAN / 2 // primeiro carro
      const atEnd = next <= -SPAN / 2 // último carro
      // Nos limites, libera o scroll natural da página (para descer ao ranking).
      if ((atEnd && e.deltaY > 0) || (atTop && e.deltaY < 0)) return
      e.preventDefault()
      rotation.set(clamp(next))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [rotation]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Navegação por arrasto (mobile + desktop) ----
  const drag = useRef<{ y: number; rot: number } | null>(null)
  function onPointerDown(e: React.PointerEvent) {
    drag.current = { y: e.clientY, rot: rotation.get() }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return
    const dy = e.clientY - drag.current.y
    rotation.set(clamp(drag.current.rot + dy * 0.25))
  }
  function onPointerUp() {
    drag.current = null
    // encaixa no carro em foco
    snapTo(computeFocus(rotation.get()))
  }

  const snapTo = useCallback(
    (i: number) => rotation.set(clamp(-angleOf(i))),
    [rotation] // eslint-disable-line react-hooks/exhaustive-deps
  )

  function step1(dir: 1 | -1) {
    const next = Math.max(0, Math.min(cars.length - 1, focusIndex + dir))
    snapTo(next)
  }

  // ---- Geometria do aro ----
  // Raio em px; o aro é posicionado abaixo da viewport, então só o topo aparece.
  const radius = 1700
  const RAD = Math.PI / 180

  const focusCar = cars[focusIndex]

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative h-[100svh] touch-none select-none overflow-hidden"
    >
      {/* Brilho sutil de fundo */}
      <div className="stage-glow pointer-events-none absolute inset-x-0 top-0 h-[60vh]" />

      {/* O ARO: gira em torno de um centro bem abaixo da tela. */}
      <motion.div
        style={{
          rotate: useTransform(smooth, (r) => -r),
          width: radius * 2,
          height: radius * 2,
          left: '50%',
          x: '-50%',
          top: `calc(14vh + ${radius}px)`,
          marginTop: `-${radius}px`,
        }}
        className="absolute"
      >
        {/* linha fina do círculo */}
        <svg
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="absolute inset-0 h-full w-full"
        >
          <circle
            cx={radius}
            cy={radius}
            r={radius - 2}
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={1.5}
          />
        </svg>

        {/* pontos / carros ao longo do aro */}
        {cars.map((car, i) => {
          // posição na borda do círculo: topo = -90° no sistema do SVG
          const a = (angleOf(i) - 90) * RAD
          const cx = radius + radius * Math.cos(a)
          const cy = radius + radius * Math.sin(a)
          const isFocus = i === focusIndex
          const newDecade = i === 0 || cars[i - 1].decade !== car.decade

          return (
            <div
              key={car.id}
              className="absolute"
              style={{
                left: cx,
                top: cy,
                // contraposição da rotação do aro para o conteúdo ficar "de pé"
                transform: `translate(-50%, -50%) rotate(${angleOf(i)}deg)`,
              }}
            >
              <button
                onClick={() => (isFocus ? onSelect(car) : snapTo(i))}
                className="group flex flex-col items-center"
                aria-label={`${car.manufacturer} ${car.name}`}
              >
                {/* marcação de década */}
                {newDecade && (
                  <span className="absolute -top-10 whitespace-nowrap text-xs font-black uppercase tracking-[0.3em] text-gold/70">
                    {car.decade}s
                  </span>
                )}

                <motion.span
                  animate={{ scale: isFocus ? 1.6 : 1, opacity: isFocus ? 1 : 0.5 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className={`block h-3 w-3 rounded-full ${
                    isFocus
                      ? 'bg-gold shadow-[0_0_20px_4px_rgba(245,179,1,0.6)]'
                      : 'bg-white/40 group-hover:bg-white/70'
                  }`}
                />
                <span className="mt-2 text-[10px] font-medium tracking-wide text-white/50">
                  {car.year}
                </span>
              </button>
            </div>
          )
        })}
      </motion.div>

      {/* CARTÃO DO CARRO EM FOCO — flutua no centro/topo */}
      <div className="pointer-events-none absolute inset-x-0 top-[14vh] flex flex-col items-center px-6 text-center">
        {focusCar && (
          <motion.button
            key={focusCar.id}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onSelect(focusCar)}
            className="pointer-events-auto flex flex-col items-center"
          >
            <div className="relative h-44 w-72 sm:h-60 sm:w-[28rem]">
              <Image
                src={focusCar.image_url}
                alt={`${focusCar.manufacturer} ${focusCar.name}`}
                fill
                priority
                sizes="(max-width:640px) 18rem, 28rem"
                className="mask-fade-bottom object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
              />
            </div>
            <span className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
              {focusCar.manufacturer} · {focusCar.year}
            </span>
            <h2 className="text-4xl font-black leading-tight sm:text-6xl">
              {focusCar.name}
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/60">
              {focusCar.blurb[locale]}
            </p>
            <span className="mt-4 rounded-full bg-gradient-to-r from-accent to-gold px-6 py-2.5 text-sm font-semibold text-black">
              {t('car.rate')}
            </span>
          </motion.button>
        )}
      </div>

      {/* setas de navegação */}
      <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-white/40 md:bottom-10">
        <button
          onClick={() => step1(-1)}
          disabled={focusIndex === 0}
          aria-label="anterior"
          className="rounded-full p-2 transition-colors hover:text-white disabled:opacity-20"
        >
          <ChevronUp size={22} />
        </button>
        <span className="text-[10px] tabular-nums">
          {focusIndex + 1} / {cars.length}
        </span>
        <button
          onClick={() => step1(1)}
          disabled={focusIndex === cars.length - 1}
          aria-label="próximo"
          className="rounded-full p-2 transition-colors hover:text-white disabled:opacity-20"
        >
          <ChevronDown size={22} />
        </button>
      </div>
    </div>
  )
}
