# MD Mehrab Hossain Portfolio — Full Codebase Analysis

> **Generated:** May 27, 2026  
> **Project:** `mehrab-portfolio` v1.0.0  
> **Framework:** Next.js 14.2.5 (App Router)  
> **Author:** MD Mehrab Hossain (@minhazexo)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Complete File Tree](#3-complete-file-tree)
4. [Architecture & Structure](#4-architecture--structure)
5. [Component Breakdown](#5-component-breakdown)
6. [Data Layer](#6-data-layer)
7. [Configuration Files](#7-configuration-files)
8. [Styling System](#8-styling-system)
9. [TypeScript Types](#9-typescript-types)
10. [Features & Functionality](#10-features--functionality)
11. [Performance Analysis](#11-performance-analysis)
12. [Findings: What to Remove / Clean Up](#12-findings-what-to-remove--clean-up)
13. [Findings: Unused Dependencies](#13-findings-unused-dependencies)
14. [Findings: Bugs & Issues](#14-findings-bugs--issues)
15. [Findings: Outdated Documentation](#15-findings-outdated-documentation)
16. [Recommendations](#16-recommendations)

---

## 1. Project Overview

A creative, single-page personal portfolio website for **MD Mehrab Hossain**, a Web Developer. The site features a dark cyberpunk/cinematic aesthetic with animated backgrounds, theme switching, particle effects, and a space/cosmos motif.

### Key Highlights
- Fully responsive with mobile-first approach
- 10 color themes (Dark, Light, Pink, Red, Blue, Green, Purple, Orange, Cyan, Rose)
- 9 switchable background effects (Particles, Retro Grid, Aurora, Constellation, Digital Rain, Floating Orbs, Geometric, Wave Flow, None)
- Cinematic loading screen with progress tracking
- Background music player with persistence
- Canvas-based particle system with mouse interaction
- Terminal/space-themed contact form
- PWA support (service worker, manifest)
- Color-blind safe accessibility modes
- Animated scroll progress bar with section navigation

---

## 2. Tech Stack & Dependencies

### Core Runtime
| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 14.2.5 | React framework with App Router |
| `react` | 18.3.1 | UI library |
| `react-dom` | 18.3.1 | React DOM renderer |
| `typescript` | 5.5.4 | Type safety |

### Styling
| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | 3.4.10 | Utility-first CSS |
| `postcss` | 8.4.41 | CSS processor |
| `autoprefixer` | 10.4.20 | Vendor prefixes |
| `clsx` | 2.1.1 | Class name utility |

### Animations & Effects
| Package | Version | Purpose |
|---------|---------|---------|
| `framer-motion` | 11.3.28 | Animation library (heavily used) |
| `gsap` | 3.12.5 | Animation toolkit (**NOT USED**) |
| `lenis` | 1.1.13 | Smooth scrolling (**NOT USED**) |

### UI & Icons
| Package | Version | Purpose |
|---------|---------|---------|
| `lucide-react` | 0.428.0 | Icon library |

### Theming & PWA
| Package | Version | Purpose |
|---------|---------|---------|
| `next-themes` | 0.3.0 | Dark/light mode with theme switching |
| `next-pwa` | 5.6.0 | Progressive Web App support |

### Development
| Package | Version | Purpose |
|---------|---------|---------|
| `eslint` | 8.57.0 | Code linting |
| `eslint-config-next` | 14.2.5 | Next.js ESLint config |
| `playwright` | 1.60.0 | E2E testing (**IN WRONG SECTION**) |
| `@testing-library/react` | 16.3.2 | React testing (**NOT USED**) |
| `@testing-library/jest-dom` | 6.9.1 | DOM matchers (**NOT USED**) |
| `@types/node` | 22.4.1 | Node.js types |
| `@types/react` | 18.3.3 | React types |
| `@types/react-dom` | 18.3.0 | React DOM types |

### Scripts
```json
{
  "dev": "next dev -p 4000",
  "build": "next build",
  "start": "next start -p 4000",
  "lint": "next lint"
}
```
**Note:** No test script exists despite test libraries being installed.

---

## 3. Complete File Tree

```
mehrab-portfolio/
├── .claude/
│   ├── settings.json
│   └── settings.local.json
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── public/                           # Static assets
│   ├── manifest.json                 # PWA manifest
│   ├── robots.txt                    # Search engine rules
│   ├── sitemap.xml                   # SEO sitemap
│   ├── sw.js                         # PWA service worker (generated)
│   └── workbox-4754cb34.js           # Workbox runtime (generated)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts          # Contact form API endpoint
│   │   ├── layout.tsx                # Root layout (providers, SEO, PWA)
│   │   └── page.tsx                  # Main page (loading screen, sections)
│   ├── components/
│   │   ├── effects/                  # Visual effect components
│   │   │   ├── AuroraBorealis.tsx
│   │   │   ├── BackgroundEffectRenderer.tsx  # Dynamic effect loader
│   │   │   ├── BackgroundMusic.tsx
│   │   │   ├── CinematicSection.tsx          # Reusable section wrapper
│   │   │   ├── CinematicText.tsx             # Staggered text reveal
│   │   │   ├── ConstellationMap.tsx          # Canvas star network
│   │   │   ├── DigitalRain.tsx               # Matrix-style rain
│   │   │   ├── FloatingOrbs.tsx
│   │   │   ├── GeometricPattern.tsx
│   │   │   ├── NoiseOverlay.tsx
│   │   │   ├── ParticleBackground.tsx        # Default particle effect
│   │   │   ├── ProjectDetailModal.tsx        # Project detail popup
│   │   │   ├── RetroGrid.tsx                 # Synthwave grid
│   │   │   ├── ScrollProgress.tsx            # Progress bar + nav dots
│   │   │   ├── ThemeTransition.tsx            # Warp effect on theme change
│   │   │   ├── TiltCard.tsx                  # Card entrance animation
│   │   │   └── WaveFlowField.tsx             # Canvas sine waves
│   │   ├── layout/
│   │   │   ├── BackToTop.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── providers/
│   │   │   ├── BackgroundEffectsProvider.tsx  # Context for effects
│   │   │   └── ThemeProvider.tsx              # Wraps next-themes
│   │   ├── sections/
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   └── SkillsSection.tsx
│   │   └── ui/
│   │       ├── BackgroundEffectSwitcher.tsx
│   │       ├── LoadingScreen.tsx
│   │       └── ThemeSwitcher.tsx
│   ├── data/
│   │   ├── about.ts                  # Milestones + skills data
│   │   ├── assets.ts                 # Image & audio paths
│   │   ├── backgrounds.ts            # Background effect definitions
│   │   ├── hero.ts                   # Stats + tagline
│   │   ├── navigation.ts             # Nav links
│   │   ├── projects.ts               # Project portfolio entries
│   │   ├── skills.ts                 # Skill categories + orbit skills
│   │   ├── social.ts                 # Social media links
│   │   └── themes.ts                 # Theme definitions
│   ├── hooks/
│   │   └── useCinematicReveal.ts      # Intersection observer hook
│   ├── lib/
│   │   └── utils.ts                   # cn(), throttle(), localStorage helpers
│   ├── styles/
│   │   └── globals.css                # ~2500 lines of CSS (themes, effects)
│   └── types/
│       └── index.ts                   # TypeScript interfaces
├── improve.txt                        # Improvement notes (TODO list)
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── PROJECT_DOCUMENTATION.md           # Existing (outdated) docs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. Architecture & Structure

### Page Loading Flow

1. User visits → `layout.tsx` renders (providers, ambient effects, scroll progress)
2. `page.tsx` renders → **LoadingScreen** shows with animated spinner
3. Images preload from `data/assets.ts` → progress bar fills
4. Fonts load → minimum 1.5s display time
5. LoadingScreen fades out → main content renders
6. **Navigation**, **BackgroundEffectRenderer**, **HeroSection** render immediately
7. All other sections lazy-load via `React.lazy()` + `Suspense`

### Provider Hierarchy (in layout.tsx)
```
ThemeProvider (next-themes)
  └── BackgroundEffectsProvider
       ├── ThemeTransition (warp effect)
       ├── NoiseOverlay (grain texture)
       ├── SectionProgress (side nav dots)
       └── <main> content
```

### State Management
- **No external state library** — uses React Context + useState/useEffect
- `ThemeProvider` — wraps `next-themes` for 10 theme classes
- `BackgroundEffectsProvider` — Context for primary/secondary background effects with localStorage persistence

### Routing
- Single page app (`/`) with hash-based section navigation (#hero, #about, #projects, #skills, #contact)
- API route at `/api/contact` for form submissions (POST only)

---

## 5. Component Breakdown

### Layout Components

#### Navigation.tsx
- Fixed top nav with glassmorphism on scroll (>100px)
- Smooth-scroll to sections with active state tracking
- Desktop: inline links + ThemeSwitcher + BackgroundEffectSwitcher + GitHub icon
- Mobile: hamburger menu with slide-in panel + Escape key close + focus trap
- Animated underline for active section using Framer Motion `layoutId`

#### Footer.tsx
- Logo + dynamic year copyright
- Social links (GitHub, LinkedIn, Twitter, Email)
- "Built with love" animated heart

#### BackToTop.tsx
- Rocket button appears after 500px scroll
- Spring animation, floating effect

### Section Components

#### HeroSection.tsx
- Parallax-scrolling astronaut background image
- Typing animation for tagline ("I build the future, one pixel at a time.")
- Character-by-character staggered reveal of name (CinematicText)
- Stats display (50+ Projects, 3+ Years Exp., 100% Satisfaction)
- CTA buttons (View Projects, GitHub)
- Rotating gradient rings around profile image
- Floating colored orbs
- Scroll indicator at bottom

#### AboutSection.tsx
- Profile image with glow
- Bio paragraphs wrapped in `<p>` tags
- 9 animated skill bars with energy pulse effect
- Constellation timeline (2021-2024 milestones) on alternating sides
- Scanning reveal animations

#### ProjectsSection.tsx
- Category filter tabs (All, React, Fullstack) with bracket styling
- 8 project cards with image, description, tech tags
- TiltCard entrance animation
- Project detail modal (lazy-loaded) with image, tech stack, and links
- "View More on GitHub" link
- AnimatePresence for filter transitions

#### SkillsSection.tsx
- 3 skill categories (Frontend, Backend, Tools) with icon + color
- Energy cell visualizations (8-segment bar per skill)
- Scanning line reveal on scroll
- Ambient glow backgrounds

#### ContactSection.tsx
- Communication-themed form (COMM_ARRAY, TRANSMISSION, SIGNAL_ACTIVE labels)
- Form fields: name, email, message with signal strength bars
- Client-side validation
- POST to `/api/contact` with rate limiting (5 requests/min/IP)
- Launch confirmation overlay with orbiting rings animation
- Portal-style social links arranged in a circle
- Online/offline status detection

### Effect Components

#### ParticleBackground.tsx (default)
- Canvas-based particles with connection lines
- 12-40 particles depending on screen size
- Colors: cyan, magenta, green
- Particles bounce off boundaries

#### RetroGrid.tsx
- Synthwave-style perspective grid
- Animated with CSS `@keyframes gridMove`
- Horizon glow line with pulse
- Configurable speed, color, grid size

#### AuroraBorealis.tsx
- CSS-based aurora wave animation (3 overlapping layers)
- Configurable speed and intensity
- Uses CSS classes from globals.css

#### ConstellationMap.tsx
- Canvas constellation with 40 stars
- Stars connected by lines within 100px
- Mouse interaction: stars glow + connections highlight within 150px
- Pulsing brightness animation

#### DigitalRain.tsx
- Matrix-style falling katakana + ASCII characters
- Canvas gradient colors
- Configurable speed, density, color

#### FloatingOrbs.tsx
- 5 random-sized floating orbs with CSS animation
- Different colors and durations

#### GeometricPattern.tsx
- CSS geometric honeycomb pattern overlay
- Slow diagonal shift animation

#### WaveFlowField.tsx
- Canvas sine wave visualization
- 2-3 overlapping colored waves
- Configurable speed

#### ProjectDetailModal.tsx
- Portal-based modal rendered to `document.body`
- Full project details with image, tech stack, source/demo links
- Spring animations, backdrop blur

#### ScrollProgress.tsx
- Horizontal gradient scroll progress bar (top of viewport)
- Animated flowing gradient (useAnimationFrame)
- Right-side section navigation dots with IntersectionObserver
- Active section indicator with pulse

#### ThemeTransition.tsx
- Warp-speed flash effect when theme changes
- Radial gradient streaks
- 600ms duration

#### CinematicSection.tsx
- Reusable section wrapper with scroll-reveal animation
- `SectionHeader` sub-component for consistent section titles

#### CinematicText.tsx
- Character-by-character or word-by-word staggered reveal
- `RevealText` — slide-up text reveal with direction support

#### TiltCard.tsx
- Card entrance animation (no tilt effect despite the name)
- Fade in + slide up on scroll

#### BackgroundMusic.tsx
- Audio player with play/pause, volume, mute
- localStorage persistence
- First-visit prompt (Enable / No Thanks)
- Retry on load error
- Guard against rapid clicks

### UI Components

#### LoadingScreen.tsx
- Galaxy spinner with 3 rotating gradient rings
- Orbiting dots
- Real progress tracking: images (0-100%) + fonts loaded + minimum 1.5s display
- Status messages per progress stage
- Animated progress bar

#### ThemeSwitcher.tsx
- Palette button with dropdown
- 10 theme previews with gradient squares
- Color-blind mode selector (5 modes: Default, Deuteranopia, Protanopia, Tritanopia, Achromatopsia)
- localStorage persistence via next-themes
- Click-outside-to-close, Escape key

#### BackgroundEffectSwitcher.tsx
- Sparkles button with dropdown
- Tab system: Primary / Overlay (secondary)
- 9 effects with gradient preview
- localStorage persistence

### Provider Components

#### ThemeProvider.tsx
- Thin wrapper around `next-themes` ThemeProvider
- Passes all 10 theme values

#### BackgroundEffectsProvider.tsx
- React Context for `backgroundEffect`, `secondaryEffect`
- Hydration-safe with mounted check
- localStorage read/write

---

## 6. Data Layer

### Static Data Files (`src/data/`)

| File | Contents |
|------|----------|
| `about.ts` | 4 milestones (2021-2024), 9 skills with percentages |
| `assets.ts` | 13 image paths, 1 audio path |
| `backgrounds.ts` | 9 background effects with name, gradient, icon |
| `hero.ts` | 3 stats, 1 tagline |
| `navigation.ts` | 5 nav links |
| `projects.ts` | 3 categories, 8 projects |
| `skills.ts` | 3 categories, 6 orbit skills, 12 top skills with levels |
| `social.ts` | 4 footer links, 4 contact links |
| `themes.ts` | 10 themes with name, color, gradient |

### Assets Referenced (in `public/`)
| Asset Path | Type |
|------------|------|
| `/hero-astronaut.jpg` | Image |
| `/profile.png` | Image |
| `/about-profile.jpg` | Image |
| `/project-bd-cloths.png` | Image |
| `/project-chatbot.jpg` | Image |
| `/project-blackhole.png` | Image |
| `/project-weather.png` | Image |
| `/project-gbc-physics.png` | Image |
| `/project-chocovers.png` | Image |
| `/project-sciencebee.png` | Image |
| `/project-nityadi-shop.png` | Image |
| `/project-seecto-bangladesh.png` | Image |
| `/background-music.mp3` | Audio |

---

## 7. Configuration Files

### `next.config.mjs`
- PWA enabled via `next-pwa` (disabled in development)
- Image optimization: AVIF/WebP formats, device/image sizes
- Production: console statements removed
- Experimental: scroll restoration enabled

### `tailwind.config.ts`
- Dark mode: class-based
- Custom colors (Cyan, Magenta, Green, Amber, Violet + dark variants)
- Custom fonts (Orbitron, Exo 2, JetBrains Mono)
- 17 custom animations (float, pulse-glow, glitch, typing, etc.)
- Custom shadows (neon, card, bloom)
- Custom easing (cinematic)

### `tsconfig.json`
- Strict mode enabled
- `@/*` path alias for `./src/*`
- Bundler module resolution
- JSX: preserve

---

## 8. Styling System (~2500 lines of CSS)

### Structure in `globals.css`
1. **CSS Variables** — Base dark theme variables
2. **10 Theme Blocks** — Each theme defines ~40 CSS custom properties
3. **Color-blind modes** — 4 accessibility modes (Deuteranopia, Protanopia, Tritanopia, Achromatopsia) with dark + light variants
4. **Base styles** — Body, headings, scrollbar
5. **Cinematic effects** — Ambient lighting, vignette, film grain
6. **Component classes** — Glassmorphism, gradient border, buttons (glow, cinematic, ghost, ripple), cards, skill bars, terminal, navigation, inputs
7. **Animation keyframes** — ~20 custom animations
8. **Accessibility** — Skip-to-content, focus-visible, reduced motion, high contrast, reduced transparency, screen reader, print
9. **Background effects** — Retro grid, Aurora, Floating Orbs, Geometric pattern CSS

### Theme Variables per theme
Each theme defines: `--primary`, `--secondary`, `--accent`, `--tertiary`, `--bg-*` (4 levels), `--text-*` (3 levels), `--glass`, `--shadow-*` (5 types), `--glow-*` (4 positions), `--gradient-primary`, `--gradient-surface`

---

## 9. TypeScript Types (`src/types/index.ts`)

| Interface | Fields |
|-----------|--------|
| `NavLink` | name, href |
| `Project` | id, title, description, image, tech[], category, github, demo |
| `Skill` | name, level |
| `SkillCategory` | name, icon (ComponentType), color, skills[] |
| `OrbitSkill` | name, angle |
| `Milestone` | year, title, description, color |
| `SocialLink` | icon, href, label, color? |
| `Theme` | name, value, color, gradient |
| `Stat` | value, label |
| `LoadingScreenProps` | onComplete, progress, isReady |
| `ThemeProviderProps` | children, attribute?, defaultTheme?, enableSystem? |

---

## 10. Features & Functionality

| Feature | Status | Details |
|---------|--------|---------|
| Loading Screen | ✅ Complete | Galaxy spinner, real progress tracking |
| Theme Switching | ✅ Complete | 10 themes + 5 color-blind modes |
| Background Effects | ✅ Complete | 9 effects, primary + overlay mode |
| Particle Background | ✅ Complete | Canvas particles with connections |
| Parallax Hero | ✅ Complete | Scroll parallax on hero image |
| Typing Animation | ✅ Complete | Tagline typing effect |
| Smooth Scrolling | ✅ Complete | CSS scroll-behavior + JS scrollIntoView |
| Project Filtering | ✅ Complete | 4 category tabs with AnimatePresence |
| Contact Form | ✅ Complete | Client validation + API route + rate limiting |
| Background Music | ✅ Complete | Audio player with localStorage persistence |
| Scroll Progress | ✅ Complete | Top bar + side nav dots |
| PWA Support | ✅ Complete | Service worker + manifest |
| SEO | ✅ Complete | Meta tags, JSON-LD, schema.org, Open Graph |
| Accessibility | ✅ Complete | Skip-to-content, ARIA, focus management, color-blind modes |
| 404 Page | ❌ Missing | No `not-found.tsx` |
| Blog | ❌ Missing | Not implemented |
| Analytics | ❌ Missing | Not implemented |
| Unit Tests | ❌ Missing | Libraries installed but no tests written |

---

## 11. Performance Analysis

### Good Practices
- ✅ Lazy loading of section components via `React.lazy()` + `Suspense`
- ✅ Image preloading during loading screen
- ✅ Dynamic imports for background effects (next/dynamic with ssr: false)
- ✅ Framer Motion `will-change-transform` on animated elements
- ✅ `content-visibility: auto` on section elements
- ✅ Mobile-optimized particle counts and canvas operations
- ✅ Touch-friendly form elements (16px minimum font)
- ✅ Memoized components (Footer, SkillsSection, ProjectsSection)

### Concerns
- ⚠️ **Large CSS file** (~2500 lines) — contributes to initial load
- ⚠️ **No code splitting** for theme CSS — all 10 themes + 4 color-blind modes load on every visit
- ⚠️ **No image optimization** — static images loaded via Image component but unoptimized mode may be set
- ⚠️ **Font loading** — Google Fonts (Orbitron, Exo 2, JetBrains Mono) loaded via @import in CSS
- ⚠️ **Multiple canvas contexts** — each background effect creates its own canvas

---

## 12. Findings: What to Remove / Clean Up

### Dead / Unused Code

| File | Issue |
|------|-------|
| `src/components/sections/AboutSection.tsx` | Imports `CinematicSection` but never uses it (only `SectionHeader` is used) |
| `src/components/sections/ProjectsSection.tsx` | Imports `Sparkles` from lucide-react but never uses it |
| `src/components/sections/SkillsSection.tsx` | `memo` import but `memo` is already used on the component export — the import is redundant |
| `src/components/effects/AuroraBorealis.tsx` | References CSS class `aurora-stars` which does NOT exist in `globals.css` |
| `src/components/effects/TiltCard.tsx` | Named "TiltCard" but implements only a simple entrance animation — no tilt/parallax effect |
| `src/components/effects/CinematicSection.tsx` | `useCinematicReveal` hook is imported but only the ref is used; the returned `controls` and `isInView` are not used directly (overridden by local motion props) |
| `src/hooks/useCinematicReveal.ts` | `hasAnimated` state is tracked but never actually used for logic |
| `src/data/assets.ts` | `projectBlackhole` path is duplicated as `projectPortfolio` value — both point to `/project-blackhole.png`. Also `projectEcommerce` and `projectBdCloths` point to the same file. |
| `improve.txt` | Outdated improvement notes — many items (SEO, API route) are already done |

### Unused Dependencies

| Package | Reason to Remove |
|---------|-----------------|
| `gsap` | Listed in package.json but **not imported anywhere** in the codebase |
| `lenis` | Listed in package.json but **not imported anywhere** |
| `playwright` | In `dependencies` instead of `devDependencies`, and **no test script or usage** |
| `@testing-library/react` | Installed but **no tests exist** |
| `@testing-library/jest-dom` | Installed but **no tests exist** |

### Missing Test Infrastructure
- Test libraries installed but no test files found anywhere
- No test script in `package.json`
- No jest/babel/vitest configuration

### Files That Might Be Removable

| File | Reason |
|------|--------|
| `public/sw.js` | Generated by next-pwa; regenerates on build |
| `public/workbox-4754cb34.js` | Generated by next-pwa; regenerates on build |
| `public/sitemap.xml` | Static file — could be auto-generated from Next.js sitemap |
| `PROJECT_DOCUMENTATION.md` | Outdated — references files that don't exist (CustomCursor, Three.js/fiber/drei) |

---

## 13. Findings: Unused Dependencies

### Safe to Remove (zero imports across codebase)

| Package | Estimated Size | Notes |
|---------|---------------|-------|
| `gsap` | ~150KB minified | Not imported anywhere; all animations use Framer Motion |
| `lenis` | ~15KB minified | Not imported anywhere; scrolling is CSS `scroll-behavior: smooth` |
| `playwright` | ~50MB+ | Should be devDependency, no tests written |
| `@testing-library/react` | ~20KB | No tests written |
| `@testing-library/jest-dom` | ~15KB | No tests written |

### Dependency Audit by File

Searched entire codebase for `import ... from 'gsap'`, `import ... from 'lenis'`, `import ... from 'playwright'` — **zero results**.

---

## 14. Findings: Bugs & Issues

### 🐛 Duplicate Image Paths
In `src/data/assets.ts`:
- `projectEcommerce` and `projectBdCloths` both point to `/project-bd-cloths.png`
- `projectPortfolio` and `projectBlackhole` both point to `/project-blackhole.png`

### 🐛 Missing CSS Class
In `src/components/effects/AuroraBorealis.tsx`:
- Renders `<div className="aurora-stars" />` but `.aurora-stars` is never defined in `globals.css`

### 🐛 Broken Social Links
- LinkedIn and Twitter links in `src/data/social.ts` point to `#` (placeholder)

### 🐛 Misplaced Dependency
- `playwright` is in `dependencies` instead of `devDependencies`

### ⚠️ TiltCard Name Mismatch
- Component is named `TiltCard` but does not implement any tilt/3D rotation effect — it's just a scroll-reveal entrance animation

### ⚠️ useCinematicReveal Hook
- `hasAnimated` state is set but never consumed by any component logic

### ⚠️ No Error Boundaries
- No React error boundaries wrapping sections or effects
- If a background effect canvas crashes, it could take down the whole page

---

## 15. Findings: Outdated Documentation

`PROJECT_DOCUMENTATION.md` is **significantly outdated** — it references:

1. **CustomCursor.tsx** — Does NOT exist in the actual file tree (was removed or never created)
2. **Three.js, @react-three/fiber, @react-three/drei** — NOT in `package.json` or imported anywhere
3. **next.config.mjs** snippet in docs differs from actual file
4. **Missing many files** — AuroraBorealis, BackgroundEffectRenderer, BackgroundMusic, CinematicSection, CinematicText, ConstellationMap, DigitalRain, FloatingOrbs, GeometricPattern, ProjectDetailModal, RetroGrid, ScrollProgress, ThemeTransition, TiltCard, WaveFlowField, BackgroundEffectsProvider, BackgroundEffectSwitcher, navigation.ts, assets.ts, backgrounds.ts

---

## 16. Recommendations

### Short-term (Quick Fixes)
1. **Remove** `gsap`, `lenis` from `package.json` dependencies
2. **Move** `playwright` to `devDependencies`
3. **Remove** unused test libraries or add test configuration + tests
4. **Fix** AuroraBorealis missing `aurora-stars` CSS class
5. **Fix** duplicate image paths in `assets.ts`
6. **Fix** broken LinkedIn/Twitter links
7. **Remove** unused imports in section files (CinematicSection in AboutSection, Sparkles in ProjectsSection)
8. **Rename** `TiltCard` to `RevealCard` or implement actual tilt effect

### Medium-term
1. **Add** `src/app/not-found.tsx` for 404 page
2. **Add** React error boundaries for each section
3. **Integrate** real email service (Resend, SendGrid) in API route
4. **Create** test files for components
5. **Update** `PROJECT_DOCUMENTATION.md` to reflect current codebase
6. **Auto-generate** sitemap.xml via Next.js config

### Long-term
1. **Add** blog section with MDX support
2. **Add** analytics (Vercel Analytics, Plausible)
3. **Implement** CMS integration (Sanity, Contentlayer) for dynamic content
4. **Add** project detail page routes
5. **Consider** CSS-in-JS migration or CSS module splitting for the massive globals.css
6. **Add** image optimization with proper Next.js Image component configuration
7. **Implement** proper unit and integration tests

---

*End of analysis. Generated from full codebase review.*
