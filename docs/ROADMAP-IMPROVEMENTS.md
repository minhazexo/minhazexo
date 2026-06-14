# Site Improvement Roadmap

> **Prioritized, actionable improvements** to enhance performance, UX, maintainability, and feature depth of the MD Mehrab Hossain portfolio.

---

## Phase 1 — Quick Fixes

### P1.1 — Fix Broken Social Links
**Status:** ✅ **Completed**
- Removed LinkedIn & Twitter (were `"#"` placeholders)
- Kept GitHub + Email with correct accent colors
- Updated both `footerSocialLinks` and `contactSocialLinks`

### P1.2 — Add Favicon
**Status:** ✅ **Completed**
- Linked existing `public/favicon_io/` files to `layout.tsx` `<head>`
- Added `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`

### P1.3 — Add 404 Page
**Status:** ✅ **Completed**
- Created `src/app/not-found.tsx` with cosmic-themed design
- Gradient 404 text, "SIGNAL LOST" message, "RETURN_TO_BASE" CTA

### P1.4 — Close Mobile Menu on Escape
**Status:** ✅ Already implemented

### P1.5 — Add `role="alert"` to Contact Form Error
**Status:** ✅ **Completed**
- Replaced intrusive `alert()` with styled `submissionError` state
- Added `role="alert"` error banner with animated entrance
- Styled with red border, Zap icon, font-mono text

---

## Phase 2 — Performance

### P2.1 — Replace `@import` Font Loading with `next/font`
**Status:** ✅ **Completed**
- Removed Google Fonts `@import` from `globals.css`
- Added `next/font/google` imports for Orbitron, Exo 2, JetBrains Mono
- Font variables applied to `<html>` class, `display: swap` for all

### P2.2 — Preload Only Critical Images
**Status:** ✅ **Completed**
- Only hero bg, profile, about-profile images preloaded for loading screen
- Remaining 8+ project images deferred via `requestIdleCallback` (3s timeout fallback)

### P2.3 — Defer Background Effect Loading with `requestIdleCallback`
**Status:** ✅ **Completed**
- Added `requestIdleCallback` to delay mounting of effect components by 1.5s
- Falls back to `setTimeout` if `requestIdleCallback` not supported

### P2.4 — Memoize Context Value in BackgroundEffectsProvider
**Status:** ✅ **Completed**
- Wrapped context value object with `useMemo`
- Dependencies: `backgroundEffect`, `secondaryEffect`, setter functions

### P2.5 — Add `loading="lazy"` to Non-Critical Section Images
**Status:** ✅ Already implemented

---

## Phase 3 — UX Polish

### P3.1 — Add Smooth Entrance Sequence
**Status:** ✅ **Completed**
- Each section wrapped in `motion.div` with staggered entrance
- Hero (0s) → About (0.15s) → Projects (0.3s) → Skills (0.45s) → Contact (0.6s) → Footer (0.75s)
- Elements fade in using `opacity`

### P3.2 — Add Scroll-Triggered Parallax to All Sections
**Status:** ✅ **Completed**
- Created `src/components/effects/ParallaxSection.tsx`
- Uses Framer Motion `useScroll` + `useTransform` for scroll-driven Y offset
- Wraps About, Projects, Skills, Contact, Footer sections
- Configurable offset per section (15–40px)
- Entrance opacity animation via `whileInView`

### P3.3 — Add Page Transition Between Views
**Status:** ❌ **Not planned** (SPA — smooth scroll navigation already in place)

### P3.4 — Improve Loading Screen UX
**Status:** ✅ **Completed**
- Added "Skip to content" button for returning users
- Returning users (localStorage check) see button after 500ms; first-time users after 2s
- Button immediately completes loading and transitions to content

### P3.5 — Add Interactive Cursor Effects
**Status:** ✅ **Completed**
- Created `src/components/effects/CursorFollower.tsx`
- White circle follower with `mix-blend-difference` for contrast
- Spring physics for smooth motion
- Auto-disabled on touch devices

