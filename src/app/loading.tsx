export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--bg-primary)] flex items-center justify-center" role="progressbar" aria-label="Loading page...">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-accent-muted border-t-accent rounded-full animate-spin" />
        <p className="text-accent-muted font-mono text-xs tracking-widest">LOADING</p>
      </div>
    </div>
  )
}
