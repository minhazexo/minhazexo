export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: 'var(--background)', zIndex: 9999 }}
      role="progressbar"
      aria-label="Loading page..."
    >
      <div className="flex flex-col items-center gap-4">
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid var(--border)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.2em' }}>
          LOADING
        </p>
      </div>
    </div>
  )
}
