'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ActionResult = { ok: true } | { ok: false; error: string }

export async function submitReview(
  carId: number,
  rating: number,
  comment: string
): Promise<ActionResult> {
  if (rating < 1 || rating > 5) return { ok: false, error: 'INVALID_RATING' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'NOT_AUTHENTICATED' }

  const { error } = await supabase.from('reviews').insert({
    car_id: carId,
    user_id: user.id,
    rating,
    comment: comment.trim() || null,
  })

  if (error) {
    // 23505 = unique_violation → já avaliou este carro.
    if (error.code === '23505') return { ok: false, error: 'ALREADY_REVIEWED' }
    return { ok: false, error: error.message }
  }

  revalidatePath('/')
  return { ok: true }
}

export async function updateReview(
  reviewId: string,
  rating: number,
  comment: string
): Promise<ActionResult> {
  if (rating < 1 || rating > 5) return { ok: false, error: 'INVALID_RATING' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'NOT_AUTHENTICATED' }

  const { error } = await supabase
    .from('reviews')
    .update({ rating, comment: comment.trim() || null })
    .eq('id', reviewId)
    .eq('user_id', user.id)

  if (error) {
    // O trigger bloqueia uma segunda edição.
    if (error.message.includes('editada')) return { ok: false, error: 'EDIT_LIMIT' }
    return { ok: false, error: error.message }
  }

  revalidatePath('/')
  return { ok: true }
}

export async function deleteReview(reviewId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'NOT_AUTHENTICATED' }

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', user.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/')
  return { ok: true }
}

/** Comentários públicos de um carro, já com o nome do autor (view car_comments). */
export async function fetchCarComments(carId: number) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('car_comments')
    .select('id, rating, comment, created_at, author_name')
    .eq('car_id', carId)
    .order('created_at', { ascending: false })
    .limit(50)
  return data ?? []
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
}
