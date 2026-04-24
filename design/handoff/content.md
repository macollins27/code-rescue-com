# Content

All copy and data, verbatim. Port directly into `lib/content.ts`. Do not paraphrase.

## Page metadata

- **Title:** `Code-Rescue — Install the stack that catches AI mistakes before they ship`
- **Description:** `One engagement. Price fixed at kickoff. Install the mechanical stack that catches AI-written mistakes before they reach your main branch. One client at a time.`
- **OG title:** same as title
- **OG description:** same as description
- **OG image:** 1200×630, dark (`--ink`) background, cream "CR" mark in the center, serif logotype beneath. Simple.

## Contact

```ts
export const CONTACT = {
  bookingUrl: "https://www.code-rescue.com/book/",
  phone: "+1 (813) 480-7797",
  phoneHref: "tel:+18134807797",
  email: "max@code-rescue.com",
  emailHref: "mailto:max@code-rescue.com?subject=Code-Rescue%20engagement%20inquiry",
};
```

## Hero

- **Eyebrow:** `One engagement · Price fixed at kickoff · One client at a time`
- **H1:** `Your team is shipping AI-written code.` / `Something needs to be catching it.` (second line is italic + accent)
- **Lede:** `Most of what's sold as "AI governance" is advice. Code-Rescue is installation — a mechanical stack of rules, gates, and reviews, wired into your codebase, catching silent mistakes before they reach your main branch. One engagement. Price fixed at kickoff. You own everything.`
- **CTAs:** `Book a call` (primary, booking URL), `See how it works` (ghost, `#how`)
- **Meta:**
  - `Operator` → `Maxwell Collins`
  - `Based on` → `A live production rebuild, documented publicly`
  - `Availability` → `Waitlist · weeks, not days`

## Problem

- **Kicker:** `The problem`
- **H2:** `AI writes code faster than any human can review it.`
- **Paragraphs:**
  1. `Your team is shipping more code than ever. Most of it written — or heavily assisted — by an AI agent. The code compiles. The tests pass. Pull requests look clean. And yet bugs are reaching production that your senior engineers would have caught a year ago.`
  2. `It's not that the AI is bad at writing code. It's that *nothing in your review pipeline was designed to catch the specific mistakes AI agents make.* Code review assumes a human author who knows what they don't know. Tests assume someone wrote them to assert the thing that actually matters. Neither assumption survives contact with an autonomous agent that's very good at producing convincing partial work.`
  3. `The result is a codebase that's drifting from what you thought you were building — silently, one well-intentioned commit at a time.`
- **Pullquote:** `"You can specify software in a form an AI agent cannot silently overrule — as long as the form is mechanical enough to check against the source code at every commit."`
- **Pullquote cite:** `Maxwell Collins, DRDD Manifesto · maxwellacollins.com`

## WhatItIs

- **Kicker:** `What gets installed`
- **H2:** `A mechanical stack that catches what human review misses.`
- **Sub:** `Every AI-written commit, every code change, every migration walks through this before it can land. Nothing is optional. Nothing can be overridden.`

```ts
export const INSTALLED: InstalledMetric[] = [
  { n: "113", what: "Automated checks", plain: "Running against every line of AI-written code your team produces, before it reaches review." },
  { n: "9",   what: "Review rounds",    plain: "An adversarial review that every change walks through before it can land on your main branch." },
  { n: "12",  what: "Gate stages",      plain: "A quality gate between every commit and production. Any stage fails, the commit doesn't land. No overrides." },
  { n: "5",   what: "Enforcement layers", plain: "At write-time, at commit, at runtime, at session start, and at every tool call — so nothing slips through a single layer." },
];
```

- **Closing prose:**
  - `Underneath these four numbers is a specific stack: 42 domain rule files, ~3,500 mechanical rule statements across 24 domains, 48 write-time hooks, 41 structural code patterns, 26 lifecycle checks, 20 custom skills, 5 review agents, 7 shared authority files. Every piece is documented, every piece is yours, and every piece is tuned to the shape of your product.`
  - `If the stack reads dense — good, it should. The point is that it's all there, installed, working, on day one.` (muted, small)

## HowItWorks

- **Kicker:** `How it works`
- **H2:** `Six stages. Every change walks through all of them.`
- **Sub:** `This is the pipeline that runs on every commit during the engagement, and keeps running after I leave.`

