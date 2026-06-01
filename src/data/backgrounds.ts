export interface BackgroundEffect {
  name: string
  value: string
  description: string
  gradient: string
  icon: string
}

export const backgroundEffects: BackgroundEffect[] = [
  {
    name: 'None',
    value: 'none',
    description: 'Disable background effects for the fastest experience',
    gradient: 'linear-gradient(135deg, #0A0A0A, #12121A)',
    icon: '∅'
  },
  { 
    name: 'Retro Grid', 
    value: 'retrogrid', 
    description: '80s synthwave perspective grid',
    gradient: 'linear-gradient(135deg, #2d1040, #1a0a20)',
    icon: '▦'
  },
  { 
    name: 'Aurora', 
    value: 'aurora', 
    description: 'Northern lights wave animation',
    gradient: 'linear-gradient(135deg, #1a3a2a, #0a1a15)',
    icon: '◐'
  },
  { 
    name: 'Constellation', 
    value: 'constellation', 
    description: 'Interactive star connections',
    gradient: 'linear-gradient(135deg, #2a1a3a, #150a20)',
    icon: '✧'
  },
  { 
    name: 'Digital Rain', 
    value: 'digitalrain', 
    description: 'Matrix-style falling code',
    gradient: 'linear-gradient(135deg, #0a1a0a, #050a05)',
    icon: '⟨⟩'
  },
  { 
    name: 'Floating Orbs', 
    value: 'floatingorbs', 
    description: 'Soft glowing floating bubbles',
    gradient: 'linear-gradient(135deg, #1a2a3a, #0a1520)',
    icon: '●'
  },
  { 
    name: 'Geometric', 
    value: 'geometric', 
    description: 'Animated geometric pattern overlay',
    gradient: 'linear-gradient(135deg, #2a2a3a, #1a1a25)',
    icon: '⬡'
  },
  { 
    name: 'Wave Flow', 
    value: 'waveflow', 
    description: 'Smooth flowing wave patterns',
    gradient: 'linear-gradient(135deg, #1a1a3a, #0a0a20)',
    icon: '〰'
  },
  { 
    name: 'Particles', 
    value: 'particles', 
    description: 'Interactive particle network',
    gradient: 'linear-gradient(135deg, #1a2a2a, #0a1515)',
    icon: '.:'
  },
]