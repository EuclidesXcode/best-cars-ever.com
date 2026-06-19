import { createClient } from '@/lib/supabase/server'
import type { Car, CarRanking, Review, CarWithStats, Decade, Post } from '@/lib/types'
import { DECADES } from '@/lib/types'

/**
 * Lista plana de todos os carros em ordem cronológica (1974 → 2022),
 * já enriquecidos com ranking agregado + a review do usuário logado.
 * É a fonte única usada pela timeline circular e pelo ranking.
 */
export async function getCars(): Promise<CarWithStats[]> {
  const supabase = await createClient()

  const [{ data: cars }, { data: rankings }, { data: userData }] = await Promise.all([
    supabase.from('cars').select('*').order('year', { ascending: true }),
    supabase.from('car_rankings').select('*'),
    supabase.auth.getUser(),
  ])

  let myReviews: Review[] = []
  if (userData.user) {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userData.user.id)
    myReviews = data ?? []
  }

  const rankingByCar = new Map<number, CarRanking>(
    (rankings ?? []).map((r) => [r.car_id, r as CarRanking])
  )
  const reviewByCar = new Map<number, Review>(myReviews.map((r) => [r.car_id, r]))

  return ((cars ?? []) as Car[]).map((car) => {
    const rk = rankingByCar.get(car.id)
    return {
      ...car,
      avg_rating: rk?.avg_rating ?? 0,
      review_count: rk?.review_count ?? 0,
      decade_rank: rk?.decade_rank ?? 0,
      my_review: reviewByCar.get(car.id) ?? null,
    }
  })
}

/**
 * Mesmos carros, agrupados por década e ordenados pelo ranking da década.
 * Usado pela seção de Ranking.
 */
export async function getCarsByDecade(): Promise<Record<Decade, CarWithStats[]>> {
  const cars = await getCars()

  const grouped = Object.fromEntries(
    DECADES.map((d) => [d, [] as CarWithStats[]])
  ) as Record<Decade, CarWithStats[]>

  for (const car of cars) grouped[car.decade].push(car)

  for (const d of DECADES) {
    grouped[d].sort(
      (a, b) => a.decade_rank - b.decade_rank || b.avg_rating - a.avg_rating
    )
  }

  return grouped
}

/** Comentários públicos de um carro (com email mascarado feito no client). */
export async function getReviewsForCar(carId: number): Promise<Review[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('car_id', carId)
    .not('comment', 'is', null)
    .order('created_at', { ascending: false })
  return (data ?? []) as Review[]
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

/** O usuário logado é admin? (lê profiles.is_admin). Usado para proteger /admin. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  return data?.is_admin === true
}

// ----------- NOTÍCIAS (blog admin) --------------------------

/** Notícias publicadas, mais recentes primeiro. Listagem pública de /news. */
export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  return (data ?? []) as Post[]
}

/**
 * Um post pelo slug. Rascunhos só são retornados para o admin (garantido por RLS),
 * então a página pública chama notFound() quando vier null.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  return (data as Post) ?? null
}

/** Um post pelo id (inclui rascunho via RLS de admin). Usado na edição. */
export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('posts').select('*').eq('id', id).maybeSingle()
  return (data as Post) ?? null
}

/** Todos os posts (inclui rascunhos). RLS já filtra para não-admin. Usado em /admin. */
export async function getAllPostsForAdmin(): Promise<Post[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  return (data ?? []) as Post[]
}
