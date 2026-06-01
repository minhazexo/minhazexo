'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView, type UseInViewOptions } from 'framer-motion'

interface CinematicRevealOptions {
  threshold?: number
  margin?: string
  once?: boolean
  staggerDelay?: number
  staggerChildren?: number
}

interface CinematicRevealResult {
  ref: React.RefObject<HTMLElement | null>
  isInView: boolean
  controls: {
    container: {
      initial: { opacity: number; y: number; scale: number }
      animate: { opacity: number; y: number; scale: number }
      transition: { duration: number; ease: number[]; delay?: number }
    }
    child: (index: number) => {
      initial: { opacity: number; y: number }
      animate: { opacity: number; y: number }
      transition: { duration: number; ease: number[]; delay: number }
    }
  }
}

const CINEMATIC_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function useCinematicReveal(
  options: CinematicRevealOptions = {}
): CinematicRevealResult {
  const {
    threshold = 0.1,
    margin = '-80px',
    once = true,
    staggerDelay = 0.1,
  } = options

  const ref = useRef<HTMLElement | null>(null)
  const inViewOptions: UseInViewOptions = {
    once,
    margin: margin as UseInViewOptions['margin'],
  }
  
  const isInView = useInView(ref, inViewOptions)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  const controls = {
    container: {
      initial: { opacity: 0, y: 60, scale: 0.95 },
      animate: isInView
        ? { opacity: 1, y: 0, scale: 1 }
        : { opacity: 0, y: 60, scale: 0.95 },
      transition: {
        duration: 0.9,
        ease: CINEMATIC_EASE,
      },
    },
    child: (index: number) => ({
      initial: { opacity: 0, y: 30 },
      animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
      transition: {
        duration: 0.7,
        ease: CINEMATIC_EASE,
        delay: staggerDelay + index * 0.1,
      },
    }),
  }

  return {
    ref: ref as React.RefObject<HTMLElement | null>,
    isInView,
    controls,
  }
}

// Pre-defined child animation variants for staggered lists
export const staggerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: CINEMATIC_EASE,
      delay: 0.2 + i * 0.08,
    },
  }),
}

// Easing constant for reuse
export const cinematicEase: [number, number, number, number] = CINEMATIC_EASE