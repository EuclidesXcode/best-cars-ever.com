'use client'

import { useState } from 'react'
import type { CarWithStats, Decade } from '@/lib/types'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { IntroHero } from './IntroHero'
import { ChapterIntro } from './ChapterIntro'
import { CinematicTimeline } from './CinematicTimeline'
import { DECADES } from '@/lib/types'
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

  const decadeCount = new Set(cars.map((c) => c.decade)).size || DECADES.length
  const reviewCount = cars.reduce((sum, c) => sum + (c.review_count ?? 0), 0)

  return (
    <>
      <span id="top" />
      <TopBar onSignIn={openAuth} />

      <main className="pb-20 md:pb-0">
        {/* ABERTURA CINEMATOGRÁFICA — parallax + stats */}
        <IntroHero
          carCount={cars.length}
          decadeCount={decadeCount}
          reviewCount={reviewCount}
        />

        {/* COSTURA NARRATIVA — capítulo que apresenta a jornada */}
        <ChapterIntro />

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
