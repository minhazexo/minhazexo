# MD Mehrab Hossain Portfolio - Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Configuration Files](#configuration-files)
5. [Data Modules](#data-modules)
6. [Components Overview](#components-overview)
7. [Types and Interfaces](#types-and-interfaces)
8. [Styles and Themes](#styles-and-themes)
9. [Features](#features)
10. [Scripts and Commands](#scripts-and-commands)

---

## Project Overview

**Project Name:** Mehrab Portfolio  
**Version:** 1.0.0  
**Description:** A creative, animated personal portfolio website for MD Mehrab Hossain, a Web Developer. Built with Next.js, React, Tailwind CSS, and Framer Motion, featuring 3D effects, particle backgrounds, theme switching, and a cosmic/neon aesthetic.

**Target Users:** Potential clients, employers, and collaborators looking to learn about MD Mehrab Hossain's work and skills.

**Key Highlights:**
- Fully responsive design with mobile-first approach
- 10 different color themes (Dark, Light, Pink, Red, Blue, Green, Purple, Orange, Cyan, Rose)
- Animated loading screen with progress percentage
- Custom cursor implementation
- Background music player with user controls
- Particle background with mouse interaction
- Terminal-style contact form

---

## Tech Stack

### Core Framework
- **Next.js 14.2.5** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.5.4** - Type safety

### Styling
- **Tailwind CSS 3.4.10** - Utility-first CSS framework
- **PostCSS 8.4.41** - CSS processor
- **Autoprefixer 10.4.20** - CSS vendor prefixes

### Animations & Effects
- **Framer Motion 11.3.28** - Animation library
- **GSAP 3.12.5** - Animation toolkit
- **Three.js 0.167.1** - 3D graphics (via @react-three)
- **@react-three/fiber 8.17.5** - Three.js React renderer
- **@react-three/drei 9.109.2** - Three.js helpers
- **Lenis 1.1.13** - Smooth scrolling

### UI Components
- **Lucide React 0.428.0** - Icon library

### Theming
- **next-themes 0.3.0** - Dark/light mode with theme switching

### Utilities
- **clsx 2.1.1** - Class name utility
- **next-pwa 5.6.0** - Progressive Web App support

### Development
- **ESLint 8.57.0** - Code linting
- **next lint** - Next.js ESLint configuration

---

## Project Structure

```
e:\Project\mehrab-portfolio-react\minhazexo\
├── public\                          # Static assets
│   ├── hero-astronaut.jpg           # Hero section background
│   ├── about-profile.jpg           # About section profile image
│   ├── project-ecommerce.jpg       # Project thumbnail
│   ├── project-chatbot.jpg         # Project thumbnail
│   ├── project-portfolio.jpg       # Project thumbnail
│   ├── project-weather.jpg         # Project thumbnail
│   └── manifest.json               # PWA manifest
├── src\
│   ├── app\                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout with metadata
│   │   └── page.tsx                # Main page component
│   ├── components\
│   │   ├── effects\                # Visual effects
│   │   │   ├── BackgroundMusic.tsx
│   │   │   ├── NoiseOverlay.tsx
│   │   │   └── ParticleBackground.tsx
│   │   ├── layout\                # Layout components
│   │   │   ├── BackToTop.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── providers\              # React context providers
│   │   │   └── ThemeProvider.tsx
│   │   ├── sections\               # Page sections
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   └── SkillsSection.tsx
│   │   └── ui\                    # UI components
│   │       ├── CustomCursor.tsx
│   │       ├── LoadingScreen.tsx
│   │       └── ThemeSwitcher.tsx
│   ├── data\                      # Static data modules
│   │   ├── about.ts
│   │   ├── assets.ts
│   │   ├── hero.ts
│   │   ├── navigation.ts
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── social.ts
│   │   └── themes.ts
│   ├── lib\                       # Utility functions
│   │   └── utils.ts
│   ├── styles\                    # Global styles
│   │   └── globals.css
│   └── types\                     # TypeScript definitions
│       └── index.ts
├── next.config.mjs                # Next.js configuration
├── postcss.config.mjs             # PostCSS configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

---

## Configuration Files

### next.config.mjs
```javascript
import nextPWA from 'next-pwa'

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
}

export default withPWA(nextConfig)
```
**Purpose:** Configures Next.js with PWA support and image optimization disabled for static exports.

---

### tailwind.config.ts
The Tailwind configuration defines:
- **Dark mode:** Class-based
- **Custom colors:** Primary (#00D4FF), Secondary (#FF00FF), Accent (#00FF88), dark-bg (#0A0A1A), dark-surface (#12121F)
- **Custom fonts:** Orbitron (headings), Exo 2 (body)
- **Custom animations:** float, pulse-glow, spin-slow, spin-reverse, glitch, typing, blink
- **Custom shadows:** neon, neon-magenta, neon-green

---

### tsconfig.json
Key settings:
- `strict: true` - Strict type checking enabled
- `jsx: preserve` - Preserve JSX for Next.js
- `paths: @/*` - Path alias for src directory
- `moduleResolution: bundler` - Modern module resolution

---

## Data Modules

### src/data/navigation.ts
Navigation links for the site:
```typescript
{ name: 'Home', href: '#hero' }
{ name: 'About', href: '#about' }
{ name: 'Projects', href: '#projects' }
{ name: 'Skills', href: '#skills' }
{ name: 'Contact', href: '#contact' }
```

---

### src/data/hero.ts
Hero section statistics:
- 50+ Projects
- 3+ Years Experience
- 100% Satisfaction

Full tagline text: "I build the future, one pixel at a time."

---

### src/data/about.ts
**Timeline Milestones:**
| Year | Title | Description |
|------|-------|-------------|
| 2021 | Started Journey | Began learning web development with HTML, CSS, and JavaScript |
| 2022 | First Client | Completed first commercial project and entered freelance world |
| 2023 | Full Stack Dev | Mastered React, Next.js, and Node.js ecosystem |
| 2024 | 50+ Projects | Delivered excellence consistently across diverse projects |

**Core Skills with levels:**
- React/Next.js: 95%
- TypeScript: 90%
- UI/UX Design: 90%
- Node.js: 85%
- Laravel: 85%
- MySQL: 85%
- PHP: 80%
- PostgreSQL: 80%
- MongoDB: 75%

---

### src/data/projects.ts
**Project Categories:** All, React, Fullstack

**Projects:**
1. **GeoWeather**
   - Tech: React, API Integration, Chart.js, PWA, Geolocation
   - Category: React
   - Features: Location-based forecasts, interactive maps, severe weather alerts

---

### src/data/skills.ts
**Skill Categories:**
1. **Frontend** (Palette icon, cyan #00D4FF)
   - React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Three.js

2. **Backend** (Server icon, green #00FF88)
   - Node.js, Express, MongoDB, PostgreSQL, GraphQL, REST API

3. **Tools** (Terminal icon, magenta #FF00FF)
   - Git, Docker, AWS, Vercel, Figma, VS Code

**Orbit Skills** (for rotating animation):
React, Node, TypeScript, Next.js, MongoDB, Tailwind

---

### src/data/social.ts
**Footer Social Links:**
- GitHub: https://github.com/minhazexo
- LinkedIn: #
- Twitter: #
- Email: contact@mehrabhossain.dev

**Contact Social Links:** Same as above with specific colors for each platform.

---

### src/data/assets.ts
**Image Assets:**
- hero-astronaut.jpg
- profile.png
- about-profile.jpg
- project-ecommerce.jpg
- project-chatbot.jpg
- project-portfolio.jpg
- project-weather.jpg

**Audio Assets:**
- Background music: /background-music.mp3
- Fallback: https://cdn.pixabay.com/audio/2024/02/22/audio_3c84d8e3b4.mp3

---

### src/data/themes.ts
**10 Available Themes:**
| Name | Value | Color | Gradient |
|------|-------|-------|----------|
| Dark | dark | #0A0A1A | linear-gradient(135deg, #1a1a2e, #16213e) |
| Light | light | #F5F5F5 | linear-gradient(135deg, #f5f5f5, #ffffff) |
| Pink | pink | #FF69B4 | linear-gradient(135deg, #ec4899, #db2777) |
| Red | red | #DC2626 | linear-gradient(135deg, #ef4444, #dc2626) |
| Blue | blue | #3B82F6 | linear-gradient(135deg, #3b82f6, #2563eb) |
| Green | green | #10B981 | linear-gradient(135deg, #10b981, #059669) |
| Purple | purple | #8B5CF6 | linear-gradient(135deg, #8b5cf6, #7c3aed) |
| Orange | orange | #F97316 | linear-gradient(135deg, #f97316, #ea580c) |
| Cyan | cyan | #06B6D4 | linear-gradient(135deg, #06b6d4, #0891b2) |
| Rose | rose | #F43F5E | linear-gradient(135deg, #f43f5e, #e11d48) |

---

## Components Overview

### Sections (src/components/sections/)

#### HeroSection.tsx
**Key Features:**
- Parallax scrolling background with astronaut image
- Typing animation effect for tagline
- Animated "Available for hire" badge with pulsing dot
- Rotating profile image with glowing rings
- Floating orbs animation
- Stats display (Projects, Experience, Satisfaction)
- CTA buttons with hover effects
- Scroll indicator with animation

**Animations:**
- Fade in on load
- Typing effect (50ms interval)
- Rotating gradient rings
- Parallax scroll transformation
- Floating orbs at different radii

---

#### AboutSection.tsx
**Key Features:**
- Profile image with glow effect
- Personal description paragraphs
- Skill progress bars with animation
- Timeline with alternating layout (desktop)
- Milestone cards with hover effects
- Animated on scroll into view

**Timeline:**
- 4 milestones displayed on alternating sides
- Center line with gradient
- Colored dots matching milestone color
- Animated entrance with staggered delay

---

#### ProjectsSection.tsx
**Key Features:**
- Category filter tabs (All, React, Node.js, Fullstack)
- Project cards with image, description, tech stack
- Hover effects with scale and glow
- AnimatePresence for filter transitions
- Links to GitHub and Live Demo
- "View More on GitHub" button

**Filtering:**
- Client-side filtering
- AnimatePresence with popLayout mode
- Smooth transitions between states

---

#### SkillsSection.tsx
**Key Features:**
- 3 skill category cards (Frontend, Backend, Tools)
- Icon with colored background and glow
- Skill list with animated entrance
- Orbiting skills visualization
- Center icon with pulsing animation
- Rotating orbit rings at different speeds

**Orbit Animation:**
- 3 concentric rotating rings
- 6 skills orbiting at different angles
- 20-second rotation cycle
- Center icon: Code2

---

#### ContactSection.tsx
**Key Features:**
- Terminal-style form with header (red/yellow/green dots)
- Name, email, message fields
- Focus glow effects
- Submit button with loading/success states
- Social links in circular orbit layout
- Direct email link

**Form Handling:**
- Simulated submission (1.5s delay)
- Success state with checkmark
- Auto-reset after 3 seconds

---

### Layout Components (src/components/layout/)

#### Navigation.tsx
**Features:**
- Fixed position with glassmorphism on scroll
- Logo: `<MH/>` with gradient text
- Active section highlighting with animated underline
- Smooth scroll to sections
- Theme switcher integration
- GitHub link button
- Mobile hamburger menu with slide-in panel
- Responsive design (hidden on mobile, shown in menu)

**Scroll Behavior:**
- Activates glass effect after 100px scroll
- Tracks active section based on scroll position
- Closes mobile menu on section click

---

#### Footer.tsx
**Features:**
- Logo with gradient text
- Copyright notice with dynamic year
- "Built with love" message with heart animation
- Social links with hover effects
- Responsive layout (center on mobile, spread on desktop)

---

#### BackToTop.tsx
**Features:**
- Appears after 500px scroll
- Rocket icon with floating animation
- Smooth scroll to top on click
- Spring animation on hover
- Hidden on mobile by default

---

### UI Components (src/components/ui/)

#### LoadingScreen.tsx
**Features:**
- Full-screen overlay with dark background
- Galaxy spinner with 3 rotating gradient rings
- Center progress percentage display
- Animated loading text with bouncing dots
- Status messages based on progress
- Auto-completes at 100% or after 3s fallback
- Exit animation with fade out

**Progress Stages:**
- 0-30%: "Loading core modules..."
- 30-60%: "Initializing 3D engine..."
- 60-90%: "Compiling shaders..."
- 90-100%: "Ready for launch..."

---

#### CustomCursor.tsx
**Features:**
- Only shows on pointer devices (not touch)
- Follows mouse with spring physics
- Expands and changes color on hoverable elements
- Mix-blend-difference for visibility
- MutationObserver for dynamic elements
- Two-circle design (border + filled)

**States:**
- Default: 20px cyan border
- Hovering: 50px magenta border with 30% opacity fill

---

#### ThemeSwitcher.tsx
**Features:**
- Palette icon button with theme color
- Dropdown menu with all 10 themes
- Theme preview gradient squares
- Active theme checkmark
- Animated open/close
- Click outside to close
- Persists via next-themes

---

### Effects Components (src/components/effects/)

#### ParticleBackground.tsx
**Features:**
- Canvas-based particle system
- 80 particles (responsive based on screen size)
- Colors: cyan (#00D4FF), magenta (#FF00FF), green (#00FF88)
- Mouse interaction (particles repel within 150px)
- Connection lines between nearby particles
- Smooth animation loop

**Particle Properties:**
- Random position, velocity, size (1-3px)
- Velocity: -0.5 to 0.5 on x/y axes
- Boundary bounce

---

#### BackgroundMusic.tsx
**Features:**
- Audio player with play/pause controls
- Volume slider
- Mute toggle
- LocalStorage preference persistence
- Fallback URL support
- Initial prompt for first-time users
- Expanded controls panel
- Animated button with pulsing ring when playing

**User Flow:**
1. First visit: Shows enable/disable prompt
2. After choice: Shows music button
3. Click button: Shows full controls
4. Preference saved in localStorage

---

#### NoiseOverlay.tsx
**Features:**
- SVG-based fractal noise pattern
- 3% opacity overlay
- Fixed position over entire viewport
- Pointer-events-none (non-interactive)
- Adds texture to the design

---

### Providers (src/components/providers/)

#### ThemeProvider.tsx
**Purpose:** Wraps the application with next-themes provider, enabling theme switching across the entire site.

**Configuration:**
- attribute: 'class'
- defaultTheme: 'dark'
- enableSystem: false
- themes: All 10 custom themes

---

## Types and Interfaces (src/types/index.ts)

### NavLink
```typescript
interface NavLink {
  name: string
  href: string
}
```

### Project
```typescript
interface Project {
  id: number
  title: string
  description: string
  image: string
  tech: string[]
  category: string
  github: string
  demo: string
}
```

### Skill
```typescript
interface Skill {
  name: string
  level: number
}
```

### SkillCategory
```typescript
interface SkillCategory {
  name: string
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  skills: string[]
}
```

### OrbitSkill
```typescript
interface OrbitSkill {
  name: string
  angle: number
}
```

### Milestone
```typescript
interface Milestone {
  year: string
  title: string
  description: string
  color: string
}
```

### SocialLink
```typescript
interface SocialLink {
  icon: ComponentType<{ className?: string }>
  href: string
  label: string
  color?: string
}
```

### Theme
```typescript
interface Theme {
  name: string
  value: string
  color: string
  gradient: string
}
```

### Stat
```typescript
interface Stat {
  value: string
  label: string
}
```

### LoadingScreenProps
```typescript
interface LoadingScreenProps {
  onComplete: () => void
  isReady: boolean
}
```

### ThemeProviderProps
```typescript
interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
}
```

---

## Styles and Themes (src/styles/globals.css)

### CSS Variables
The global styles define CSS variables for:
- Primary colors (cyan, magenta, green)
- Background colors (dark-bg, dark-surface, dark-tertiary)
- Text colors (primary, secondary)
- Glass effect variables
- Glow effects (neon, magenta, green)
- Font families (Orbitron, Exo 2)

### Theme Variables
Each theme (dark, light, pink, red, blue, green, purple, orange, cyan, rose) has:
- --primary
- --secondary
- --accent
- --bg-primary
- --bg-secondary
- --bg-tertiary
- --text-primary
- --text-secondary
- --glass
- --glass-strong
- --border-color
- --neon-glow
- --magenta-glow
- --green-glow

### Custom Classes
- `.glass` - Glassmorphism effect
- `.glass-strong` - Stronger glassmorphism
- `.gradient-border` - Animated gradient border
- `.glow-btn` - Glowing button effect
- `.card-hover` - Card hover animation
- `.skill-bar` / `.skill-fill` - Progress bar styling
- `.terminal` - Terminal window styling
- `.nav-glass` - Navigation glass effect
- `.noise-overlay` - Noise texture overlay
- `.custom-cursor` - Custom cursor styling
- `.neon-text` / `.gradient-text` - Text effects

### Animations
- `float` - Up/down floating movement
- `pulse-glow` - Pulsing glow effect
- `spin-slow` / `spin-reverse` - Various spin speeds
- `glitch` - Glitch effect
- `typing` / `blink` - Text animations

---

## Features

### Visual Effects
1. **Particle Background** - Interactive particles that react to mouse movement and connect nearby particles
2. **Loading Screen** - Animated galaxy spinner with progress tracking
3. **Custom Cursor** - Spring-animated cursor that expands on interactive elements
4. **Noise Overlay** - Subtle texture overlay for depth
5. **Parallax Scrolling** - Hero section moves at different rate on scroll

### Theme System
1. **10 Color Themes** - Dark, Light, Pink, Red, Blue, Green, Purple, Orange, Cyan, Rose
2. **Persistent Selection** - Theme choice saved in localStorage via next-themes
3. **Smooth Transitions** - CSS transitions between theme changes
4. **Animated Theme Switcher** - Dropdown with preview gradients

### Animations
1. **Framer Motion** - Used throughout for:
   - Scroll-triggered animations (useInView)
   - Staggered entrance animations
   - Hover/tap interactions
   - Layout transitions (AnimatePresence)
   - Spring physics

2. **GSAP** - Available but not actively used in current components

3. **Three.js** - Available via @react-three/fiber and @react-three/drei for potential 3D enhancements

### Interactivity
1. **Navigation** - Smooth scroll to sections, active state tracking, mobile menu
2. **Project Filtering** - Category-based project filtering with animations
3. **Contact Form** - Working form with validation and feedback
4. **Background Music** - Audio player with controls and persistence

### Responsive Design
1. **Mobile-First** - Tailwind responsive classes throughout
2. **Mobile Navigation** - Hamburger menu with slide-in panel
3. **Adapted Layouts** - Grid changes from single to multi-column
4. **Touch Optimized** - Custom cursor hidden on touch devices

---

## Scripts and Commands

### Package.json Scripts
```json
{
  "dev": "next dev -p 4000",      // Start development server on port 4000
  "build": "next build",          // Build for production
  "start": "next start -p 4000",  // Start production server on port 4000
  "lint": "next lint"             // Run ESLint
}
```

### Running the Project
```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint
```

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Touch devices (cursor disabled automatically)
- Reduced motion preference respected

---

## SEO & Accessibility

- Semantic HTML structure
- Meta tags for Open Graph and Twitter Cards
- JSON-LD structured data (Person schema)
- ARIA labels on interactive elements
- Focus visible styles
- Reduced motion media query support
- Color contrast compliance

---

## Performance Optimizations

- Image preloading on initial load
- Lazy loading for below-fold content
- Optimized animations (transform, opacity only)
- PWA support for offline capability
- Optimized images setting in Next.js config

---

## Potential Improvements

1. **CMS Integration** - Connect to headless CMS for dynamic content
2. **Blog Section** - Add markdown-based blog
3. **Project Detail Pages** - Individual pages for each project
4. **Contact Backend** - Connect to email service (Formspree, SendGrid)
5. **Analytics** - Add tracking (Google Analytics, Plausible)
6. **Performance** - Further optimize images, add caching

---

## Credits

- **Developer:** MD Mehrab Hossain
- **GitHub:** @minhazexo
- **Email:** mehrabhossain7102@gmail.com

---

*Last Updated: May 2026*