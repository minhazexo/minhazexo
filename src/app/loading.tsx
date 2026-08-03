/* Server-safe branded loader. Shown by Next.js while the client bundle
   hydrates, before the interactive LoadingScreen takes over — matching
   backgrounds keeps the transition seamless (no double-spinner pop). */

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--background)' }}
      role="progressbar"
      aria-label="Loading page..."
    >
      <div style={{ position: 'relative', width: 96, height: 96 }}>
        {/* Rotating gradient ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, var(--primary), var(--primary-secondary), var(--primary-accent), var(--primary))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
            opacity: 0.5,
            animation: 'lspin 1.2s linear infinite',
          }}
        />
        {/* Glow core */}
        <div
          style={{
            position: 'absolute',
            inset: 30,
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            boxShadow: '0 0 24px var(--glow-color)',
            animation: 'lcorePulse 1.6s ease-in-out infinite',
          }}
        />
      </div>

      <p
        style={{
          marginTop: 24,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
        }}
      >
        MD Mehrab Hossain
      </p>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes lspin { to { transform: rotate(360deg) } }
        @keyframes lcorePulse { 0%,100% { transform: scale(1); opacity: .6 } 50% { transform: scale(1.15); opacity: 1 } }
      ` }} />
    </div>
  )
}