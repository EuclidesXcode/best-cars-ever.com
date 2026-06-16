'use client'

import { useState } from 'react'
import type { CarWithStats, Decade } from '@/lib/types'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { IntroHero } from './IntroHero'
import { CinematicTimeline } from './CinematicTimeline'
import { CarDetail } from './CarDetail'
import { RankingSection } from './RankingSection'
import { AboutSection } from './AboutSection'
import { AuthModal } from './AuthModal'

export function App({
  cars,
  carsByDecade,
}: {
  cars: CarWithStats[]
  carsByDecade: Record<Decade, CarWithStats[]>
}) {
  const [authOpen, setAuthOpen] = useState(false)
  const [selected, setSelected] = useState<CarWithStats | null>(null)
  const openAuth = () => setAuthOpen(true)

  return (
    <>
      <span id="top" />
      <TopBar onSignIn={openAuth} />

      <main className="pb-20 md:pb-0">
        {/* ABERTURA CINEMATOGRÁFICA — parallax de scroll real */}
        <IntroHero />

        {/* TIMELINE — jornada scroll-driven, uma cena por carro */}
        <CinematicTimeline cars={cars} onSelect={setSelected} />

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
