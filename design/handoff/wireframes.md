# Wireframes

Section-by-section layout spec. Measurements are from the reference mockup. For exact copy, see `content.md`.

## Page order

```
TopNav          sticky, 64px tall
Hero            120/96 padding
ProblemSection  narrow prose
WhatItIs        4-up metric grid + prose
HowItWorks      6-step pipeline grid
Deliverables    3-up card grid
Proof           narrow prose, 4 incidents
RuleAnatomy     single rule card
Pricing         range strip + compare-v2 table
NotThis         dark section, 2-col grid
Engage          accent-green section, 3-up channels
Footer          dark section
```

---

## TopNav

```
┌────────────────────────────────────────────────────────────────────┐
│  [CR] Code-Rescue      What · How · Proof          [Book a call]   │
└────────────────────────────────────────────────────────────────────┘
```

- Sticky, `rgba(245,242,236,0.88)` + backdrop-blur.
- Height 64px.
- Brand mark: 28×28 green square, serif "CR" in cream.
- Links: sans 14/500, `--ink-2`, hover `--accent`.
- CTA: ink background, cream text, 8/16 padding, hover swaps to accent green.

---

## Hero

```
┌────────────────────────────────────────────────────────────────────┐
│  ● ONE ENGAGEMENT · PRICE FIXED AT KICKOFF · ONE CLIENT AT A TIME  │
│                                                                    │
│  Your team is shipping AI-written code.                            │
│  Something needs to be catching it.  ← italic, accent green        │
│                                                                    │
│  Most of what's sold as "AI governance" is advice. Code-Rescue is  │
│  installation — a mechanical stack of rules, gates, and reviews,   │
│  wired into your codebase...                                       │
│                                                                    │
│  [Book a call]   [See how it works]                                │
│  ─────────────────────────────────────────────                     │
│  OPERATOR         BASED ON            AVAILABILITY                 │
│  Maxwell Collins  A live production   Waitlist · weeks             │
│                   rebuild...          not days                     │
└────────────────────────────────────────────────────────────────────┘
```

- `.hero` padding: `120px 0 96px`.
- Eyebrow pip: 8px accent dot with 4px rgba glow.
- Title: `max-width: 880px`, `<em>` is italic + accent.
- Lede: serif 22px, `max-width: 640px`.
- CTAs: primary (ink) + ghost (bordered).
- Meta strip: 3 cols, `border-top: 1px solid --line`, 32px padding-top.

---

## ProblemSection

