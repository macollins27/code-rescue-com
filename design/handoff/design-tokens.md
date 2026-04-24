# Design Tokens

Install as CSS custom properties on `:root` in `app/globals.css`. These are the exact values from the reference mockup.

## Colors

```css
:root {
  /* Neutrals — warm cream palette */
  --bg:        #f5f2ec;  /* page background */
  --bg-warm:   #ede8dc;  /* alternating section background */
  --bg-card:   #ffffff;  /* elevated cards (deliverables, rule anatomy, compare) */

  /* Ink — text */
  --ink:       #1a1a1a;  /* headings + primary text */
  --ink-2:     #2e2e2e;  /* body serif */
  --ink-dim:   #5a5a54;  /* secondary body */
  --ink-faint: #8a877e;  /* mono labels, kickers */

  /* Lines */
  --line:      #d9d4c6;  /* soft divider */
  --line-2:    #c8c2b2;  /* harder divider on cards */

  /* Accent — forest green */
  --accent:       #2a5f4f;  /* primary accent, links, hover */
  --accent-deep:  #1c443a;  /* hover-on-accent */
  --accent-ink:   #f5f2ec;  /* text on accent bg */
  --accent-faint: #dfe8e3;  /* accent chip bg */

  /* Supporting */
  --warn:      #a25f1f;  /* rule-type badge */
}
```

**Semantics:**

- The page alternates `--bg` / `--bg-warm` per section for vertical rhythm.
- `--accent` is used sparingly: the Engage section background, the hero em, brand mark, pip dot, cite/ilink underline, incident date, deliverable card letter, and hover states on CTAs.
- The `--ink` black section (NotThis) and `--accent` green section (Engage) are the two dark-mode inversions. Everything else is warm-cream.

## Typography

Three families. Load with `next/font/google`.

```ts
import { Newsreader, JetBrains_Mono, Inter } from 'next/font/google';

export const serif = Newsreader({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--serif',
});
export const mono = JetBrains_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--mono',
});
export const sans = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--sans',
});
```

Bind to CSS vars:

```css
:root {
  --serif: "Newsreader", Georgia, "Times New Roman", serif;
  --sans:  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  --mono:  "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
```

**Role assignments:**

| Role | Family | Weight | Size | Notes |
| --- | --- | --- | --- | --- |
| Hero title | serif | 500 | `clamp(40px, 6vw, 72px)` | `letter-spacing: -0.02em; line-height: 1.05`; italic em is accent color |
| H2 | serif | 500 | `clamp(32px, 4.5vw, 52px)` | |
| H3 | serif | 500 | `clamp(24px, 2.2vw, 30px)` | |
| Body serif (lede, incident body) | serif | 400 | 18–22px | `line-height: 1.5–1.6`; `text-wrap: pretty` |
| Body sans | sans | 400 | 17px | default body size |
| Kicker | mono | 500 | 12px | `text-transform: uppercase; letter-spacing: 0.08em` |
| Meta label | mono | 500 | 11px | uppercase, `letter-spacing: 0.08em`, `--ink-faint` |
| Button | sans | 500 | 15px | |
| Pull quote | serif | 400 italic | 24px | |

## Layout

```css
:root {
  --maxw:   1160px;  /* section wrap */
  --narrow: 720px;   /* text-heavy wrap (.wrap.narrow) */
}
```

**Wrap rules:**

- `.wrap` — `max-width: var(--maxw); padding: 0 32px;` — for grids and cards.
- `.wrap.narrow` — `max-width: var(--narrow);` — for prose sections (Problem, incident bodies, pricing intro).

**Section rhythm:**

- `.section` — `padding: 96px 0; border-bottom: 1px solid var(--line);`
- At `max-width: 640px` — `.section { padding: 64px 0; }`

## Breakpoints

```css
@media (max-width: 900px) {
  /* Collapse 3-col grids to 1–2 cols */
  .installed-grid { grid-template-columns: repeat(2, 1fr); }
  .deliv-grid, .pipeline, .notthis-grid { grid-template-columns: 1fr; }
  .compare-v2-row { grid-template-columns: 1fr; gap: 16px; padding: 20px; }
  .price-range-row { grid-template-columns: 100px 1fr; }
  .channels { grid-template-columns: 1fr; }
  .rule-row { grid-template-columns: 1fr; gap: 6px; }
  .footer-top { grid-template-columns: 1fr; }
  .hero-meta, .engage-facts { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .wrap { padding: 0 20px; }
  .hero { padding: 64px 0 48px; }
  .section { padding: 64px 0; }
  .topnav-links a:not(.topnav-cta) { display: none; }
  .hero-ctas { flex-direction: column; }
  .btn { width: 100%; }
}
```

## Motion

- All transitions: `150–200ms ease`. Nothing snappier, nothing slower.
- Hover transforms: `translateY(-2px)` on interactive cards (`.deliv-card`, `.channel`).
- Global: honor `prefers-reduced-motion: reduce` — disable animations + smooth-scroll.

## Border radius

- Buttons, ilinks, rule badges: `2px`. Nothing is pillowy.
- Cards: no radius (hard corners).

## Selection

```css
::selection { background: var(--accent); color: var(--accent-ink); }
```
