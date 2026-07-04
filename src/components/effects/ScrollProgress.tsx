'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const gradientBackground = `linear-gradient(90deg, var(--primary) 0%, var(--primary-secondary) 25%, var(--primary-accent) 50%, var(--primary-secondary) 75%, var(--primary) 100%)`

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[9999] origin-left"
        style={{
          scaleX,
          background: gradientBackground,
          willChange: 'transform',
        }}
        role="progressbar"
        aria-valuenow={Math.round(scrollYProgress.get() * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            willChange: 'transform',
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      <motion.div
        className="fixed top-[3px] left-0 right-0 h-[8px] z-[9998] origin-left opacity-40 pointer-events-none"
        style={{
          scaleX,
          background: gradientBackground,
          filter: 'blur(6px)',
          willChange: 'transform',
        }}
      />

      <motion.div
        className="fixed top-[1px] left-0 right-0 h-[1px] z-[9999] origin-left pointer-events-none"
        style={{
          scaleX,
          background: 'white',
          opacity: 0.6,
          willChange: 'opacity',
        }}
      />
    </>
  )
}