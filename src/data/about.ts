import { MapPin, Briefcase, Calendar, Code2 } from 'lucide-react'
import type { AboutInfoItem, StatItem } from '@/types'

export const aboutInfoItems: AboutInfoItem[] = [
  { icon: MapPin, label: 'Location', value: 'Dhaka, Bangladesh' },
  { icon: Briefcase, label: 'Availability', value: 'Available for Freelance' },
  { icon: Calendar, label: 'Experience', value: '3+ Years' },
  { icon: Code2, label: 'Tech Stack', value: 'React, Next.js, Node.js' },
]

export const aboutStats: StatItem[] = [
  { value: '3+', label: 'Years Experience', description: 'Building production web applications' },
  { value: '50+', label: 'Projects Completed', description: 'Across various industries and scales' },
  { value: '15+', label: 'Technologies', description: 'From frontend to backend and cloud' },
  { value: '100%', label: 'Client Satisfaction', description: 'Consistent quality and on-time delivery' },
]
