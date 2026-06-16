'use client'

import { useRef } from 'react'
import Image from 'next/image'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion'
import { Star, ArrowUpRight, Gauge, Zap } from 'lucide-react'
import type { CarWithStats } from '@/lib/types'
import { useI18n } from './I18nProvider'

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
      {/* Régua de progresso da jornada (décadas) — lateral no desktop */}
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

  // O carro entra pelo seu próprio lado e sai um pouco para o oposto.
  const carEnter = carRight ? 50 : -50
  const carExit = carRight ? -22 : 22
  const carX = useTransform(local, [0, 0.5, 1], [carEnter, 0, carExit])
  const carXpc = useTransform(carX, (v) => `${v}%`)
  const carScale = useTransform(local, [0, 0.5, 1], [0.92, 1, 1.04])
  const carOpacity = useTransform(local, [0, 0.22, 0.8, 1], [0, 1, 1, 0])
  const carRotate = useTransform(local, [0, 1], [carRight ? 3 : -3, carRight ? -2 : 2])

  // O painel de infos entra pelo lado OPOSTO ao carro.
  const infoEnter = carRight ? -8 : 8
  const infoX = useTransform(local, [0, 0.45, 1], [infoEnter, 0, -infoEnter * 0.6])
  const infoXpc = useTransform(infoX, (v) => `${v}rem`)
  const infoOpacity = useTransform(local, [0, 0.32, 0.8, 1], [0, 1, 1, 0])

  // Ano gigante de fundo — parallax mais lento, em sentido oposto ao carro.
  const bgX = useTransform(local, [0, 1], [carRight ? -10 : 10, carRight ? 10 : -10])
  const bgXpc = useTransform(bgX, (v) => `${v}%`)
  const bgOpacity = useTransform(local, [0, 0.3, 0.7, 1], [0, 0.5, 0.5, 0])

  // glow de estúdio pulsa no centro da cena
  const glowOpacity = useTransform(local, [0, 0.5, 1], [0, 1, 0])

  return (
    <section
      className="relative h-[170vh]"
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
          className={`relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center gap-2 px-6 md:grid md:grid-cols-2 md:gap-8 md:px-10 ${
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
/** Trilha de capítulos por década, fixa na lateral (desktop) / topo (mobile). */
function ChapterRail({
  cars,
  progress,
}: {
  cars: CarWithStats[]
  progress: MotionValue<number>
}) {
  // posições normalizadas (0→1) onde começa cada carro
  const total = cars.length
  const marks = cars.map((c, i) => ({
    id: c.id,
    at: i / total,
    decade: c.decade,
    decadeStart: i === 0 || cars[i - 1].decade !== c.decade,
  }))

  const fill = useTransform(progress, (v) => `${Math.min(100, v * 100)}%`)

  return (
    <div className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex">
      {/* linha base + preenchimento */}
      <div className="relative flex flex-col items-end gap-3">
        {marks
          .filter((m) => m.decadeStart)
          .map((m) => (
            <DecadeTick key={m.id} decade={m.decade} at={m.at} progress={progress} />
          ))}
      </div>
      {/* barra vertical sutil ao lado */}
      <motion.div
        className="absolute -left-3 top-0 w-px bg-champagne/60"
        style={{ height: fill, maxHeight: '100%' }}
        aria-hidden
      />
      <div className="absolute -left-3 top-0 h-full w-px bg-white/10" aria-hidden />
    </div>
  )
}

function DecadeTick({
  decade,
  at,
  progress,
}: {
  decade: number
  at: number
  progress: MotionValue<number>
}) {
  const active = useTransform(progress, (v) => (v >= at - 0.04 ? 1 : 0.35))
  return (
    <motion.span
      style={{ opacity: active }}
      className="text-[10px] font-medium uppercase tracking-[0.3em] text-champagne transition-opacity"
    >
      {decade}s
    </motion.span>
  )
}
