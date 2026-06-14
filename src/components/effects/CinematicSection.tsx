'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useCinematicReveal, cinematicEase } from '@/hooks/useCinematicReveal'

interface CinematicSectionProps {
  children: ReactNode
  id?: string
  className?: string
  delay?: number
  staggerChildren?: boolean
  depthBlur?: boolean
}

export function CinematicSection({
  children,
  id,
  className = '',
  delay = 0,
  staggerChildren = false,
  depthBlur = false,
}: CinematicSectionProps) {
  const { ref: sectionRef, isInView } = useCinematicReveal({ margin: '-100px' })

  return (
    <motion.section
      ref={sectionRef as unknown as React.RefObject<HTMLElement>}
      id={id}
      className={`relative ${className} ${depthBlur && !isInView ? 'dof-blurred' : ''}`}
      initial={{ opacity: 0, y: 60, scale: 0.98 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 60, scale: 0.98 }
      }
      transition={{
        duration: 0.9,
        ease: cinematicEase,
        delay,
      }}
    >
      {staggerChildren ? (
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: delay + 0.1,
              },
            },
            hidden: {},
          }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.section>
  )
}

// Re-usable header component for consistent section headers
export function SectionHeader({
  label,
  title,
  subtitle,
  isInView,
  delay = 0,
}: {
  label: string
  title: string
  subtitle: string
  isInView: boolean
  delay?: number
}) {
  return (
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: cinematicEase, delay }}
    >
      <motion.span
        className="inline-block px-4 py-1 rounded-full glass text-accent text-sm font-medium mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: delay + 0.1, duration: 0.4, ease: cinematicEase }}
      >
        {label}
      </motion.span>
      <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
        <span className="gradient-text">{title}</span>
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </motion.div>
  )
}