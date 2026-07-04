'use client'

import { ChevronRight } from 'lucide-react'

interface PremiumButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  className?: string
  icon?: React.ReactNode
  arrow?: boolean
  external?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  style?: React.CSSProperties
}

export function PremiumButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  icon,
  arrow = false,
  external = false,
  disabled = false,
  type = 'button',
  style,
}: PremiumButtonProps) {
  const heightMap = { sm: 40, md: 48, lg: 52 }
  const paddingMap = { sm: '12px 20px', md: '14px 24px', lg: '16px 28px' }
  const fontSizeMap = { sm: 13, md: 14, lg: 15 }

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: heightMap[size],
    padding: paddingMap[size],
    borderRadius: '999px',
    fontSize: fontSizeMap[size],
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 300ms ease',
    border: '1px solid var(--border)',
    background: variant === 'primary' ? 'var(--glass-bg)' : 'transparent',
    color: variant === 'primary' ? 'var(--text)' : 'var(--text-secondary)',
    backdropFilter: variant === 'primary' ? 'blur(20px)' : 'none',
    textDecoration: 'none',
    ...style,
  }

  const content = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
      {icon && <span style={{ width: 16, height: 16, display: 'flex' }}>{icon}</span>}
      {children}
      {arrow && <ChevronRight style={{ width: 14, height: 14 }} />}
    </span>
  )

  const handleHoverStart = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    if (disabled) return
    target.style.borderColor = 'var(--border-strong)'
    target.style.transform = 'translateY(-1px)'
    if (variant === 'primary') {
      target.style.boxShadow = '0 0 20px var(--glow-color)'
    } else {
      target.style.color = 'var(--text)'
      target.style.background = 'var(--glass-bg)'
    }
  }

  const handleHoverEnd = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    target.style.borderColor = 'var(--border)'
    target.style.transform = 'translateY(0)'
    target.style.boxShadow = 'none'
    if (variant === 'secondary') {
      target.style.color = 'var(--text-secondary)'
      target.style.background = 'transparent'
    }
  }

  const sharedProps = {
    style: baseStyle,
    onMouseEnter: handleHoverStart,
    onMouseLeave: handleHoverEnd,
    onMouseDown: (e: React.MouseEvent) => { if (!disabled) (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' },
    onMouseUp: (e: React.MouseEvent) => { if (!disabled) (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' },
  }

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...sharedProps}
        className={className}
      >
        {content}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} {...sharedProps} className={className}>
      {content}
    </button>
  )
}
