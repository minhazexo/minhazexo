import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="text-center px-4">
        <h1
          style={{
            fontSize: 'clamp(64px, 12vw, 128px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 'var(--space-4)',
          }}
        >
          404
        </h1>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-8)',
            maxWidth: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Page not found in this dimension
        </p>
        <Link
          href="/"
          className="not-found-cta"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 52,
            padding: '16px 28px',
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 600,
            color: '#fff',
            background: 'var(--gradient-primary)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 24px var(--glow-color)',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'transform 250ms ease, box-shadow 250ms ease',
          }}
        >
          Return Home
        </Link>
        <style>{`
          .not-found-cta:hover {
            transform: translateY(-2px) scale(1.02) !important;
            box-shadow: 0 0 36px var(--glow-color) !important;
          }
        `}</style>
      </div>
    </div>
  )
}
