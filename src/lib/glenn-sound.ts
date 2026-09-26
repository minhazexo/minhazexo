/* Tiny optional UI blip synth — original code, no assets.
   Creates a short oscillator ping on hover/click when sound is on. */

let ctx: AudioContext | null = null
let enabled = false

export function setGlennSoundOn(on: boolean) {
  enabled = on
  if (on && typeof window !== 'undefined') {
    try {
      if (!ctx) {
        const AC = window.AudioContext || (window as any).webkitAudioContext
        if (AC) ctx = new AC()
      }
      if (ctx && ctx.state === 'suspended') void ctx.resume()
    } catch {
      /* ignore */
    }
  }
}

export function isGlennSoundOn() {
  return enabled
}

export function glennBlip(freq = 520, dur = 0.07, gain = 0.04) {
  if (!enabled) return
  try {
    if (!ctx) return
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)
    osc.frequency.exponentialRampToValueAtTime(Math.max(60, freq * 0.6), t + dur)
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  } catch {
    /* ignore */
  }
}

/* Cinematic riser for the gate reveal: a soft sine sweep up. Silent
   unless the visitor chose "Enter" (with sound). */
export function glennWhoosh() {
  if (!enabled) return
  try {
    if (!ctx) return
    const t = ctx.currentTime
    const dur = 0.65
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, t)
    osc.frequency.exponentialRampToValueAtTime(920, t + dur)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.14)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + dur + 0.05)
  } catch {
    /* ignore */
  }
}
