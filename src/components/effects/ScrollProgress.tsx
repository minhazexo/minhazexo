'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useState, useEffect } from 'react'

/**
 * Cinematic Scroll Progress - Horizontal bar at top with animated gradient
 * Shows scroll progress with flowing neon colors
 */
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
      {/* Main progress bar with glow */}
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

      {/* Outer glow layer */}
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

      {/* Inner core glow */}
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

/**
 * Cinematic Section Navigator - Shows current section with active state
 * Uses Intersection Observer for accurate section detection
 */
export function SectionProgress() {
  const [activeSection, setActiveSection] = useState('hero')

  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ]

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setActiveSection(section.id)
            }
          })
        },
        { threshold: [0.1, 0.3, 0.5, 0.7, 0.9] }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
      {sections.map((section) => {
        const isActive = activeSection === section.id

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group flex items-center gap-3 cursor-pointer bg-transparent border-none p-0"
          >
            {/* Label - appears on hover or when active */}
            <span
              className={`
                text-[10px] uppercase tracking-widest transition-all duration-300
                ${isActive
                  ? 'text-cyan-400 opacity-100 font-medium'
                  : 'text-gray-500 opacity-0 group-hover:opacity-100'
                }
              `}
            >
              {section.label}
            </span>

            {/* Animated dot indicator */}
            <div className="relative w-2 h-2">
              {/* Outer ring - always visible */}
              <div
                className={`
                  absolute inset-0 rounded-full border transition-all duration-500
                  ${isActive
                    ? 'border-cyan-400 scale-125'
                    : 'border-white/20 group-hover:border-white/40'
                  }
                `}
              />

              {/* Inner core - pulses when active */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyan-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    boxShadow: '0 0 10px var(--primary), 0 0 20px var(--primary)',
                  }}
                />
              )}
            </div>
          </button>
        )
      })}

      {/* Connecting line */}
      <div className="absolute left-[3px] top-3 bottom-3 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </nav>
  )
}