'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const gradientBackground = `linear-gradient(90deg, var(--primary) 0%, var(--secondary) 25%, var(--tertiary) 50%, var(--secondary) 75%, var(--primary) 100%)`

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[9999] origin-left"
        style={{
          scaleX,
          background: gradientBackground,
          backgroundSize: '200% 100%',
          boxShadow: `
            0 0 20px var(--primary),
            0 0 40px var(--primary),
            0 0 60px var(--secondary)
          `,
        }}
        animate={{ backgroundPosition: ['0% 0', '200% 0'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        role="progressbar"
        aria-valuenow={Math.round(scrollYProgress.get() * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />

      <motion.div
        className="fixed top-[3px] left-0 right-0 h-[8px] z-[9998] origin-left opacity-40"
        style={{
          scaleX,
          background: gradientBackground,
          backgroundSize: '200% 100%',
          filter: 'blur(6px)',
        }}
        animate={{ backgroundPosition: ['0% 0', '200% 0'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="fixed top-[1px] left-0 right-0 h-[1px] z-[9999] origin-left"
        style={{
          scaleX,
          background: 'white',
          boxShadow: '0 0 10px white, 0 0 20px white',
          opacity: 0.6,
        }}
      />
    </>
  )
}