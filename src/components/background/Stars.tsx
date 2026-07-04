'use client'

import { useState, useEffect, useMemo } from 'react'

interface Star {
  left: number
  top: number
  size: number
  delay: number
  duration: number
  opacity: number
}

function getStarCount(): number {
  if (typeof window === 'undefined') return 300
  return window.innerWidth < 640 ? 150 : window.innerWidth < 1024 ? 200 : 300
}

function generateStars(count: number): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    stars.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() > 0.7 ? 2 : 1,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 4,
      opacity: 0.2 + Math.random() * 0.6,
    })
  }
  return stars
}

export function Stars() {
  const [count, setCount] = useState(300)
  const stars = useMemo(() => generateStars(count), [count])

  useEffect(() => {
    const update = () => setCount(getStarCount())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            opacity: star.opacity,
            animation: `star-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            willChange: 'opacity',
          }}
        />
      ))}
    </div>
  )
}
