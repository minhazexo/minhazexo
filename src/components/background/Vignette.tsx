'use client'

export function Vignette() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(circle, transparent 45%, rgba(0,0,0,0.45) 100%)',
      }}
      aria-hidden="true"
    />
  )
}