```ts
export const PIPELINE: PipelineStage[] = [
  { stage: "1", title: "Rules are the specification", plain: "Your product's behavior is written down as mechanical rules. Not prose. Not wishes. Statements a machine can check." },
  { stage: "2", title: "Contract extraction",           plain: "An automated step reads the rules and produces the plan the implementation will follow, layer by layer." },
  { stage: "3", title: "Source, one layer at a time",   plain: "Code gets written layer by layer. Every procedure verified the moment it's written, with cross-procedure checks after each layer." },
  { stage: "4", title: "Nine rounds of adversarial review", plain: "A structured review pass through the code — input handling, query correctness, error paths, audit trails, security surface — ending in a clean, zero-findings state." },
  { stage: "5", title: "QA auditor",                    plain: "An autonomous agent walks your live app like a real user. Across time zones, devices, concurrency, accessibility. Files every bug it finds into a database." },
  { stage: "6", title: "Regression tests",              plain: "Tests get written after QA — one per real bug surfaced — so the same bug can never ship twice. Tests lock behavior; they don't define it." },
];
```

## Deliverables

- **Kicker:** `What you choose`
- **H2:** `One engagement, one concrete deliverable.`
- **Sub:** `The stack gets installed either way. At kickoff you pick one of three deliverables to ship under it.`

```ts
export const DELIVERABLES: Deliverable[] = [
  {
    letter: "a",
    label: "Domain Build",
    oneline: "One area of your product, rebuilt end-to-end under full mechanical review.",
    plain: "Pick one bounded part of your codebase — a checkout flow, a permissions system, a reporting module. I rebuild it from written specification to shipped production code, with every rule, gate, and review in place the entire time.",
    duration: "4 – 8 weeks",
    bestFor: "You have one area that keeps breaking, or one area you know is load-bearing for the next 18 months.",
  },
  {
    letter: "b",
    label: "System Migration",
    oneline: "One cross-cutting change, executed spec-first without regressions.",
    plain: "A vendor swap. A database migration. A shared abstraction renamed across the codebase. The kind of change that touches every domain and usually ships bugs quietly for months. I execute one of these under the full pipeline — nothing lands until it's verified, everywhere.",
    duration: "4 – 8 weeks",
    bestFor: "You have a migration your team has been avoiding because the blast radius is too large.",
  },
  {
    letter: "c",
    label: "QA Run",
    oneline: "An autonomous auditor walks your app and files every bug it finds.",
    plain: "I install the QA harness on your production app and run it against your existing code. It behaves like a real user — across time zones, screen sizes, concurrent sessions, accessibility checks, edge-case inputs — and hands you a filed-and-prioritized backlog. No change to your codebase; pure diagnostic.",
    duration: "2 – 3 weeks",
    bestFor: "You want to know what's broken before an investor, an auditor, or a customer finds out.",
  },
];
```

## Proof

- **Kicker:** `Receipts`
- **H2:** `Four dated incidents from one production rebuild.`
- **Sub:** `Each incident produced a new layer of the stack you'd be installing. None of this is theoretical.`

```ts
export const INCIDENTS: Incident[] = [
  {
    date: "March 30, 2026",
    headline: "20 minutes. 100+ critical bugs. A green test suite.",
    body: "A codebase with 4,800 passing tests shipped to production. A single QA audit — 20 minutes — surfaced over 100 critical bugs. Every bug had a passing test sitting on top of it. The test suite was the problem: tests assert at call sites, and users don't live at call sites. They live in sequences — a page load, a click, a navigation away, a return five minutes later to check if the record stuck. None of that is a function return value.",
    takeaway: "Tests that pass while the software breaks are worse than no tests at all. They make the break invisible.",
  },
  {
    date: "February 21, 2026",
    headline: "24,367 lines of research, deleted in a morning.",
    body: "A rebuild's research phase had been completed — cleanly, confidently, with thorough deliverables. The phase covered residential properties only. The actual business serves residential, commercial, industrial, institutional, and government property types. The AI agents had been told this, in passing, and had narrowed the scope anyway because the residential case was easier. Nothing flagged. It only surfaced on read-through.",
    takeaway: "AI agents narrow scope silently. Smart agents do it more, not less, because they're better at producing convincing partial work.",
  },
  {
    date: "February 26–27, 2026",
    headline: "184 architecture documents, archived in one day.",
    body: "Twelve phases of architecture docs had been written by AI agents reading other AI-generated documents instead of the actual source code. 24 direct contradictions with the live codebase. 31 aspirational features described as already shipped. 9 architecture decision records entirely hallucinated. 44 commits in one day to clean it up.",
    takeaway: "AI-written documentation that cites AI-written documentation is confidence without substance. It reads right and points nowhere.",
  },
  {
    date: "March 1, 2026",
    headline: "\u201CPLW is real, not simulated.\u201D",
    body: "Architecture validation was supposed to run against a live API. The agents rewrote the brief as a \u201Crisk-inventory and tiny-experiment approach,\u201D treated the live system as a simulation, and produced pretend validations. Five commits and fifty-one minutes to revert. The revert commit message became a standing rule: when a real system exists, reason against the real system.",
    takeaway: "AI agents default to reasoning against simulations, even when the real thing is wired up and available. The simulation always agrees with them.",
  },
];
```

