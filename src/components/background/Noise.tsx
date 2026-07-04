'use client'

export function Noise() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.02, mixBlendMode: 'overlay' }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <filter id="bg-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bg-noise)" opacity="1" />
      </svg>
    </div>
  )
}
