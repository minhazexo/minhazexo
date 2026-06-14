# Theme & Color System — Complete Reference

> **Portfolio of MD Mehrab Hossain** | Next.js 14 + Tailwind CSS + CSS Custom Properties

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [The 10 Themes](#2-the-10-themes)
3. [CSS Variable System](#3-css-variable-system)
4. [Tailwind Configuration](#4-tailwind-configuration)
5. [Color Blind Safe Modes](#5-color-blind-safe-modes)
6. [Text Effects & Gradients](#6-text-effects--gradients)
7. [Shadow & Glow System](#7-shadow--glow-system)
8. [Component Color Usage Map](#8-component-color-usage-map)
9. [Data Layer Colors](#9-data-layer-colors)
10. [Theme Transition](#10-theme-transition)

---

## 1. Architecture Overview

### How It Works

```
User clicks theme → next-themes (useTheme) → <html class="pink">
    ↓
globals.css activates `.pink` block
    ↓
~31 CSS custom properties are redefined
    ↓
All components consume via var(--primary), var(--bg-secondary), etc.
    ↓
Color-blind data-attribute layers on top (orthogonal)
```

### Key Files

| File | Purpose |
|------|---------|
| `src/styles/globals.css` | All CSS variables, theme blocks, effects, utilities (~2168 lines) |
| `tailwind.config.ts` | Tailwind theme extension with hardcoded color values |
| `src/data/themes.ts` | 10 theme definitions (name, value, color, gradient) consumed by UI |
| `src/types/index.ts` | `Theme` interface |
| `src/components/providers/ThemeProvider.tsx` | Wraps `next-themes` with all 10 theme values |
| `src/components/ui/ThemeSwitcher.tsx` | Theme picker dropdown + color-blind mode selector |
| `src/components/effects/ThemeTransition.tsx` | Warp-speed animation on theme change |

### Data Flow

```
themes.ts → ThemeProvider (next-themes) → <html class="...">
                                              ↓
                              globals.css theme block
                           (`.dark`, `.light`, `.pink`, etc.)
                                              ↓
                     CSS custom properties → consumed everywhere
                                              ↓
                     ThemeSwitcher.tsx reads current theme via useTheme()
```

---

## 2. The 10 Themes

### 2.1 Dark — "Cyberpunk" (Default)

True black background with pure white text. Vibrant cyan primary, hot pink secondary, and mint green accent pop against the void. The anchor theme.

```css
--primary: #00E5FF        /* Vivid cyan    — CTAs, links, focus */
--secondary: #FF2D95      /* Hot pink      — decorative, contrast */
--accent: #00F593         /* Mint green    — success, badges */
--tertiary: #7C5CFC       /* Deep violet   — supporting accent */
--bg-void: #000000        /* True black    — deepest layer */
--bg-primary: #050508     /* Near black    — page background */
--bg-secondary: #0A0A12   /* Very dark     — card surfaces */
--bg-tertiary: #12121E    /* Dark          — hover states */
--text-primary: #FFFFFF   /* Pure white */
--text-secondary: #A0A0B8
--text-muted: #606078
--gradient-primary: linear-gradient(135deg, #00E5FF, #7C5CFC, #FF2D95)
```

### 2.2 Light — "Pure Light"

Pure white background with pure black text. Clean, minimal, and highly readable with vibrant blue/purple/emerald accents.

```css
--primary: #2563EB        /* Royal blue */
--secondary: #7C3AED      /* Deep purple */
--accent: #059669         /* Emerald */
--tertiary: #D97706       /* Amber */
--bg-void: #FFFFFF        /* Pure white */
--bg-primary: #FFFFFF     /* Pure white */
--bg-secondary: #F5F7FA   /* Light gray */
--bg-tertiary: #EEF0F4    /* Slightly darker */
--text-primary: #000000   /* Pure black */
--text-secondary: #333344
--text-muted: #666680
--gradient-primary: linear-gradient(135deg, #2563EB, #7C3AED, #059669)
```

### 2.3 Pink — "Rose Gold"

Sophisticated warm palette on unified dark canvas. Soft pink primary, deep rose secondary, champagne gold accent.

| Token | Value |
|-------|-------|
| `--primary` | `#FF6B9D` |
| `--secondary` | `#E9407A` |
| `--accent` | `#FFD4A8` |
| `--tertiary` | `#C084FC` |
| `--bg-void` | `#000000` |
| `--bg-primary` | `#050508` |
| `--bg-secondary` | `#0A0A12` |
| `--text-primary` | `#FFFFFF` |
| `--text-secondary` | `#A0A0B8` |
| `--gradient-primary` | `linear-gradient(135deg, #FF6B9D, #E9407A, #FFD4A8)` |

### 2.4 Red — "Ember"

Fiery palette on unified dark canvas. Vivid red primary, burnt orange secondary, golden amber accent.

| Token | Value |
|-------|-------|
| `--primary` | `#FF4B4B` |
| `--secondary` | `#FF7849` |
| `--accent` | `#FFD93D` |
| `--tertiary` | `#FF8A65` |
| `--bg-void` | `#000000` |
| `--bg-primary` | `#050508` |
| `--bg-secondary` | `#0A0A12` |
| `--text-primary` | `#FFFFFF` |
| `--text-secondary` | `#A0A0B8` |
| `--gradient-primary` | `linear-gradient(135deg, #FF4B4B, #FF7849, #FFD93D)` |

### 2.5 Blue — "Ocean Deep"

Deep aquatic palette on unified dark canvas. Rich blue primary, teal secondary, soft violet accent.

| Token | Value |
|-------|-------|
| `--primary` | `#3B82F6` |
| `--secondary` | `#06B6D4` |
| `--accent` | `#A78BFA` |
| `--tertiary` | `#34D399` |
| `--bg-void` | `#000000` |
| `--bg-primary` | `#050508` |
| `--bg-secondary` | `#0A0A12` |
| `--text-primary` | `#FFFFFF` |
| `--text-secondary` | `#A0A0B8` |
| `--gradient-primary` | `linear-gradient(135deg, #3B82F6, #06B6D4, #A78BFA)` |

### 2.6 Green — "Emerald"

Lush green palette on unified dark canvas. Emerald primary, cyan secondary, golden amber accent.

| Token | Value |
|-------|-------|
| `--primary` | `#10B981` |
| `--secondary` | `#22D3EE` |
| `--accent` | `#FBBF24` |
| `--tertiary` | `#A78BFA` |
| `--bg-void` | `#000000` |
| `--bg-primary` | `#050508` |
| `--bg-secondary` | `#0A0A12` |
| `--text-primary` | `#FFFFFF` |
| `--text-secondary` | `#A0A0B8` |
| `--gradient-primary` | `linear-gradient(135deg, #10B981, #22D3EE, #FBBF24)` |

### 2.7 Purple — "Violet Nebula"

Cosmic palette on unified dark canvas. Deep violet primary, pink secondary, cyan accent.

| Token | Value |
|-------|-------|
| `--primary` | `#8B5CF6` |
| `--secondary` | `#EC4899` |
| `--accent` | `#22D3EE` |
| `--tertiary` | `#FBBF24` |
| `--bg-void` | `#000000` |
| `--bg-primary` | `#050508` |
| `--bg-secondary` | `#0A0A12` |
| `--text-primary` | `#FFFFFF` |
| `--text-secondary` | `#A0A0B8` |
| `--gradient-primary` | `linear-gradient(135deg, #8B5CF6, #EC4899, #22D3EE)` |

### 2.8 Orange — "Sunset"

Warm radiant palette on unified dark canvas. Vibrant orange primary, golden secondary, coral accent.

| Token | Value |
|-------|-------|
| `--primary` | `#F97316` |
| `--secondary` | `#FBBF24` |
| `--accent` | `#FB7185` |
| `--tertiary` | `#A78BFA` |
| `--bg-void` | `#000000` |
| `--bg-primary` | `#050508` |
| `--bg-secondary` | `#0A0A12` |
| `--text-primary` | `#FFFFFF` |
| `--text-secondary` | `#A0A0B8` |
| `--gradient-primary` | `linear-gradient(135deg, #F97316, #FBBF24, #FB7185)` |

### 2.9 Cyan — "Electric Aqua"

Bright energetic palette on unified dark canvas. Cyan primary, violet secondary, emerald accent.

| Token | Value |
|-------|-------|
| `--primary` | `#06B6D4` |
| `--secondary` | `#8B5CF6` |
| `--accent` | `#34D399` |
| `--tertiary` | `#FBBF24` |
| `--bg-void` | `#000000` |
| `--bg-primary` | `#050508` |
| `--bg-secondary` | `#0A0A12` |
| `--text-primary` | `#FFFFFF` |
| `--text-secondary` | `#A0A0B8` |
| `--gradient-primary` | `linear-gradient(135deg, #06B6D4, #8B5CF6, #34D399)` |

### 2.10 Rose — "Cherry Blossom"

Delicate romantic palette on unified dark canvas. Rose-red primary, soft pink secondary, warm gold accent.

| Token | Value |
|-------|-------|
| `--primary` | `#F43F5E` |
| `--secondary` | `#FB7185` |
| `--accent` | `#FDE68A` |
| `--tertiary` | `#A78BFA` |
| `--bg-void` | `#000000` |
| `--bg-primary` | `#050508` |
| `--bg-secondary` | `#0A0A12` |
| `--text-primary` | `#FFFFFF` |
| `--text-secondary` | `#A0A0B8` |
| `--gradient-primary` | `linear-gradient(135deg, #F43F5E, #FB7185, #FDE68A)` |

---

### All Themes — Primary Color Comparison

| Theme | `--primary` | `--secondary` | `--accent` | `--tertiary` | Palette Feel |
|-------|-----------|--------------|-----------|-------------|--------------|
| Dark | `#00E5FF` | `#FF2D95` | `#00F593` | `#7C5CFC` | Cyberpunk |
| Light | `#2563EB` | `#7C3AED` | `#059669` | `#D97706` | Pure Light |
| Pink | `#FF6B9D` | `#E9407A` | `#FFD4A8` | `#C084FC` | Rose Gold Luxe |
| Red | `#FF4B4B` | `#FF7849` | `#FFD93D` | `#FF8A65` | Ember Blaze |
| Blue | `#3B82F6` | `#06B6D4` | `#A78BFA` | `#34D399` | Ocean Deep |
| Green | `#10B981` | `#22D3EE` | `#FBBF24` | `#A78BFA` | Emerald Forest |
| Purple | `#8B5CF6` | `#EC4899` | `#22D3EE` | `#FBBF24` | Violet Nebula |
| Orange | `#F97316` | `#FBBF24` | `#FB7185` | `#A78BFA` | Sunset Glow |
| Cyan | `#06B6D4` | `#8B5CF6` | `#34D399` | `#FBBF24` | Electric Aqua |
| Rose | `#F43F5E` | `#FB7185` | `#FDE68A` | `#A78BFA` | Cherry Blossom |

---

## 3. CSS Variable System

Every theme block defines these 31 variables:

### Color Roles (4)

| Variable | Purpose |
|----------|---------|
| `--primary` | CTAs, links, selection, focus outlines, active states |
| `--secondary` | Contrast accent, decorative elements, secondary buttons |
| `--accent` | Success states, skill bars, badges, secondary badges |
| `--tertiary` | Supporting accent, tertiary elements |

### Color Variants (8)

| Variable | Purpose |
|----------|---------|
| `--primary-dark` | Darker shade for hover/active states |
| `--primary-light` | Lighter shade for backgrounds, badges |
| `--secondary-dark` | Darker shade of secondary |
| `--secondary-light` | Lighter shade of secondary |
| `--accent-dark` | Darker shade of accent |
| `--accent-light` | Lighter shade of accent |
| `--tertiary-dark` | Darker shade of tertiary |
| `--tertiary-light` | Lighter shade of tertiary |

### Background Layers (5)

| Variable | Dark Value | Light Value | Usage |
|----------|-----------|------------|-------|
| `--bg-void` | `#000000` | `#FFFFFF` | Deepest background layer |
| `--bg-primary` | `#050508` | `#FFFFFF` | Main page background |
| `--bg-secondary` | `#0A0A12` | `#F5F7FA` | Card/section backgrounds |
| `--bg-tertiary` | `#12121E` | `#EEF0F4` | Hover states, active cards |
| `--bg-elevated` | `#1A1A28` | `#FFFFFF` | Elevated surfaces, modals |

### Text Hierarchy (3)

| Variable | Dark Value | Light Value | Usage |
|----------|-----------|------------|-------|
| `--text-primary` | `#FFFFFF` | `#000000` | Headings, body text |
| `--text-secondary` | `#A0A0B8` | `#333344` | Subtitles, descriptions |
| `--text-muted` | `#606078` | `#666680` | Metadata, placeholders |

### Glass & Borders (4)

| Variable | Purpose |
|----------|---------|
| `--glass` | Glassmorphism backgrounds |
| `--glass-strong` | Stronger glass (dropdowns, modals) |
| `--border-color` | Themed borders with primary color |
| `--border-light` | Subtle borders |

### Shadows (4)

| Variable | Purpose |
|----------|---------|
| `--shadow-card` | Default card shadow |
| `--shadow-card-hover` | Hover card shadow |
| `--shadow-neon` | Primary glow (primary color) |
| `--shadow-magenta` | Secondary glow (secondary color) |

Some themes also define `--shadow-green` and `--shadow-purple` for accent/tertiary glows.

### Glow Gradients (4)

| Variable | Position | Color |
|----------|----------|-------|
| `--glow-cyan` | Top center | Primary color radial glow |
| `--glow-magenta` | Bottom center | Secondary color radial glow |
| `--glow-purple` | Top right | Tertiary or accent color glow |
| `--glow-green` | Bottom left | Accent color radial glow |

### Gradients (2)

| Variable | Purpose |
|----------|---------|
| `--gradient-primary` | Primary → Tertiary → Secondary (135deg) |
| `--gradient-surface` | Subtle white overlay gradient |

### Root-Only Variables (not overridden by themes)

| Variable | Value | Purpose |
|----------|-------|---------|
| `--accent-cyan` | `#00D4FF` | Static cyan (used in glitch, canvas effects) |
| `--accent-magenta` | `#FF00AA` | Static magenta |
| `--accent-green` | `#00FF88` | Static green |
| `--accent-amber` | `#FFB800` | Static amber |
| `--accent-violet` | `#8B5CF6` | Static violet |
| `--ease-cinematic` | `cubic-bezier(0.16, 1, 0.3, 1)` | Animation easing |
| `--ease-cinematic-out` | `cubic-bezier(0.2, 0, 0.1, 1)` | Exit animation easing |
| `--duration-slow` | `1.2s` | Slow transitions |
| `--duration-normal` | `0.6s` | Standard transitions |
| `--duration-fast` | `0.3s` | Hover/tap transitions |

---

## 4. Tailwind Configuration

### Named Colors (match new Dark theme default)

```js
primary: '#00E5FF',
secondary: '#FF2D95',
accent: '#00F593',
'dark-bg': '#050508',
'dark-surface': '#0A0A12',
'dark-elevated': '#12121E',
'dark-card': '#0E0E18',
'void-black': '#000000',
```

### Color Scales

```js
cyan:    { 300: '#4DF0FF', 400: '#00E5FF', 500: '#00B8D4', 600: '#0099C0' },
magenta: { 300: '#FF6BB5', 400: '#FF2D95', 500: '#D4007A', 600: '#B00068' },
green:   { 300: '#4DFFB5', 400: '#00F593', 500: '#00C47A', 600: '#00A068' },
amber:   { 400: '#FFD93D', 500: '#F5C518' },
violet:  { 400: '#A088FF', 500: '#7C5CFC' },
```

### Font Families

```js
orbitron: ['var(--font-orbitron)', 'sans-serif'],    // Headings, hero
exo: ['var(--font-exo-2)', 'sans-serif'],             // Body text
jetbrains: ['var(--font-jetbrains)', 'monospace'],     // Code, terminal
```

### Custom Shadows (hardcoded for Tailwind classes)

```js
neon:           '0 0 20px rgba(0,229,255,0.5), 0 0 40px rgba(0,229,255,0.3)'
neon-magenta:   '0 0 20px rgba(255,45,149,0.5), 0 0 40px rgba(255,45,149,0.3)'
neon-green:     '0 0 20px rgba(0,245,147,0.5), 0 0 40px rgba(0,245,147,0.3)'
card:           '0 20px 40px rgba(0,0,0,0.4), 0 0 40px rgba(0,229,255,0.1)'
card-hover:     '0 30px 60px rgba(0,0,0,0.5), 0 0 60px rgba(0,229,255,0.2)'
bloom:          '0 0 10px rgba(0,229,255,0.5), 0 0 20px rgba(0,229,255,0.3), 0 0 40px rgba(0,229,255,0.1)'
```

### Custom Animations

| Class | Keyframes | Duration | Usage |
|-------|-----------|----------|-------|
| `animate-float` | translateY(0→-20→0) | 4s ease-in-out infinite | Floating elements |
| `animate-float-slow` | translateY(0→-20→0) | 6s ease-in-out infinite | Slower float |
| `animate-pulse-glow` | box-shadow pulse | 2s ease-in-out infinite | CTA buttons |
| `animate-spin-slow` | 360° rotation | 20s linear infinite | Decorative rings |
| `animate-spin-reverse` | -360° rotation | 15s linear infinite | Counter-rotating rings |
| `animate-glitch` | translate jitter | 0.3s ease infinite | Glitch text on hover |
| `animate-typing` | width 0→100% | 3.5s steps(40, end) | Terminal typing |
| `animate-blink` | border-color transparent | 1s step-end infinite | Cursor blink |
| `animate-cinematic-float` | Y+rotate wiggle | 6s cubic-bezier infinite | Hero orbs |
| `animate-grain-shift` | random 1px shifts | 0.5s steps(10) infinite | Film grain |
| `animate-warp` | scale+rotate+blur | 0.6s cubic-bezier | Theme transition |
| `animate-skill-shine` | translateX(-100%→100%) | 2s ease-in-out infinite | Skill bar shimmer |

### Easing & Duration

```js
easing: {
  'cinematic':      'cubic-bezier(0.16, 1, 0.3, 1)',
  'cinematic-out':  'cubic-bezier(0.2, 0, 0.1, 1)',
}
duration: {
  'slow':   '1.2s',
  'normal': '0.6s',
  'fast':   '0.3s',
}
```

---

## 5. Color Blind Safe Modes

Applied via `data-colorblind` attribute on `<html>` element. These override specific CSS variables, stacking on top of any theme.

### Modes

| Mode | Attribute Value | Affected | Key Changes |
|------|----------------|----------|-------------|
| Default | `none` | — | No overrides |
| Deuteranopia | `data-colorblind="deuteranopia"` | Red-green | Cyan→Blue `#0077FF`, Magenta→Orange `#E67E22` |
| Protanopia | `data-colorblind="protanopia"` | Red | Primary→Blue `#0066CC`, Secondary→Orange `#E67E22` |
| Tritanopia | `data-colorblind="tritanopia"` | Blue | Primary→Red `#E74C3C`, Secondary→Yellow `#F1C40F` |
| Achromatopsia | `data-colorblind="achromatopsia"` | All colors | Full grayscale |

### Color Blind Mode Selector (ThemeSwitcher.tsx:9-15)

```typescript
const colorBlindModes = [
  { value: 'none', label: 'Default' },
  { value: 'deuteranopia', label: 'Deuteranopia' },
  { value: 'protanopia', label: 'Protanopia' },
  { value: 'tritanopia', label: 'Tritanopia' },
  { value: 'achromatopsia', label: 'Achromatopsia' },
]
```

---

## 6. Text Effects & Gradients

### `.gradient-text` — Theme-Adaptive Gradient Text

```css
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

Used for: section headings, hero title, logo.

### `.cinematic-title` — Hardcoded Gradient (NOT theme-aware)

```css
.cinematic-title {
  background: linear-gradient(135deg, #00D4FF 0%, #FF00AA 50%, #00FF88 100%);
}
```

Used in: Hero section heading (static dark theme colors).

### `.neon-text` — Theme-Aware Glow

```css
.neon-text     { text-shadow: 0 0 10px var(--primary), 0 0 20px var(--primary), ... }
.neon-text-magenta { text-shadow: 0 0 10px var(--secondary), ... }
.neon-text-green   { text-shadow: 0 0 10px var(--accent), ... }
```

### `.glitch-text` — Hover-Activated Glitch

CSS pseudo-elements with `clip-path` + shifted text shadows using `--accent-cyan`/`--accent-magenta`.

---

## 7. Shadow & Glow System

### Tailwind Shadow Classes (hardcoded to dark theme base colors)

| Class | Use Case |
|-------|----------|
| `shadow-neon` | Primary glow buttons, BackToTop |
| `shadow-neon-magenta` | Secondary glow elements |
| `shadow-neon-green` | Accent glow elements |
| `shadow-card` | Default card state |
| `shadow-card-hover` | Card hover state |
| `shadow-bloom` | Strong glow (decorative) |

### CSS Variable Shadows (theme-aware, auto-adapt)

| Variable | Use Case |
|----------|----------|
| `--shadow-neon` | `.glow-btn:hover`, `.shadow-neon` utility class |
| `--shadow-magenta` | `.shadow-magenta` utility class |
| `--shadow-card` | `.cinematic-card` |
| `--shadow-card-hover` | `.cinematic-card:hover`, `.card-hover:hover` |

### Ambient Glow System (`.page-ambient`)

Four radial gradients positioned at corners, composited on a fixed element behind everything:

```
top-center:   --glow-cyan     (var(--primary) glow, ~18% opacity)
bottom-center: --glow-magenta (var(--secondary) glow, ~12% opacity)
top-right:     --glow-purple  (var(--tertiary) glow, ~10% opacity)
bottom-left:   --glow-green   (var(--accent) glow, ~8% opacity)
```

With a breathing animation (`ambientBreath`) that oscillates opacity between 0.3 and 0.6.

---

## 8. Component Color Usage Map

### Navigation (`src/components/layout/Navigation.tsx`)

| Element | CSS/Class | Value |
|---------|-----------|-------|
| Active link | `text-cyan-400` | Hardcoded cyan |
| Active underline | `from-cyan-400 to-magenta-500` | Hardcoded gradient |
| Logo | `gradient-text` | Theme-aware via CSS variable |
| Mobile active bg | `bg-cyan-400/20 text-cyan-400` | Hardcoded cyan |

### Hero Section (`src/components/sections/HeroSection.tsx`)

| Element | Value |
|---------|-------|
| Role badges | `text-cyan-400`, `text-magenta-400`, `text-green-400` (hardcoded) |
| Title | `.cinematic-title` (hardcoded cyan→magenta→green) |
| Conic ring | `conic-gradient(#00D4FF, #FF00FF, #00FF88)` (hardcoded) |
| Floating orbs | `#00D4FF`, `#FF00FF`, `#00FF88` (hardcoded) |
| Buttons | `from-cyan-500 to-blue-600` (hardcoded) |

### About Section (`src/components/sections/AboutSection.tsx`)

| Element | Value |
|---------|-------|
| Background grid | `#4f46e5` / `#818cf8` (indigo) |
| Skill bars | `linear-gradient(90deg, #4f46e5, #818cf8, #6366f1)` |
| Timeline | `linear-gradient(to bottom, #4f46e5, #818cf8, #a78bfa, #6366f1)` |
| Milestone dots | Use `color` field from data: `#00E5FF`, `#FF2D95`, `#00F593` |

### Projects Section (`src/components/sections/ProjectsSection.tsx`)

| Element | Value |
|---------|-------|
| Filter buttons | `border-indigo-500/30`, `bg-indigo-500/10` |
| Card bg | `linear-gradient(135deg, rgba(15,15,35,0.9), rgba(30,10,60,0.4))` |
| Tech badges | `bg-indigo-500/5 text-indigo-400/70` |

### Skills Section (`src/components/sections/SkillsSection.tsx`)

| Element | Value |
|---------|-------|
| Category colors | From data: `#00E5FF` (Frontend), `#00F593` (Backend), `#FF2D95` (Tools) |
| Top skill colors | Individual brand colors (React `#61dafb`, TS `#3178c6`, etc.) |

### Contact Section (`src/components/sections/ContactSection.tsx`)

| Element | Value |
|---------|-------|
| Name field | `#818cf8` |
| Email field | `#a78bfa` |
| Message field | `#6366f1` |
| Submit btn | `linear-gradient(135deg, #4f46e5, #7c3aed)` |
| Success btn | `linear-gradient(135deg, #059669, #10b981)` |
| Social links | From data: GitHub `#00E5FF`, Email `#00F593` |

### Other Components

| Component | Key Colors |
|-----------|-----------|
| Footer logo | `gradient-text` (theme-aware) |
| Footer social hover | `hover:text-cyan-400 hover:bg-cyan-400/10` |
| BackToTop | `from-cyan-500 to-magenta-500`, `shadow-neon` |
| LoadingScreen | `conic-gradient(#00E5FF, #FF2D95, #00F593)` |
| ScrollProgress | `var(--primary)`, `var(--secondary)`, `var(--tertiary)` |
| SectionHeader label | `text-cyan-400` (hardcoded) |
| ThemeTransition | `rgba(0, 229, 255, 0.3)` + `rgba(255, 45, 149, 0.3)` |

---

## 9. Data Layer Colors

### `src/data/skills.ts` — Category & Skill Colors

```typescript
Category colors:
  Frontend: '#00E5FF'    // cyan (matches new primary)
  Backend:  '#00F593'    // green (matches new accent)
  Tools:    '#FF2D95'    // magenta/pink (matches new secondary)

Top skills (brand colors — unchanged):
  React:      '#61dafb'     TypeScript: '#3178c6'
  Node.js:    '#339933'     Next.js:    '#ffffff'
  Three.js:   '#049ef4'     MongoDB:    '#47A248'
  Tailwind:   '#38bdf8'     Framer:     '#ff69b4'
  GraphQL:    '#e535ab'     Docker:     '#2496ed'
  PostgreSQL: '#336791'     Git:        '#f05032'
```

### `src/data/about.ts` — Milestone Colors

```typescript
'#00E5FF'   // First milestone (cyan)
'#FF2D95'   // Second milestone (pink)
'#00F593'   // Third milestone (green)
'#00E5FF'   // Fourth milestone (cyan)
```

### `src/data/social.ts` — Social Link Colors

```typescript
GitHub: '#00E5FF'   // cyan
Email:  '#00F593'   // green
```

### `src/data/themes.ts` — Theme UI Preview Data

```typescript
export const themes: Theme[] = [
  { name: 'Dark',   value: 'dark',   color: '#0D0D14', gradient: 'linear-gradient(135deg, #1a1a2e, #0D0D14)' },
  { name: 'Light',  value: 'light',  color: '#EFF6FF', gradient: 'linear-gradient(135deg, #ffffff, #DBEAFE)' },
  { name: 'Pink',   value: 'pink',   color: '#FF6B9D', gradient: 'linear-gradient(135deg, #E9407A, #FF6B9D)' },
  { name: 'Red',    value: 'red',    color: '#FF4B4B', gradient: 'linear-gradient(135deg, #DC2626, #FF4B4B)' },
  { name: 'Blue',   value: 'blue',   color: '#3B82F6', gradient: 'linear-gradient(135deg, #2563EB, #3B82F6)' },
  { name: 'Green',  value: 'green',  color: '#10B981', gradient: 'linear-gradient(135deg, #059669, #10B981)' },
  { name: 'Purple', value: 'purple', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #7C3AED, #8B5CF6)' },
  { name: 'Orange', value: 'orange', color: '#F97316', gradient: 'linear-gradient(135deg, #EA580C, #F97316)' },
  { name: 'Cyan',   value: 'cyan',   color: '#06B6D4', gradient: 'linear-gradient(135deg, #0891B2, #06B6D4)' },
  { name: 'Rose',   value: 'rose',   color: '#F43F5E', gradient: 'linear-gradient(135deg, #E11D48, #F43F5E)' },
]
```

### TypeScript Interface (`src/types/index.ts`)

```typescript
export interface Theme {
  name: string      // Display name
  value: string     // CSS class name
  color: string     // Hex color (for palette icon)
  gradient: string  // CSS gradient (for UI preview)
}
```

---

## 10. Theme Transition

`ThemeTransition.tsx` monitors theme changes via `useTheme()` and plays a 600ms warp-speed animation:

1. Two radial gradients (cyan `#00E5FF` at 30%, pink `#FF2D95` at 70%) fade in/out
2. Repeating linear gradient streaks slide horizontally (warp speed effect)
3. A dark center radial gradient adds depth
4. Uses `AnimatePresence` for mount/unmount animation

---

## Theme Provider Setup (`src/components/providers/ThemeProvider.tsx`)

```typescript
<NextThemesProvider
  attribute="class"          // Applies class to <html>
  defaultTheme="dark"        // Default is dark
  enableSystem={false}       // No system preference detection
  themes={themeValues}       // All 10 theme values from data
>
```

## Layout Integration (`src/app/layout.tsx`)

```tsx
export const viewport: Viewport = {
  themeColor: '#050508',    // matches dark bg-primary
}

// Wrapping order:
<ThemeProvider>
  <BackgroundEffectsProvider>
    <ThemeTransition />
    <NoiseOverlay />
    <SectionProgress />
    <KeyboardShortcutProvider>
      <main>{children}</main>
    </KeyboardShortcutProvider>
  </BackgroundEffectsProvider>
</ThemeProvider>
```

---

## Key Architectural Insights

1. **Dual color system**: Tailwind hardcoded colors (used in JSX classes like `text-cyan-400`) coexist with CSS custom properties (used in CSS files like `var(--primary)`). Many components use both.

2. **Hardcoded colors dominate sections**: Hero, About, Projects, Contact, Navigation, and Footer predominantly use hardcoded Tailwind colors (cyan, magenta, green, indigo) rather than CSS variable references. These sections do NOT fully adapt to theme changes — they always show the Dark theme's color scheme.

3. **Theme-adaptive elements**: `gradient-text`, glassmorphism, shadows, ambient glow, scrollbar, and `.page-ambient` properly respond to CSS variable changes.

4. **Color-blind modes are orthogonal**: The `data-colorblind` attribute layers on top of any theme class and overrides the 4 accent colors.

5. **Background effects are separate**: The 9 background effects (Particles, Digital Rain, etc.) have their own colors, persistent via localStorage, independent of theme.

6. **Three core accent colors** (`#00E5FF` cyan, `#FF2D95` pink, `#00F593` mint green) appear throughout as hardcoded values in component JSX, effect canvas code, and data files — matching the new Dark theme palette.
