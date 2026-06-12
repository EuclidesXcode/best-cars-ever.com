'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gauge, Zap, Star, Trophy, Quote } from 'lucide-react'
import type { CarWithStats } from '@/lib/types'
import { useI18n } from './I18nProvider'
import { usePointerTilt } from '@/lib/usePointerTilt'
import { ReviewForm } from './ReviewForm'
import { fetchCarComments } from '@/lib/actions'

type Comment = {
  id: string
  rating: number
  comment: string | null
  created_at: string
  author_name: string
}

/** Overlay imersivo: abre sobre o aro com a cena 3D flutuante + votos + comentários. */
export function CarDetail({
  car,
  onClose,
  onRequireAuth,
}: {
  car: CarWithStats | null
  onClose: () => void
  onRequireAuth: () => void
}) {
  const { t, locale } = useI18n()
  const tilt = usePointerTilt({ maxTilt: 6 })
  const [comments, setComments] = useState<Comment[] | null>(null)

  useEffect(() => {
    if (!car) return
    setComments(null)
    fetchCarComments(car.id).then((c) => setComments(c as Comment[]))
  }, [car])

  // trava o scroll do body enquanto aberto + fecha no Esc
  useEffect(() => {
    if (!car) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [car, onClose])

  const isLeader = car && car.decade_rank === 1 && car.review_count > 0

  return (
    <AnimatePresence>
      {car && (
        <motion.div
          className="fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-ink/80 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* botão fechar */}
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className="fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 rounded-full border border-white/15 bg-white/5 p-2.5 backdrop-blur transition-colors hover:bg-white/15"
          >
            <X size={20} />
          </button>

          <div className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-8 px-5 py-20 md:grid-cols-2 md:py-16">
            {/* ---------- CENA 3D FLUTUANTE ---------- */}
            <div
              className="relative [perspective:1400px]"
              onPointerMove={tilt.onPointerMove}
              onPointerLeave={tilt.onPointerLeave}
            >
              <motion.div
                style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
                className="preserve-3d relative aspect-[4/3]"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="stage-glow absolute inset-0 -z-10 blur-2xl"
                  style={{ transform: 'translateZ(-80px) scale(1.2)' }}
                />
                <div className="absolute inset-0" style={{ transform: 'translateZ(40px)' }}>
                  <Image
                    src={car.image_url}
                    alt={`${car.manufacturer} ${car.name}`}
                    fill
                    priority
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="mask-fade-bottom object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
                  />
                </div>
                {isLeader && (
                  <div
                    className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-bold text-black"
                    style={{ transform: 'translateZ(70px)' }}
                  >
                    <Trophy size={13} /> {t('decade.topPick')}
                  </div>
                )}
              </motion.div>
            </div>

            {/* ---------- INFO + VOTAÇÃO + COMENTÁRIOS ---------- */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-sm font-medium uppercase tracking-[0.25em] text-gold">
                {car.manufacturer} · {car.year} · {car.decade}s
              </span>
              <h2 className="mt-1 text-5xl font-black leading-[0.95] sm:text-6xl">
                {car.name}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
                {car.blurb[locale]}
              </p>

              <div className="mt-5 flex flex-wrap gap-5 text-sm">
                {car.top_speed && (
                  <span className="flex items-center gap-1.5 text-white/80">
                    <Gauge size={16} className="text-gold" /> {car.top_speed} km/h
                  </span>
                )}
                {car.power_hp && (
                  <span className="flex items-center gap-1.5 text-white/80">
                    <Zap size={16} className="text-gold" /> {car.power_hp} hp
                  </span>
                )}
                {car.review_count > 0 && (
                  <span className="flex items-center gap-1.5 text-white/80">
                    <Star size={16} className="fill-gold text-gold" />
                    {car.avg_rating.toFixed(1)}
                    <span className="text-white/40">
                      · #{car.decade_rank} {t('car.rank')} · {car.review_count}{' '}
                      {t('car.reviews')}
                    </span>
                  </span>
                )}
              </div>

              {/* votação */}
              <div className="mt-6 max-w-md">
                <ReviewForm
                  carId={car.id}
                  myReview={car.my_review}
                  onRequireAuth={onRequireAuth}
                />
              </div>

              {/* comentários da comunidade */}
              <div className="mt-8 max-w-md">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
                  {t('comments.title')}
                </h3>
                {comments === null ? (
                  <p className="text-sm text-white/40">{t('comments.loading')}</p>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-white/40">{t('comments.empty')}</p>
                ) : (
                  <ul className="space-y-3">
                    {comments.map((c) => (
                      <li
                        key={c.id}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                      >
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 text-sm font-semibold">
                            <Quote size={13} className="text-gold/60" />
                            {c.author_name}
                          </span>
                          <span className="flex items-center gap-0.5 text-xs text-gold">
                            <Star size={11} className="fill-gold text-gold" />
                            {c.rating}
                          </span>
                        </div>
                        <p className="text-sm text-white/80">{c.comment}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
