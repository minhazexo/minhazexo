export function SectionDivider() {
  return (
    <div
      style={{
        maxWidth: 960,
        margin: '0 auto',
        height: 1,
        background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
        opacity: 0.05,
      }}
      aria-hidden="true"
    />
  )
}
