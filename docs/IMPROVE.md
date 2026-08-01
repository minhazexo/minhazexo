# Super-Smooth Deployment Guide

A deep-dive audit of the entire project, prioritized by impact. Every recommendation is based on actual file analysis — not generic advice.

---

## Audit Summary

| Metric | Current State | Target |
|--------|--------------|--------|
| Total image weight (public/) | **~23 MB** (24 images) | <3 MB |
| Redundant image pairs (jpg+png) | 8 pairs (duplicated) | 0 |
| Background music | **7.6 MB** MP3 | <1 MB or streamed |
| globals.css | **2,231 lines**, 62 KB | <800 lines, inlined critical |
| JS bundle (first load) | **149 KB** (52 KB gzip) | <100 KB gzip |
| Canvas effects running on load | 8 effects (when selected) | Only active effect |
| Contact form backend | Incomplete (no .env.local) | Fully functional |
| Unit tests | 0 (Playwright E2E only) | >20 unit tests |
| PWA | Manifest exists, **no service worker** | Full offline support |
| Google Analytics | Placeholder ID in .env, **not implemented** | Working analytics |
| font-display | `swap` (good), but **no preload** | Preloaded critical fonts |

---

## P0 — Critical (High Impact, Low-Medium Effort)

### 1. Image Apocalypse — The Single Biggest Win

**Problem:** `public/` contains **~23 MB** of images. Many are PNG screenshots that could be WebP at 10-20% the size. Worst offenders:

| File | Size | After WebP (est.) |
|------|------|-------------------|
| `about-profile.jpg` | **3.7 MB** | ~300 KB |
| `project-gbc-physics.png` | **3.1 MB** | ~250 KB |
| `project-seecto-bangladesh.png` | **2.0 MB** | ~180 KB |
| `project-sciencebee.png` | **2.0 MB** | ~180 KB |
| `project-bd-cloths.jpg` | **1.9 MB** | ~350 KB |

**Action:**

```bash
# Batch convert to WebP (install sharp or use squoosh CLI)
npx sharp-cli i public/*.jpg public/*.png -o public/webp --webp '{quality:80}'
```

Then update `src/data/assets.ts` to point to WebP versions, with JPG/PNG fallback via `<picture>`:

```tsx
<picture>
  <source srcSet="/webp/project-gbc-physics.webp" type="image/webp" />
  <img src="/project-gbc-physics.png" alt="..." />
</picture>
```

Remove **redundant duplicate pairs** (both `.jpg` and `.png` exist for 8 projects — keep only one, preferably WebP).

**Result:** ~23 MB → ~2 MB. **Massive** improvement to LCP, FCP, and data usage.

### 2. Fix Contact Form Backend

**Problem:** No `.env.local` file exists with `RESEND_API_KEY`. The contact API gracefully warns but doesn't actually send emails in production.

**Action:** Create `.env.local`:

```
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL=mehrabhossain7102@gmail.com
NEXT_PUBLIC_SITE_URL=https://mehrabhossain.dev
```

The API route (`src/app/api/contact/route.ts:98-147`) already handles everything — validation, rate limiting, Resend integration. It just needs the key.

### 3. Split & Optimize globals.css

**Problem:** `src/styles/globals.css` is **2,231 lines**. Tailwind's JIT purges unused utility classes, but the custom CSS is monolithic.

**Action:** Split into semantic files:

```
src/styles/
  ├── globals.css          # imports all below
  ├── variables.css        # :root CSS custom properties, theme vars
  ├── base.css             # reset, html/body defaults, typography
  ├── components.css       # .glass, .gradient-text, .vignette-overlay, etc.
  ├── animations.css       # @keyframes for grain-shift, float, etc.
  └── utilities.css        # .touch-target-min, .scrollbar-none, etc.
```

Use `@layer` to control cascade:

```css
@layer base, components, utilities;
@import './variables.css' layer(base);
@import './base.css' layer(base);
@import './components.css' layer(components);
@import './animations.css' layer(components);
@import './utilities.css' layer(utilities);
```

**Result:** Smaller initial CSS payload, better caching (only changed files re-download), easier maintenance.

### 4. Add Service Worker for PWA

**Problem:** `public/manifest.json` exists with icons, but **no service worker** is registered. The app is installable but has zero offline support.

