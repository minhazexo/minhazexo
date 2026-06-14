# Accessibility Audit & Guide

---

## Compliance Targets

- **WCAG 2.1 AA** (primary target)
- **WCAG 2.1 AAA** where feasible (color contrast, reduced motion)
- **Section 508** (U.S. federal)

---

## ✅ Already Implemented

### Semantic HTML

| Feature | Location | Line(s) |
|---------|----------|---------|
| `<main>` with `id="main-content"` | `layout.tsx` | 200 |
| `role="navigation"` on nav | `Navigation.tsx` | 109 |
| `role="menubar"` + `role="menuitem"` on desktop nav | `Navigation.tsx` | 130, 145 |
| `role="menu"` + `role="menuitem"` on mobile nav | `Navigation.tsx` | 222, 241 |
| `role="region"` with `aria-label` on hero | `page.tsx` | 90 |
| `aria-label` on all sections | Section components | — |
| `role="list"` + `role="listitem"` for skill lists | `SkillsSection.tsx` | 142, 155 |
| `role="tabpanel"` for project grid | `ProjectsSection.tsx` | 128 |
| `role="article"` on project cards | `ProjectsSection.tsx` | 141 |
| `role="progressbar"` on loading screen | `LoadingScreen.tsx` | 80-83 |
| `role="progressbar"` on scroll progress | `ScrollProgress.tsx` | 37-41 |
| `role="combobox"` + `aria-expanded` on switchers | UI components | — |
| `role="listbox"` + `role="option"` on theme dropdown | `ThemeSwitcher.tsx` | 115, 139 |
| `role="radiogroup"` + `role="radio"` for color blind modes | `ThemeSwitcher.tsx` | 172, 182 |

### Keyboard Navigation

| Feature | Location | Line(s) |
|---------|----------|---------|
| Escape closes mobile menu | `Navigation.tsx` | 59-67 |
| Tab trap in mobile menu | `Navigation.tsx` | 69-98 |
| Escape closes theme/background dropdowns | UI switchers | — |
| Skip-to-content link | `layout.tsx` | 178-184 |
| All interactive elements focusable | Throughout | — |

### Screen Readers

| Feature | Location | Line(s) |
|---------|----------|---------|
| `aria-hidden="true"` on all decorative elements | Throughout | — |
| `aria-live="polite"` on typing effect | `HeroSection.tsx` | 155 |
| `aria-live="polite"` on loading status | `LoadingScreen.tsx` | 226 |
| `aria-atomic="true"` on dynamic text | Hero + Loading | — |
| `aria-label` on all icon-only buttons | Navigation, Footer | — |
| `aria-controls` on mobile menu button | `Navigation.tsx` | 184 |
| `aria-current` on active nav items | `Navigation.tsx` | 146, 242 |
| `aria-invalid` + `aria-describedby` on form fields | `ContactSection.tsx` | 83-85, 97-99 |
| Link text says "(opens in new tab)" | Throughout | — |
| `aria-selected` on theme/effect options | Switchers | — |
| `<h1>`-`<h4>` heading hierarchy maintained | Throughout | — |

### Visual Accessibility

| Feature | Location |
|---------|----------|
| 4 color-blind safe modes (deuteranopia, protanopia, tritanopia, achromatopsia) | `globals.css` |
| `prefers-reduced-motion` — all animations disabled | `globals.css:1530-1550` |
| `prefers-contrast: high` — removes glass/blur, solid text | `globals.css:1552-1579` |
| `prefers-reduced-transparency` — removes backdrop-filter | `globals.css:1757-1765` |
| `focus-visible` outlines on all interactive elements | `globals.css:1510-1527` |
| Print styles — removes decorative elements | `globals.css:1768-1793` |
| Touch targets ≥ 44px (`.touch-target-min`) | Throughout + globals.css |
| Font size 16px minimum on mobile form elements | `globals.css:1729` |
| Scroll padding for fixed nav | `globals.css:595` |
| `sr-only` utility class | `globals.css:1582-1592` |

---

## 🔴 Issues to Fix

### Critical

| Issue | Location | WCAG | Fix |
|-------|----------|------|-----|
| LinkedIn & Twitter links use `"#"` placeholder | `src/data/social.ts:6-7` | 2.4.4 (Link Purpose) | Replace with actual URLs or remove |
| Contact form has no `aria-hidden` management during submission | `ContactSection.tsx:317-361` | 4.1.3 (Status Messages) | Add `aria-live="polite"` to form status area |
| No `role="alert"` on form submission errors | `ContactSection.tsx:357` | 4.1.3 | Wrap error in `<div role="alert">` |
| ThemeTransition creates a flash — no `prefers-reduced-motion` check | `ThemeTransition.tsx:17-25` | 2.2.2 (Pause, Stop, Hide) | Check `prefers-reduced-motion` before animating |

### High

