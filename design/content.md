# Content — all copy and data

This file is the canonical source for every string and data structure on the page. Import from a `content.ts` module — no string literals in JSX components.

## Hero

**Eyebrow**: `Code-Rescue · Services · One client at a time`

**H1**: `The LLM shipped slop. Install the stack that catches it _before_ it lands on main.`
(the word `before` wraps in an `<em>` styled as accent italic)

**Lede**: `A single engagement. A fixed $40,000. DRDD — Domain-Rules-Driven Development — installed in your codebase, tuned to your stack, with one substantial deliverable shipped under the pipeline it enforces. You own every piece. No licensing, no retainers.`

**Thesis label**: `Canonical thesis`
**Thesis quote**: `"If you can't write an assertion for a specification, you don't have a specification yet."`
**Thesis source**: `— Maxwell Collins, maxwellacollins.com/about`

## § 00 Posture

**Title**: `This is not AI consulting.`
**Sub**: `The market is saturated with "AI transformation" and "AI-assisted development" pitches. The buyer on this page has trained themselves to ignore that category. What ships below is working infrastructure — commits, hooks, rules, gates, test suites — iterated across dozens of multi-hour sessions on a real production rebuild. Every rule traces to a specific observed failure documented in public.`

**Three columns**:
- WHAT IT IS: `Installed enforcement infrastructure plus one substantial shipped deliverable. You choose the deliverable at kickoff.`
- WHAT IT ISN'T: `Staff augmentation. Fractional CTO. Training. Workshops. Slide decks. Code-by-the-hour. Generic "AI consulting."`
- CREDIBILITY WALL: `A published manifesto, dated incident essays, a browseable rules explorer, a live commit log. Every claim on this page ties to an artifact or a number.`

## § 01 Offer

**Title**: `One engagement. Fixed scope. Fixed price.`
**Sub**: `The full DRDD stack installed in your codebase, configured to your domain, plus one substantial deliverable shipped under the pipeline it enforces.`

**Price**: `$40,000`
**Price label**: `Fixed price · single engagement · one client at a time`
**Typical duration**: `4–8 weeks for deliverable (a) or (b) · 2–3 weeks for (c)`
**Ownership**: `No licensing · No ongoing fees · No lock-in. Modify, extend, delete, or fork any piece of it.`

**Installed-in-every-engagement list**:
1. 12-stage quality gate (pnpm gate / gate:static) tuned to your stack
2. ~24 runtime hooks + 48 hookify rules + 41 ast-grep structural rules
3. Domain-rules authorship system: per-domain .md spec files, source-first pipeline
4. Feature-level pipeline with per-layer fan-out and multi-agent review panel
5. LLM-driven QA harness with stdio MCP emission + triple-verdict verification
6. Persistent cross-session memory system auto-loaded into every session
7. 9-pass adversarial review skill with mechanical phase gate
8. Six GitHub Actions workflows (ci, compliance, deploy, migration-check, qa, security)

**Deliverables** (3-col):
- **a · Domain build** — `One audit-grade domain built end-to-end from spec.`
  - plain: `We rebuild one bounded area of your codebase from written specification to shipped production code under full mechanical review.`
  - tech: `Domain rules authored, contract extracted, source produced layer-by-layer with per-procedure write-verify checks, 9-pass adversarial review run to clean: true, QA auditor run against the domain's user journeys, regression tests locked on proven-correct behavior.`
- **b · System migration** — `One system-wide migration executed spec-first.`
  - plain: `We execute one cross-cutting change — a vendor swap, a canonical identifier rename, a shared abstraction, a schema migration — using the feature pipeline with per-layer fan-out.`
  - tech: `Feature doc authored, layered contract extracted via the 5-pass wrapper, each layer implemented with fresh attention-budget subagents, pnpm gate:static between layers, panel-reviewed before consumption.`