**Action:** Create `public/sw.js`:

```js
const CACHE = 'mehrab-portfolio-v1'
const PRECACHE_URLS = ['/', '/offline', '/manifest.json', '/favicon_io/favicon.ico']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE_URLS)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim())
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).then((res) => {
      const cache = caches.open(CACHE)
      cache.then((c) => c.put(e.request, res.clone()))
      return res
    }))
  )
})
```

Register in `src/app/layout.tsx`:

```tsx
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
  }
}, [])
```

**Result:** Instant loading on repeat visits, offline fallback, true PWA status.

### 5. Compress Background Music

**Problem:** `background-music.mp3` is **7.6 MB**. Many visitors will never click play.

**Action:**

```bash
# Convert to 64kbps AAC/MP3 (dramatically smaller, acceptable for background)
ffmpeg -i background-music.mp3 -codec:a libmp3lame -b:a 64k background-music-compressed.mp3
# Also provide as .ogg for broader support
ffmpeg -i background-music.mp3 -codec:a libvorbis -b:a 64k background-music.ogg
```

Or better: **lazy-load the audio** — don't even fetch the file until the user explicitly clicks play. This saves 7.6 MB on first load.

Also add an IntersectionObserver to the BackgroundMusic component to only load when visible or when the user first interacts.

---

## P1 — High Impact (Medium Effort)

### 6. Implement Google Analytics

**Problem:** `NEXT_PUBLIC_GA_ID` exists in `.env.example` but GA is not implemented anywhere.

**Action:** Create `src/lib/analytics.ts`:

```tsx
export function initGA(gaId: string) {
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  script.async = true
  document.head.appendChild(script)
  window.dataLayer = window.dataLayer || []
  function gtag(...args: unknown[]) { window.dataLayer.push(args) }
  gtag('js', new Date())
  gtag('config', gaId)
}
```

Or use `next/script` in `layout.tsx`:

```tsx
import Script from 'next/script'

// In layout:
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
<Script id="ga-init" strategy="afterInteractive">
  {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');`}
</Script>
```

### 7. Reduce Framer Motion Bundle

**Problem:** The full `framer-motion` library is imported. It's ~30 KB gzipped.

**Action:** Import only what's used. The project uses: `motion`, `AnimatePresence`, `useScroll`, `useTransform`, `useSpring`, `useInView`. Use `motion` directly with tree-shaking (Next.js + webpack handles this, but verify):

```tsx
// Instead of: import { motion, AnimatePresence, useScroll } from 'framer-motion'
// Verify that your bundler is tree-shaking unused features.
// Run: npx next-bundle-analyzer to check
```

Install `@next/bundle-analyzer`:

```bash
bun add -d @next/bundle-analyzer@14
```

Add to `next.config.mjs`:

```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
export default withBundleAnalyzer(nextConfig)
```

Then `ANALYZE=true bun run build` to see what's actually bundled.

### 8. Preload Critical Fonts

**Problem:** Google Fonts (Orbitron, Exo 2, JetBrains Mono) are loaded via next/font which handles self-hosting, but preconnect hints exist. However, fonts are not preloaded for the critical rendering path.

**Action:** In `layout.tsx`, `next/font/google` already self-hosts these fonts (they're served from your domain, not Google). This is good. But verify the font files are small enough:

- Orbitron is ~160 KB (Latin only) — this is fine
- Consider **subsetting** to Latin-only (`subsets: ['latin']` is already set — good)

Add `preload` on the hero section's heading font:

```tsx
<link rel="preload" href="/_next/static/media/..." as="font" crossOrigin="anonymous" />
```

(The exact URL appears in the build output.)

### 9. Implement Dynamic Sitemap

**Problem:** `public/sitemap.xml` is a static file with only the homepage. For SEO, this should include project detail pages.

**Action:** Create `src/app/sitemap.ts`:

```tsx
import { projects } from '@/data/projects'

