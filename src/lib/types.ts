export type Locale = 'pt' | 'en' | 'es'

export const DECADES = [1970, 1980, 1990, 2000, 2010, 2020] as const
export type Decade = (typeof DECADES)[number]

export interface Car {
  id: number
  slug: string
  name: string
  manufacturer: string
  year: number
  decade: Decade
  top_speed: number | null
  power_hp: number | null
  image_url: string
  blurb: Record<Locale, string>
}

export interface Review {
  id: string
  car_id: number
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
  edit_count: number
}

export interface CarRanking {
  car_id: number
  decade: Decade
  avg_rating: number
  review_count: number
  decade_rank: number
}

/** Car enriched with its aggregated ranking + the current user's own review. */
export interface CarWithStats extends Car {
  avg_rating: number
  review_count: number
  decade_rank: number
  my_review: Review | null
}
