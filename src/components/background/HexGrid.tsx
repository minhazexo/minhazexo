'use client'

import { useState, useEffect, useMemo } from 'react'

function getHexSize(): number {
  if (typeof window === 'undefined') return 72
  const w = window.innerWidth
  if (w < 640) return 48
  if (w < 1024) return 58
  return 72
}

function hexPoints(cx: number, cy: number, r: number): string {
  const s3 = r * Math.sqrt(3) / 2
  return [
    `${cx},${cy - r}`,
    `${cx + s3},${cy - r / 2}`,
    `${cx + s3},${cy + r / 2}`,
    `${cx},${cy + r}`,
    `${cx - s3},${cy + r / 2}`,
    `${cx - s3},${cy - r / 2}`,
  ].join(' ')
}

const PATTERN_ID = 'bg-hex-grid'

export function HexGrid() {
  const [size, setSize] = useState(72)

  useEffect(() => {
    const update = () => setSize(getHexSize())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const { pw, ph, h1, h2, h3, r } = useMemo(() => {
    const R = size / 3.2
    const s3 = R * Math.sqrt(3)
    return {
      r: R,
      pw: 2 * s3,
      ph: 3 * R,
      h1: hexPoints(s3 / 2, R, R),
      h2: hexPoints(3 * s3 / 2, R, R),
      h3: hexPoints(s3, 2.5 * R, R),
    }
  }, [size])

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 2,
        opacity: 0.28,
        maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 25%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,0.55) 70%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 25%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,0.55) 70%, transparent 100%)',
        filter: 'drop-shadow(0 0 6px rgba(var(--theme-rgb), 0.18))',
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <pattern
            id={PATTERN_ID}
            width={pw}
            height={ph}
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points={h1}
              fill="none"
              stroke="rgba(var(--theme-rgb), 0.35)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <polygon
              points={h2}
              fill="none"
              stroke="rgba(var(--theme-rgb), 0.35)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <polygon
              points={h3}
              fill="none"
              stroke="rgba(var(--theme-rgb), 0.35)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${PATTERN_ID})`} />
      </svg>
    </div>
  )
}
