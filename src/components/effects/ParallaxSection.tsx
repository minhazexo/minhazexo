'use client'

import { useRef, useState, useEffect, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  id?: string
  offset?: number
  delay?: number
}

export function ParallaxSection({ children, className, id, offset = 30, delay = 0 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [isMobile ? 0 : offset, isMobile ? 0 : -offset])

  return (
    <div ref={ref} id={id} className={className}>
      <motion.div
        style={{ y, willChange: 'transform' as const }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}
