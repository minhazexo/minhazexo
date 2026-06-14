# Performance Guide — Analysis & Optimization

---

## Current Performance Profile

The portfolio uses several performance strategies already in place. This document analyzes each and provides actionable improvements.

---

## ✅ Already Implemented

### Image Optimization

| Strategy | Location | Status |
|----------|----------|--------|
| `next/image` with `priority` on hero | `HeroSection.tsx:61-68` | ✅ |
| `next/image` with `loading="lazy"` on project screenshots | `ProjectsSection.tsx:160-168` | ✅ |
| Proper `sizes` attributes | All Image components | ✅ |
| AVIF/WebP formats enabled | `next.config.mjs:5` | ✅ |
| Device/image sizes configured | `next.config.mjs:6-7` | ✅ |
| 30-day minimum cache TTL | `next.config.mjs:8` | ✅ |

### Code Splitting

| Strategy | Location | Status |
|----------|----------|--------|
| `React.lazy()` for 6 section components | `page.tsx:17-23` | ✅ |
| `next/dynamic` with `ssr: false` for effects | `BackgroundEffectRenderer.tsx` | ✅ |
| `next/dynamic` for modal | `ProjectsSection.tsx:13-16` | ✅ |

### Rendering

| Strategy | Location | Status |
|----------|----------|--------|
| `content-visibility: auto` on all sections | `globals.css:621-624` | ✅ |
| `contain-intrinsic-size: 800px` | `globals.css:623` | ✅ |
| `isolation: isolate` on main | `globals.css:643` | ✅ |
| `memo()` on heavy components | Multiple files | ✅ |
| `useMemo` for static arrays | `HeroSection.tsx:18` | ✅ |
| `will-change: transform, opacity` on canvas | `globals.css:628-629` | ✅ |

### Bundle

| Strategy | Location | Status |
|----------|----------|--------|
| `removeConsole` in production | `next.config.mjs:14` | ✅ |
| `productionBrowserSourceMaps: false` | `next.config.mjs:12` | ✅ |

### Caching (Netlify)

| Resource | Cache Header | File |
|----------|-------------|------|
| Images | 1 year, immutable | `public/_headers` |
| JS/CSS bundles | 1 year, immutable | `public/_headers` |
| Manifest | 1 hour | `public/_headers` |
| Service worker | No cache | `public/_headers` |

---

## 🎯 Optimization Opportunities

### Critical: Lighthouse Score Improvements

#### 1. Reduce Cumulative Layout Shift (CLS)

Current issue: Loading screen exits → content appears. No space is reserved.

**Fix:** Add `min-height` placeholders for each section in the HTML before React hydrates:

```tsx
// In layout.tsx, wrap children with skeleton placeholders:
<body>
  <div id="skeleton" style={{ minHeight: '100vh' }}>
    {/* Pre-rendered skeleton matching page structure */}
  </div>
  <div id="main-content" style={{ display: 'none' }}>
    {children}
  </div>
  <script dangerouslySetInnerHTML={{
    __html: `
      // Swap logic: after hydration, hide skeleton, show content
    `
  }} />
</body>
```

Alternatively, ensure the loading screen maintains a static height (it already uses `fixed inset-0` so it shouldn't cause CLS, but verify that the content below doesn't flash).

#### 2. Reduce Largest Contentful Paint (LCP)

Hero background image (`hero-astronaut.jpg`) is the LCP candidate.

**Optimization:**
- Preload it explicitly in the `<head>`:
  ```html
  <link rel="preload" href="/hero-astronaut.jpg" as="image" />
  ```
- Convert to AVIF format specifically for hero (Next.js handles this, but ensure it exists)
- Reduce JPEG quality from likely 80+ to 70 (hero image is behind a gradient overlay at `opacity-40` — visual quality loss from compression is virtually invisible)

#### 3. Reduce JavaScript Execution Time

**Background effects** are heavy. Even though dynamic, they can block the main thread.

**Optimizations:**

```tsx
// BackgroundEffectRenderer.tsx — wrap registration in idle callback
const [effectComponent, setEffectComponent] = useState(null)

useEffect(() => {
  if (typeof window.requestIdleCallback !== 'function') {
    // Fallback: load immediately
    loadEffect(backgroundEffect)
    return
  }
  
  const idleID = requestIdleCallback(() => {
    loadEffect(backgroundEffect)
  }, { timeout: 2000 })
  
  return () => cancelIdleCallback(idleID)
}, [backgroundEffect])
```

#### 4. Optimize CSS Delivery

`globals.css` is ~1800 lines with ~30 theme blocks. Tailwind purges unused classes, but CSS variables for all 10 themes are always loaded.

