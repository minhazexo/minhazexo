# Design System — Portfolio of MD Mehrab Hossain

---

## Design Philosophy

> **"Cinematic cyberpunk meets cosmic minimalism."**

The design blends dark sci-fi aesthetics with accessible, content-first UX. Every visual choice serves the portfolio's narrative: a developer who builds the future, one pixel at a time.

---

## Color System

### Base Palette (Dark Theme)

| Token | CSS Variable | Hex | Usage |
|-------|-------------|-----|-------|
| Void | `--bg-void` | `#000000` | Deepest background layer |
| Primary BG | `--bg-primary` | `#0A0A0F` | Page background |
| Surface | `--bg-secondary` | `#12121A` | Card backgrounds |
| Elevated | `--bg-tertiary` | `#1A1A25` | Hover states, active cards |
| Card | `--bg-card` | `#16161F` | Default card surface |

### Accent System

| Role | Token | Default Dark | Light Mode | Purpose |
|------|-------|-------------|------------|---------|
| Primary | `--primary` | `#00D4FF` (cyan) | `#0077FF` (blue) | CTAs, links, selection, focus |
| Secondary | `--secondary` | `#FF00AA` (magenta) | `#9333EA` (purple) | Contrast accent, decorative |
| Accent | `--accent` | `#00FF88` (green) | `#059669` (emerald) | Success states, secondary badges |
| Tertiary | `--tertiary` | `#8B5CF6` (violet) | `#F59E0B` (amber) | Supporting accent |

### Text Hierarchy

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--text-primary` | `#FFFFFF` | `#1A1A2E` | Headings, body text |
| `--text-secondary` | `#B0B0C0` | `#4A5568` | Subtitles, descriptions |
| `--text-muted` | `#707080` | `#718096` | Metadata, placeholders |

### 10 Theme Variants

Each theme redefines the 4 accent roles + background shades:

- **dark** — Cyan/Magenta/Green (default cyberpunk)
- **light** — Blue/Purple/Emerald (ocean day)
- **pink** — Pink/HotPink/Gold (rose gold)
- **red** — Red/Orange/Amber (ember)
- **blue** — Blue/Cyan/Violet (ocean deep)
- **green** — Emerald/Cyan/Amber (emerald)
- **purple** — Violet/Pink/Cyan (violet nebula)
- **orange** — Orange/Amber/Red (sunset)
- **cyan** — Cyan/Violet/Emerald (electric aqua)
- **rose** — Rose/Pink/Amber (cherry blossom)

All ten usages (text, bg, border, shadow, glow, gradient) auto-adapt through CSS variables.

### Color-Blind Safe Modes

| Mode | Affected | Key Change |
|------|----------|------------|
| Deuteranopia | Red-green | Cyan→Blue, Magenta→Orange |
| Protanopia | Red | Primary→Blue, Secondary→Orange |
| Tritanopia | Blue | Primary→Red, Secondary→Yellow |
| Achromatopsia | All | Full grayscale, all distinctions via brightness |

---

## Typography

| Font | CSS Variable | Weights | Usage |
|------|-------------|---------|-------|
| **Orbitron** | `--font-orbitron` | 400-900 | Headings, hero text, stats, decorative |
| **Exo 2** | `--font-exo-2` | 100-900 | Body text, paragraphs, navigation |
| **JetBrains Mono** | `--font-jetbrains` | 300-700 | Code snippets, skill names, terminal UI, form labels |

### Type Scale

```
h1: 5xl-7xl  font-orbitron font-bold gradient-text
h2: 4xl-5xl  font-orbitron font-bold gradient-text
h3: 2xl-3xl  font-orbitron font-bold
h4: text-lg  font-mono tracking-tight
body: text-base font-exo-2 leading-relaxed
small: text-sm text-gray-400
label: text-xs font-mono tracking-wider uppercase
```

### Special Text Effects

- **`.gradient-text`** — `linear-gradient(135deg, var(--primary), var(--secondary), var(--accent))` with `background-clip: text`
- **`.neon-text`** — Multi-layered `text-shadow` using `var(--primary)`
- **`.glitch-text`** — CSS `::before`/`::after` pseudo-elements with `clip-path` + `text-shadow`
- **`.cinematic-title`** — Hardcoded cyan→magenta→green gradient for hero

---

## Spacing & Layout

- Max content width: `max-w-7xl` (80rem / 1280px)
- Section padding: `py-24` (6rem / 96px)
- Grid gap: `gap-8` to `gap-16`
- Card padding: `p-6` to `p-8`

### Glassmorphism

```css
.glass {
  background: var(--glass);              /* rgba(255,255,255,0.05) */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.glass-strong {
  background: var(--glass-strong);       /* rgba(255,255,255,0.08-0.12) */
  backdrop-filter: blur(20px);
}
```

---

## Shadows & Glows

| Token | Box Shadow |
|-------|-----------|
| `shadow-neon` | `0 0 25px var(--primary), 0 0 50px var(--primary)` |
| `shadow-card` | `0 20px 40px rgba(0,0,0,0.5), 0 0 50px var(--primary)` |
| `shadow-card-hover` | `0 30px 60px rgba(0,0,0,0.6), 0 0 80px var(--primary)` |
| `bloom` | `0 0 10px var(--primary), 0 0 20px var(--primary), 0 0 40px var(--primary)` |

