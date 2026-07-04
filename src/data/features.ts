import { Layout, Sparkles, Zap, Shield } from 'lucide-react'
import type { Feature } from '@/types'

export const features: Feature[] = [
  {
    icon: Layout,
    title: 'Clean Architecture',
    description: 'Modular, scalable codebases built with separation of concerns and maintainability as core principles.',
  },
  {
    icon: Sparkles,
    title: 'Modern UI Engineering',
    description: 'Pixel-perfect interfaces with fluid animations, glassmorphism, and thoughtful micro-interactions.',
  },
  {
    icon: Zap,
    title: 'Performance First',
    description: 'Optimized bundles, lazy loading, and 95+ Lighthouse scores out of the box.',
  },
  {
    icon: Shield,
    title: 'Production Ready',
    description: 'Type-safe, tested, and deployed with CI/CD pipelines for reliable shipping.',
  },
]
