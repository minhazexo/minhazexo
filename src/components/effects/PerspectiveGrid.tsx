'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function PerspectiveGrid() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const gridOpacity = useTransform(scrollYProgress, [0, 0.8], [0.5, 0])

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity: gridOpacity }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        style={{ y: gridY }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="fadeTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(148,163,184,0)" />
              <stop offset="30%" stopColor="rgba(148,163,184,0.04)" />
              <stop offset="60%" stopColor="rgba(148,163,184,0.06)" />
              <stop offset="100%" stopColor="rgba(148,163,184,0)" />
            </linearGradient>
            <clipPath id="perspectiveClip">
              <polygon points="0,900 1440,900 1440,200 0,200" />
            </clipPath>
          </defs>

          <g clipPath="url(#perspectiveClip)" opacity="0.5">
            {/* Horizontal lines converging to horizon */}
            <line x1="0" y1="200" x2="1440" y2="200" stroke="rgba(148,163,184,0.04)" strokeWidth="0.5" />
            <line x1="0" y1="250" x2="1440" y2="250" stroke="rgba(148,163,184,0.04)" strokeWidth="0.5" />
            <line x1="0" y1="310" x2="1440" y2="310" stroke="rgba(148,163,184,0.035)" strokeWidth="0.5" />
            <line x1="0" y1="380" x2="1440" y2="380" stroke="rgba(148,163,184,0.03)" strokeWidth="0.5" />
            <line x1="0" y1="460" x2="1440" y2="460" stroke="rgba(148,163,184,0.025)" strokeWidth="0.5" />
            <line x1="0" y1="550" x2="1440" y2="550" stroke="rgba(148,163,184,0.02)" strokeWidth="0.5" />
            <line x1="0" y1="650" x2="1440" y2="650" stroke="rgba(148,163,184,0.015)" strokeWidth="0.5" />
            <line x1="0" y1="770" x2="1440" y2="770" stroke="rgba(148,163,184,0.01)" strokeWidth="0.5" />

            {/* Vertical lines converging toward center */}
            <line x1="720" y1="200" x2="0" y2="900" stroke="rgba(148,163,184,0.03)" strokeWidth="0.5" />
            <line x1="720" y1="200" x2="1440" y2="900" stroke="rgba(148,163,184,0.03)" strokeWidth="0.5" />
            <line x1="720" y1="200" x2="180" y2="900" stroke="rgba(148,163,184,0.025)" strokeWidth="0.5" />
            <line x1="720" y1="200" x2="1260" y2="900" stroke="rgba(148,163,184,0.025)" strokeWidth="0.5" />
            <line x1="720" y1="200" x2="360" y2="900" stroke="rgba(148,163,184,0.02)" strokeWidth="0.5" />
            <line x1="720" y1="200" x2="1080" y2="900" stroke="rgba(148,163,184,0.02)" strokeWidth="0.5" />
            <line x1="720" y1="200" x2="540" y2="900" stroke="rgba(148,163,184,0.015)" strokeWidth="0.5" />
            <line x1="720" y1="200" x2="900" y2="900" stroke="rgba(148,163,184,0.015)" strokeWidth="0.5" />
          </g>

          {/* Gradient overlay to fade grid toward the bottom */}
          <rect x="0" y="0" width="100%" height="100%" fill="url(#fadeTop)" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
