'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'

const sectionData = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export function SectionProgress() {
  const [activeSection, setActiveSection] = useState('hero')
  const lastUpdateRef = useRef(0)

  const setActiveDebounced = useCallback((id: string) => {
    const now = Date.now()
    if (now - lastUpdateRef.current < 100) return
    lastUpdateRef.current = now
    setActiveSection(id)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sectionData.forEach((section) => {
      const element = document.getElementById(section.id)
      if (!element) return
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setActiveDebounced(section.id)
            }
          })
        },
        { threshold: [0.1, 0.3, 0.5, 0.7, 0.9] }
      )
      observer.observe(element)
      observers.push(observer)
    })
    return () => observers.forEach((obs) => obs.disconnect())
  }, [setActiveDebounced])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className="section-progress-nav"
      style={{
        position: 'fixed', right: 24, top: '50%',
        transform: 'translateY(-50%)', zIndex: 50,
        flexDirection: 'column', gap: 16,
        display: 'none',
      }}
      onMouseOver={() => {}}
    >
      {sectionData.map((section) => {
        const isActive = activeSection === section.id

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="spr-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', background: 'transparent', border: 'none', padding: 0,
            }}
          >
            <span
              style={{
                fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                opacity: isActive ? 1 : 0,
                fontWeight: isActive ? 500 : 400,
                transition: 'all 300ms ease',
              }}
              className="spr-label"
            >
              {section.label}
            </span>

            <div style={{ position: 'relative', width: 8, height: 8 }}>
              <div
                style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: isActive
                    ? '1px solid var(--primary)'
                    : '1px solid var(--border-strong)',
                  transform: isActive ? 'scale(1.25)' : 'scale(1)',
                  transition: 'all 500ms ease',
                }}
              />

              {isActive && (
                <motion.div
                  style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    boxShadow: '0 0 10px var(--primary), 0 0 20px var(--primary)',
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </div>
          </button>
        )
      })}

      <div style={{
        position: 'absolute', left: 3, top: 12, bottom: 12, width: 1,
        background: 'linear-gradient(to bottom, transparent, var(--border), transparent)',
      }} />
    </nav>
  )
}