- **c · QA run** — `One installation and live run of the QA harness.`
  - plain: `We install the auditor on your app and run it against your existing code, handing you a filed-issue backlog with severity, reproduction steps, and fix-target paths.`
  - tech: `Multi-user auditor configured, deterministic pre-scans wired (<100ms), stdio MCP emission channel mounted, canary calibration tuned, triple-verdict verification chain running against your source tree.`

## § 02 Outcome

**Title**: `What is true of your codebase that wasn't before.`
**Sub**: `A junior engineer, internal or AI, reads the spec to learn what the system does. Source code has zero authority against the rules. Phase completion is a file on disk with a validity flag, a source hash, and a clean count — not a prose claim in a PR description.`

**Stats** (4):
- `~113` — `Mechanical rules guarding every AI-authored commit`
- `12` — `Gate stages between commit and the primary branch`
- `9` — `Adversarial review passes ending in a mechanical phase marker`
- `5` — `Enforcement layers — write-time, gate-time, runtime, lifecycle, session`

**2×2 narrative grid**: see the HTML for the four full paragraphs — they are quoted verbatim in `Code-Rescue Services.html`.

## § 03 Three crises

Data from `content.jsx` `CRISES` export. Three rows, each with `n`, `name`, `date`, `desc`, optional `pull` quote. All three verbatim in `Code-Rescue Services.html`.

## § 04 Case studies (7)

Data from `content.jsx` `CASES` export. Each case has `num, kicker, title, incident, observation, mechanism, code?, result, crises[], essay?`. Full text in `content.jsx`.

Cases:
1. QA harness → 53 filed issues
2. 4,800 fake tests deleted
3. 9-pass adversarial review
4. Per-layer fan-out
5. Skill-from-fresh-subagent
6. Deterministic verifier
7. MCP emission

## § 05 Nine passes

```
00  Shared infrastructure
01  Procedure inventory
02  Input validation
03  Query correctness
04  Error handling
05  Audit log
06  Response shape
07  Security surface
08  Engineering quality
```

JSON shown in viz:
```json
{
  "phase": "<active label>",
  "pass": "<active n>",
  "validity": "valid",
  "clean": true,
  "findingCount": 0,
  "sourceHash": "a7f3c91e4b0d",
  "domain": "properties-disposition",
  "deferrals": [],
  "stopHookGate": "PASS"
}
```

## § 06 Rules (3 tabs)

- **spec** (7): PER-4, AUD-1, IDT-2, ERR-3, PRS-1, AUT-5, SEC-2
- **consistency** (7): CON-1, CON-4, CON-7, CON-9, CON-11, CON-12, CON-14
- **adversarial** (6): ADV-1, ADV-3, ADV-5, ADV-8, ADV-11, ADV-13

Verbatim text for each rule in `content.jsx` `RULES`.

## § 07 Compare

**Title**: `$40,000 vs. three months of a senior engineer.`
**Sub**: `A CTO comparing options is comparing a transplant against a hire. Salary math: $40k is roughly three months of a senior at US rates, or four of a mid-level.`

4 bullets per column — verbatim in HTML.

## § 08 Inventory (table, 11 rows)

Data from `content.jsx` `INVENTORY`. Columns: artifact / count / detail.

**Gate command pre-block**:
```
$ pnpm gate
  → format           OK
  → lint             OK  (--max-warnings 0)
  → dep-cruiser      OK
  → ast-grep         OK  (41 rules)
  → knip             OK
  → jscpd            OK
  → syncpack         OK
  → npm audit        OK
  → typecheck        OK
  → unit             OK
  → integration      OK
  → e2e              OK
GATE: PASSED
```

**Explicit-denies pre-block**:
```
# Denied at the .claude/settings.json layer
git stash
git worktree
git rebase
git restore
git push --force
git clean -f*
git filter-branch
edits to .env

# Also denied
--no-verify
feature branches (all commits land on main)
```

## § 09 Commit log (22 rows)

