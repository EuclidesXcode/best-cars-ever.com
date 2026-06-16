'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import type { CarWithStats, Decade } from '@/lib/types'
import { DECADES } from '@/lib/types'
import { useI18n } from './I18nProvider'

export function RankingSection({
  carsByDecade,
}: {
  carsByDecade: Record<Decade, CarWithStats[]>
}) {
  const { t } = useI18n()
  const [active, setActive] = useState<Decade>(DECADES[0])

  const reviewed = [...carsByDecade[active]]
    .filter((c) => c.review_count > 0)
    .sort((a, b) => a.decade_rank - b.decade_rank)

  // Enquanto a comunidade não avalia, mostramos os carros da década ordenados
  // por potência — a seção nunca fica "vazia"/quebrada.
  const hasReviews = reviewed.length > 0
  const ranked = hasReviews
    ? reviewed
    : [...carsByDecade[active]].sort((a, b) => (b.power_hp ?? 0) - (a.power_hp ?? 0))

  return (
    <section
      id="ranking"
      className="relative scroll-mt-20 border-t border-white/[0.06] bg-carbon py-24 sm:py-32"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <span className="text-[10px] font-medium uppercase tracking-ultra text-champagne">
            {t('ranking.subtitle')}
          </span>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-platinum sm:text-6xl">
            {t('ranking.title')}
          </h2>
          <div className="rule mx-auto mt-6 w-20" />
        </div>

        {/* Seletor de década */}
        <div className="mb-12 flex justify-center gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DECADES.map((d) => (
            <button
              key={d}
              onClick={() => setActive(d)}
              className={`shrink-0 rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
                active === d
                  ? 'bg-champagne text-ink'
                  : 'text-platinum/50 hover:text-platinum'
              }`}
            >
              {d}s
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="divide-y divide-white/[0.06]"
          >
            {ranked.map((car, i) => (
              <div
                key={car.id}
                className="group flex items-center gap-5 py-5 transition-colors hover:bg-white/[0.02]"
              >
                <span className="w-10 shrink-0 text-center font-display text-3xl font-medium tabular-nums text-platinum/30 transition-colors group-hover:text-champagne">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div
                  className="h-16 w-24 shrink-0 rounded-lg bg-cover bg-center ring-1 ring-white/10"
                  style={{ backgroundImage: `url(${car.image_url})` }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-platinum">
                    {car.manufacturer} {car.name}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-platinum/40">
                    {car.year}
                  </p>
                </div>
                {hasReviews ? (
                  <div className="flex shrink-0 items-center gap-2 text-champagne">
                    <Star size={15} className="fill-champagne" />
                    <span className="font-display text-xl font-medium tabular-nums">
                      {car.avg_rating.toFixed(1)}
                    </span>
                  </div>
                ) : (
                  car.power_hp != null && (
                    <div className="flex shrink-0 items-baseline gap-1 text-platinum/70">
                      <span className="font-display text-xl font-medium tabular-nums">
                        {car.power_hp}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-platinum/40">
                        hp
                      </span>
                    </div>
                  )
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {!hasReviews && (
          <p className="mt-8 text-center text-xs uppercase tracking-[0.2em] text-platinum/40">
            {t('ranking.cta')}
          </p>
        )}
      </div>
    </section>
  )
}
