# Code-Rescue VP Page — Handoff Package

This folder is everything Claude Code needs to build **Code-Rescue.com** as a production website. The reference mockup is `../Code-Rescue.html` + `../vp.jsx` at the project root. These Markdown files are the source of truth; the HTML is the visual reference.

## Audience for this page

The Code-Rescue homepage is written for a **VP of Engineering or CTO** at a company whose team ships AI-written code. The copy is deliberately plain-language; there is no developer jargon, no command-palette, no "live gate" demo. If you're porting from an earlier craft version of this project — **do not port the command palette, live gate, reviewer-state tracker, or selection cite pill.** They were a different direction.

## Files in this package

| File | Purpose |
| --- | --- |
| `README.md` | This file. Build order + stack recommendation. |
| `design-tokens.md` | Colors, typography, spacing — exact values from the CSS. |
| `wireframes.md` | Every section, ASCII wireframe + layout spec. |
| `components.md` | Component list from `vp.jsx`, prop shapes, composition. |
| `content.md` | All copy and data, verbatim. The content layer. |
| `checklist.md` | Phase-by-phase implementation checklist. |

## Recommended stack

- **Framework:** Next.js 15, App Router, TypeScript strict mode
- **Styling:** Plain CSS with CSS custom properties — no Tailwind, no CSS-in-JS. The token system is intentionally small; a utility framework would obscure it.
- **Fonts:** `next/font/google` loading:
  - `Newsreader` (400/500/600/700, italic 400/500) — serif, display + body
  - `JetBrains Mono` (400/500/600) — mono, labels + kickers
  - `Inter` (400/500/600/700) — sans, UI + buttons
- **Routing:** single page at `/`, plus static routes for `/humans.txt`, `/robots.txt`, `/.well-known/engagements.json`
- **Interactivity:** one `useEffect` for the footer live-clock. Everything else is static.
- **No analytics, no cookies, no tracking pixels.** Intentional.
- **Hosting:** Vercel or Netlify. Static export (`output: 'export'`) is fine — there's no server logic.

## Build order

Work bottom-up. Each phase has a visible gate; don't move to the next until the previous renders correctly.

1. **Design tokens** — install the `:root` custom properties from `design-tokens.md` into `app/globals.css`. Nothing rendered yet.
2. **Content layer** — move every string from `content.md` into a `lib/content.ts` module, typed. No components consume it yet.
3. **Static sections, top to bottom** — `TopNav → Hero → Problem → WhatItIs → HowItWorks → Deliverables → Proof → RuleAnatomy → Pricing → NotThis → Engage → Footer`. Each renders from `lib/content.ts`. Match `wireframes.md` exactly.
4. **Responsive** — verify the breakpoints in `design-tokens.md` (`900px`, `640px`).
5. **Static sub-routes** — `/humans.txt`, `/robots.txt`, a minimal `/.well-known/engagements.json`.
6. **Metadata + OG** — page title, meta description, one OG image.

## Critical non-goals

Do not build unless the user explicitly asks:

- Blog / essays (those live at `maxwellacollins.com` — link to them)
- CMS / headless content layer (the copy changes rarely; TS module is correct)
- Contact form (booking is via `code-rescue.com/book/`, an external Cal.com-style page)
- A dashboard, client portal, or authentication
- Any animation beyond CSS hover transitions
- Dark mode (the palette is warm-cream + forest-green, by design)

## What "done" looks like

- Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100 on mobile
- Total page weight under 200 KB gzipped (excluding fonts)
- No layout shift; no hydration mismatches
- All external links open in new tab with `rel="noopener"`
- Keyboard-navigable from top to bottom with visible focus rings
