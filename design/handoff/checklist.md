# Implementation Checklist

Phase-by-phase. Do not skip. Each gate is a human-visible check.

## Phase 0 — Scaffold

- [ ] `npx create-next-app@latest code-rescue --typescript --app --no-tailwind --no-src-dir`
- [ ] Delete the default `app/page.tsx` body; keep the file.
- [ ] Configure `next.config.js` with `output: 'export'` if you want a static build.
- [ ] Add `prettier` + `eslint` with the Next.js defaults. No custom rules yet.
- **Gate:** `npm run dev` shows a blank page on `localhost:3000`, no errors.

## Phase 1 — Design tokens

- [ ] Paste the `:root` block from `design-tokens.md` into `app/globals.css`.
- [ ] Add the three `next/font/google` imports to `app/layout.tsx`.
- [ ] Bind the font CSS variables in the `<html>` className.
- [ ] Set `body { background: var(--bg); color: var(--ink); font-family: var(--sans); }`.
- **Gate:** set a single `<h1 className="h2">Hello</h1>` in `page.tsx` and confirm it renders in Newsreader serif, correct color, correct size.

## Phase 2 — Content layer

- [ ] Create `lib/content.ts`.
- [ ] Port every data structure from `content.md` (INCIDENTS, DELIVERABLES, COMPARE, INSTALLED, PIPELINE, CONTACT).
- [ ] Type each with the interfaces from `components.md`.
- [ ] Export each as a named const.
- **Gate:** `npm run type-check` passes; no `any` types.

## Phase 3 — Static sections

Build top to bottom, one per commit. Match the wireframes exactly.

- [ ] `<TopNav />` — sticky, backdrop-blur, brand + 3 anchors + CTA.
- [ ] `<Hero />` — H1 with italic accent em, lede, two CTAs, 3-col meta strip.
- [ ] `<ProblemSection />` — narrow prose + pullquote.
- [ ] `<WhatItIs />` — 4-up metric grid + narrow closing prose.
- [ ] `<HowItWorks />` — 3×2 step grid, numbered.
- [ ] `<Deliverables />` — 3-up cards with hover lift.
- [ ] `<Proof />` — 4 incidents with date / headline / body / takeaway.
- [ ] `<RuleAnatomy />` — single rule card with head, title, 4 anatomy rows, footer.
- [ ] `<Pricing />` — price-range card + compare-v2 table.
- [ ] `<NotThis />` — dark section, 2-col + wide bottom.
- [ ] `<Engage />` — accent section, 3-up channels, dl facts.
- [ ] `<Footer />` — dark, two-col top with live clock.
- **Gate:** the page renders top-to-bottom matching the reference mockup at 1440px. No layout shift on load.

## Phase 4 — Responsive

- [ ] Verify 900px breakpoint: all 3-4 col grids collapse to 1-2 col per wireframes.
- [ ] Verify 640px breakpoint: topnav links hide, CTAs stack full-width.
- [ ] Verify 375px: no horizontal scroll, text wraps cleanly.
- **Gate:** Chrome devtools responsive mode cycles 375 → 768 → 1024 → 1440 with no overflow, no broken grids.

## Phase 5 — Accessibility

- [ ] Every section is wrapped in `<section>` with an `id` matching the anchor.
- [ ] Every heading level is sequential (no h2 → h4 jumps).
- [ ] Every link that opens externally: `target="_blank" rel="noopener"`.
- [ ] Visible focus rings on all interactive elements.
- [ ] `prefers-reduced-motion` kills transitions and `scroll-behavior: smooth`.
- [ ] Contrast ratios: all text ≥ 4.5:1 on its background.
- **Gate:** axe-core run, 0 violations. Keyboard Tab/Shift+Tab through the whole page works.

## Phase 6 — Static sub-routes

- [ ] `app/humans.txt/route.ts` — return plain text from content.md.
- [ ] `app/robots.txt/route.ts` — return plain text.
- [ ] `app/.well-known/engagements.json/route.ts` — return JSON.
- **Gate:** all three fetch correctly with the right Content-Type.

## Phase 7 — Metadata + OG

- [ ] `app/layout.tsx` exports `metadata` with title, description, openGraph, twitter.
- [ ] OG image at `public/og.png` (1200×630).
- [ ] Favicon at `app/icon.tsx` (generate from the "CR" mark).
- **Gate:** https://www.opengraph.xyz shows the page rendering correctly when pasted in.

## Phase 8 — Performance

- [ ] Lighthouse mobile run:
  - Performance ≥ 95 (target 100)
  - Accessibility 100
  - Best Practices 100
  - SEO 100
- [ ] Total transfer under 200 KB gzipped (excluding fonts).
- [ ] LCP < 1.5s on fast 3G.
- [ ] CLS = 0.
- **Gate:** Lighthouse CI on a deployed preview URL hits all targets.

## Phase 9 — Deploy

- [ ] Push to GitHub.
- [ ] Connect Vercel, deploy preview.
- [ ] Add custom domain `code-rescue.com` (and `www.code-rescue.com` → canonical).
- [ ] Confirm the booking URL `https://www.code-rescue.com/book/` resolves (Cal.com or similar, separate setup).
- **Gate:** the live URL is reachable, all anchors scroll, all external links open correctly.

## Out of scope — do not build

- Blog, essays, writing archive. Those live at `maxwellacollins.com`.
- Any authentication, login, dashboard, or account area.
- A contact form (booking is external).
- CMS or headless content.
- Dark mode.
- i18n.
- Analytics (PostHog, Plausible, GA — none).
- Cookie banner. (There are no cookies to disclose.)
- Email newsletter capture.
- Customer logos / testimonials / case studies from other companies. (The proof is the live rebuild, not external references.)
