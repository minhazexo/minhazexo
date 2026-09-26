'use client'

import { useSyncExternalStore } from 'react'
import { HEX_FX_OPTIONS, HEX_FX_DEFAULT, type HexFx } from './HexGrid'

/* Shared honeycomb glow settings — the grid lives in two places
   (ambient Background off-gallery, GlennBackdrop inside the gallery)
   but there is exactly one visitor choice. Stored in localStorage,
   broadcast to every subscriber. */

const FX_KEY = 'hexgrid-effect'
const INT_KEY = 'hexgrid-intensity'

function readEffect(): HexFx {
  if (typeof window === 'undefined') return HEX_FX_DEFAULT
  try {
    const v = window.localStorage.getItem(FX_KEY) as HexFx | null
    if (v && HEX_FX_OPTIONS.includes(v)) return v
  } catch {}
  return HEX_FX_DEFAULT
}

function readIntensity(): number {
  if (typeof window === 'undefined') return 1
  try {
    const v = Number(window.localStorage.getItem(INT_KEY))
    if (Number.isFinite(v) && v >= 0.4 && v <= 1.6) return v
  } catch {}
  return 1
}

export interface HexFxState {
  effect: HexFx
  intensity: number
}

let effect: HexFx = HEX_FX_DEFAULT
let intensity = 1
let initialized = false
let snapshot: HexFxState = { effect, intensity }
const listeners = new Set<() => void>()

function ensureInit() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  effect = readEffect()
  intensity = readIntensity()
  snapshot = { effect, intensity }
}

function notify() {
  snapshot = { effect, intensity }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const serverSnapshot: HexFxState = { effect: HEX_FX_DEFAULT, intensity: 1 }

export function useHexFx(): HexFxState {
  ensureInit()
  return useSyncExternalStore(subscribe, () => snapshot, () => serverSnapshot)
}

export function setHexFx(fx: HexFx) {
  ensureInit()
  if (effect === fx) return
  effect = fx
  try {
    window.localStorage.setItem(FX_KEY, fx)
  } catch {}
  notify()
}

export function setHexIntensity(v: number) {
  ensureInit()
  if (intensity === v) return
  intensity = v
  try {
    window.localStorage.setItem(INT_KEY, String(v))
  } catch {}
  notify()
}