```
┌── .wrap.narrow ───────────────────────────────────────────────┐
│  THE PROBLEM                                                  │
│  AI writes code faster than any human can review it.          │
│                                                               │
│  Your team is shipping more code than ever...                 │
│  [3 body paragraphs, serif 18px]                              │
│                                                               │
│  ┌ pullquote ──────────────────────────────────────────────┐  │
│  │ "You can specify software in a form an AI agent cannot  │  │
│  │ silently overrule..."                                   │  │
│  │   — Maxwell Collins, DRDD Manifesto                     │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

- Pullquote: `padding: 24px 32px; border-left: 3px solid --accent; background: --bg-warm` (or `--bg-card` if on warm section).

---

## WhatItIs

```
┌── .wrap.narrow ───────────────────────────────────────────────┐
│  WHAT GETS INSTALLED                                          │
│  A mechanical stack that catches what human review misses.    │
│  Every AI-written commit...                                   │
└───────────────────────────────────────────────────────────────┘
┌── .wrap ──────────────────────────────────────────────────────┐
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                          │
│  │ 113  │ │   9  │ │  12  │ │   5  │                          │
│  │Auto. │ │Review│ │Gate  │ │Enfor.│                          │
│  │checks│ │rounds│ │stages│ │layers│                          │
│  │[plain│ │[plain│ │[plain│ │[plain│                          │
│  └──────┘ └──────┘ └──────┘ └──────┘                          │
└───────────────────────────────────────────────────────────────┘
┌── .wrap.narrow ───────────────────────────────────────────────┐
│  [Explanatory prose: what's under the hood]                   │
└───────────────────────────────────────────────────────────────┘
```

- 4-col grid at `>=900px`, 2-col at `<900px`, 1-col at `<640px`.
- Card: `background: --bg-warm` (on warm section, use `--bg-card`), `padding: 40px 32px`.
- Number: serif 500, `clamp(48px, 6vw, 72px)`, `--accent-deep`.
- What: sans 600, 15px.
- Plain: sans 400, 14px, `--ink-dim`, line-height 1.55.

---

## HowItWorks

```
┌── .wrap ──────────────────────────────────────────────────────┐
│  HOW IT WORKS                                                 │
│  Six stages. Every change walks through all of them.          │
│                                                               │
│  ┌──1──┐  ┌──2──┐  ┌──3──┐                                    │
│  │Rules│  │Contr│  │Sourc│                                    │
│  └─────┘  └─────┘  └─────┘                                    │
│  ┌──4──┐  ┌──5──┐  ┌──6──┐                                    │
│  │Nine │  │QA   │  │Regre│                                    │
│  └─────┘  └─────┘  └─────┘                                    │
└───────────────────────────────────────────────────────────────┘
```

- 3-col grid, 2 rows.
- Step card: `background: --bg-card; border: 1px solid --line; padding: 28px 24px;`.
- Number: serif italic 500, 36px, `--accent`.
- Title: serif 500, 20px.
- Plain: sans 400, 15px, `--ink-2`, line-height 1.55.

---

## Deliverables

```
┌── .wrap ──────────────────────────────────────────────────────┐
│  WHAT YOU CHOOSE                                              │
│  One engagement, one concrete deliverable.                    │
│                                                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │ a          │  │ b          │  │ c          │               │
│  │ Domain     │  │ System     │  │ QA Run     │               │
│  │ Build      │  │ Migration  │  │            │               │
│  │ [oneline]  │  │ [oneline]  │  │ [oneline]  │               │
│  │ [plain]    │  │ [plain]    │  │ [plain]    │               │
│  │ ──────     │  │ ──────     │  │ ──────     │               │
│  │ Duration   │  │ Duration   │  │ Duration   │               │
│  │ 4–8 weeks  │  │ 4–8 weeks  │  │ 2–3 weeks  │               │
│  │ Best for   │  │ Best for   │  │ Best for   │               │
│  │ [one line] │  │ [one line] │  │ [one line] │               │
│  └────────────┘  └────────────┘  └────────────┘               │
└───────────────────────────────────────────────────────────────┘
```

- 3-col grid, `gap: 24px`.
- Card: `--bg-card`, `border: 1px solid --line`, `padding: 36px 32px`.
- Hover: `border-color: --accent; transform: translateY(-2px)`.
- Letter: serif italic 500, 40px, `--accent`.
- Label: serif 600, 26px.
- Oneline: serif italic 17px, `--ink-2`.
- Plain: sans 15px, `--ink-dim`, `flex: 1`.
- Foot: `margin-top: auto; padding-top: 20px; border-top: 1px solid --line;` — two stacked k/v pairs.

---

## Proof

```
┌── .wrap.narrow ───────────────────────────────────────────────┐
│  RECEIPTS                                                     │
│  Four dated incidents from one production rebuild.            │
│                                                               │
│  MARCH 30, 2026                                               │
│  20 minutes. 100+ critical bugs. A green test suite.          │
│  [serif body paragraph]                                       │
│  ┌ takeaway ─────────────────────────────────────────────┐    │
│  │ TAKEAWAY  Tests that pass while software breaks...    │    │
│  └───────────────────────────────────────────────────────┘    │
│  ── divider ──                                                │
│  [3 more incidents, same structure]                           │
│                                                               │
│  The full methodology, with every rule and every incident,    │
│  is published at maxwellacollins.com.                         │
└───────────────────────────────────────────────────────────────┘
```

- Incident: `padding: 48px 0; border-bottom: 1px solid --line`.
- Date: mono 12px uppercase, `--accent`.
- Headline: serif 500, `clamp(24px, 3vw, 32px)`.
- Body: serif 18px, `--ink-2`, line-height 1.6.
- Takeaway: `padding: 16px 20px; background: --bg-warm; border-left: 2px solid --accent`.

---

## RuleAnatomy

```
┌── .wrap.narrow ───────────────────────────────────────────────┐
│  WHAT ONE RULE LOOKS LIKE                                     │
│  A small, concrete example.                                   │
│                                                               │
│  ┌─ rule-card ────────────────────────────────────────────┐   │
│  │ [AUTH-5]  ADVERSARIAL      Locked 2026-04-07           │   │
│  │ ──────                                                 │   │
│  │ Cross-organization access                              │   │
│  │                                                        │   │
│  │ ORIGIN            An attacker probing...               │   │
│  │ ──                                                     │   │
│  │ WHAT THE RULE...  Every request that looks up...       │   │
│  │ ──                                                     │   │
│  │ HOW IT'S ENFORCED Write-time: ... Commit-time: ...     │   │
│  │ ──                                                     │   │
│  │ WHAT IT CLOSES    Three distinct failure modes...      │   │
│  │ ──                                                     │   │
│  │ One of ~3,500 rules. View on maxwellacollins.com →    │   │
│  └────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

- Card: `--bg-card`, `border: 1px solid --line-2`.
- Head: `padding: 20px 28px; border-bottom: 1px solid --line; background: --bg`.
- ID badge: mono, `--accent` on `--accent-faint`, `padding: 4px 10px`.
- Type badge: sans 500, 12px uppercase, `--warn`.
- Locked: mono 11px, `--ink-faint`, `margin-left: auto`.
- Title: serif 500, 28px, `margin: 28px 28px 20px`.
- Anatomy rows: `grid-template-columns: 180px 1fr; gap: 24px; padding: 16px 0; border-top: 1px solid --line`.
- Row k: mono 11px uppercase, `--ink-faint`.
- Row v: serif 16px, `--ink-2`, line-height 1.55.
- `<code>`: mono 13px, `background: --bg-warm; padding: 2px 6px`.

---

## Pricing

```
┌── .wrap.narrow ───────────────────────────────────────────────┐
│  PRICE                                                        │
│  $10,000 to $100,000. Fixed at kickoff.                       │
│  Engagements are scoped...                                    │
│                                                               │
│  ┌─ price-range ───────────────────────────────────────────┐  │
│  │ FLOOR      $10,000    Small codebase, one bounded...    │  │
│  │         ████████████░░░░░░░░░░░░░░░░░░ (gradient bar)   │  │
│  │ CEILING    $100,000   Large codebase, multi-domain...   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  THE ALTERNATIVES, HONESTLY                                   │
│  What you could do instead — and what each option leaves      │
│  unsolved.                                                    │
│                                                               │
│  ┌ compare-v2 ─────────────────────────────────────────────┐  │
│  │ Hire a senior  | What it produces | What it leaves       │  │
│  │ engineer       | Code at the rate │ They can't install   │  │
│  │                | one person...    │ this stack...        │  │
│  │ ────                                                     │  │
│  │ Retain an AI-  | Slides, workshops│ Nothing installed... │  │
│  │ consulting firm|                  │                      │  │
│  │ ────                                                     │  │
│  │ [2 more rows]                                            │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

- Price range card: `padding: 36px 40px; border: 1px solid --line-2; background: --bg-card`.
- Range row: `grid-template-columns: 120px 220px 1fr; gap: 32px; align-items: baseline`.
- Amount: serif 600, `clamp(28px, 3.5vw, 40px)`, `--accent-deep`.
- Bar: 4px tall, `margin: 20px 0 20px 152px`, gradient from `--accent-faint` to `--accent`.
- Compare-v2 rows: `grid-template-columns: 1fr 1.2fr 1.3fr; gap: 32px; padding: 28px 32px; border-bottom: 1px solid --line`.

---

## NotThis (dark section)

```
┌── .wrap.narrow ──────────────────────────── (bg: --ink) ──────┐
│  WHAT THIS IS NOT                                             │
│  The list of things Code-Rescue deliberately isn't.           │
│                                                               │
│  ┌─────────────────────┐  ┌─────────────────────┐             │
│  │ Not AI consulting.  │  │ Not staff aug.      │             │
│  │ No slides...        │  │ I'm not a...        │             │
│  └─────────────────────┘  └─────────────────────┘             │
│  ┌─────────────────────┐  ┌─────────────────────┐             │
│  │ Not a retainer.     │  │ Not a tool...       │             │
│  └─────────────────────┘  └─────────────────────┘             │
│  ─────────────────────────────────────────                    │
│  ┌ wide col ─────────────────────────────────────────────┐    │
│  │ Not a product you can buy elsewhere.                  │    │
│  │ [wide body paragraph]                                 │    │
│  └───────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

- Section: `background: --ink; color: --bg`.
- Title color overridden to cream; kicker at 55% alpha cream.
- 2-col grid, `gap: 48px 64px`.
- Wide column: `grid-column: 1 / -1; padding-top: 24px; border-top: 1px solid rgba(245,242,236,0.2)`.
- Title: serif 500, 24px, cream.
- Body: sans 16px, cream at 75% alpha.

---

## Engage (accent section)

```
┌── .wrap.narrow ──────────────────────── (bg: --accent) ───────┐
│  ENGAGE                                                       │
│  One client at a time. Three ways to reach me.                │
│                                                               │
│  ┌──────────────────┐ ┌─────────────┐ ┌──────────────────┐    │
│  │ BOOK A CALL    → │ │ PHONE     → │ │ EMAIL          → │    │
│  │ Pick a time...   │ │ +1 (813)... │ │ max@code-...     │    │
│  └──────────────────┘ └─────────────┘ └──────────────────┘    │
│                                                               │
│  ────────────                                                 │
│  OPERATOR          LOCATION          PRICE                    │
│  Maxwell Collins   Tampa, FL         $10k–$100k · fixed       │
│  DURATION          CLIENTS AT A TIME NEXT SLOT                │
│  2–8 weeks         One               Inquire                  │
└───────────────────────────────────────────────────────────────┘
```

- Section: `background: --accent; color: --accent-ink`.
- Channels: 3-col grid (1.1fr 1fr 1fr), `gap: 16px`.
- Channel: `padding: 24px 28px; border: 1px solid rgba(cream,0.3); background: rgba(cream,0.05)`.
- Primary channel: `background: --bg; color: --accent-deep`.
- Channel k: mono 11px uppercase, 0.7 opacity.
- Channel v: serif 500, 20px.
- Arrow: serif 28px, 0.5 opacity, animates to 1 + `translateX(4px)` on hover.
- Engage facts (`<dl>`): 3-col grid, `gap: 32px; padding-top: 32px; border-top: 1px solid rgba(cream,0.25)`.

---

## Footer (dark section)

```
┌── .wrap ──────────────────────── (bg: --ink) ─────────────────┐
│  [CR] Code-Rescue       METHODOLOGY  CODE-RESCUE  CONTACT     │
│  The commercial inst.   Manifesto    What it is   Book a call │
│  of DRDD — by Maxwell   Three crises How it works +1 (813)... │
│  Collins. At maxwell... Rules expl.  Proof        max@code... │
│                         Field notes  Engage       Tampa, FL   │
│                                                   14:32 · CST │
│  ────────────────────────────────────────                     │
│  © 2026 Code-Rescue · Published in public | No analytics...   │
└───────────────────────────────────────────────────────────────┘
```

- Background: `--ink`, text: `--bg`.
- Two-col top: `grid-template-columns: 1.2fr 2fr; gap: 64px`.
- Right side: 3 sub-columns of links.
- Live clock/TZ: one `useEffect` tick every 30s; SSR-safe (empty string initially, fill on client).
- Bottom: flex row, justify-between, mono 13px at 50% cream.