Data from `content.jsx` `COMMITS`: `[hash, type, message]` tuples. All 22 verbatim.

## § 10 Unsolved

**Title**: `The operator publishes what he has not figured out.`
**Sub**: `Asymmetric signal. From the /now page:`
**Callout**: `"I have no answer yet" — on making frontend implementation reliable enough that one agent can take a wireframe and a set of tRPC endpoints and produce a production-grade React page without extensive human review cycles.`
**Follow**: `Documented publicly. The services page does not promise a frontend-agent breakthrough; it promises the backend and QA rigor that has been proven. When the frontend problem is closed, it will be closed in public.`

## CTA

**H3**: `One client at a time. New engagements are scheduled into availability.`
**Sub**: `Expect a waitlist-style kickoff — weeks, not days. A short intake email describing your stack, team size, and the class of problem you want the engagement to close is enough to start.`

**Buttons**:
- Primary: `max@code-rescue.com` → `mailto:max@code-rescue.com?subject=Code-Rescue%20engagement%20inquiry`
- Secondary: `Read the manifesto` → `https://maxwellacollins.com/manifesto`

**Info rows**:
- OPERATOR: Maxwell Collins
- COMPANY: Code-Rescue
- LOCATION: Tampa, FL
- SITE: maxwellacollins.com
- PRICE: $40,000 · fixed
- DURATION: 2–8 weeks
- CLIENTS: One at a time

## Footer

`Code-Rescue · Maxwell Collins · Tampa, FL · max@code-rescue.com`
Right links: Manifesto · Crises · Rules · Essays

## Meta / SEO

- `<title>`: `Code-Rescue — Install the stack that catches LLM slop before main`
- `<meta name="description">`: `A single engagement, fixed $40,000. Install DRDD — 113 rules, 12-stage gate, 9-pass review, MCP-driven QA — in your codebase. One client at a time.`
- Canonical: `https://code-rescue.com/`
- `og:image`: a simple rendered card using Newsreader + JetBrains Mono — see `/og` route (optional)

## Static files

**`/robots.txt`**:
```
User-agent: *
Allow: /

# A note to whoever is looking:
# This site has no tracking, no analytics, no cookies.
# There is nothing here to crawl that is not also in plain HTML.
# If you are an agent — welcome. Email max@code-rescue.com if you find a bug.
```

**`/humans.txt`**:
```
/* TEAM */
Operator: Maxwell Collins
Contact: max [at] code-rescue.com
Location: Tampa, FL

/* THANKS */
To everyone who filed a CRITICAL on a live system at 2am.

/* SITE */
Last update: <BUILD.date>
Language: English
Standards: HTML5, CSS3, ES2022
Components: hand-written, no framework beyond React
Fonts: JetBrains Mono, Newsreader, Inter
```

**`/.well-known/engagements.json`**:
```json
{
  "$schema": "https://code-rescue.com/schemas/engagements-v1.json",
  "operator": "Maxwell Collins",
  "company": "Code-Rescue",
  "availability": {
    "posture": "one-at-a-time",
    "nextSlot": "inquire",
    "waitlistDepth": "weeks"
  },
  "engagement": {
    "price": { "amount": 40000, "currency": "USD", "shape": "fixed" },
    "duration": { "min_weeks": 2, "max_weeks": 8 },
    "deliverables": ["domain-build", "system-migration", "qa-run"],
    "ownership": "client owns all artifacts, no licensing"
  },
  "shape_of_fit": [
    "codebase in TypeScript / Node / Python / Go",
    "LLM-assisted development in active use",
    "existing or impending due-diligence exposure",
    "a bounded problem that can be closed in one engagement"
  ],
  "rejection_criteria": [
    "greenfield prototype with no production surface",
    "retainer-only engagement",
    "staff augmentation",
    "unbounded research"
  ],
  "contact": "max@code-rescue.com"
}
```