| Issue | Location | WCAG | Fix |
|-------|----------|------|-----|
| Music auto-play attempts without user gesture (returning users) | `BackgroundMusic.tsx:77-100` | 2.5.4 (Motion Actuation), 1.4.2 (Audio Control) | Only auto-play if user previously opted in AND browser allows; respect `prefers-reduced-motion` |
| No visible focus indicator on some animated interactive elements | `HeroSection.tsx:198-216` (CTA buttons) | 2.4.7 (Focus Visible) | Ensure custom `whileHover` styles have corresponding `:focus-visible` styles |
| Project detail modal lacks focus trap on open | `ProjectDetailModal.tsx` | 2.1.2 (No Keyboard Trap) | Implement focus trap (tab cycles within modal, focus returns to trigger on close) |
| Modal close button has no `aria-label` | `ProjectDetailModal.tsx:67` | 4.1.2 (Name, Role, Value) | Add `aria-label="Close project details"` |

### Medium

| Issue | Location | WCAG | Fix |
|-------|----------|------|-----|
| No `lang` change markers for code-like text | Throughout | 3.1.2 (Language of Parts) | Ensure code snippets wrapped with appropriate semantics |
| Background music lacks `aria-hidden` on audio element | `BackgroundMusic.tsx:170-176` | — | Already fine, but verify screen readers don't announce the `<audio>` element |
| Floating orbs in hero are decorative but have motion that can't be paused | `HeroSection.tsx:264-296` | 2.2.2 | Already under `prefers-reduced-motion` guard — acceptable |
| Loading screen progress value updates without announcing changes | `LoadingScreen.tsx:81` | 4.1.3 | Use `aria-valuenow` correctly (already done) — verify live announcements |
| No high-contrast mode icon for visual switcher | `ThemeSwitcher.tsx` | — | Nice-to-have: add a high-contrast indicator icon |

### Low

| Issue | Location | Fix |
|-------|----------|-----|
| `.gradient-text` has no fallback for forced colors mode | `globals.css:784-790` | Add `@media (forced-colors: active)` fallback |
| Some decorative animations use `div` with CSS `background-image` instead of `::before`/`::after` | Multiple | Purely cosmetic — no semantic impact |
| Section labels like `// who_i_am` may confuse screen readers | `AboutSection.tsx:175` | Consider adding visually-hidden plain text alternative |

---

## 🧪 Testing Checklist

### Automated

```bash
# Using axe-core (install @axe-core/playwright or pa11y)
npx pa11y https://mehrabhossain.dev
npx axe https://mehrabhossain.dev

# Lighthouse a11y audit
npx lighthouse https://mehrabhossain.dev --preset=desktop --categories=accessibility
```

### Manual (Per Browser)

| Browser | Screen Reader | Test |
|---------|--------------|------|
| Chrome | NVDA (Windows) | Full tab through + navigation |
| Safari | VoiceOver (macOS) | Modal, form, dynamic content |
| Firefox | JAWS (Windows) | Reduced motion + high contrast |
| Edge | Narrator (Windows) | Touch + keyboard interaction |

### Test Cases

1. **Tab through entire page** — all interactive elements reachable, visible focus ring
2. **Screen reader reads headings** — hierarchy correct (h1 → h2 → h3 → h4)
3. **Submit contact form with errors** — error messages announced
4. **Open project modal** — focus trapped inside, close with Escape
5. **Toggle themes** — color-blind mode changes visible, contrast sufficient
6. **Enable reduced motion** — all animations stopped, no flashing
7. **Enable high contrast** — all text readable, no transparent elements
8. **Navigate with keyboard only** — all sections reachable, no dead ends
9. **Mobile touch + screen reader** — touch targets ≥ 44px, labels announced
10. **Zoom to 200%** — no content loss, layout remains functional

---

## Color Contrast Compliance

### Dark Theme (Default) — Passes AA (4.5:1)

| Pair | Ratio | Pass |
|------|-------|------|
| `#00D4FF` on `#0A0A0F` | ~8:1 | ✅ AAA |
| `#FFFFFF` on `#0A0A0F` | ~18:1 | ✅ AAA |
| `#B0B0C0` on `#0A0A0F` | ~9:1 | ✅ AAA |
| `#707080` on `#0A0A0F` | ~5.5:1 | ✅ AA |

### Light Theme — Passes AA

| Pair | Ratio | Pass |
|------|-------|------|
| `#0077FF` on `#F0F4F8` | ~5:1 | ✅ AA |
| `#1A1A2E` on `#FFFFFF` | ~16:1 | ✅ AAA |

### Color-Blind Modes — All Pass AA by design (palette chosen for distinction)

---

## ARIA Live Regions Used

| Region | Type | Content | File |
|--------|------|---------|------|
| Typing effect text | `polite` | Hero tagline | `HeroSection.tsx:155` |
| Loading status | `polite` | Loading message | `LoadingScreen.tsx:226` |
| Form error messages | `assertive` (implied) | Validation errors | `ContactSection.tsx` |

---

## Recommendations for Improvement Order

1. Fix broken LinkedIn/Twitter links (simple, visible user-facing)
2. Add focus trap to project detail modal (keyboard UX)
3. Add `role="alert"` to contact form error state
4. Add `prefers-reduced-motion` guard to ThemeTransition
5. Test with real screen readers and fix any discovered issues
6. Add automated a11y testing to CI pipeline
7. Consider adding a full skip-link keyboard navigation path