export default function sitemap() {
  const projectUrls = projects.map((p) => ({
    url: `https://mehrabhossain.dev/projects/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    { url: 'https://mehrabhossain.dev', lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    ...projectUrls,
  ]
}
```

(Note: only if project detail pages exist as separate routes; currently they're modals, so the sitemap may not benefit from individual project entries unless you create dedicated pages.)

---

## P2 — Medium Impact (Medium Effort)

### 10. Add Unit Tests (Vitest)

**Problem:** No unit tests exist. Only Playwright E2E tests are configured.

**Action:**

```bash
bun add -d vitest @testing-library/react @testing-library/jest-dom jsdom
```

Test the data layer:

```tsx
// src/__tests__/projects.test.ts
import { projects } from '@/data/projects'

describe('projects', () => {
  it('has 8 projects', () => expect(projects).toHaveLength(8))
  it('all have valid images', () => projects.forEach(p => expect(p.image).toMatch(/\.(png|jpg|webp)$/)))
  it('all have non-empty descriptions', () => projects.forEach(p => expect(p.description.length).toBeGreaterThan(10)))
})
```

Add to `package.json` scripts:

```json
"test:unit": "vitest run"
```

### 11. Add Script for Image Optimization

Create `scripts/optimize-images.mjs` that can be run before builds:

```js
import sharp from 'sharp'
import { readdirSync, mkdirSync, existsSync } from 'fs'
import { join, extname, parse } from 'path'

const publicDir = 'public'
const outDir = join(publicDir, 'webp')
if (!existsSync(outDir)) mkdirSync(outDir)

const files = readdirSync(publicDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f))

for (const file of files) {
  const input = join(publicDir, file)
  const output = join(outDir, `${parse(file).name}.webp`)
  await sharp(input).webp({ quality: 80 }).toFile(output)
  console.log(`✓ ${file} → webp/${parse(file).name}.webp`)
}
```

Add to `package.json`:

```json
"scripts": {
  "optimize:images": "bun scripts/optimize-images.mjs",
  "build": "next build"
}
```

### 12. Add Loading="eager" for Hero Images

**Problem:** Hero section images are `priority` but some non-hero images on initial viewport lack loading optimization.

**Action:** Audit all `<Image>` components. The hero background and profile images should use `priority` (they already do: `page.tsx:42` for hero, `HeroSection.tsx:41` for hero BG, `:192` for chess). Verify the above-the-fold images in AboutSection are also `priority` (about profile at `AboutSection.tsx:192-193` has `priority` — good).

Add explicit `width`/`height` to ALL images to prevent CLS. Currently some use `fill` (which is fine with `sizes`) but the parent div must have explicit dimensions. Check `<Image>` usage:

- HeroSection.tsx: `fill` with `sizes` — parent has `relative w-72 h-72` (good)
- AboutSection.tsx: `fill` — parent has `relative w-56 h-56` (good)
- ProjectsSection.tsx: `fill` with `loading="lazy"` — parent has `relative h-48 sm:h-56` (good)

### 13. Prefetch/Prioritize Hero Images

**Problem:** The hero background is loaded as a CSS background or via `<Image>` on the client, but the biggest LCP element (the hero heading) has no font preloading.

**Action:** In `layout.tsx`, add:

```tsx
<link rel="preload" href="/hero-astronaut.jpg" as="image" />
```

### 14. Cache Strategy for Vercel

**Problem:** `vercel.json` has security/static cache rules. Vercel's Next.js platform handles ISR/SSR caching, but images could use more aggressive CDN caching.

**Action:** Tune `vercel.json` headers (already created — migrated from the old Netlify `_headers`):

```json
{
  "headers": [
    { "source": "/_next/static/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/webp/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=2592000, stale-while-revalidate=86400" }] },
    { "source": "/(.*)\.html", "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }] }
  ]
}
```

---

## P3 — Nice to Have (Lower Impact)

### 16. Add Scroll-Triggered Animation for Canvas Effects

**Problem:** Canvas effects run full frame rate even when the user is reading content.

**Idea:** Reduce canvas FPS to 15-20 when the user is not actively scrolling. Detect scrolling vs. idling:

```tsx
let idleTimer: NodeJS.Timeout
const onScroll = () => {
  clearTimeout(idleTimer)
  setFps(60)
  idleTimer = setTimeout(() => setFps(15), 3000)
}
window.addEventListener('scroll', onScroll, { passive: true })
```

### 17. Environment Validation at Build Time

**Problem:** Missing `RESEND_API_KEY` only surfaces at runtime (gracefully handled, but still a gap).

**Action:** Add a validation step in `next.config.mjs`:

```js
const requiredEnvVars = ['RESEND_API_KEY']
requiredEnvVars.forEach((key) => {
  if (!process.env[key] && process.env.NODE_ENV === 'production') {
    console.warn(`⚠ Missing required env: ${key}`)
  }
})
```

### 18. Add `fetchpriority` to Hero Image

**Problem:** The hero background uses `priority` (correct), but adding `fetchpriority="high"` gives the browser an explicit hint:

```tsx
<Image
  src={imageAssets.heroBg}
  alt=""
  fill
  priority
  fetchpriority="high"  // explicit hint to browser
/>
```

### 19. Add Breadcrumb Navigation to Project Modal

**Problem:** JSON-LD BreadcrumbList exists for homepage only. Project modals should update breadcrumbs.

**Action:** When a project modal opens, dynamically update the JSON-LD breadcrumb schema to include the current project. This helps SEO for the modal content.

```tsx
useEffect(() => {
  if (!project) return
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mehrabhossain.dev' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://mehrabhossain.dev/#projects' },
      { '@type': 'ListItem', position: 3, name: project.title, item: `https://mehrabhossain.dev/#project-${project.id}` },
    ],
  }
  const script = document.getElementById('breadcrumb-schema')
  if (script) script.textContent = JSON.stringify(breadcrumb)
}, [project])
```

### 20. Add 404 Logging

**Problem:** 404s are not tracked. You don't know what users are looking for.

**Action:** In `src/app/not-found.tsx`, add a simple analytics event:

```tsx
useEffect(() => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', { page_title: '404', page_location: window.location.href })
  }
}, [])
```

---

## Priority Matrix (Updated)

| Priority | Effort | Impact | Task |
|----------|--------|--------|------|
| **P0** | Low | **Massive** | Convert all images to WebP (~23 MB → ~2 MB) |
| **P0** | Low | **Very High** | Fix contact form (.env.local) |
| **P0** | Low | **High** | Split globals.css (2,231 → smaller layers) |
| **P0** | Low | **High** | Add service worker for true PWA |
| **P0** | Low | **High** | Compress/lazy-load background music (7.6 MB) |
| **P1** | Low | **High** | Implement Google Analytics (placeholder exists) |
| **P1** | Low | **High** | Run bundle analyzer, tree-shake Framer Motion |
| **P1** | Low | **High** | Preload critical hero image |
| **P1** | Low | **Medium** | Remove duplicate .jpg/.png pairs |
| **P1** | Medium | **Medium** | Add unit tests (Vitest) |
| **P1** | Medium | **Medium** | Cache strategy for Vercel CDN (`vercel.json`) |
| **P2** | Medium | **Medium** | Auto-generate sitemap from project data |
| **P2** | Medium | **Low** | Add image optimization build script |
| **P2** | Medium | **Low** | Dynamic breadcrumb schema in modals |
| **P3** | Low | **Low** | Idle FPS reduction for canvas effects |
| **P3** | Low | **Low** | Build-time env validation |
| **P3** | Medium | **Low** | 404 tracking |
| **P3** | Medium | **Low** | `fetchpriority="high"` on hero images |

---

## Quick Wins (Do These First)

```bash
# 1. Convert all images to WebP
npx sharp-cli i "public/*.{jpg,png}" -o "public/webp" --webp "{quality:80}"

# 2. Compress background music
ffmpeg -i public/background-music.mp3 -b:a 64k public/background-music-compressed.mp3

# 3. Create .env.local
echo "RESEND_API_KEY=re_xxxxxxxx\nCONTACT_EMAIL=mehrabhossain7102@gmail.com" > .env.local

# 4. Remove duplicate images (keep smallest of each pair)
rm public/project-*.png  # if keeping .jpg; or vice versa

# 5. Add service worker (copy sw.js template above)

# 6. Run bundle analysis
bun add -d @next/bundle-analyzer@14
ANALYZE=true bun run build

# 7. Run WebPageTest after deployment to verify
```

After these quick wins:
- Image weight: **~23 MB → ~2 MB** (−91%)
- Audio weight: **7.6 MB → ~650 KB** (−91%)
- CSS payload: **62 KB → ~25 KB** (−60%)
- JS bundle: **149 KB → ~110 KB** (−26%)
- Lighthouse Performance: **~65 → ~92+**
- PWA: Offline-capable, installable
