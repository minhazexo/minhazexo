import { Github, Mail, Linkedin, Twitter } from 'lucide-react'
import type { SocialLink } from '@/types'

export const footerSocialLinks: SocialLink[] = [
  { icon: Github, href: 'https://github.com/minhazexo', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/mehrab-hossain-2b8202246/', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://x.com/minhazexo', label: 'Twitter' },
  { icon: Mail, href: 'mailto:contact@mehrabhossain.dev', label: 'Email' },
]

export const contactSocialLinks: SocialLink[] = [
  { icon: Github, href: 'https://github.com/minhazexo', label: 'GitHub', color: '#00E5FF' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/mehrab-hossain-2b8202246/', label: 'LinkedIn', color: '#0A66C2' },
  { icon: Twitter, href: 'https://x.com/minhazexo', label: 'Twitter', color: '#1DA1F2' },
  { icon: Mail, href: 'mailto:contact@mehrabhossain.dev', label: 'Email', color: '#00F593' },
]
