export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export const Z_INDEX = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  nav: 200,
  modal: 100,
  overlay: 9998,
  progress: 9999,
} as const

export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.5,
  slow: 0.8,
  reveal: 0.9,
  entrance: 0.6,
} as const

export const CINEMATIC_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const SPRING_STIFF: Readonly<{ type: 'spring'; stiffness: number; damping: number }> = { type: 'spring', stiffness: 300, damping: 25 }
export const SPRING_BOUNCY: Readonly<{ type: 'spring'; stiffness: number; damping: number }> = { type: 'spring', stiffness: 200, damping: 15 }

export const RATE_LIMIT = 5
export const RATE_LIMIT_WINDOW = 60 * 1000

export const INTERSECTION_THRESHOLDS = [0.1, 0.3, 0.5, 0.7, 0.9]
export const INTERSECTION_MARGIN = '-100px'
