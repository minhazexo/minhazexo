'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsGlennMode } from '@/hooks/useGlennMode'
import { HexGrid } from './HexGrid'
import { HexGridFxPanel } from './HexGridFxPanel'
import { useHexFx } from './hexFxStore'
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
  const isGlenn = useIsGlennMode()
  const [mounted, setMounted] = useState(false)

  /* Visitor-picked honeycomb glow pattern + intensity (shared store). */
  const { effect, intensity } = useHexFx()

  useEffect(() => {
    setMounted(true)
  }, [])

  /* The gallery paints its own backdrop (GlennBackdrop: canvas glows +
     grain plus the shared HexGrid, all theme-driven). Unmount the whole
     aurora stack here instead of dimming it — it was still animating at
     16% opacity underneath. */
  if (isGlenn) return null

  /* Stars / particles generate random layouts with Math.random — rendering
     them during SSR guarantees a hydration mismatch (server positions ≠
     client positions). Mount them client-side only. */
  const showRandomLayers = mounted && !prefersReduced

  return (
    <>
      <div aria-hidden="true" id="site-background">
        <div
          className="bg-base"
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
          <HexGrid effect={effect} intensity={intensity} />
        </div>

        {!showRandomLayers ? null : (
          <div style={{ ...layerStyles, zIndex: 4 }}>
            <Stars />
          </div>
        )}

        {!showRandomLayers ? null : (
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
      {/* Interactive — lives outside the aria-hidden backdrop. */}
      {mounted && !prefersReduced && <HexGridFxPanel />}
    </>
  )
}
