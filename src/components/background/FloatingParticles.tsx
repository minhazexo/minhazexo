'use client'

import { useState, useEffect, useMemo } from 'react'

interface Particle {
  left: number
  top: number
  size: number
  delay: number
  duration: number
}

function getParticleCount(): number {
  if (typeof window === 'undefined') return 25
  return window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 18 : 25
}

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    particles.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.floor(Math.random() * 3),
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 15,
    })
  }
  return particles
}

export function FloatingParticles() {
  const [count, setCount] = useState(25)
  const particles = useMemo(() => generateParticles(count), [count])

  useEffect(() => {
    const update = () => setCount(getParticleCount())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            backgroundColor: 'rgba(var(--theme-rgb), 0.35)',
            opacity: 0.15,
            animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}
