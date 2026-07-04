import { type Variants, type Transition } from 'framer-motion'

export const cinematicEase: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const springStiff: Transition = { type: 'spring', stiffness: 300, damping: 25 }
export const springBouncy: Transition = { type: 'spring', stiffness: 200, damping: 15 }

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: cinematicEase } },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: cinematicEase } },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: cinematicEase } },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: cinematicEase } },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: cinematicEase } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: cinematicEase } },
}

export const scaleInSpring: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: springStiff },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: cinematicEase },
  },
}

export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.7, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const shimmerVariants: Variants = {
  animate: {
    x: ['-100%', '100%'],
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
  },
}

export const cardHover = {
  whileHover: { y: -5, transition: { duration: 0.3, ease: cinematicEase } },
  whileTap: { scale: 0.98 },
}

export const buttonHover = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.96 },
}
