# Hero Section — Professional Improvement Guide

> A deep-dive analysis of `src/components/sections/HeroSection.tsx` with actionable fixes to achieve a polished, production-grade hero.

---

## Table of Contents

1. [Critical Bugs & Broken Features](#1-critical-bugs--broken-features)
2. [Visual Hierarchy & Layout](#2-visual-hierarchy--layout)
3. [Typography Refinement](#3-typography-refinement)
4. [Color & Lighting](#4-color--lighting)
5. [Animation Quality](#5-animation-quality)
6. [Profile Image / Avatar Area](#6-profile-image--avatar-area)
7. [CTA Button Design](#7-cta-button-design)
8. [Stats Presentation](#8-stats-presentation)
9. [Typing Effect](#9-typing-effect)
10. [Accessibility](#10-accessibility)
11. [Performance](#11-performance)
12. [Responsive Design](#12-responsive-design)
13. [Content & Messaging](#13-content--messaging)
14. [Background Integration](#14-background-integration)
15. [Implementation Priority Matrix](#15-implementation-priority-matrix)

---

## 1. Critical Bugs & Broken Features

### 1.1 Floating Orbs Are Broken

**File:** `HeroSection.tsx:260-284`

The 3 floating orbs rotate in a circle around the profile image — except they don't move at all. The `motion.div` wraps a child `motion.div` with `position: absolute; left: 160 + i * 20; top: 0` but the parent orb never translates along any orbit path. The orbs stack on top of each other at center.

**Fix:** Use trigonometric orbit positioning via `style` with `x` and `y` transforms driven by a `useTransform` or use `animate` with custom keyframes for circular motion:

```tsx
// For each orb i, compute position with angle offset
const angle = useMemo(() => (i * Math.PI * 2) / 3, [i])
<motion.div
  className="absolute w-3 h-3 rounded-full"
  style={{
    background: colors[i],
    boxShadow: `0 0 20px ${colors[i]}`,
    top: '50%',
    left: '50%',
    marginTop: -6,
    marginLeft: -6,
  }}
  animate={{
    x: [Math.cos(angle) * orbitRadius, Math.cos(angle + Math.PI * 2) * orbitRadius],
    y: [Math.sin(angle) * orbitRadius, Math.sin(angle + Math.PI * 2) * orbitRadius],
  }}
  transition={{
    duration: 8 + i * 4,
    repeat: Infinity,
    ease: 'linear',
  }}
/>
```

### 1.2 `scale` + `blur` on Content Container Causes Jank

**File:** `HeroSection.tsx:59`

Applying both `scale` and `filter: blur()` on the same `motion.div` via `useTransform` triggers excessive repaints on scroll. This is especially expensive on lower-end devices.

**Fix:** Move the blur to a pseudo-element or a separate overlay layer. Remove `scale` entirely or apply it to a wrapper that doesn't also blur:

```tsx
// Content container — only translateY + opacity
<motion.div style={{ y: textY, opacity }}>
  ...
</motion.div>

// Separate blur overlay that fades in
<motion.div
  className="absolute inset-0 pointer-events-none"
  style={{ opacity: useTransform(scrollYProgress, [0.3, 0.5], [0, 1]) }}
>
  <div className="w-full h-full backdrop-blur-sm" />
</motion.div>
```

---

## 2. Visual Hierarchy & Layout

### 2.1 Left Column Has No Maximum Width

The text content spans the full `lg:grid-cols-2` column. On large screens, lines like "I build the future, one pixel at a time." stretch too wide, reducing readability.

**Fix:** Constrain the left column's text:

```tsx
<div className="order-2 lg:order-1 max-w-xl lg:max-w-2xl">
```

### 2.2 Spacing Between Sections Is Inconsistent

- "Available for hire" badge → Name: `mb-6` (24px)
- Name → Roles: `mb-6` (24px)
- Roles → Tagline: `mb-8` (32px)
- Tagline → Stats: `mb-8` (32px)

A 32px gap between the tagline and stats creates a visual disconnect. The roles and tagline should feel like one grouped statement.

**Recommendation:** Use a consistent 8px grid system:
- Badge → Name: `mb-8` (32px — gives name breathing room)
- Name → Roles: `mb-4` (16px — tight, connected)
- Roles → Tagline: `mb-6` (24px)
- Tagline → Stats: `mb-10` (40px — deliberate separation before metrics)
- Stats → CTAs: `mb-8` (32px)

### 2.3 Content Doesn't Vertically Center on All Heights

`pt-20` on the content container doesn't guarantee true vertical centering across screen heights. On very short viewports, content may overflow; on very tall ones, more space at bottom.

**Fix:** Use `min-height: calc(100vh - 80px)` on the flex container and `margin-top: auto / margin-bottom: auto` instead of `pt-20`:

```tsx
<section className="min-h-screen flex flex-col relative overflow-hidden">
  {/* Spacer for nav */}
  <div className="h-20 flex-shrink-0" />
  {/* Centered content */}
  <div className="flex-1 flex items-center">
    <motion.div className="max-w-7xl mx-auto px-4 w-full">
      ...
    </motion.div>
  </div>
  {/* Scroll indicator */}
  <div className="h-20 flex-shrink-0" />
</section>
```

---

## 3. Typography Refinement

### 3.1 Name Text Is Too Large on Mobile

`text-5xl` (48px) on mobile for "MD MEHRAB HOSSAIN" can overflow on smaller screens (320–375px width).

**Fix:** Reduce mobile sizes and use more granular breakpoints:

```tsx
className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-orbitron font-bold gradient-text inline-block"
```

### 3.2 Letter-Spacing on Name

`font-orbitron` is an all-caps display font. It benefits from tight tracking (letter-spacing).

**Add:** `tracking-tighter` or `-tracking-[0.02em]` on the name for a more refined look:

```tsx
className="... tracking-tight font-orbitron font-bold gradient-text inline-block"
```

### 3.3 Role Labels Lack Visual Weight Hierarchy

"Web Developer", "Code Architect", "Digital Dreamweaver" are all the same size and weight. "Web Developer" should lead visually.

**Fix:** Increase the first role's weight or size slightly, and reduce prominence of tertiary roles:

```tsx
<motion.span className="text-lg md:text-xl text-[var(--primary)] font-semibold">
  Web Developer
</motion.span>
<motion.span className="text-base md:text-lg text-gray-400 font-light">
  | Code Architect | Digital Dreamweaver
</motion.span>
```

### 3.4 Tagline Font

The tagline uses `text-gray-300 font-light`. Consider using `font-exo` (secondary body font) instead of the system default for consistency with the rest of the site:

```tsx
className="text-lg md:text-xl text-gray-300 font-exo font-light"
```

---

## 4. Color & Lighting

### 4.1 Gradient Text Glow Overpowering

`.gradient-text` applies `drop-shadow(0 0 20px rgba(0, 212, 255, 0.3))`. On the name, this glow creates a bloom effect that reduces legibility.

**Fix:** Reduce to `drop-shadow(0 0 8px rgba(0, 212, 255, 0.15))` for the hero name. Reserve stronger glows for smaller accent elements.

### 4.2 "Available for Hire" Badge

The green dot pulse animation uses `bg-green-400` which doesn't match the site's accent palette (`--accent: #00FF88`). Use the theme variable instead.

**Fix:**

```tsx
<span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
```

### 4.3 Glass Background on Badge

The glass style is subtle (`rgba(255, 255, 255, 0.03)`). On dark backgrounds, this is barely visible. Add a `border-accent-subtle` border and a hint of `bg-accent-subtle` to make it distinct:

```tsx
className="inline-block px-4 py-2 rounded-full glass border-accent-subtle bg-accent-subtle mb-6"
```

### 4.4 Contrast Ratio on Stats Labels

`text-gray-400` (#9CA3AF) on `bg-slate-950` (#020617) has a contrast ratio of ~5.2:1 — passes AA but not AAA. Use `text-gray-300` (#D1D5DB) for better readability.

---

## 5. Animation Quality

### 5.1 Scroll Parallax Feels Detached

The entire content block (`textY`, `opacity`, `scale`, `blur`) moves together. This creates a "flat" parallax. Professional hero sections have layered parallax with different speeds for different elements.

**Fix:** Create 2–3 parallax layers:

```tsx
const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])      // Background: fast
const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])  // Content: medium
const textY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])     // Text: slow
```

### 5.2 Typing Effect Interval Too Short

`40ms` per character means a 42-character string types in ~1.7 seconds. The reader can't absorb the text as it appears.

**Fix:** Increase to 50–60ms and add a brief pause before the cursor blinks:

```tsx
const TYPING_SPEED = 55 // ms per character
const PAUSE_BEFORE_COMPLETE = 800 // ms pause when done

useEffect(() => {
  let index = 0
  const interval = setInterval(() => {
    if (index <= fullText.length) {
      setDisplayText(fullText.slice(0, index))
      index++
    } else {
      clearInterval(interval)
      setTimeout(() => setIsTypingComplete(true), PAUSE_BEFORE_COMPLETE)
    }
  }, TYPING_SPEED)
  return () => clearInterval(interval)
}, [])
```

### 5.3 Cursor Blink Timing Mismatch

The cursor (`animate-pulse`) blinks at 1s cycle regardless of the typing state. After typing completes, the cursor should blink a few times then stop.

**Fix:** After `isTypingComplete`, fade out the cursor with a short delay:

```tsx
{displayText}
<motion.span
  className="inline-block w-0.5 h-6 bg-[var(--primary)] ml-1"
  animate={isTypingComplete ? { opacity: 0 } : { opacity: [1, 0] }}
  transition={isTypingComplete ? { duration: 0.5 } : { duration: 0.8, repeat: Infinity }}
  aria-hidden="true"
/>
```

### 5.4 Stat Items Animate In After Everything Else

Stats have `delay: 0.7` but the CTA buttons have `delay: 0.9`. The stats, being numbers, should appear earlier to anchor credibility before the user sees the call-to-action.

**Fix:** Shift stat delays to `0.5 + index * 0.1` and CTA to `0.8`.

### 5.5 CinematicText `rotateX` Initial State Causes Warping

```tsx
initial={{ opacity: 0, y: 40, rotateX: -90 }}
```

`rotateX: -90` on text causes a severe 3D flip that looks distorted on non-retina displays. Combined with `y: 40`, it also creates a jarring double-motion.

**Fix:** Remove `rotateX` and use a simpler entrance, or reduce to `rotateX: -45` with `perspective: 1000px`:

```tsx
initial={{ opacity: 0, y: 30, rotateX: -45 }}
style={{ perspective: 1000 }}
```

### 5.6 Scroll Indicator Bounce Uses `easeInOut`

The scroll indicator bounce uses `easeInOut` which feels mechanical. Use `cinematicEase` (`cubic-bezier(0.16, 1, 0.3, 1)`) for a more organic bounce:

```tsx
transition={{ duration: 1.5, repeat: Infinity, ease: cinematicEase }}
```

---

## 6. Profile Image / Avatar Area

### 6.1 Rotating Conic Gradient Ring Causes Repaints

The outer glowing ring uses `animate={{ rotate: 360 }}` on a div with `padding: 3px` and a conic gradient background. CSS `rotate` on a gradient forces repaints every frame.

**Fix:** Use `transform: rotate()` instead (hardware-accelerated), or use a CSS `@keyframes` animation:

```css
@keyframes rotate-gradient {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

Or better: draw the gradient ring as an SVG `<circle>` with `strokeDasharray` + `strokeDashoffset` for a GPU-accelerated spinning border.

### 6.2 Image Sizes Attribute Inaccurate

```tsx
sizes="(max-width: 768px) 100vw, 384px"
```

The profile image container is `w-72 h-72` (288px) on md and `w-96 h-96` (384px) on lg. The `sizes` attribute should reflect the actual rendered size:

```tsx
sizes="(max-width: 768px) 0px, (max-width: 1024px) 288px, 384px"
```

### 6.3 Image Hidden on Mobile Creates Layout Shift

The profile image is `hidden md:block` — it disappears on mobile, which is correct for space, but the grid column still allocates space. This can cause the left column to not take full width.

**Fix:** Use `lg:grid-cols-2 grid-cols-1` with conditional rendering:

```tsx
<div className="grid lg:grid-cols-2 grid-cols-1 gap-12 items-center">
```

The image column simply won't exist on mobile, and the grid naturally collapses to one column.

### 6.4 Middle Ring Doesn't Contribute Visually

The second ring (`border-2 border-accent-muted`) spinning in the opposite direction adds visual noise. The outer gradient ring and the image already communicate the "cosmic/tech" theme.

**Fix:** Remove the middle ring or make it far more subtle (opacity 0.2, no animation).

### 6.5 Profile Image Has No Subtle Hover Interaction

The `whileHover={{ scale: 1.05 }}` works but feels basic. Add a subtle `boxShadow` transition and a slight brightness shift:

```tsx
<motion.div
  className="absolute inset-8 rounded-full overflow-hidden glass-strong"
  whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(0, 212, 255, 0.3)' }}
  transition={{ duration: 0.4, ease: cinematicEase }}
>
```

---

## 7. CTA Button Design

### 7.1 Button Heights Mismatch

"View Projects" uses `py-3 md:py-4` while "GitHub" uses the same. On mobile `py-3` (12px padding) combined with `gap-2` and an icon makes the GitHub button feel cramped.

**Fix:** Standardize to `py-3 md:py-3.5 px-6 md:px-8` and ensure icons are `w-4 h-4` on mobile, `w-5 h-5` on desktop.

### 7.2 GitHub Button Lacks Hover Richness

The GitHub button only has `hover:bg-white/10 transition-colors`. Add a subtle border glow on hover:

```tsx
<motion.a
  href="https://github.com/minhazexo"
  className="px-6 md:px-8 py-3 md:py-4 rounded-full glass text-white font-medium flex items-center gap-2 border border-white/10 hover:border-[var(--primary)]/30 transition-all duration-300"
  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 212, 255, 0.15)' }}
  whileTap={{ scale: 0.95 }}
>
```

### 7.3 No Distinction Between Primary/Secondary Actions

Both buttons have similar visual weight when the user should be guided toward the primary action (View Projects).

**Fix:** Make "View Projects" more prominent and "GitHub" deliberately more subtle:

```tsx
{/* Primary */}
<motion.a
  href="#projects"
  className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-semibold flex items-center gap-2 shadow-neon"
  whileHover={{ scale: 1.05, boxShadow: '0 0 50px var(--shadow-neon)' }}
>
  <Rocket className="w-5 h-5" />
  View Projects
</motion.a>

{/* Secondary */}
<motion.a
  href="https://github.com/minhazexo"
  className="px-6 py-3 rounded-full border border-white/10 text-gray-300 font-medium flex items-center gap-2 hover:text-white hover:border-white/30 transition-all duration-300"
  whileHover={{ scale: 1.03 }}
>
  <Github className="w-4 h-4" />
  GitHub Profile
</motion.a>
```

### 7.4 No Haptic Feedback Beyond Scale

Both buttons scale on hover/tap. Add micro-interactions: icon animation on hover, subtle background shift:

```tsx
whileHover={{ scale: 1.05 }}
// Inside: icon animates
<Rocket className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
```

---

## 8. Stats Presentation

### 8.1 Stats Lack Visual Container

The stats float as bare text. They'd benefit from a subtle container or dividers between them for structure.

**Option A:** Glass-backed stat cards:

```tsx
<motion.div className="flex gap-4 p-4 rounded-xl glass w-fit">
  {stats.map((stat, i) => (
    <div key={stat.label} className="px-4 text-center">
      <div className="text-2xl font-orbitron font-bold gradient-text">{stat.value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
      {i < stats.length - 1 && (
        <div className="absolute right-0 top-1/4 h-1/2 w-px bg-white/5" />
      )}
    </div>
  ))}
</motion.div>
```

**Option B:** Minimal with vertical dividers:

```tsx
<div className="flex gap-6 items-center">
  {stats.map((stat, i) => (
    <div key={stat.label} className="relative">
      <div className="text-2xl font-orbitron font-bold gradient-text">{stat.value}</div>
      <div className="text-xs text-gray-400">{stat.label}</div>
      {i < stats.length - 1 && (
        <div className="hidden sm:block absolute right-0 top-1/4 h-1/2 w-px bg-white/10" />
      )}
    </div>
  ))}
</div>
```

### 8.2 "100% Satisfaction" Is a Red Flag

"100% Satisfaction" is clichéd and often viewed skeptically by tech-savvy audiences. Replace with a more credible metric.

**Recommendation:** Change to something verifiable or specific:
- `50+` Projects → Keep (strong, verifiable)
- `3+` Years Exp. → `4+` Clients (implies demand)
- `100%` Satisfaction → `24/7` Support or `15+` Technologies or lead with a specific achievement

---

## 9. Typing Effect

### 9.1 Single Tagline Lacks Impact

"I build the future, one pixel at a time." is a decent tagline, but the typing effect draws attention to one sentence for too long. Consider a multi-line rotation or a shorter punchier line.

**Recommendation:** Use 2–3 taglines that cycle:

```tsx
const taglines = [
  'I build the future, one pixel at a time.',
  'Full-stack developer. Open-source enthusiast.',
  'Turning complex problems into elegant code.',
]
```

Cycle through them with a type-out, pause, type-back, next animation.

### 9.2 No `prefers-reduced-motion` Support

The typing effect has no reduced-motion fallback. Users who prefer reduced motion should see the full text immediately.

**Fix:**

```tsx
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

useEffect(() => {
  if (prefersReducedMotion) {
    setDisplayText(fullText)
    setIsTypingComplete(true)
    return
  }
  // ... typing logic
}, [prefersReducedMotion])
```

---

## 10. Accessibility

### 10.1 Missing `aria-hidden` on Animated Elements

The `gradient-text` on stat values uses `-webkit-text-fill-color: transparent` which can be invisible to some browser rendering modes. Ensure the text remains readable:

```tsx
<div className="text-xl sm:text-2xl md:text-3xl font-orbitron font-bold gradient-text">
  <span className="sr-only">{stat.value}</span>
  <span aria-hidden="true">{stat.value}</span>
</div>
```

### 10.2 Decorative Orbs Need `aria-hidden`

The 3 floating orbs around the profile image are purely decorative but are interactive `motion.div` elements.

**Fix:** Add `aria-hidden="true"` to all decorative orb elements.

### 10.3 No Keyboard-accessible Skip Link

Hero sections often contain the page's first interactive content (CTA buttons). Without a skip-to-content link, keyboard users must tab through the entire navigation first.

**Fix:** Add a skip link in the layout:

```tsx
// In Navigation or layout.tsx
<a href="#hero-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--primary)] focus:text-black focus:rounded">
  Skip to hero content
</a>
```

### 10.4 Focus Indicators on CTAs

The `whileTap={{ scale: 0.95 }}` removes the browser default focus ring. Add a custom focus-visible style:

```tsx
// In globals.css
a:focus-visible, button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### 10.5 Reduced Motion Should Disable All Scroll Animations

Users with `prefers-reduced-motion: reduce` should see a static hero. The `useScroll` + `useTransform` still triggers even if animations are unwanted.

**Fix:** Conditionally apply scroll transforms:

```tsx
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

const textY = prefersReducedMotion
  ? useTransform(() => '0%')
  : useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
```

---

## 11. Performance

### 11.1 `useScroll` on container Causes Re-Layout

Using `useScroll` with `target: containerRef` on the hero section triggers scroll-linked DOM updates. Since the hero is the first section, this fires on every scroll event — including when the user is scrolling past it.

**Fix:** Use `useScroll` without a target (window-level) and clamp the progress:

```tsx
const { scrollY } = useScroll()
const heroProgress = useTransform(scrollY, [0, windowHeight], [0, 1])
const clampedProgress = useTransform(heroProgress, [0, 1], [0, 1])
```

### 11.2 Concurrent `useTransform` Calls

Each `useTransform` creates a separate subscription to `scrollYProgress`. 5+ simultaneous transforms on the same `MotionValue` creates overhead.

**Fix:** Consolidate transforms by using one `useTransform` and deriving others:

```tsx
const scrollYProgress = useScroll({ ... })
const progress = useTransform(scrollYProgress, [0, 1], [0, 100])

// Then in style:
style={{
  y: useTransform(progress, [0, 100], ['0%', '50%']),
  opacity: useTransform(progress, [0, 50], [1, 0]),
}}
```

### 11.3 Background Image Has No Blur Placeholder

`/hero-astronaut.jpg` is loaded with `priority` but has no `placeholder="blur"` — users may see a flash of white/empty space.

**Fix:** Use Next.js static import for automatic blur placeholder:

```tsx
import heroBg from '@/../public/hero-astronaut.jpg'

<Image
  src={heroBg}
  placeholder="blur"
  ...
/>
```

### 11.4 Unnecessary Re-renders from `displayText` State

The typing effect calls `setDisplayText` every 40ms for 42 characters (42 state updates in 1.7s). This triggers re-renders of the entire HeroSection.

**Fix:** Extract the typing effect into a separate lightweight component:

```tsx
function TypingEffect({ text, speed = 55 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState('')
  // ... effect here
  return <p aria-live="polite">{displayText}<Cursor /></p>
}
```

This way, only the typing sub-tree re-renders, not the entire hero.

### 11.5 Memoized Stats Array Not Used Effectively

`memoizedStats` is created via `useMemo(() => stats, [])` but `stats` is already a module-level constant. The `useMemo` is unnecessary.

**Fix:** Remove `memoizedStats` and use `stats` directly. Or if the intent is defensive, it's harmless but worth noting.

---

## 12. Responsive Design

### 12.1 Stacking Order Is Sub-optimal

On mobile (`order-2 lg:order-1`), the profile image renders first (above text) but is `hidden md:block` — so it's invisible but still in DOM order. This confuses screen readers.

**Fix:** Use conditional rendering based on a media query or hide it properly:

```tsx
// On mobile: don't render the image column at all
{isDesktop && (
  <motion.div className="order-1 lg:order-2 relative">
    ...
  </motion.div>
)}
```

But since we can't use hooks for SSR-safe media queries, the simplest fix is:

```tsx
<div className="hidden lg:block order-2">
  ...image content...
</div>
```

### 12.2 Font Sizes Don't Scale Smoothly

`text-5xl md:text-6xl lg:text-7xl` jumps from 48px → 60px → 72px. Use `clamp()` for fluid typography:

```tsx
className="text-[clamp(2rem, 5vw, 4.5rem)] font-orbitron font-bold gradient-text"
```

### 12.3 Stats Flex-Wrap Spacing on Small Screens

`gap-3 sm:gap-6 md:gap-8` with `flex-wrap` causes stats to wrap awkwardly on small screens (2 on one row, 1 below).

**Fix:** Use a grid for stats that adapts:

```tsx
<div className="grid grid-cols-3 gap-4 max-w-xs">
```

### 12.4 Touch Targets on Mobile < 44px

The "Available for hire" badge has `px-4 py-2` — the tap target is ~32px height. WCAG requires minimum 44px.

**Fix:** Add `min-h-[44px]` on interactive elements or increase padding:

```tsx
className="inline-block px-5 py-2.5 rounded-full glass ..."
```

---

## 13. Content & Messaging

### 13.1 Value Proposition Is Weak

"I build the future, one pixel at a time." focuses on "how" rather than "what value you bring". Replace or supplement with a stronger positioning statement.

**Recommendation:** Lead with a specific outcome or expertise:

```
Current: "I build the future, one pixel at a time."
Better:  "Full-stack developer specializing in high-performance React applications."
Best:    "I build performant, accessible web applications that scale."
```

### 13.2 "Digital Dreamweaver" Is Unclear

"Digital Dreamweaver" as a role title doesn't communicate a specific skill. If it's meant to be creative/artistic, it works as a flourish — but paired with "Web Developer" and "Code Architect", it feels inconsistent.

**Recommendation:** Replace with a more specific role:
- "UI/UX Engineer"
- "Open Source Contributor"
- "React Specialist"
- "Performance Optimizer"

### 13.3 No Social Proof in Hero

The big companies/notable clients that developers have worked with usually appear in the hero for credibility. Consider adding a "Trusted by" or "Worked with" micro-row below the stats, even if it's just logos.

### 13.4 No Email/CV CTA

Only "View Projects" and "GitHub" are offered as actions. Add a "Get in Touch" or "Download CV" as a third option (subtle, text-based link):

```tsx
<motion.a
  href="#contact"
  className="text-sm text-gray-400 hover:text-[var(--primary)] transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-[var(--primary)]"
>
  or get in touch →
</motion.a>
```

---

## 14. Background Integration

### 14.1 Static Gradient Clashes with Shared Background

The hero has `bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950` as a static background, but `page.tsx` renders `BackgroundEffectRenderer` behind everything. This gradient may visually conflict with the dynamic background effect.

**Fix:** Make the hero background transparent once `BackgroundEffectRenderer` is active, or use a weaker gradient:

```tsx
<div className="absolute inset-0 z-0 bg-gradient-to-br from-[var(--bg-void)] via-[var(--bg-primary)] to-[var(--bg-void)]" aria-hidden="true" />
```

### 14.2 Background Image Gradient Overlay

The gradient overlay on the hero background image uses `from-transparent via-dark-bg/50 to-dark-bg`. Since CSS gradients composite differently on images, this can create a muddy gray transition area.

**Fix:** Use a multi-stop gradient for smoother transition:

```tsx
<div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/40 via-60% to-[var(--bg-primary)]" />
```

### 14.3 Hero Background Redundant with Page Bg

The page already sets `bg-dark-bg` on the root `div`. The hero's gradient background covers the same area. If the dynamic background is active, the hero gradient should cede.

**Design decision:** Consider removing the static gradient overlay entirely and relying on the hero image opacity + the page's dark background + the dynamic `BackgroundEffectRenderer`.

---

## 15. Implementation Priority Matrix

| Priority | Effort | Category | Improvement |
|----------|--------|----------|-------------|
| P0 | Low | Bug | Fix broken floating orbs (1.1) |
| P0 | Low | Bug | Fix scale+blur repaint jank (1.2) |
| P0 | Medium | Performance | Extract typing effect into sub-component (11.4) |
| P1 | Low | Accessibility | Add `aria-hidden` to decorative elements (10.2) |
| P1 | Low | Accessibility | Add reduced-motion support (10.5, 9.2) |
| P1 | Low | Visual | Fix stat contrast ratio (4.4) |
| P1 | Medium | Visual | Refine spacing hierarchy (2.2) |
| P1 | Medium | Visual | Improve parallax with layered speeds (5.1) |
| P1 | Medium | Visual | Refine CTA button distinction (7.3) |
| P1 | Low | UX | Improve typing effect timing (5.2, 5.3) |
| P2 | Medium | Visual | Redesign stats with containers (8.1) |
| P2 | Low | Visual | Add fluid typography (12.2) |
| P2 | Medium | Visual | Orbit orbs trigonometric fix (1.1) |
| P2 | High | Performance | Consolidate useTransform calls (11.2) |
| P2 | Low | Content | Strengthen tagline/messaging (13.1) |
| P2 | Low | Content | Update stats content (8.2) |
| P3 | Low | Visual | Remove middle spinning ring (6.4) |
| P3 | Medium | Visual | Add placeholder blur to bg image (11.3) |
| P3 | Medium | UX | Add email/CV CTA (13.4) |
| P3 | High | Architecture | True vertical centering without pt-20 (2.3) |
| P3 | Low | Visual | Gradient text glow reduction (4.1) |
| P3 | Low | Accessibility | Add focus-visible styles (10.4) |

### Legend

| Priority | Meaning |
|----------|---------|
| **P0** | Broken feature or major performance issue — fix now |
| **P1** | Immediate quality-of-life improvement — next sprint |
| **P2** | Good polish that elevates the design — planned backlog |
| **P3** | Nice-to-have refinement — when time permits |

---

*Generated from deep-dive analysis of `src/components/sections/HeroSection.tsx` and related files. Each suggestion references specific line numbers from the current implementation for fast navigation.*
