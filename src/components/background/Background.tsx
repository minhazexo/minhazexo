'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { HexGrid } from './HexGrid'
import { GlowLayer } from './GlowLayer'
import { Stars } from './Stars'
import { FloatingParticles } from './FloatingParticles'
import { Noise } from './Noise'
import { Vignette } from './Vignette'

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
}

export function Background() {
  const prefersReduced = useReducedMotion()

  return (
    <div aria-hidden="true">
      <div
        style={{
          ...layerStyles,
          zIndex: 0,
          background: 'linear-gradient(180deg, #071220 0%, #030816 55%, #01040A 100%)',
        }}
      />

      <div style={{ ...layerStyles, zIndex: 1 }}>
        <GlowLayer />
      </div>

      <div style={{ ...layerStyles, zIndex: 2 }}>
        <HexGrid />
      </div>

      {!prefersReduced && (
        <div style={{ ...layerStyles, zIndex: 4 }}>
          <Stars />
        </div>
      )}

      {!prefersReduced && (
        <div style={{ ...layerStyles, zIndex: 5 }}>
          <FloatingParticles />
        </div>
      )}

      <div style={{ ...layerStyles, zIndex: 6 }}>
        <Noise />
      </div>

      <div style={{ ...layerStyles, zIndex: 7 }}>
        <Vignette />
      </div>
    </div>
  )
}
