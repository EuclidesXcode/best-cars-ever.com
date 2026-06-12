'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Lock, Pencil, Trash2, LogIn } from 'lucide-react'
import { StarRating } from './StarRating'
import { useI18n } from './I18nProvider'
import { useAuth } from './AuthProvider'
import { submitReview, updateReview, deleteReview } from '@/lib/actions'
import type { Review } from '@/lib/types'
import type { TranslationKey } from '@/lib/dictionaries'

const ERROR_KEY: Record<string, TranslationKey> = {
  ALREADY_REVIEWED: 'error.already',
  EDIT_LIMIT: 'error.editLimit',
}

export function ReviewForm({
  carId,
  myReview,
  onRequireAuth,
}: {
  carId: number
  myReview: Review | null
  onRequireAuth: () => void
}) {
  const { t } = useI18n()
  const { user } = useAuth()
  const [pending, startTransition] = useTransition()

  const [editing, setEditing] = useState(!myReview)
  const [rating, setRating] = useState(myReview?.rating ?? 0)
  const [comment, setComment] = useState(myReview?.comment ?? '')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  // Já gastou a única edição permitida?
  const editLocked = (myReview?.edit_count ?? 0) >= 1

  function showError(code: string) {
    const key = ERROR_KEY[code] ?? 'error.generic'
    setError(t(key))
  }

  function handleSubmit() {
    if (rating < 1) return
    setError(null)
    startTransition(async () => {
      const res = myReview
        ? await updateReview(myReview.id, rating, comment)
        : await submitReview(carId, rating, comment)
      if (res.ok) {
        setDone(true)
        setEditing(false)
      } else {
        showError(res.error)
      }
    })
  }

  function handleDelete() {
    if (!myReview) return
    if (!window.confirm(t('review.confirmDelete'))) return
    setError(null)
    startTransition(async () => {
      const res = await deleteReview(myReview.id)
      if (!res.ok) showError(res.error)
    })
  }

  // --- Não autenticado ---
  if (!user) {
    return (
      <button
        onClick={onRequireAuth}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-medium transition-colors hover:bg-white/10"
      >
        <LogIn size={16} />
        {t('review.signInPrompt')}
      </button>
    )
  }

  // --- Tem review e NÃO está editando: modo leitura ---
  if (myReview && !editing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-white/10 bg-white/5 p-4"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-white/50">
            {t('car.yourReview')}
          </span>
          <StarRating value={myReview.rating} readOnly size={18} />
        </div>
        {myReview.comment && (
          <p className="mb-3 text-sm text-white/80">{myReview.comment}</p>
        )}

        {editLocked ? (
          <p className="flex items-center gap-1.5 text-xs text-white/40">
            <Lock size={12} /> {t('review.editedOnce')}
          </p>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              disabled={pending}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              <Pencil size={13} /> {t('review.edit')}
            </button>
            <button
              onClick={handleDelete}
              disabled={pending}
              className="flex items-center gap-1.5 rounded-lg bg-accent/15 px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/25 disabled:opacity-50"
            >
              <Trash2 size={13} /> {t('review.delete')}
            </button>
          </div>
        )}
        {error && <p className="mt-2 text-xs text-accent">{error}</p>}
      </motion.div>
    )
  }

  // --- Criar review ou editar ---
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex justify-center">
        <StarRating value={rating} onChange={setRating} size={30} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t('review.commentPlaceholder')}
        rows={3}
        maxLength={1000}
        className="mb-3 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition-colors focus:border-gold/60"
      />

      {myReview && !editLocked && (
        <p className="mb-2 text-xs text-gold/80">{t('review.editOnce')}</p>
      )}
      {error && <p className="mb-2 text-xs text-accent">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={pending || rating < 1}
          className="flex-1 rounded-lg bg-gradient-to-r from-accent to-gold py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {pending
            ? t('review.submitting')
            : myReview
              ? t('review.save')
              : t('review.submit')}
        </button>
        {myReview && (
          <button
            onClick={() => {
              setEditing(false)
              setRating(myReview.rating)
              setComment(myReview.comment ?? '')
              setError(null)
            }}
            disabled={pending}
            className="rounded-lg bg-white/10 px-4 py-2.5 text-sm transition-colors hover:bg-white/20"
          >
            {t('review.cancel')}
          </button>
        )}
      </div>
      {done && <p className="mt-2 text-center text-xs text-gold">{t('review.thanks')}</p>}
    </div>
  )
}
