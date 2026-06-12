'use client'

import { useEffect } from 'react'
import {
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'

interface TiltOptions {
  /** Quanto a cena gira no eixo X/Y (graus). */
  maxTilt?: number
  /** Suavização da mola. */
  stiffness?: number
  damping?: number
}

export interface Tilt {
  /** Liga no container: rotaciona a cena inteira em 3D. */
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  /** -0.5..0.5 — multiplique por uma profundidade para deslocar cada camada. */
  px: MotionValue<number>
  py: MotionValue<number>
  onPointerMove: (e: React.PointerEvent) => void
  onPointerLeave: () => void
}

/**
 * Tilt 3D dirigido pelo ponteiro (desktop) e pelo giroscópio (mobile).
 * Centralizado aqui para que todas as cenas compartilhem a mesma física.
 */
export function usePointerTilt({
  maxTilt = 8,
  stiffness = 120,
  damping = 18,
}: TiltOptions = {}): Tilt {
  // -0.5 .. 0.5 relativos ao centro do elemento
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const px = useSpring(mx, { stiffness, damping })
  const py = useSpring(my, { stiffness, damping })

  const rotateY = useTransform(px, [-0.5, 0.5], [-maxTilt, maxTilt])
  const rotateX = useTransform(py, [-0.5, 0.5], [maxTilt, -maxTilt])

  function onPointerMove(e: React.PointerEvent) {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  function onPointerLeave() {
    mx.set(0)
    my.set(0)
  }

  // Giroscópio no mobile (quando o usuário inclina o aparelho).
  useEffect(() => {
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return
    function onOrient(e: DeviceOrientationEvent) {
      if (e.gamma == null || e.beta == null) return
      // gamma: -90..90 (esq/dir), beta: -180..180 (frente/trás)
      mx.set(Math.max(-0.5, Math.min(0.5, e.gamma / 45)))
      my.set(Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 45)))
    }
    window.addEventListener('deviceorientation', onOrient)
    return () => window.removeEventListener('deviceorientation', onOrient)
  }, [mx, my])

  return { rotateX, rotateY, px, py, onPointerMove, onPointerLeave }
}
