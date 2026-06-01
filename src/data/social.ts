import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import type { SocialLink } from '@/types'

export const footerSocialLinks: SocialLink[] = [
  { icon: Github, href: 'https://github.com/minhazexo', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Mail, href: 'mailto:contact@mehrabhossain.dev', label: 'Email' },
]

export const contactSocialLinks: SocialLink[] = [
  { icon: Github, href: 'https://github.com/minhazexo', label: 'GitHub', color: '#00D4FF' },
  { icon: Linkedin, href: '#', label: 'LinkedIn', color: '#00FF88' },
  { icon: Twitter, href: '#', label: 'Twitter', color: '#FF00FF' },
  { icon: Mail, href: 'mailto:contact@mehrabhossain.dev', label: 'Email', color: '#00D4FF' },
]
