'use client'

import { footerSocialLinks } from '@/data/social'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: 'var(--space-9) 0',
      }}
    >
      <div style={{ maxWidth: 'var(--content-width)', margin: '0 auto', padding: '0 var(--space-6)' }}>
        <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div
              style={{
                width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff',
                background: 'var(--gradient-primary)',
              }}
            >
              M
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              &copy; {currentYear} minhazexo
            </span>
          </div>

          <div className="footer-links" style={{ display: 'flex', gap: 'var(--space-4)' }}>
            {footerSocialLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Icon style={{ width: 16, height: 16 }} />
                  {link.label}
                </a>
              )
            })}
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .footer-inner { flex-direction: column !important; text-align: center !important; gap: 16px !important; }
            .footer-links { flex-wrap: wrap !important; justify-content: center !important; gap: 16px !important; }
          }
        `}</style>
      </div>
    </footer>
  )
}
