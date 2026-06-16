'use client'

import { useEffect, useRef, useState } from 'react'

// Easing "Apple" — desaceleração suave e cara.
export const APPLE_EASE = [0.16, 1, 0.3, 1] as const

/**
 * Conta de 0 até `target` quando o elemento entra na viewport.
 * Retorna [value, ref] — prenda o ref no nó a observar.
 */
export function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLElement | null>(null)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return
        done.current = true
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          // easeOutExpo
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
          setValue(Math.round(target * eased))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, duration])

  return [value, ref] as const
}