---

## Animation Tokens

### Easing Curves

| Token | Cubic Bezier | Usage |
|-------|-------------|-------|
| `--ease-cinematic` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, reveals |
| `--ease-cinematic-out` | `cubic-bezier(0.2, 0, 0.1, 1)` | Exits |

### Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 0.3s | Hover, tap, simple transitions |
| `--duration-normal` | 0.6s | Card reveals, section entrances |
| `--duration-slow` | 1.2s | Hero section, loading exit |

### Built-in Tailwind Animations

| Animation | Keyframe | Usage |
|-----------|----------|-------|
| `animate-float` | `translateY(0 → -20 → 0)` | Floating elements (6s) |
| `animate-pulse-glow` | `box-shadow` pulse (2s) | CTA buttons |
| `animate-spin-slow` | 360° (20s) | Decorative rings |
| `animate-cinematic-float` | Y+rotation wiggle (6s) | Hero orbs |
| `animate-grain-shift` | Random 1px shifts (0.5s) | Film grain overlay |
| `animate-warp` | Scale+rotate+blur (0.6s) | Theme transition |

---

## Component Patterns

### Section Header (Reusable)
Every section uses `SectionHeader` from `CinematicSection.tsx`:
```tsx
<SectionHeader
  label="// who_i_am"        // Terminal-style label in glass pill
  title="ABOUT ME"           // Gradient text
  subtitle="..."             // Gray description
  isInView={isInView}       // Controls animation
/>
```

### Cinematic Reveal (Two Variants)

1. **`CinematicText`** — Staggered character or word reveal with `rotateX` + `translateY`
2. **`RevealText`** — Slide-up container with `overflow-hidden` parent

### Card Pattern
```
TiltCard (entrance animation)
  └─ .rounded-2xl .border .overflow-hidden
       ├─ Gradient background (135deg, rgba(15,15,35,0.9), rgba(30,10,60,0.4))
       ├─ Animated border glow on hover (inset box-shadow)
       ├─ Category badge (glass pill top-left)
       ├─ Scan line overlay (repeating-linear-gradient, opacity 0.02)
       └─ Content (padding, flex, borders)
```

### Form Field Pattern (ContactSection)
```
CommunicationField
  ├─ TRANSMISSION_XXX label with Radio icon
  ├─ Border container with animated bottom scan line on focus
  ├─ Signal strength bars (right side, animated on focus)
  ├─ Input/textarea with transparent bg, font-mono
  └─ Error state with Zap icon + ERROR: prefix
```

---

## Background Effect System

9 effects, each a React component loaded via `next/dynamic`:

| Effect | File | Type | Interactive |
|--------|------|------|-------------|
| None | — | — | — |
| Retro Grid | `RetroGrid.tsx` | CSS 3D perspective grid | No |
| Aurora | `AuroraBorealis.tsx` | Canvas wave animation | No |
| Constellation | `ConstellationMap.tsx` | Canvas connected dots | Yes (mouse) |
| Digital Rain | `DigitalRain.tsx` | Canvas falling chars | No |
| Floating Orbs | `FloatingOrbs.tsx` | CSS blur + translate | No |
| Geometric | `GeometricPattern.tsx` | Canvas shapes | No |
| Wave Flow | `WaveFlowField.tsx` | Canvas flow field | Yes (mouse) |
| Particles | `ParticleBackground.tsx` | Canvas particle network | Yes (mouse) |

Effects can be layered (primary + overlay/secondary). Preference saved to localStorage.

---

## Responsive Breakpoints

| BP | Tailwind | Notes |
|----|----------|-------|
| Mobile | `default` | Single column, reduced blur, full-width |
| Tablet | `md: (768px)` | 2-column grids, side nav dots visible |
| Desktop | `lg: (1024px)` | Full layout, floating orbs, parallax |
| Wide | `xl: (1280px)` | Max-width constraint |

Mobile-specific optimizations:
- Reduced `backdrop-filter` blur from 10px → 5px
- `font-size: 16px !important` on form elements (prevents iOS zoom)
- Touch targets min 44×44px via `.touch-target-min`

---

## Accessibility-Focused Design Choices

- All decorative elements marked `aria-hidden="true"`
- Focus-visible outlines use `var(--primary)` for theme-adaptive contrast
- Skip-to-content link at top of page
- Reduced motion media query disables all animations
- High contrast mode removes glass/noise/vignette, solidifies text
- Reduced transparency mode disables backdrop-filter
- Screen-reader-only `.sr-only` utility for contextual labels
- Print styles strip all decorative effects

---

## CSS Architecture

The global stylesheet (`globals.css`, ~1800 lines) is organized:

1. **CSS Variables** — Root, theme classes, color-blind overrides
2. **Base** — Reset, html, body, headings
3. **Performance** — `content-visibility`, `contain`, `will-change`
4. **Components** — Glass, cards, buttons, inputs, navigation
5. **Utilities** — Shadows, glow, scan lines, terminal
6. **Accessibility** — Skip link, focus, reduced motion, high contrast, print
7. **Animations** — All custom keyframes with cinematic easing
8. **Responsive** — Touch targets, mobile blur reduction
