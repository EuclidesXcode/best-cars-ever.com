'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange?: (v: number) => void
  size?: number
  readOnly?: boolean
}

export function StarRating({
  value,
  onChange,
  size = 24,
  readOnly = false,
}: StarRatingProps) {
  const [hover, setHover] = useState(0)
  const active = hover || value

  return (
    <div className="flex items-center gap-1" role={readOnly ? undefined : 'radiogroup'}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= active
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            aria-label={`${star} / 5`}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange?.(star)}
            className={`transition-transform ${
              readOnly ? 'cursor-default' : 'cursor-pointer active:scale-90 hover:scale-110'
            } p-1 -m-1 touch-manipulation`}
          >
            <Star
              size={size}
              className={
                filled ? 'fill-gold text-gold' : 'fill-transparent text-white/30'
              }
            />
          </button>
        )
      })}
    </div>
  )
}
