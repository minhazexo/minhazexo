'use client'

import { NoiseOverlay } from './NoiseOverlay'
import { CursorGlow } from './CursorGlow'
import { ScrollProgress } from './ScrollProgress'
import { HexagonGrid } from './HexagonGrid'

export function BackgroundSystem() {
  return (
    <>
      <ScrollProgress />

      <HexagonGrid />

      <div className="fixed inset-0 pointer-events-none z-background overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(1200px,150vw)] h-[min(1200px,150vw)] max-w-[100vw] max-h-[100vh]"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, transparent 70%)',
            filter: 'blur(300px)',
          }}
        />
      </div>

      <NoiseOverlay />

      <div className="fixed inset-0 pointer-events-none z-[2]" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(5,7,10,0.85) 100%)',
          }}
        />
      </div>

      <CursorGlow />
    </>
  )
}