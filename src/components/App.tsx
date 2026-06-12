'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { CarWithStats, Decade } from '@/lib/types'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { WheelTimeline } from './WheelTimeline'
import { CarDetail } from './CarDetail'
import { RankingSection } from './RankingSection'
import { AboutSection } from './AboutSection'
import { AuthModal } from './AuthModal'
import { useI18n } from './I18nProvider'

export function App({
  cars,
  carsByDecade,
}: {
  cars: CarWithStats[]
  carsByDecade: Record<Decade, CarWithStats[]>
}) {
  const { t } = useI18n()
  const [authOpen, setAuthOpen] = useState(false)
  const [selected, setSelected] = useState<CarWithStats | null>(null)
  const openAuth = () => setAuthOpen(true)

  return (
    <>
      <span id="top" />
      <TopBar onSignIn={openAuth} />

      <main className="pb-20 md:pb-0">
        {/* AÇO / TIMELINE CIRCULAR — tela cheia */}
        <section id="timeline" className="relative scroll-mt-0">
          <div className="pointer-events-none absolute inset-x-0 top-[max(5rem,calc(env(safe-area-inset-top)+4rem))] z-10 flex flex-col items-center text-center">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
              {t('hero.tagline')}
            </span>
          </div>

          <WheelTimeline cars={cars} onSelect={setSelected} />

          <button
            onClick={() =>
              document.getElementById('ranking')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="absolute bottom-6 right-6 z-10 hidden items-center gap-1 text-xs uppercase tracking-widest text-white/40 transition-colors hover:text-white md:flex"
          >
            {t('nav.ranking')}
            <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
              <ChevronDown size={16} />
            </motion.span>
          </button>
        </section>

        <RankingSection carsByDecade={carsByDecade} />
        <AboutSection />
      </main>

      <BottomNav onSignIn={openAuth} />
      <CarDetail
        car={selected}
        onClose={() => setSelected(null)}
        onRequireAuth={openAuth}
      />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
