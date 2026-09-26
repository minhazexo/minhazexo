'use client'

/* Original fixed meta column (right side on desktop, stacked on mobile).
   Content is the owner's own bio — only the layout feel is inspired. */
export function GlennMeta() {
  return (
    <div className="glenn-meta" aria-hidden="false">
      <div className="glenn-meta-inner">
        <div className="glenn-meta-block">
          <span>Portfolio of</span>
          <span>MD Mehrab Hossain</span>
        </div>
        <div className="glenn-meta-block glenn-meta-sub">
          <span>Full-Stack</span>
          <span>Web Developer</span>
        </div>
        <div className="glenn-meta-block">
          <span>Available for</span>
          <span>freelance work</span>
        </div>
      </div>
    </div>
  )
}
