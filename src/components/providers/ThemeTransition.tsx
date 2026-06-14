'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeTransition() {
  const { theme } = useTheme()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [prevTheme, setPrevTheme] = useState<string>('')

  useEffect(() => {
    if (theme && theme !== prevTheme && prevTheme !== '') {
      setIsTransitioning(true)

      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 600)

      return () => clearTimeout(timer)
    }

    if (theme) {
      setPrevTheme(theme)
    }
  }, [theme, prevTheme])

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[10000] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.3, 0.5, 0.3, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: `
              radial-gradient(circle at 30% 50%, rgba(0, 212, 255, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 50%, rgba(255, 0, 170, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)
            `,
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  transparent 0px,
                  transparent 20px,
                  rgba(255, 255, 255, 0.1) 21px,
                  transparent 22px,
                  transparent 40px
                )
              `,
            }}
            animate={{
              backgroundPosition: ['0% 0%', '200% 0%'],
            }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
