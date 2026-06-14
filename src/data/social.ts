import { Github, Mail } from 'lucide-react'
import type { SocialLink } from '@/types'

export const footerSocialLinks: SocialLink[] = [
  { icon: Github, href: 'https://github.com/minhazexo', label: 'GitHub' },
  { icon: Mail, href: 'mailto:contact@mehrabhossain.dev', label: 'Email' },
]

export const contactSocialLinks: SocialLink[] = [
  { icon: Github, href: 'https://github.com/minhazexo', label: 'GitHub', color: '#00E5FF' },
  { icon: Mail, href: 'mailto:contact@mehrabhossain.dev', label: 'Email', color: '#00F593' },
]