### P3.6 — Add Keyboard Shortcut Hints
**Status:** ✅ **Completed**
- Created `src/components/ui/KeyboardShortcuts.tsx`
- ⌘K toggles shortcut hints dialog
- H / A / P / S / C scrolls to respective section
- Auto-ignores when focus is in input/textarea

---

## Phase 4 — Feature Additions

### P4.1 — Blog Section
**Status:** ❌ **Not planned**

### P4.2 — Resume Download
**Status:** ✅ **Completed**
- Created `src/components/ui/ResumeButton.tsx`
- Added to desktop nav and mobile menu
- HEAD check detects if PDF exists; shows "Resume N/A" gracefully when missing
- Spinner during download

### P4.3 — Testimonials / Recommendations
**Status:** ❌ **Not planned**

### P4.4 — Live Code Statistics
**Status:** ❌ **Not planned**

### P4.5 — Dark/Light Mode Toggle Animation
**Status:** ✅ Already implemented

### P4.6 — Visitor Counter
**Status:** ❌ **Not planned**

---

## Phase 5 — Maintainability

### P5.1 — Add Error Boundaries
**Status:** ✅ **Completed**
- Created `src/components/providers/ErrorBoundary.tsx`
- `SectionErrorBoundary` wraps each lazy-loaded section (About, Projects, Skills, Contact, Footer)
- Prevents one failing section from crashing the entire page
- Graceful fallback display

### P5.2 — Extract CSS Themes to Separate Files
**Status:** ❌ **Not planned**

### P5.3 — Add Unit Tests
**Status:** ❌ **Not planned**

### P5.4 — Add Storybook Stories
**Status:** ❌ **Not planned**

### P5.5 — Add API Route Tests
**Status:** ❌ **Not planned**

---

## Phase 6 — Advanced

### P6.1 — Internationalization (i18n)
**Status:** ❌ **Not planned**

### P6.2 — SEO Overhaul
**Status:** ❌ **Not planned**

### P6.3 — PWA with Service Worker
**Status:** ❌ **Not planned**

### P6.4 — Performance Monitoring
**Status:** ❌ **Not planned**

### P6.5 — A/B Theme Testing
**Status:** ❌ **Not planned**

---

## Effort Summary

| Phase | Progress |
|-------|----------|
| P1 — Quick Fixes | 100% ✅ |
| P2 — Performance | 100% ✅ |
| P3 — UX Polish | 100% ✅ |
| P4 — Features | 20% |
| P5 — Maintainability | 20% |
| P6 — Advanced | 0% |

---

## Files Changed

| File | Changes |
|------|---------|
| `src/data/social.ts` | Removed LinkedIn/Twitter, fixed colors |
| `src/app/layout.tsx` | Added favicon links, `next/font`, CursorFollower, KeyboardShortcutProvider |
| `src/app/page.tsx` | Staggered section entrances, parallax sections, error boundaries, section IDs for shortcuts |
| `src/app/not-found.tsx` | **New** — 404 page |
| `src/styles/globals.css` | Removed `@import` font link |
| `src/components/providers/BackgroundEffectsProvider.tsx` | `useMemo` for context value |
| `src/components/providers/ErrorBoundary.tsx` | **New** — SectionErrorBoundary |
| `src/components/effects/BackgroundEffectRenderer.tsx` | `requestIdleCallback` defer |
| `src/components/effects/ParallaxSection.tsx` | **New** — Scroll-triggered parallax wrapper |
| `src/components/effects/CursorFollower.tsx` | **New** — Interactive cursor follower |
| `src/components/ui/KeyboardShortcuts.tsx` | **New** — Keyboard shortcut hints dialog |
| `src/components/ui/ResumeButton.tsx` | **New** — Resume download button |
| `src/components/ui/LoadingScreen.tsx` | Skip button for returning users |
| `src/components/layout/Navigation.tsx` | Added ResumeButton to desktop nav + mobile menu |
| `src/components/sections/ContactSection.tsx` | `role="alert"` error banner |
| `docs/ROADMAP-IMPROVEMENTS.md` | Updated with progress tracking |
