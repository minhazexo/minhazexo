'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

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
            <span
              className={`
                text-[10px] uppercase tracking-widest transition-all duration-300
                ${isActive
                  ? 'text-accent opacity-100 font-medium'
                  : 'text-gray-500 opacity-0 group-hover:opacity-100'
                }
              `}
            >
              {section.label}
            </span>

            <div className="relative w-2 h-2">
              <div
                className={`
                  absolute inset-0 rounded-full border transition-all duration-500
                  ${isActive
                    ? 'border-accent scale-125'
                    : 'border-white/20 group-hover:border-white/40'
                  }
                `}
              />

              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-accent"
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

      <div className="absolute left-[3px] top-3 bottom-3 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </nav>
  )
}
