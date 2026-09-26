'use client'

/* Original fixed meta column (right side on desktop, stacked on mobile).
   Content is the owner's own bio — only the layout feel is inspired.
   Name/role come from the admin profile when set (page.tsx), otherwise
   the static defaults below. The role wraps onto two lines like before. */
export function GlennMeta({ name, title }: { name?: string | null; title?: string | null }) {
  const displayName = name?.trim() || 'MD Mehrab Hossain'
  const words = (title?.trim() || 'Full Stack Developer').split(/\s+/)
  const mid = Math.ceil(words.length / 2)
  const line1 = words.slice(0, mid).join(' ')
  const line2 = words.slice(mid).join(' ')
  return (
    <div className="glenn-meta" aria-hidden="false">
      <div className="glenn-meta-inner">
        <div className="glenn-meta-block">
          <span>Portfolio of</span>
          <span>{displayName}</span>
        </div>
        <div className="glenn-meta-block glenn-meta-sub">
          <span>{line1}</span>
          {line2 ? <span>{line2}</span> : null}
        </div>
        <div className="glenn-meta-block">
          <span>Available for</span>
          <span>freelance work</span>
        </div>
      </div>
    </div>
  )
}