- **Footnote:** `The full methodology, with every rule and every incident, is published at maxwellacollins.com. This page is the commercial installation of it.`

## RuleAnatomy

- **Kicker:** `What one rule looks like`
- **H2:** `A small, concrete example.`
- **Sub:** `If you're wondering what "a mechanical rule" actually is, here is one from the live rebuild — rendered the way it lives in the codebase. It exists because an attack vector was found, and it prevents that exact class of problem from ever shipping again.`
- **Rule ID:** `AUTH-5`
- **Rule type:** `Adversarial`
- **Locked:** `Locked 2026-04-07`
- **Title:** `Cross-organization access`
- **Rows:**
  - `Origin` → `An attacker probing the system could tell whether a record existed in another customer's account by the error code returned — enabling cross-customer enumeration.`
  - `What the rule says` → `Every request that looks up a single record must include the active organization's ID. If no row comes back — regardless of *why* — respond with "not found." Never use "access denied." That error leaks existence.`
  - `How it's enforced` → `Write-time: an AI agent trying to write ` + code(`"Access denied"`) + ` in a procedure file gets blocked before the edit lands. Commit-time: a static check refuses any database query missing the organization ID. Runtime: middleware verifies the session before any procedure body runs.`
  - `What it closes` → `Three distinct failure modes — record doesn't exist, record was deleted, record belongs to another customer — now return identical responses. A probing client can no longer distinguish between them. The enumeration attack stops being possible.`
- **Footer line:** `One of ~3,500 mechanical rule statements across 24 domains. Every one has the same six-part anatomy.` + link `View on maxwellacollins.com →` → `https://maxwellacollins.com/rules/auth-5`

## Pricing

- **Kicker:** `Price`
- **H2:** `$10,000 to $100,000. Fixed at kickoff.`
- **Sub:** `Engagements are scoped to your codebase and the problem. Once we've talked through the surface area and agreed on a number, it stops moving. No hourly billing. No scope creep. No surprise invoices.`
- **Floor:** `$10,000` — `Small codebase, one bounded problem, a QA run or a focused migration.`
- **Ceiling:** `$100,000` — `Large codebase, multi-domain scope, full stack installed with a substantial deliverable shipped under it.`

- **Second kicker:** `The alternatives, honestly`
- **H3:** `What you could do instead — and what each option leaves unsolved.`
- **Small sub:** `The stack Code-Rescue installs was built over months of production work and documented publicly at maxwellacollins.com. It isn't available as a product, a platform, or an off-the-shelf framework. Here's what the other paths produce, and the gap each one leaves.`

```ts
export const COMPARE: CompareRow[] = [
  {
    label: "Hire a senior engineer",
    produces: "Code at the rate one person can write it, reviewed by the standards they already know.",
    gap: "They can't install this stack. It isn't on the market. You'd be asking them to build it from the published methodology — and that's a multi-year undertaking, not a hire.",
  },
  {
    label: "Retain an AI-consulting firm",
    produces: "Slides, workshops, maturity assessments, a governance framework document.",
    gap: "Nothing installed, nothing shipped, nothing running against your actual codebase when they leave. The code keeps drifting while the engagement reports say it isn't.",
  },
  {
    label: "License a code-quality tool",
    produces: "A dashboard. Generic rules. A monthly invoice.",
    gap: "Off-the-shelf rules can't encode your domain, your failure modes, or the specific ways an AI agent drifts on your codebase. The rules have to be written from incidents — and those incidents are yours.",
  },
  {
    label: "Wait for the AI tooling to mature",
    produces: "Nothing. The wait is the strategy.",
    gap: "Codebase drift compounds. Every month you wait is a month of silent regressions and a harder cleanup when you finally stop waiting.",
  },
];
```

