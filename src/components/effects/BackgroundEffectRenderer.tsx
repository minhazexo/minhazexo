'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useBackgroundEffect } from '@/components/providers/BackgroundEffectsProvider'
import { SectionErrorBoundary } from '@/components/providers/ErrorBoundary'

const effectLoader = (importer: any) =>
  dynamic(importer, {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black" />,
  })

const RetroGrid = effectLoader(() => import('./RetroGrid').then(mod => ({ default: mod.default })))
const AuroraBorealis = effectLoader(() => import('./AuroraBorealis').then(mod => ({ default: mod.default })))
const ConstellationMap = effectLoader(() => import('./ConstellationMap').then(mod => ({ default: mod.default })))
const DigitalRain = effectLoader(() => import('./DigitalRain').then(mod => ({ default: mod.default })))
const FloatingOrbs = effectLoader(() => import('./FloatingOrbs').then(mod => ({ default: mod.default })))
const GeometricPattern = effectLoader(() => import('./GeometricPattern').then(mod => ({ default: mod.default })))
const WaveFlowField = effectLoader(() => import('./WaveFlowField').then(mod => ({ default: mod.default })))
const ParticleBackground = effectLoader(() => import('./ParticleBackground').then(mod => ({ default: mod.default })))

const effectComponents: Record<string, React.ComponentType<any> | null> = {
  none: null,
  retrogrid: RetroGrid,
  aurora: AuroraBorealis,
  constellation: ConstellationMap,
  digitalrain: DigitalRain,
  floatingorbs: FloatingOrbs,
  geometric: GeometricPattern,
  waveflow: WaveFlowField,
  particles: ParticleBackground,
}

export function BackgroundEffectRenderer() {
  const { backgroundEffect, secondaryEffect } = useBackgroundEffect()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setIsReady(true), { timeout: 1500 })
    } else {
      setTimeout(() => setIsReady(true), 1500)
    }
  }, [])

  if (!isReady) return null

  const PrimaryEffect = effectComponents[backgroundEffect] ?? null
  const SecondaryEffect = secondaryEffect && secondaryEffect !== 'none'
    ? effectComponents[secondaryEffect]
    : null

  const renderEffect = (Effect: React.ComponentType<any>) => (
    <SectionErrorBoundary>
      <Effect />
    </SectionErrorBoundary>
  )

  return (
    <>
      {PrimaryEffect && renderEffect(PrimaryEffect)}
      {SecondaryEffect && renderEffect(SecondaryEffect)}
    </>
  )
}