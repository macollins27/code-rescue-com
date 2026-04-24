# Implementation checklist

Check off as you go. Each phase has a definition of done.

## Phase 0 — project setup
- [ ] `pnpm create next-app code-rescue --ts --app --no-tailwind --src-dir --import-alias "@/*"`
- [ ] Strict TS config (`strict: true`, `noUncheckedIndexedAccess: true`)
- [ ] ESLint flat config, `max-warnings 0`
- [ ] `next/font` set up for JetBrains Mono, Newsreader, Inter
- [ ] CSP header configured in `next.config.js` (no unsafe-inline, no external origins)
- [ ] `public/robots.txt`, `public/humans.txt`, `public/.well-known/engagements.json` — see `content.md`

**Done when**: `pnpm dev` renders an empty page with all three fonts loaded from same-origin.

## Phase 1 — tokens + layout shell
- [ ] `src/styles/tokens.css` with terminal/editorial/spec token sets (see `design-tokens.md`)
- [ ] `src/app/layout.tsx` imports tokens, sets `data-reg="terminal"` on `<html>`
- [ ] Global reset: margin/padding 0, box-sizing border-box, `::selection`, `*:focus-visible`
- [ ] `.wrap` utility (`max-width: 1240px; margin: 0 auto; padding: 0 40px;`)
- [ ] `.mono`, `.serif`, `.sans`, `.up`, `.dim`, `.faint`, `.accent`, `.num` utility classes

**Done when**: a test page using `<div className="wrap"><h1 className="serif">Test</h1></div>` uses the right font/color automatically.

## Phase 2 — content module
- [ ] `src/content/cases.ts` — 7 CaseStudy records (copy from `content.jsx`)
- [ ] `src/content/crises.ts` — 3 Crisis records
- [ ] `src/content/commits.ts` — 22 commit tuples
- [ ] `src/content/rules.ts` — spec (7) / consistency (7) / adversarial (6)
- [ ] `src/content/inventory.ts` — 11 rows
- [ ] `src/content/passes.ts` — 9 passes
- [ ] Types for each

**Done when**: a throwaway page iterating each dataset renders every string.

## Phase 3 — static sections
Build each in order; match wireframes in `wireframes.md` exactly.
- [ ] `TopBar`
- [ ] `Hero` + `ThesisBar`
- [ ] `§ 00 Posture`
- [ ] `§ 01 Offer` + 3 `Deliverable` cards
- [ ] `§ 02 Outcome` (stats + 2×2 narrative)
- [ ] `§ 03 Crises` (static layout)
- [ ] `§ 04 Cases` — 7 instances
- [ ] `§ 05 NinePassViz` (static only, no interactivity yet)
- [ ] `§ 06 RulesExplorer` (static only — show spec tab always)
- [ ] `§ 07 Compare`
- [ ] `§ 08 Inventory` table + 2 code blocks
- [ ] `§ 09 CommitLog`
- [ ] `§ 10 Unsolved`
- [ ] `CTA`
- [ ] `Footer`

**Done when**: the page scrolls end-to-end and visually matches `Code-Rescue Services.html` open with `?reg=terminal`. Lighthouse Performance ≥ 95.

## Phase 4 — small interactivity
- [ ] `NinePassViz` clickable tabs → update JSON below
- [ ] `RulesExplorer` tab switching
- [ ] Smooth-scroll anchors on TopBar nav (without `scrollIntoView`; compute + `window.scrollTo({ top, behavior: "smooth" })`)
- [ ] Hover state on inventory table rows

**Done when**: all three interactions work keyboard-first.

## Phase 5 — craft layer
Implement in the order listed in `interactions.md`. Each item is individually mergeable — do not bundle.
- [ ] `BUILD` constant wired to CI env vars
- [ ] `StatusBar` with live clock + uptime
- [ ] `ScrollProgress`
- [ ] Hero caret
- [ ] Keyboard router
- [ ] `CommandPalette`
- [ ] `Cheatsheet`
- [ ] `LiveState`
- [ ] `SelectionCite`
- [ ] Paragraph anchors
- [ ] `PriceContextMenu`
- [ ] `LiveGate` (replace static GATE block)
- [ ] Console banner
- [ ] Toast
- [ ] `SystemInfo` footer block
- [ ] View-source HTML comment

**Done when**: every behavior in `interactions.md` works; JS disabled still renders the page cleanly.

## Phase 6 — polish
- [ ] `prefers-reduced-motion: reduce` disables caret blink, live-state pulse, gate-running pulse
- [ ] All interactive elements keyboard-reachable; visible focus rings
- [ ] Lighthouse 100 on all four axes
- [ ] `<title>`, `<meta description>`, `<link rel=canonical>`
- [ ] OpenGraph + Twitter card images (optional)
- [ ] CSP header confirmed strict in deployed build
- [ ] Total JS gzipped < 40 KB — measure with `next build` output

**Done when**: shipping to production would not embarrass the operator.

## Gates (run before every push)
```
pnpm format
pnpm lint --max-warnings 0
pnpm typecheck
pnpm test
pnpm build
```

If the dev wants to mirror the rigor of the page's own subject matter, add an `ast-grep` config and a couple of the rules from `content.md` to block `console.log`, unbounded `z.string()`, and UUIDv4 at commit time. Optional, but thematically appropriate.
