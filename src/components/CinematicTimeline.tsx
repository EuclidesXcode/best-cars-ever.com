'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion'
import { Star, ArrowUpRight, Gauge, Zap } from 'lucide-react'
import type { CarWithStats } from '@/lib/types'
import { useI18n } from './I18nProvider'
import { APPLE_EASE } from '@/lib/useCountUp'

/**
 * Timeline cinematográfica SCROLL-DRIVEN.
 *
 * A rolagem é LIVRE (nunca sequestrada). Cada carro é uma "cena" de ~140vh.
 * Dentro de cada cena, um bloco sticky de 100svh se monta conforme o scroll
 * atravessa o intervalo daquela cena:
 *   - o carro entra deslizando pela lateral, com leve parallax;
 *   - o ANO gigante e o nome aparecem como pano de fundo editorial;
 *   - specs sobem em sequência;
 *   - ao sair, a cena dissolve e a próxima entra — nada aparece "do nada".
 *
 * Uma barra de progresso de capítulos (décadas) acompanha a jornada.
 */
export function CinematicTimeline({
  cars,
  onSelect,
}: {
  cars: CarWithStats[]
  onSelect: (car: CarWithStats) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const n = cars.length

  return (
    <div ref={containerRef} id="timeline" className="relative">
      {/* HUD da jornada: índice 01/24 + barra de progresso (estilo Apple) */}
      <JourneyHUD cars={cars} progress={scrollYProgress} />
      {/* Régua de décadas — lateral no desktop */}
      <ChapterRail cars={cars} progress={scrollYProgress} />

      {cars.map((car, i) => (
        <Scene
          key={car.id}
          car={car}
          index={i}
          total={n}
          progress={scrollYProgress}
          onSelect={() => onSelect(car)}
        />
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- */

function Scene({
  car,
  index,
  total,
  progress,
  onSelect,
}: {
  car: CarWithStats
  index: number
  total: number
  progress: MotionValue<number>
  onSelect: () => void
}) {
  const { t } = useI18n()
  // Alterna o lado: carro à direita nas cenas pares, à esquerda nas ímpares.
  const carRight = index % 2 === 0

  // Intervalo de scroll [start, end] que pertence a esta cena.
  const seg = 1 / total
  const start = index * seg
  const end = start + seg

  // Progresso local 0→1 dentro da cena.
  const raw = useTransform(progress, [start, end], [0, 1], { clamp: true })
  const local = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 })

  // PLATÔ DE "MONTADO": entre P_IN e P_OUT a cena fica estável e centrada
  // (carro perto das infos). Só entra/sai nas bordas → a cena fica "boa" o
  // tempo todo em que está no meio da tela, e só abre/fecha ao entrar pelo
  // topo ou sair por baixo.
  const P_IN = 0.3
  const P_OUT = 0.7

  // O carro entra pelo seu lado, FICA centrado durante o platô, e sai pouco.
  const carEnter = carRight ? 42 : -42
  const carExit = carRight ? -14 : 14
  const carX = useTransform(local, [0, P_IN, P_OUT, 1], [carEnter, 0, 0, carExit])
  const carXpc = useTransform(carX, (v) => `${v}%`)
  const carScale = useTransform(local, [0, P_IN, P_OUT, 1], [0.94, 1, 1, 1.03])
  const carOpacity = useTransform(local, [0, 0.18, 0.85, 1], [0, 1, 1, 0])
  const carRotate = useTransform(
    local,
    [0, P_IN, P_OUT, 1],
    [carRight ? 2.5 : -2.5, 0, 0, carRight ? -1.5 : 1.5]
  )

  // O painel de infos entra pelo lado OPOSTO e também estabiliza no platô.
  const infoEnter = carRight ? -6 : 6
  const infoX = useTransform(
    local,
    [0, P_IN, P_OUT, 1],
    [infoEnter, 0, 0, -infoEnter * 0.5]
  )
  const infoXpc = useTransform(infoX, (v) => `${v}rem`)
  const infoOpacity = useTransform(local, [0, 0.26, 0.85, 1], [0, 1, 1, 0])

  // Ano gigante de fundo — parallax mais lento, em sentido oposto ao carro.
  const bgX = useTransform(local, [0, 1], [carRight ? -8 : 8, carRight ? 8 : -8])
  const bgXpc = useTransform(bgX, (v) => `${v}%`)
  const bgOpacity = useTransform(local, [0, P_IN, P_OUT, 1], [0, 0.5, 0.5, 0])

  // glow de estúdio: aceso durante todo o platô.
  const glowOpacity = useTransform(local, [0, P_IN, P_OUT, 1], [0, 1, 1, 0])

  return (
    <section
      className="relative h-[140vh]"
      aria-label={`${car.manufacturer} ${car.name}`}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* glow */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="studio-glow pointer-events-none absolute inset-0"
          aria-hidden
        />

        {/* ANO gigante de fundo */}
        <motion.div
          style={{ x: bgXpc, opacity: bgOpacity }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <span
            className="select-none font-display font-medium leading-none text-platinum/[0.06]"
            style={{ fontSize: 'clamp(11rem, 40vw, 34rem)' }}
          >
            {car.year}
          </span>
        </motion.div>

        {/* GRID lado-a-lado (desktop) / coluna (mobile) */}
        <div
          className={`relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center gap-2 px-6 md:grid md:grid-cols-2 md:items-center md:gap-6 md:px-10 ${
            carRight ? 'md:[direction:rtl]' : ''
          }`}
        >
          {/* CARRO */}
          <motion.button
            onClick={onSelect}
            aria-label={`${car.manufacturer} ${car.name}`}
            style={{
              x: carXpc,
              scale: carScale,
              opacity: carOpacity,
              rotate: carRotate,
            }}
            className="group relative order-1 w-full cursor-pointer [direction:ltr] md:order-none"
          >
            <div className="relative mx-auto aspect-[16/10] w-full max-w-[46rem]">
              <Image
                src={car.image_url}
                alt={`${car.manufacturer} ${car.name}`}
                fill
                priority={index < 2}
                sizes="(max-width:768px) 92vw, 46rem"
                className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-[1.02]"
                draggable={false}
              />
            </div>
            {/* sombra de chão */}
            <div
              className="pointer-events-none absolute -bottom-1 left-1/2 h-9 w-[55%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-2xl"
              aria-hidden
            />
          </motion.button>

          {/* PAINEL DE INFOS — sempre visível, ao lado (desktop) / abaixo (mobile) */}
          <motion.div
            style={{ x: infoXpc, opacity: infoOpacity }}
            className={`order-2 flex w-full flex-col items-center text-center [direction:ltr] md:order-none md:items-start md:text-left ${
              carRight ? 'md:items-end md:text-right' : ''
            }`}
          >
            <span className="text-[10px] font-medium uppercase tracking-ultra text-champagne">
              {car.manufacturer} · {car.decade}s
            </span>

            <h2
              className="mt-2 font-display font-medium leading-[0.95] tracking-tight text-platinum md:mt-3"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
            >
              {car.name}
            </h2>

            {/* specs */}
            <div
              className={`mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-platinum/70 md:mt-6 md:justify-start ${
                carRight ? 'md:justify-end' : ''
              }`}
            >
              {car.power_hp != null && (
                <Spec icon={<Zap size={16} />} value={`${car.power_hp}`} unit="hp" />
              )}
              {car.top_speed != null && (
                <Spec
                  icon={<Gauge size={16} />}
                  value={`${car.top_speed}`}
                  unit="km/h"
                />
              )}
            </div>

            {car.review_count > 0 ? (
              <span className="mt-3 flex items-center gap-1.5 text-champagne">
                <Star size={14} className="fill-champagne" />
                <span className="tabular-nums font-medium">
                  {car.avg_rating.toFixed(1)}
                </span>
                <span className="text-xs text-platinum/40">
                  · {car.review_count} {t('car.reviews')}
                </span>
              </span>
            ) : (
              <span className="mt-3 text-xs text-platinum/40">{t('car.noReviews')}</span>
            )}

            <button
              onClick={onSelect}
              className="group/btn mt-7 inline-flex items-center gap-2 rounded-full border border-champagne/40 px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-champagne transition-colors hover:border-champagne hover:bg-champagne/10"
            >
              {t('car.rate')}
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Spec({
  icon,
  value,
  unit,
}: {
  icon: React.ReactNode
  value: string
  unit: string
}) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="self-center text-champagne/70">{icon}</span>
      <span className="font-display text-xl font-medium tabular-nums text-platinum">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-platinum/40">
        {unit}
      </span>
    </span>
  )
}

/* ---------------------------------------------------------------- */
/**
 * HUD fixo da jornada: índice do carro atual (01 / 24), nome compacto e uma
 * barra de progresso fina no rodapé. Só aparece enquanto a timeline está em
 * tela (some no hero, ranking e about) — assinatura de site cinematográfico.
 */
function JourneyHUD({
  cars,
  progress,
}: {
  cars: CarWithStats[]
  progress: MotionValue<number>
}) {
  const n = cars.length
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  useMotionValueEvent(progress, 'change', (v) => {
    const inside = v > 0.001 && v < 0.999
    setVisible(inside)
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)))
    setIndex(i)
  })

  const barW = useTransform(progress, (v) => `${Math.min(100, Math.max(0, v * 100))}%`)
  const car = cars[index]

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.5, ease: APPLE_EASE }}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden md:block"
    >
      <div className="mx-auto flex max-w-7xl items-end justify-between px-10 pb-5">
        <div className="flex items-baseline gap-2 font-display">
          <span className="text-2xl font-medium tabular-nums text-platinum">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-sm text-platinum/30">/ {String(n).padStart(2, '0')}</span>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-platinum/40">
          {car.manufacturer} {car.name}
        </span>
      </div>
      {/* barra de progresso */}
      <div className="relative h-px w-full bg-white/10">
        <motion.div className="absolute inset-y-0 left-0 bg-champagne" style={{ width: barW }} />
      </div>
    </motion.div>
  )
}

