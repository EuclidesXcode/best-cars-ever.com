'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star } from 'lucide-react'
import type { CarWithStats, Decade } from '@/lib/types'
import { DECADES } from '@/lib/types'
import { useI18n } from './I18nProvider'

const MEDALS = ['🥇', '🥈', '🥉']

export function RankingSection({
  carsByDecade,
}: {
  carsByDecade: Record<Decade, CarWithStats[]>
}) {
  const { t } = useI18n()
  const [active, setActive] = useState<Decade>(DECADES[0])

  // Carros da década com pelo menos 1 avaliação, ordenados pelo ranking.
  const ranked = [...carsByDecade[active]]
    .filter((c) => c.review_count > 0)
    .sort((a, b) => a.decade_rank - b.decade_rank)

  return (
    <section id="ranking" className="scroll-mt-20 border-t border-white/10 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <Trophy size={28} className="mx-auto mb-3 text-gold" />
          <h2 className="text-3xl font-black sm:text-5xl">{t('ranking.title')}</h2>
          <p className="mt-2 text-sm text-white/60">{t('ranking.subtitle')}</p>
        </div>

        {/* Seletor de década — scroll horizontal no mobile (app-like) */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DECADES.map((d) => (
            <button
              key={d}
              onClick={() => setActive(d)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                active === d
                  ? 'bg-gradient-to-r from-accent to-gold text-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {d}s
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {ranked.length === 0 ? (
              <p className="py-12 text-center text-white/40">{t('ranking.empty')}</p>
            ) : (
              ranked.map((car, i) => (
                <div
                  key={car.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <span className="w-8 shrink-0 text-center text-2xl font-black text-white/50">
                    {MEDALS[i] ?? `#${i + 1}`}
                  </span>
                  <div
                    className="h-14 w-20 shrink-0 rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${car.image_url})` }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      {car.manufacturer} {car.name}
                    </p>
                    <p className="text-xs text-white/50">{car.year}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Star size={16} className="fill-gold text-gold" />
                    <span className="font-bold">{car.avg_rating.toFixed(1)}</span>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
