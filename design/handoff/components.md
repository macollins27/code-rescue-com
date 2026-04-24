# Components

One-to-one with `../vp.jsx`. Port each as a server component in `app/page.tsx` or a co-located component file. No client-side state except where noted.

## File layout (recommended)

```
app/
  layout.tsx              # font loading, html shell
  page.tsx                # composes all sections in order
  globals.css             # tokens from design-tokens.md
lib/
  content.ts              # all copy + data from content.md
components/
  TopNav.tsx
  Hero.tsx
  ProblemSection.tsx
  WhatItIs.tsx
  HowItWorks.tsx
  Deliverables.tsx
  Proof.tsx
  RuleAnatomy.tsx
  Pricing.tsx
  NotThis.tsx
  Engage.tsx
  Footer.tsx              # "use client" — has the live clock
```

## Content types

Put these in `lib/content.ts`. All copy lives here.

```ts
export type Incident = {
  date: string;
  headline: string;
  body: string;
  takeaway: string;
};

export type Deliverable = {
  letter: 'a' | 'b' | 'c';
  label: string;
  oneline: string;
  plain: string;
  duration: string;
  bestFor: string;
};

export type CompareRow = {
  label: string;
  produces: string;
  gap: string;
};

export type InstalledMetric = {
  n: string;
  what: string;
  plain: string;
};

export type PipelineStage = {
  stage: string;
  title: string;
  plain: string;
};

export type Contact = {
  bookingUrl: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
};
```

## Component specs

### `<TopNav />`

- Sticky header with brand + 3 section links + booking CTA.
- No state. Links are plain `<a href="#what">` anchors.
- On mobile (<640px), hides the section links; keeps brand + CTA.

### `<Hero />`

- Eyebrow pip (8px green dot) + mono label.
- H1 with `<em>` on second line in accent color.
- Serif lede (640px max-width).
- Two CTAs: primary (ink), ghost (bordered).
- Meta strip: 3 k/v pairs with a top border.
- No state.

### `<ProblemSection />`

- `.wrap.narrow`, kicker + H2 + 3 prose paragraphs.
- Ends with a `<blockquote>` pullquote attributed to the manifesto.
- No state.

### `<WhatItIs />`

- Two-part: narrow intro, then full-width 4-up grid.
- Metric card: number (serif, huge, accent-deep) + what (sans 600) + plain body.
- After the grid, back to narrow for explanatory prose with a small muted footnote.

### `<HowItWorks />`

- Narrow intro + full-width `<ol>` grid (3×2 at wide, stacks on mobile).
- Step card has a large serif-italic number and a title/body.
- No state.

### `<Deliverables />`

- Narrow intro + full-width 3-up grid.
- Hover effect: `border-color → --accent; transform: translateY(-2px)`.
- Each card has a footer with Duration + Best for as stacked k/v.

### `<Proof />`

- All `.wrap.narrow`.
- Maps `INCIDENTS` to `<article>` with date / headline / body / takeaway.
- Last element: muted footnote linking to `maxwellacollins.com`.

### `<RuleAnatomy />`

- One hard-coded rule card (AUTH-5).
- Head row: ID badge + type tag + locked date.
- Title + 4 anatomy rows with mono keys and serif values.
- Footer: meta line + outbound link.

### `<Pricing />`

- Narrow intro + price-range card.
- Price-range card has two rows (Floor, Ceiling) separated by a gradient bar.
- Below: a second kicker ("The alternatives, honestly") + H3 + small-sub + `<CompareV2>` rows.
- Render the 4 rows from `COMPARE`.

### `<NotThis />`

- Dark section (`--ink` background).
- 2-col grid + one wide bottom column spanning both.
- Kicker + H2 both inverted to cream.

### `<Engage />`

- Accent-green section.
- 3-up channel grid: [Book a call | Phone | Email].
- First channel is the "primary" variant (cream bg, deep-accent text).
- Below: `<dl>` with 6 facts (operator, location, price, duration, clients, next slot).

### `<Footer />` — only client component

```tsx
'use client';
import { useEffect, useState } from 'react';

export function Footer() {
  const [tz, setTz] = useState('');
  const [time, setTime] = useState('');
  useEffect(() => {
    try { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone); } catch { setTz('UTC'); }
    const tick = () => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  // render — use `time ? `${time} · ${tz}` : '\u00A0'` so the line doesn't collapse pre-hydration
}
```

- Empty string defaults prevent hydration mismatch. Render only on client after effect runs.

## Composition

```tsx
// app/page.tsx
export default function Page() {
  return (
    <>
      <TopNav />
      <Hero />
      <ProblemSection />
      <WhatItIs />
      <HowItWorks />
      <Deliverables />
      <Proof />
      <RuleAnatomy />
      <Pricing />
      <NotThis />
      <Engage />
      <Footer />
    </>
  );
}
```
