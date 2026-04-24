# Code-Rescue Services Page — Handoff Package

This folder is everything Claude Code (or any dev) needs to rebuild the Code-Rescue services page as a real production website. The HTML mockups in the project root (`Code-Rescue Services.html`, `Code-Rescue Services Craft.html`) are the visual reference. **These Markdown files are the requirement spec — Claude Code should treat them as source of truth, not the HTML.**

## Files in this package

| File | Purpose |
| --- | --- |
| `README.md` | This file. Build order + stack recommendation. |
| `design-tokens.md` | Colors, typography, spacing, borders — exact values. |
| `wireframes.md` | Every section, ASCII wireframe + layout spec + content slots. |
| `components.md` | Reusable components (StatusBar, Case, LiveGate, CommandPalette, etc.). |
| `content.md` | All copy, case studies, rules data, commit log, inventory. Verbatim. |
| `interactions.md` | The craft-layer behaviors — keyboard, cite-pill, live gate, reviewer-state, etc. |
| `checklist.md` | Phase-by-phase implementation checklist. |

## Recommended stack

The design fits naturally in any modern React stack. Suggested:

- **Framework**: Next.js 15 App Router, TypeScript strict
- **Styling**: Plain CSS with CSS custom properties (no Tailwind — the token system is intentionally small and explicit)
- **Fonts**: `next/font/google` loading JetBrains Mono (400/500/600/700), Newsreader (400/500/600, italic), Inter (400/500/600/700)
- **Routing**: single page at `/`, plus `/humans.txt`, `/robots.txt`, `/.well-known/engagements.json` as static routes
- **No client-side framework needed beyond React** — all interactivity is local state + scroll/keyboard listeners
- **No analytics, no tracking pixels, no cookie banners** — this is intentional for the brand

## Build order

Work bottom-up in this order. Do not move to the next phase until the previous gate passes.

1. **Design tokens** — install the CSS custom properties from `design-tokens.md`. No components yet.
2. **Static sections** — build the page from hero → footer using only HTML + the tokens. No interactivity. Match the wireframes exactly.
3. **Data wiring** — move the copy/rules/cases/commits from `content.md` into a `content.ts` module; render from data. Page should look identical.
4. **Register switcher** — the `data-reg` CSS variables for terminal/editorial/spec (see `design-tokens.md`). Expose via a dev-only URL param `?reg=editorial` for now.
5. **Craft layer** — each interaction from `interactions.md`, one at a time, in the order listed there. This is the last phase because every item composes cleanly over the static page.

## Critical non-goals

Things Claude Code should **not** build unless the user explicitly asks:

- Dark/light mode toggle in the shipped UI (the page has one aesthetic — terminal — and the other registers exist only as optional Tweaks during design review)
- CMS integration (copy is static)
- Internationalization
- A blog (external, lives at `maxwellacollins.com`)
- Analytics
- A marketing nav beyond what the TopBar has
- Any "book a call" widget — the CTA is a plain `mailto:`

## Definition of done

- Lighthouse 100 on Performance, Accessibility, Best Practices, SEO
- Zero third-party network requests on initial load (fonts are self-hosted via `next/font`, no tracking)
- Works with JS disabled for every section except the craft layer (graceful degradation — static content visible, interactive extras silently absent)
- Keyboard-complete: every command-palette action reachable from a physical key sequence; focus rings visible; tab order matches DOM order
- `prefers-reduced-motion: reduce` disables the caret blink, gate-running pulse, live-state pulse
- Content-Security-Policy header set strict; no `unsafe-inline`; no remote scripts
- Total JS shipped to client: target &lt; 40 KB gzipped
