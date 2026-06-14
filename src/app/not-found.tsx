import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="text-center px-4">
        <h1 className="text-8xl md:text-9xl font-orbitron font-bold gradient-text mb-4">404</h1>
        <p className="text-gray-400 mb-8 font-mono text-lg">
          SIGNAL LOST &mdash; Page not found in this dimension
        </p>
        <Link
          href="/"
          className="inline-flex px-8 py-4 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-medium transition-all hover:scale-105"
        >
          RETURN_TO_BASE
        </Link>
      </div>
    </div>
  )
}