**Fix:** Extract theme variables to separate files and lazy-load them only when needed:

```
styles/
├── globals.css          # Base, reset, utilities (~400 lines)
├── themes/
│   ├── dark.css         # Loaded by default
│   ├── light.css        # Loaded on demand
│   ├── pink.css
│   └── ...
```

Or, since CSS custom properties are lightweight, consider that the current approach is acceptable — CSS parsing cost is low vs. JS. Measure before refactoring.

---

### Medium Priority

#### 5. Font Loading Optimization

Currently fonts are loaded via `@import` in `globals.css:1`:
```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:...');
```

**Better:** Use `next/font` which provides:
- Automatic self-hosting (zero layout shift)
- `font-display: optional` or `swap` control
- Subsetting for reduced payload
- Built-in preload

```tsx
// In layout.tsx
import { Orbitron, Exo_2, JetBrains_Mono } from 'next/font/google'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html className={`${orbitron.variable} ${exo2.variable} ${jetbrains.variable}`}>
```

#### 6. Reduce Preloaded Images

`preloadImages` in `page.tsx:39-56` loads **all** project images + hero + profile on initial visit. This is 12+ images.

**Optimization:** Only preload critical images:
```tsx
const preloadImages = [
  imageAssets.heroBg,
  imageAssets.profile,
  // Only preload first 4 project images
  ...projects.slice(0, 4).map(p => p.image),
]
```

#### 7. Memoize Context Providers

`BackgroundEffectsProvider` re-renders on every effect change, which triggers re-render of the entire tree below it.

**Fix:** Memoize the context value:
```tsx
const value = useMemo(() => ({
  backgroundEffect,
  setBackgroundEffect,
  secondaryEffect,
  setSecondaryEffect,
}), [backgroundEffect, secondaryEffect])
```

---

### Low Priority / Nice-to-Have

#### 8. Service Worker for PWA

A service worker could cache the app shell for instant repeat visits. Currently there's a `manifest.json` but no `sw.js`.

Add a simple service worker using Workbox via `next-pwa` or a custom script:
```
public/
├── sw.js
└── workbox-*.js
```

#### 9. IntersectionObserver Memoization

`Navigation.tsx:22-48` creates new IntersectionObservers on every mount. This is fine for SPA, but the callback closures capture stale state.

**Minor:** Use `useCallback` for the observer callback and cleanup.

#### 10. Reduce Animation CPU Cost

- Canvas effects run at device pixel ratio. Cap at 2x for performance:
  ```tsx
  const dpr = Math.min(window.devicePixelRatio, 2)
  canvas.width = width * dpr
  ```
- Some effects use `requestAnimationFrame` without pause when offscreen. Add `IntersectionObserver` to stop rendering when section is out of view.

#### 11. Bundle Analysis

Run the Next.js bundle analyzer periodically:
```bash
npm i -D @next/bundle-analyzer
```

Then inspect for:
- Duplicate dependencies
- Large unexpected modules
- Framer Motion tree-shaking (it should be well-optimized already)

#### 12. Image Format Audit

Currently mixed formats (`.jpg`, `.png`). Standardize:
- Hero images → AVIF with WebP fallback
- Project screenshots → WebP (Next.js handles this automatically)
- Profile → AVIF/WebP

---

## Performance Budget (Suggested)

| Metric | Target | Current Estimate |
|--------|--------|-----------------|
| LCP | < 2.5s | ~3-5s (loading screen + assets) |
| FID | < 100ms | ~50ms |
| CLS | < 0.1 | ~0.05 |
| TBT | < 200ms | ~300-500ms (effects heavy) |
| SI | < 3.0s | ~4s |
| Bundle JS (initial) | < 150KB | ~200-250KB |
| Bundle CSS (initial) | < 50KB | ~30KB |

---

## Measurement Commands

```bash
# Lighthouse CI
npx @lhci/cli@0.14.x autorun

# Bundle analysis
ANALYZE=true npm run build

# Manual lighthouse
npx lighthouse https://mehrabhossain.dev --view

# Web Vitals in dev (add to page.tsx)
import { useReportWebVitals } from 'next/web-vitals'
```

---

## Quick Wins (Implement in Order)

1. Replace `@import` font loading with `next/font` — biggest impact on CLS + load time
2. Preload only critical images (hero + profile), defer project images
3. Add `requestIdleCallback` for background effect loading
4. Memoize context values in `BackgroundEffectsProvider`
5. Add bundle analyzer to CI pipeline
6. Switch hero image to AVIF at reduced quality (70)
