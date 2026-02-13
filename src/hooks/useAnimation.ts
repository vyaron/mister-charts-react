import { useRef, useCallback } from 'react'
import { easeOut } from '../services/chart.service'

export function useAnimation(duration: number = 2000) {
  const animationRef = useRef<number | null>(null)

  const animate = useCallback(
    (onFrame: (progress: number) => void, onComplete?: () => void) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      const startTime = performance.now()

      const tick = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const rawProgress = Math.min(elapsed / duration, 1)
        const progress = easeOut(rawProgress)

        onFrame(progress)

        if (rawProgress < 1) {
          animationRef.current = requestAnimationFrame(tick)
        } else {
          animationRef.current = null
          onComplete?.()
        }
      }

      animationRef.current = requestAnimationFrame(tick)
    },
    [duration]
  )

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [])

  return { animate, stop }
}
