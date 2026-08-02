'use client'

import Image from 'next/image'
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
            <Image
              src="/favicon_io/android-chrome-192x192.png"
              alt="minhazexo logo"
              width={192}
              height={192}
              sizes="28px"
              style={{ height: 28, width: 'auto', display: 'block', borderRadius: 6 }}
            />
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
      </div>
    </footer>
  )
}
