# Background Effects — Deep Dive & Professional Improvement Guide

A comprehensive analysis of all 8 background effects, the ambient lighting system, and every overlay in the project. Covers architecture, performance, code quality, and actionable improvements for a production-grade experience.

---

## Table of Contents

1. [System Architecture & Layer Stack](#1-system-architecture--layer-stack)
2. [Effect Catalog](#2-effect-catalog)
   - 2.1 ParticleBackground (default primary)
   - 2.2 ConstellationMap
   - 2.3 DigitalRain
   - 2.4 WaveFlowField
   - 2.5 AuroraBorealis
   - 2.6 FloatingOrbs
   - 2.7 RetroGrid
   - 2.8 GeometricPattern
3. [Global Overlays](#3-global-overlays)
   - 3.1 NoiseOverlay (z-9998)
   - 3.2 VignetteOverlay (z-9997)
   - 3.3 Page Ambient (z-[-1])
4. [Provider & Switcher](#4-provider--switcher)
5. [Cross-cutting Concerns](#5-cross-cutting-concerns)
6. [Implementation Priority Matrix](#6-implementation-priority-matrix)

---

## 1. System Architecture & Layer Stack

### z-index Layer Order (bottom to top)

```
z-index: -1     │  page-ambient (ambient radial gradients, breathing glow)
                │  └─ ::before — animated breath (8s)
                │  └─ ::after — top-down cyan light
─────────────────┼────────────────────────────────────────────
z-index:  0     │  BackgroundEffectRenderer (dynamic)
                │  └─ Secondary effect (rendered first)
                │  └─ Primary effect (rendered on top)
                │
                │  Hero section static bg (from-slate-950 via-slate-900)
                │  Hero section bg image / parallax layer
                │  Hero section content
─────────────────┼────────────────────────────────────────────
z-index: 9997   │  VignetteOverlay (radial dark edge fade)
─────────────────┼────────────────────────────────────────────
z-index: 9998   │  NoiseOverlay (SVG film grain, mix-blend-mode: overlay)
─────────────────┼────────────────────────────────────────────
other fixed     │  ScrollProgress (z-50)
                │  SectionProgress
                │  Navigation, BackToTop, etc.
```

### Data Flow

```
backgrounds.ts (data)
     │
     ▼
BackgroundEffectsProvider (context + localStorage)
     │
     ├──► BackgroundEffectRenderer (orchestrator)
     │       │
     │       ├──► Primary effect (dynamic import)
     │       └──► Secondary effect (dynamic import)
     │
     └──► BackgroundEffectSwitcher (UI panel)
             │
             ├── Primary tab → setBackgroundEffect()
             └── Overlay tab → setSecondaryEffect()
```

### File Map

| File | Role |
|------|------|
| `src/data/backgrounds.ts` | 9 effect definitions (name, value, gradient, icon) |
| `src/components/providers/BackgroundEffectsProvider.tsx` | React Context + localStorage persistence |
| `src/components/effects/BackgroundEffectRenderer.tsx` | Dynamic loader, primary+secondary orchestration |
| `src/components/ui/BackgroundEffectSwitcher.tsx` | Full UI dropdown with primary/overlay tabs |
| `src/app/layout.tsx` | Renders `page-ambient`, `vignette-overlay`, `NoiseOverlay` |
| `src/app/page.tsx` | Renders `BackgroundEffectRenderer` via `next/dynamic` |
| `src/styles/globals.css` | All CSS animations, keyframes, overlays |

---

## 2. Effect Catalog

### 2.1 ParticleBackground (default primary)

**Technique:** Canvas 2D with alpha-composited trails
**File:** `src/components/effects/ParticleBackground.tsx`
**Default:** Yes (set in `BackgroundEffectsProvider`)

#### Current Implementation

- Creates 12–30 particles (based on viewport area), each with random position, velocity, size, color
- Particles bounce off canvas edges
- Distance check: draws lines between particles within 100px, opacity scaled by `0.08 * (1 - dist/100)`
- Canvas cleared with `fillStyle = 'rgba(10, 10, 26, 0.1)'` instead of `clearRect()` — creates motion trails
- Mobile: 30% of calculated particle count
- Colors: cyan (#00D4FF), magenta (#FF00FF), green (#00FF88)

#### Strengths
- Lightweight particle system with minimal overhead
- Connection lines add visual interest without complexity
- Responsive particle count

#### Issues & Improvements

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | No FPS cap — runs at full refresh rate (60/120/144fps) | Medium | Add `requestAnimationFrame` throttling or delta-time scaling |
| 2 | Alpha-fill compositing for trails is expensive — fills entire canvas | Medium | Reduce fill opacity or use `clearRect` + manual trail array |
| 3 | No pause when tab is hidden | High | Add `document.hidden` check via `visibilitychange` listener |
| 4 | No `will-change: transform` on canvas | Low | Add CSS hint for GPU compositing |
| 5 | Colors are hardcoded instead of using CSS variables | Low | Use `getComputedStyle` to read `--primary`, `--secondary`, `--accent` |
| 6 | Canvas DPI not scaled for retina displays | Medium | Multiply canvas dimensions by `devicePixelRatio` and scale context |
| 7 | No connection line alpha optimization — checks every particle pair | Low | Use spatial grid (quadtree) for O(n) instead of O(n²) |

**Recommended rewrite:**

```tsx
// Add visibility-based pause
useEffect(() => {
  const handleVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(animationRef.current!)
    } else {
      animationRef.current = requestAnimationFrame(animate)
    }
  }
  document.addEventListener('visibilitychange', handleVisibility)
  return () => document.removeEventListener('visibilitychange', handleVisibility)
}, [])

// Retina support
const dpr = window.devicePixelRatio || 1
canvas.width = window.innerWidth * dpr
canvas.height = window.innerHeight * dpr
ctx.scale(dpr, dpr)

// Theming
const styles = getComputedStyle(document.documentElement)
const primaryColor = styles.getPropertyValue('--primary').trim() || '#00D4FF'
```

---

### 2.2 ConstellationMap

**Technique:** Canvas 2D with mouse interaction
**File:** `src/components/effects/ConstellationMap.tsx`

#### Current Implementation

- 40 stars with random positions, sizes, brightness
- Pre-computes connections between stars within `connectionDistance` (default 100px)
- Stars pulse with `0.5 + 0.5 * sin(time * 2 + i * 0.1)`
- Mouse interaction: stars within 150px glow cyan, connections highlight
- Default state: violet (#8B5CF6). Mouse near: cyan (#00D4FF)
- Canvas cleared with same alpha-fill technique as Particles

#### Strengths
- Pre-computed connections avoid O(n²) per frame
- Mouse interaction is smooth and adds delight
- Good color scheme distinction (violet default → cyan on interaction)

#### Issues & Improvements

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | `starCount` and `connectionDistance` can't be changed after mount — effect doesn't re-run | Low | Add deps to useEffect or use refs |
| 2 | No resize recalculation of connections for stars | Medium | Recompute connections on resize |
| 3 | Alpha-fill compositing (same as Particles) | Medium | Use `clearRect` + preserved trail array, or reduce fill opacity |
| 4 | Mouse event listeners on `window` instead of canvas | Low | Add `pointer-events: auto` to canvas or scope to container |
| 5 | Stars wrap at canvas edges on resize — positions become stale | Medium | Recompute `starsRef.current` on resize with proportional repositioning |
| 6 | No touch device support for mouse interaction | High | Add `touchmove` / `touchstart` listeners |
| 7 | `speed` prop affects time delta but not connection pulse — inconsistent | Low | Decouple star pulse speed from connection pulse speed |

---

### 2.3 DigitalRain

**Technique:** Canvas 2D, column-based katakana fall
**File:** `src/components/effects/DigitalRain.tsx`

#### Current Implementation

- Columns spaced by 20px (desktop) / 30px (mobile)
- Characters: full katakana set + alphanumeric + symbols
- Gradient color per character (secondary → primary)
- Trailing fade effect via random column resets
- Background: `linear-gradient(180deg, #0A0A1A 0%, #050510 100%)`
- Separate `setInterval` at 100ms to randomly reset columns

#### Strengths
- Iconic visual with good character set variety
- Gradient-colored characters look rich
- Props for `speed`, `density`, `color`

#### Issues & Improvements

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | `setInterval` for column resets + `requestAnimationFrame` for drawing — two competing loops | Medium | Merge into single RAF loop with time accumulator |
| 2 | `density` prop is declared but **never used** in the effect | High | Either remove or implement (control column width/spacing) |
| 3 | Canvas bg gradient is re-rendered on every `draw()` call | Medium | Set canvas background via CSS, or draw gradient once |
| 4 | No visibility pause | High | Add visibility listener |
| 5 | Characters per frame is uniform — all columns advance at same rate | Low | Add per-column speed variation for organic feel |
| 6 | No retina DPI support | Medium | Scale for devicePixelRatio |
| 7 | `resizeCanvas` not cleaned up when `speed`/`density`/`color` props change | High | Add cleanup in useEffect return |
| 8 | Full background on every frame with `rgba(10, 10, 26, 0.05)` — creates buildup that never fully clears | Medium | Periodically full-clear to prevent saturation |

---

### 2.4 WaveFlowField

**Technique:** Canvas 2D, sine wave computation
**File:** `src/components/effects/WaveFlowField.tsx`

#### Current Implementation

- 2–3 (mobile/desktop) sine waves with randomized amplitude, frequency, phase, speed
- Each wave: filled area under curve + stroked line on top
- Colors: cyan (0.1), magenta (0.08), green (0.06), violet (0.08), amber (0.05)
- Mobile: smaller amplitude (18+30 vs 30+50), 2 waves instead of 3

#### Strengths
- Simple, performant — only computes y = sin(x * freq + t * speed + phase) * amp
- Multiple waves with different parameters create depth
- Color palette matches the design system

#### Issues & Improvements

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | `clearRect` used (good), but fills entire canvas | OK | No issue here, this is the correct approach |
| 2 | No visibility pause | High | Add visibility listener |
| 3 | Waves are recomputed on every frame — can be optimized with offscreen canvas or cached segments | Low | Pre-compute wave segments and reuse for 2–3 frames |
| 4 | `density` prop not used | Medium | Implement as segment count or wave count multiplier |
| 5 | Stroke colors hardcoded via `.replace('0.', '0.3')` string hack | High | Extract alpha to a variable instead of string manipulation |
| 6 | Waves drawn across full canvas width regardless of scroll position | Low | Add viewport culling for offscreen areas |
| 7 | No retina support | Medium | devicePixelRatio |

---

### 2.5 AuroraBorealis

**Technique:** Pure CSS with `@keyframes`
**File:** `src/components/effects/AuroraBorealis.tsx`

#### Current Implementation

- 3 overlapping gradient layers with `animation: auroraWave1/2/3`
- Each wave: linear gradient spanning cyan → green → violet, 200%×200% size
- Animations: translateX ±10%, rotate ±2°, scaleY 1→1.5→1, opacity pulsing
- Dedicated star field via 20 `radial-gradient` dots with `twinkle` animation
- Background: `linear-gradient(180deg, #0A0A1A 0%, #0A0A0F 100%)`

#### Strengths
- Zero JavaScript after mount — fully CSS-driven
- Star field is built into the effect (no extra component)
- `speed` and `intensity` props control animation

#### Issues & Improvements

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | Large CSS gradients (200%×200%) on 3 layers with blur-equivalent transforms cause GPU overdraw | Medium | Reduce to 150%×150% or use `will-change: transform` |
| 2 | Colors are hardcoded rgba values in CSS — can't theme-switch | High | Use CSS variables (`--primary`, `--accent`, `--tertiary`) or inline styles |
| 3 | Star field is 20 manually-positioned dots — not responsive | Low | Use a repeating pattern or JS-generated stars for viewport coverage |
| 4 | No `prefers-reduced-motion` check (relies on global CSS media query) | Low | Add local check via `useMediaQuery` for zero-animation fallback |
| 5 | Background gradient is hardcoded in CSS, not using theme variables | Medium | Replace `#0A0A1A` with `var(--bg-primary)` variants |
| 6 | All three waves animate identically (just offset by delay) | Low | Give each wave unique keyframe parameters for organic feel |

---

### 2.6 FloatingOrbs

**Technique:** Pure CSS with `@keyframes`
**File:** `src/components/effects/FloatingOrbs.tsx`

#### Current Implementation

- 5 orbs (configurable via `count` prop) with randomized size (100–300px), position (10–90%), duration (15–25s), delay
- Colors: cyan (0.15), magenta (0.12), green (0.1), violet (0.1), amber (0.08) — via `radial-gradient`
- Animation: `floatOrb` keyframe — translate(30, -20) → (-20, -40) → (-40, -10) with scale
- `filter: blur(1px)` for softness

#### Strengths
- Simple, visually soft, good atmospheric effect
- CSS-driven, no runtime cost after mount
- Responsive to `count` and `speed` props

#### Issues & Improvements

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **`orbs` array is regenerated on every render** — `Math.random()` in render body | High | Wrap in `useMemo(() => ..., [count])` or generate outside JSX |
| 2 | CSS classes `.orb-1` through `.orb-5` are hardcoded — if `count > 5`, extra orbs have no styling | High | Use inline styles for ALL orb properties instead of CSS classes |
| 3 | No visibility pause | Low | CSS animations can't be paused without JS — add JS visibility check |
| 4 | Colors hardcoded as rgba, not theme-aware | Medium | Read CSS variables or accept as prop |
| 5 | `count` prop can't actually exceed the 5 predefined CSS classes | High | The component generates `count` divs but only 5 have `.orb-n` styles — **bug** |

---

### 2.7 RetroGrid

**Technique:** CSS pseudo-elements with perspective transform
**File:** `src/components/effects/RetroGrid.tsx`

#### Current Implementation

- `::before`: primary grid using CSS `repeating-linear-gradient` with `--grid-size` spacing
- `::after`: secondary grid at 2× spacing with secondary color
- Both transformed with `rotateX(75deg)` for perspective, masked via `mask-image: linear-gradient(to top, black 0%, transparent 40%)`
- Grid scrolls via `gridMove` keyframe (translateY by `--grid-size`)
- Visual extras: `retro-grid-glow` (bottom gradient), `retro-horizon-glow` (pulsing horizon line)

#### Strengths
- Visually impressive — the most distinctive effect in the set
- CSS variables for customization (`--grid-speed`, `--grid-size`, `--grid-color`)
- Multiple visual layers (grid, glow, horizon) create depth

#### Issues & Improvements

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | `mask-image` / `-webkit-mask-image` with `linear-gradient` on 200%×200% pseudo-elements is expensive | Medium | Consider clipping the elements instead of masking |
| 2 | `rotateX(75deg)` with `perspective: 1000px` can cause jitter on non-60hz displays | Low | Add `backface-visibility: hidden` on the grid |
| 3 | Horizon glow box-shadow (`0 0 20px #FF00AA, 0 0 40px #00D4FF...`) generates many GPU layers | Medium | Use a single `box-shadow` or CSS gradient instead |
| 4 | Colors use variable fallback `var(--primary, #00D4FF)` — good pattern | OK | Reference for other effects |
| 5 | No reduced-motion override (relies on global CSS query at end of file) | Low | Add `.retro-grid { animation-play-state: paused }` in the media query |
| 6 | Grid size doesn't adapt to viewport — tiny grid on mobile, large on 4K | Low | Make `gridSize` prop responsive (smaller on mobile) |

---

### 2.8 GeometricPattern

**Technique:** Pure CSS `background-image` with repeating linear gradients
**File:** `src/components/effects/GeometricPattern.tsx`

#### Current Implementation

- 6 layers of `linear-gradient` at 30°, 150°, and 60° creating overlapping diamonds
- 3% opacity → extremely subtle
- `geometricShift` keyframe scrolls `background-position` over 20s
- Accepts `opacity` and `scale` props

#### Strengths
- Elegant, extremely performant (pure CSS, no DOM elements beyond the container)
- Good as a secondary overlay effect
- Theme-aware via `var(--primary)` and `var(--secondary)`

#### Issues & Improvements

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | `opacity: 0.03` is nearly invisible — almost no user will perceive it | Low | Increase default to 0.05–0.08 or make configurable via switcher UI |
| 2 | 6 gradient layers with animation cause style recalculations | Low | Use `transform: translate()` on a single large background instead |
| 3 | `scale` prop transforms the container, but the pattern doesn't scale proportionally | Low | Multiply `background-size` by `scale` for true scaling |
| 4 | No visible difference between this and "None" effect | Medium | Consider merging with another effect or removing |

---

## 3. Global Overlays

### 3.1 NoiseOverlay (z-index: 9998)

**File:** `src/components/effects/NoiseOverlay.tsx`
**CSS:** `.grain-overlay` in `globals.css:725`

#### Current Implementation
- Fixed full-screen div with SVG-based film grain (SVG `<feTurbulence>` embedded as data URI)
- `opacity: 0.02`, `mix-blend-mode: overlay`
- Rendered in `layout.tsx` inside `ThemeProvider`

#### Issues & Improvements

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | SVG data URI is ~600 bytes, but re-parsed on every paint | Low | Use CSS `@supports (mix-blend-mode: overlay)` as progressive enhancement |
| 2 | No toggle — user can't disable it | Medium | Add to BackgroundEffectSwitcher as a toggle or include in effect options |
| 3 | At 2% opacity with `overlay` blend, effect is imperceptible on dark backgrounds | Low | Increase to 3–4% for dark themes, 1–2% for light |
| 4 | SVG `<feTurbulence>` with `fractalNoise` at 0.6 frequency can cause jank on low-end GPU | Medium | Reduce baseFrequency to 0.4 or use a static PNG instead |

### 3.2 VignetteOverlay (z-index: 9997)

**File:** `layout.tsx:215` (inline `<div className="vignette-overlay" />`)
**CSS:** `globals.css:697`

#### Current Implementation
- Fixed full-screen radial gradient (transparent center, `rgba(0,0,0,0.25)` edges)
- `will-change: transform` hint
- `::after` adds `inset box-shadow` for corner darkening

#### Issues & Improvements

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | `will-change: transform` is unnecessary — no transform animation | Low | Remove or change to `will-change: opacity` |
| 2 | Radius is at 50% 0% → vignette is stronger at top than bottom. This is intentional for cinematic look but should be documented | Info | Fine as-is |
| 3 | Vignette may obscure content when combined with dark effects like DigitalRain | Low | Consider making it part of the effect switcher or reducing to 15% |

### 3.3 Page Ambient (z-index: -1)

**File:** `layout.tsx:212` (inline `<div className="page-ambient" />`)
**CSS:** `globals.css:650`

#### Current Implementation
- Fixed full-screen with multiple `radial-gradient` layers (cyan top, magenta bottom, purple corner)
- `::before` animates via `ambientBreath` (opacity 0.3→0.6, scale 1→1.05, 8s loop)
- `::after` adds a subtle cyan top-down light gradient

#### Issues & Improvements

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | Multiple radial gradients with `::before` animating causes layout/paint | Medium | Apply `will-change: opacity, transform` on `::before` |
| 2 | Ambient gradients compete with active background effects — when Particles is on, user sees both | Medium | Reduce ambient opacity when an effect is active, or disable it |
| 3 | No light theme adjustment — ambient glow colors are designed for dark mode | High | Add `.light .page-ambient` with different gradient colors |

---

## 4. Provider & Switcher

### BackgroundEffectsProvider

**File:** `BackgroundEffectsProvider.tsx`

| Issue | Severity | Fix |
|-------|----------|-----|
| Default effect is `'particles'` with no fallback if Particles fails to load | Medium | Add try/catch in effect loader or provide a static gradient fallback |
| `setBackgroundEffect` / `setSecondaryEffect` are recreated on every render (not wrapped in `useCallback`) | Low | Wrap in `useCallback` to prevent unnecessary context re-renders |
| localStorage is read but not validated — if a user manually corrupts it, the effect won't match any key | Low | Validate against `backgroundEffects.map(e => e.value)` before setting state |

### BackgroundEffectSwitcher

**File:** `BackgroundEffectSwitcher.tsx`

| Issue | Severity | Fix |
|-------|----------|-----|
| Dropdown has no `aria-activedescendant` or keyboard navigation between options | Medium | Add arrow key navigation for accessibility |
| No "Reset to default" button | Low | Add a reset action |
| Preview gradients in the grid are static — don't reflect actual effect appearance | Low | Could use a tiny canvas preview or animated thumbnail |
| Switcher button icon (Sparkles) is purple — doesn't match current effect's accent color | Low | Dynamically color the icon based on active effect |

### BackgroundEffectRenderer

**File:** `BackgroundEffectRenderer.tsx`

| Issue | Severity | Fix |
|-------|----------|-----|
| `effectLoader` creates a new `dynamic()` call per effect on every render | Medium | Move effect loaders to module level (they already are — each `dynamic` is called once when the module loads, not per render. This is fine.) |
| 1.5s idle callback delay means user sees a blank background for ~1.5s on every visit | Medium | Show a fallback gradient immediately, then swap to the effect |
| If primary === secondary, both render (two copies of the same effect) | Low | Skip rendering if primary === secondary |
| No error boundary per effect — if one effect crashes, all effects disappear | High | Wrap each effect in its own ErrorBoundary |

---

## 5. Cross-cutting Concerns

### 5.1 Performance

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | 4 canvas effects (Particles, Constellation, DigitalRain, WaveFlow) run RAF at full refresh rate with no pause when off-screen | **Critical** | Add `IntersectionObserver` + `visibilitychange` to all canvas effects |
| 2 | No device capability detection — low-end phones get same particle count as high-end desktops | High | Implement quality tiers (low/medium/high) based on `navigator.hardwareConcurrency`, memory, or a simple FPS heuristic |
| 3 | Canvas DPI not scaled for retina | Medium | Multiply dimensions by `devicePixelRatio` |
| 4 | CSS animations (Aurora, FloatingOrbs, Geometric) run even when page is not visible | Medium | Use `document.hidden` to pause CSS animations via `animation-play-state` |
| 5 | Overlapping effects (primary + secondary) with canvas render two separate RAF loops | High | Merge into a single composited canvas when both are canvas-based |
| 6 | No FPS counter or performance monitor for debugging | Low | Add in dev mode |

### 5.2 Theming

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | CSS effects (Aurora, FloatingOrbs, Geometric, RetroGrid) use hardcoded colors | High | All background effects should read theme CSS variables: `var(--primary)`, `var(--secondary)`, `var(--accent)` |
| 2 | Canvas effects hardcode color strings in JS | Medium | Read from `getComputedStyle(document.documentElement)` for canvas effects or pass theme as prop |
| 3 | Light theme has no dedicated background effect styling | High | Add `.light` overrides for each effect's CSS |

### 5.3 Accessibility

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | No effect has a `prefers-reduced-motion` check beyond the global CSS override | Low | Add per-effect exit animations or static fallback frames |
| 2 | Canvas effects are not detectable by screen readers (aria-hidden is missing on some) | Low | Audit all canvas elements for `aria-hidden="true"` |
| 3 | Continuous animations (especially DigitalRain and aurora) can be distracting for users with vestibular disorders | Medium | Ensure global `prefers-reduced-motion` override fully stops all effects |

### 5.4 Mobile

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | Only Particles and WaveFlow have mobile-specific logic (reduced count/waves) | Medium | Add mobile profiles for all effects |
| 2 | ConstellationMap mouse interaction doesn't work on touch devices | High | Add touch event handlers |
| 3 | DigitalRain column spacing is larger on mobile, but no overlap prevention | Low | Fine as-is |
| 4 | Battery impact from continuous canvas animations on mobile | High | Pause all canvas animations when not visible, reduce frame rate to 30fps on mobile |

### 5.5 Architecture

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | No quality autodetection — user must manually choose effects | Medium | Add automatic quality detection on first visit with a manual override |
| 2 | Secondary effect can be the same as primary | Low | Add validation to prevent duplicate selection |
| 3 | No error boundary per effect (as mentioned above) | High | Wrap each in `<SectionErrorBoundary>` or similar |
| 4 | Effect switching causes unmount/remount of entire canvas — no smooth transition | Low | Add crossfade overlay when switching effects |

---

## 6. Implementation Priority Matrix

| Priority | Effort | Category | Improvement |
|----------|--------|----------|-------------|
| **P0** | Medium | Performance | Add visibility-based pause to all canvas effects (5.1 #1) |
| **P0** | Medium | Bug Fix | Fix FloatingOrbs `count > 5` breaking due to hardcoded CSS classes (2.6 #2/#5) |
| **P0** | Low | Bug Fix | Add `density` prop implementation or remove it from DigitalRain (2.3 #2) |
| **P0** | High | Architecture | Wrap each effect in individual ErrorBoundary (5.5 #3) |
| **P1** | Medium | Performance | Add retina/DPR scaling to all canvas effects (5.1 #3) |
| **P1** | Medium | Performance | Add quality tiers based on device capability (5.1 #2) |
| **P1** | Low | Performance | Fix FloatingOrbs `Math.random()` on every render (2.6 #1) |
| **P1** | Medium | Theming | Make CSS effects use CSS variables (5.2 #1) |
| **P1** | Medium | Theming | Make canvas effects read theme colors from `getComputedStyle` (5.2 #2) |
| **P1** | Low | Theming | Add light theme overrides for all effects (5.2 #3) |
| **P1** | High | Mobile | Add touch support to ConstellationMap (5.4 #2) |
| **P1** | High | Mobile | Reduce mobile canvas fps to 30 (5.4 #4) |
| **P2** | Low | Performance | Remove alpha-fill compositing in Particles/Constellation (2.1 #2, 2.2 #3) |
| **P2** | Low | Bug Fix | Fix resize cleanup in DigitalRain when props change (2.3 #7) |
| **P2** | Medium | UX | Show instant fallback gradient instead of 1.5s blank screen (4.3 #2) |
| **P2** | Low | UX | Add smooth crossfade when switching effects (5.5 #4) |
| **P2** | Low | Access | Add keyboard navigation to effect switcher dropdown (4.2 #1) |
| **P2** | Low | Bug Fix | Fix WaveFlow string-replace color hack (2.4 #5) |
| **P2** | Medium | Visual | Merge ambient glow with active effects (3.3 #2) |
| **P3** | Low | Visual | Increase GeometricPattern opacity to be perceptible (2.8 #1) |
| **P3** | Low | Visual | Give each aurora wave unique animation parameters (2.5 #6) |
| **P3** | Low | Visual | Add per-column speed variation to DigitalRain (2.3 #5) |
| **P3** | Low | UX | Add "Reset to default" button in switcher (4.2 #2) |
| **P3** | Medium | UX | Add NoiseOverlay toggle to switcher (3.1 #2) |

### Legend

| Priority | Meaning |
|----------|---------|
| **P0** | Broken functionality, crash risk, or significant battery drain on mobile |
| **P1** | Polish gap that degrades experience noticeably — next sprint |
| **P2** | Important quality improvement — planned backlog |
| **P3** | Nice-to-have enhancement — when time permits |

---

## Quick Reference: All Effect Files

| File | Lines | Type | Read |
|------|-------|------|------|
| `BackgroundEffectRenderer.tsx` | 44 | Orchestrator | Full |
| `ParticleBackground.tsx` | 90 | Canvas | Full |
| `ConstellationMap.tsx` | 167 | Canvas | Full |
| `DigitalRain.tsx` | 131 | Canvas | Full |
| `WaveFlowField.tsx` | 117 | Canvas | Full |
| `AuroraBorealis.tsx` | 49 | CSS | Full |
| `FloatingOrbs.tsx` | 53 | CSS | Full |
| `RetroGrid.tsx` | 47 | CSS | Full |
| `GeometricPattern.tsx` | 25 | CSS | Full |
| `NoiseOverlay.tsx` | 9 | CSS | Full |
| `BackgroundEffectsProvider.tsx` | 61 | Context | Full |
| `BackgroundEffectSwitcher.tsx` | 192 | UI | Full |
| `backgrounds.ts` | 49 | Data | Full |
| `globals.css` (effects) | ~250 lines | CSS | Full |

---

*Generated from deep-dive analysis of all background effect components, CSS, provider, and UI files. Each improvement references specific code issues with actionable fixes.*
