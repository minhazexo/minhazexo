'use client'

import { useState } from 'react'
import {
  MousePointer2,
  Waves,
  Shell,
  Activity,
  Sparkles,
  CircleDot,
  Flame,
  Power,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import type { HexFx } from './HexGrid'
import { useHexFx, setHexFx, setHexIntensity } from './hexFxStore'

/* Floating control for the living honeycomb — visitors pick the glow
   pattern they like. Rendered next to whichever grid is mounted
   (gallery backdrop or ambient background); state is shared. */

const OPTIONS: { id: HexFx; label: string; hint: string; Icon: typeof Waves }[] = [
  { id: 'cursor', label: 'Cursor Bloom', hint: 'Light follows your pointer', Icon: MousePointer2 },
  { id: 'wave', label: 'Wave', hint: 'Light sweeps left to right', Icon: Waves },
  { id: 'vortex', label: 'Vortex', hint: 'Rotating spiral of light', Icon: Shell },
  { id: 'breathing', label: 'Breathing', hint: 'Cells gently pulse', Icon: Activity },
  { id: 'twinkle', label: 'Twinkle', hint: 'Random star-like flashes', Icon: Sparkles },
  { id: 'ripple', label: 'Ripple', hint: 'Click to send shockwaves', Icon: CircleDot },
  { id: 'ember', label: 'Embers', hint: 'Drifting blobs of glow', Icon: Flame },
  { id: 'off', label: 'Calm', hint: 'Still lattice, no motion', Icon: Power },
]

export function HexGridFxPanel() {
  const { effect, intensity } = useHexFx()
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        position: 'fixed',
        left: 16,
        top: 16,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close glow effects' : 'Open glow effects'}
        aria-expanded={open}
        title="Grid glow effects"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: open ? '1px solid var(--primary)' : '1px solid var(--border)',
          color: open ? 'var(--primary)' : 'var(--text-secondary)',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          transition: 'border-color 200ms ease, color 200ms ease, transform 200ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <SlidersHorizontal style={{ width: 19, height: 19 }} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Grid glow effects"
          style={{
            width: 264,
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100dvh - 96px)',
            overflowY: 'auto',
            borderRadius: 20,
            padding: 16,
            /* Solid dark base under the theme glass so options stay
               readable over bright gallery content. */
            background:
              'linear-gradient(rgba(10,14,20,0.93), rgba(10,14,20,0.93)), var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                fontWeight: 700,
              }}
            >
              Grid glow
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close glow effects"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {OPTIONS.map(({ id, label, hint, Icon }) => {
              const active = effect === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setHexFx(id)}
                  aria-pressed={active}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '9px 12px',
                    borderRadius: 12,
                    border: active
                      ? '1px solid var(--primary)'
                      : '1px solid transparent',
                    background: active
                      ? 'color-mix(in srgb, var(--primary) 12%, transparent)'
                      : 'transparent',
                    color: active ? 'var(--text)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 200ms ease, border-color 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = 'var(--glass-bg)'
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <Icon
                    style={{
                      width: 17,
                      height: 17,
                      flexShrink: 0,
                      color: active ? 'var(--primary)' : 'var(--text-muted)',
                    }}
                  />
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hint}</span>
                  </span>
                </button>
              )
            })}
          </div>

          {effect !== 'off' && (
            <div style={{ marginTop: 14 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                  }}
                >
                  Intensity
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {Math.round(intensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.4}
                max={1.6}
                step={0.1}
                value={intensity}
                onChange={(e) => setHexIntensity(Number(e.target.value))}
                aria-label="Glow intensity"
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