/**
 * Régua de décadas na lateral direita. Uma linha vertical com os rótulos das
 * décadas; a década que está sendo percorrida fica em champagne cheio, as
 * outras esmaecidas. Um ponto/marcador desliza pela linha acompanhando o
 * scroll, e o trecho já percorrido fica preenchido em champagne.
 */
function ChapterRail({
  cars,
  progress,
}: {
  cars: CarWithStats[]
  progress: MotionValue<number>
}) {
  const total = cars.length

  // Décadas distintas, na ordem, com a fração de scroll onde começam.
  const decades: { decade: number; at: number }[] = []
  cars.forEach((c, i) => {
    if (i === 0 || cars[i - 1].decade !== c.decade) {
      decades.push({ decade: c.decade, at: i / total })
    }
  })

  // Índice da década ativa (a mais recente cujo "at" já foi ultrapassado).
  const [activeDecade, setActiveDecade] = useState(0)
  useMotionValueEvent(progress, 'change', (v) => {
    let idx = 0
    for (let i = 0; i < decades.length; i++) {
      if (v >= decades[i].at - 0.001) idx = i
    }
    setActiveDecade(idx)
  })

  // Posição do ponto deslizante e do preenchimento (0–100% da altura da régua).
  const dotTop = useTransform(progress, (v) => `${Math.min(100, Math.max(0, v * 100))}%`)

  return (
    <div className="pointer-events-none fixed right-8 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
      <div className="relative flex items-stretch gap-4">
        {/* trilho vertical + preenchimento + ponto */}
        <div className="relative w-px self-stretch bg-white/10">
          <motion.div
            className="absolute inset-x-0 top-0 bg-gradient-to-b from-champagne/0 to-champagne"
            style={{ height: dotTop }}
            aria-hidden
          />
          <motion.div
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne shadow-[0_0_12px_rgba(216,178,124,0.8)]"
            style={{ top: dotTop }}
            aria-hidden
          />
        </div>

        {/* rótulos */}
        <div className="flex flex-col justify-between gap-5 py-1">
          {decades.map((d, i) => {
            const isActive = i === activeDecade
            return (
              <span
                key={d.decade}
                className={`text-right text-[11px] font-medium uppercase tracking-[0.3em] transition-all duration-500 ${
                  isActive
                    ? 'text-champagne'
                    : 'text-platinum/25'
                }`}
              >
                {d.decade}s
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