## NotThis

- **Kicker:** `What this is not`
- **H2:** `The list of things Code-Rescue deliberately isn't.`
- **Columns:**
  1. `Not AI consulting.` — `No slides. No workshops. No "AI enablement strategy." If the engagement produces a slide deck, the engagement has failed.`
  2. `Not staff augmentation.` — `I'm not a fractional engineer or a fractional CTO. I install a system, ship one deliverable under it, and leave. Your team runs it after.`
  3. `Not a retainer.` — `One engagement, price fixed at kickoff, clean exit. If you want ongoing help later, we talk later. Nothing about this engagement locks you in.`
  4. `Not a tool you license.` — `Every rule, hook, gate, and test installed during the engagement is yours. Modify it, extend it, delete it, fork it. No ongoing fees.`
  5. (wide, full-width) `Not a product you can buy elsewhere.` — `The stack is built from a live production rebuild, documented publicly at maxwellacollins.com, and installed during the engagement. Nothing about it is licensed, franchised, or sitting on a vendor's shelf.`

## Engage

- **Kicker:** `Engage`
- **H2:** `One client at a time. Three ways to reach me.`
- **Sub:** `Pick the channel that fits. The call is structured — 30 minutes, we talk about your codebase and whether this is a fit. The phone is for the immediate question. Email is for the considered note.`
- **Channels:**
  - Primary: `Book a call` / `Pick a time in the next 3 days` / → booking URL
  - Secondary: `Phone` / `+1 (813) 480-7797` / → tel:
  - Secondary: `Email` / `max@code-rescue.com` / → mailto:
- **Facts (dl):**
  - `Operator` → `Maxwell Collins`
  - `Location` → `Tampa, FL`
  - `Price` → `$10k – $100k · fixed at kickoff`
  - `Duration` → `2 – 8 weeks`
  - `Clients at a time` → `One`
  - `Next slot` → `Inquire`

## Footer

- **Brand tagline:** `The commercial installation of Domain-Rules-Driven Development — the methodology by Maxwell Collins, documented publicly at maxwellacollins.com.`
- **Column: Methodology**
  - `Manifesto` → `https://maxwellacollins.com/manifesto`
  - `Three crises` → `https://maxwellacollins.com/crises`
  - `Rules explorer` → `https://maxwellacollins.com/rules`
  - `Field notes` → `https://maxwellacollins.com/writing`
- **Column: Code-Rescue**
  - `What it is` → `#what`
  - `How it works` → `#how`
  - `Proof` → `#proof`
  - `Engage` → `#engage`
- **Column: Contact**
  - `Book a call` → booking URL
  - `+1 (813) 480-7797` → tel:
  - `max@code-rescue.com` → mailto:
  - `Tampa, FL` (text)
  - live clock `HH:MM · TZ` (text, client-only)
- **Bottom line L:** `© 2026 Code-Rescue · Maxwell Collins · Published in public`
- **Bottom line R:** `No analytics · No tracking · No cookies · View-source has a note`

## Static routes

### `/humans.txt`

```
/* CODE-RESCUE */

Operator:   Maxwell Collins
Contact:    max@code-rescue.com
Location:   Tampa, FL, USA
Site:       https://www.code-rescue.com
Method:     Domain-Rules-Driven Development (maxwellacollins.com)

Stack:      Next.js · TypeScript · Hand-laid CSS · No tracking

Thanks:     Every engineer who's ever caught a bug a test missed.
```

### `/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://www.code-rescue.com/sitemap.xml
```

### `/.well-known/engagements.json`

```json
{
  "operator": "Maxwell Collins",
  "clientsAtATime": 1,
  "priceFloorUSD": 10000,
  "priceCeilingUSD": 100000,
  "priceModel": "fixed-at-kickoff",
  "durationWeeksFloor": 2,
  "durationWeeksCeiling": 8,
  "bookingUrl": "https://www.code-rescue.com/book/",
  "methodology": "https://maxwellacollins.com"
}
```
