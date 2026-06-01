'use client'

import dynamic from 'next/dynamic'
import { useBackgroundEffect } from '@/components/providers/BackgroundEffectsProvider'

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
const ParticleBackground = effectLoader(() => import('./ParticleBackground').then(mod => ({ default: mod.ParticleBackground })))

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

  const PrimaryEffect = effectComponents[backgroundEffect] ?? null
  const SecondaryEffect = secondaryEffect && secondaryEffect !== 'none'
    ? effectComponents[secondaryEffect]
    : null

  return (
    <>
      {PrimaryEffect && <PrimaryEffect />}
      {SecondaryEffect && <SecondaryEffect />}
    </>
  )
}