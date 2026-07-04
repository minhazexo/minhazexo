'use client'

import { useState, useEffect, useRef } from 'react'

const PATTERN_PREFIX = 'hex-'

const LAYERS = [
  { id: 'a', opacity: 0.12, depth: 1, driftAmp: 4, driftPeriod: 45 },
  { id: 'b', opacity: 0.07, depth: 1.8, driftAmp: 3, driftPeriod: 60 },
  { id: 'c', opacity: 0.04, depth: 2.8, driftAmp: 2, driftPeriod: 80 },
]

function getHexSize(): number {
  if (typeof window === 'undefined') return 60
  const w = window.innerWidth
  if (w < 640) return 40
  if (w < 1024) return 50
  return 60
}

function hexPoints(cx: number, cy: number, r: number): string {
  return [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2
      return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`
    })
    .join(' ')
}

export function HexagonGrid() {
  const [hexSize, setHex] = useState(60)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef(0)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const update = () => setHex(getHexSize())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  useEffect(() => {
    const start = Date.now()
    const animate = () => {
      const { x: mx, y: my } = mouseRef.current
      const t = (Date.now() - start) / 1000
      for (let i = 0; i < LAYERS.length; i++) {
        const el = layerRefs.current[i]
        if (!el) continue
        const { depth, driftAmp, driftPeriod } = LAYERS[i]
        const dx = mx * 5 * depth
        const dy = my * 5 * depth + Math.sin((t / driftPeriod) * Math.PI * 2) * driftAmp
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const r = hexSize / 3
  const w = r * Math.sqrt(3)
  const h = hexSize
  const h1 = hexPoints(w / 2, r, r)
  const h2 = hexPoints(w / 2, r * 2.5, r)

  return (
    <>
      {LAYERS.map((layer, i) => (
        <div
          key={layer.id}
          ref={(el) => { layerRefs.current[i] = el }}
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: -7 + i,
            opacity: layer.opacity,
            mixBlendMode: 'overlay',
            filter: 'drop-shadow(0 0 6px var(--pattern-color))',
            maskImage: 'radial-gradient(ellipse 70% 65% at 50% 55%, black 30%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 55%, black 30%, transparent 72%)',
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
                id={`${PATTERN_PREFIX}${layer.id}`}
                width={w}
                height={h}
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points={h1}
                  fill="none"
                  stroke="var(--pattern-color)"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <polygon
                  points={h2}
                  fill="none"
                  stroke="var(--pattern-color)"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${PATTERN_PREFIX}${layer.id})`} />
          </svg>
        </div>
      ))}
    </>
  )
}
