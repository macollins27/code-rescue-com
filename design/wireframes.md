# Wireframes

ASCII wireframes + layout specs for every section, top to bottom. Each section has: purpose, layout grid, content slots, and component references.

Page column: `max-width: 1240px` centered, 40px outer gutter.

---

## 0. Status bar (craft-only, fixed top, 26px)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ● code-rescue │ build a7f3c91 │ node 22.11.0 │ uptime-since-green 1d 2h 18m      │
│ │ 2026-04-24T14:32:07-05:00          press ? for keys · ⌘K command   [ ⌘K ]    │
└─────────────────────────────────────────────────────────────────────────────────┘
```
- Monospace 11px, `--ink-faint`
- `●` accent dot with `box-shadow: 0 0 6px var(--accent)`
- Live clock updates 1/s
- Uptime counter updates 1/s
- Right side: hint text + `⌘K` button

## 1. Top bar (sticky, 56px)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [CR] Code-Rescue  MAXWELLACOLLINS.COM        Offer  Crises  Cases  System  Engage │
└─────────────────────────────────────────────────────────────────────────────────┘
```
- `[CR]` 22×22px accent square, mono 700 13px, accent-ink
- Brand stack: mark → "Code-Rescue" → faint subdomain label
- Nav: 5 anchor links, mono 12px, `--ink-dim`, hover → `--ink`
- Border-bottom 1px `--rule`
- Backdrop-filter blur

## 2. Hero (72px top, 56px bottom)

```
● Code-Rescue · Services · One client at a time

The LLM shipped slop.
Install the stack that
catches it *before* it
lands on main.▊

The lede paragraph sits below the headline in
a serif at 18–22px. Two short paragraphs max.
Hints at DRDD, fixed price, deliverable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CANONICAL  │ "If you can't write an assertion      │ — Maxwell
 THESIS    │  for a specification, you don't have  │   Collins,
           │  a specification yet."                │   /about
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
- Eyebrow: mono 11px uppercase, accent dot
- H1: serif 500, `em` on "before" in accent italic
- H1 trailing caret (craft-only, blinking)
- Lede: serif 18–22px, `--ink-dim`, 62ch max
- Thesis: 3-col grid [140px label | flex quote | auto source], top/bottom borders `--rule-strong`

## 3. § 00 Posture

```
§ 00 · POSTURE │ This is not AI consulting.
                 The market is saturated with "AI transformation"
                 pitches. The buyer on this page has trained
                 themselves to ignore that category...

┌──────────────┬──────────────┬──────────────┐
│ WHAT IT IS   │ WHAT IT ISN'T│ CREDIBILITY  │
│ Installed    │ Staff aug.   │ Published    │
│ enforcement  │ Fractional   │ manifesto,   │
│ infra +      │ CTO. Training│ dated incident│
│ one shipped  │ Workshops.   │ essays, live │
│ deliverable. │ Slide decks. │ commit log.  │
└──────────────┴──────────────┴──────────────┘
```
- Section head grid: `[180px idx | 1fr headline + sub]`
- 3-col grid below with hairline separators, each cell 24px padding

## 4. § 01 Offer

```
§ 01 · OFFER │ One engagement. Fixed scope. Fixed price.

┌──────────────────────────┬──────────────────────────┐
│                          │ INSTALLED IN EVERY       │
│   $40,000                │ ENGAGEMENT               │
│                          │                          │
│   Fixed price · single   │ ▸ 12-stage quality gate  │
│   engagement · one at    │ ▸ ~24 runtime hooks      │
│   a time                 │ ▸ Domain-rules system    │
│                          │ ▸ Feature pipeline       │
│   Typical duration       │ ▸ LLM-driven QA harness  │
│   4–8 weeks              │ ▸ Memory system          │
│                          │ ▸ 9-pass review          │
│   You own everything     │ ▸ GitHub Actions x6      │
└──────────────────────────┴──────────────────────────┘

CHOOSE ONE DELIVERABLE AT KICKOFF

┌──────────────┬──────────────┬──────────────┐
│ a · DOMAIN   │ b · MIGRATION│ c · QA RUN   │
│ BUILD        │              │              │
│ One audit-   │ One system-  │ Install +    │
│ grade domain │ wide migra-  │ run the QA   │
│ end-to-end   │ tion spec-   │ harness on   │
│ from spec.   │ first.       │ your app.    │
└──────────────┴──────────────┴──────────────┘
```
- Offer box: 2-col grid [1.2fr | 1fr], border `--rule-strong`
- Left: price + duration + ownership
- Right: bullet list with accent `▸` markers, hairlines between items
- Below offer: "choose one deliverable" label + 3-col grid of deliverable cards
- Each deliverable card: tag (uppercase accent) → serif title → serif-italic plain-english → mono technical detail

## 5. § 02 After the engagement

```
§ 02 · AFTER  │ What is true of your codebase that wasn't before.

┌──────┬──────┬──────┬──────┐
│ ~113 │  12  │   9  │   5  │
│ rules│ gate │review│ layers│
└──────┴──────┴──────┴──────┘

┌──────────────────┬──────────────────┐
│ Defect classes   │ Due-diligence    │
│ made impossible  │ exposure drops   │
├──────────────────┼──────────────────┤
│ Every procedure  │ Knowledge        │
│ has a spec       │ transfer         │
└──────────────────┴──────────────────┘
```
- 4-col stat grid up top (StatCard component)
- 2×2 grid below of narrative cells

## 6. § 03 Three crises

```
§ 03 · THREE  │ Three named, dated incidents.
  CRISES      │ Each one shares the same root.

  01  │ Scope Narrowing                │ Agents optimize for tractable
      │ Incident: Feb 21, 2026         │ aspects of requirements. Feb
      │                                │ 21, 2026...
  ────┼────────────────────────────────┼───────────────────────────
  02  │ Documentation Contamination    │ Agents produce internally
      │ Incident: Feb 26–27, 2026      │ consistent docs...
      │                                │ "Agents cannot read their
      │                                │  own genre as source of truth"
  ────┼────────────────────────────────┼───────────────────────────
  03  │ Simulated Reasoning            │ ...
      │ Incident: Mar 1, 2026          │
```
- 3-col grid: `[64px number | 200px name+date | 1fr description]`
- Number: mono 28px, accent
- Name: serif 20px, 500
- Description: serif 15.5px, `--ink-dim`; optional pull-quote callout with accent left-border

## 7. § 04 Case studies

```
§ 04 · CASES  │ Seven problems, closed with mechanism.

  01   │ An LLM-driven QA harness producing 53 filed
  QA   │ issues in one end-to-end run.
harness│
       │ INCIDENT    Browser-level QA at scope...
       │ OBSERVATION A working LLM-driven QA harness
       │             requires several orthogonal...
       │ MECHANISM   66 flow YAMLs across auth, hub...
       │ ┌──────────────────────────────────────────┐
       │ │ RESULT  One clean end-to-end run         │
       │ │         produced 152 raw findings...     │
       │ └──────────────────────────────────────────┘
       │ ↳ Scope Narrowing  ↳ Documentation Contamination
```
- Each case: 2-col grid `[200px meta | 1fr body]`, top border `--rule`
- Meta left: large mono number + kicker
- Body: serif h3 title + Incident/Observation/Mechanism paragraphs with mono label column
- Embedded `<pre.code>` for the ast-grep YAML (case 02)
- Result box: `--panel` background, `--rule` border, 18×22 padding
- Crisis tags: 1px accent border, uppercase accent text
- 7 cases total. Collapse `Incident` and `Observation` paragraphs when `data-density="medium"` or `"tight"`.

## 8. § 05 9-pass review (interactive)

```
§ 05 · 9-PASS │ Phase completion is a file on disk.

┌────┬────┬────┬────┬────┬────┬────┬────┬────┐
│ 00 │ 01 │ 02 │ 03 │ 04 │ 05 │ 06 │ 07 │ 08 │
│shrd│proc│inp │qry │err │aud │rsp │sec │eng │
└────┴────┴────┴────┴────┴────┴────┴────┴────┘

$ cat .review/reviewer-state.json
{
  "phase": "Shared infrastructure",
  "pass": "00",
  "validity": "valid",
  "clean": true,
  ...
}
```
- 9 equal-width clickable tabs; active tab fills with accent, text flips to `accent-ink`
- Below: reviewer-state JSON block, `--panel-2` bg, mono 12.5px, syntax-colored (keys accent, string values ink-dim, booleans ok/crit)

## 9. § 06 Rules (tabbed)

```
§ 06 · RULES  │ ~3,500 rule statements. A sample.

┌──────────┬──────────────┬──────────────┐
│SPEC [ 7 ]│CONSISTENCY[7]│ADVERSARIAL[6]│
└──────────┴──────────────┴──────────────┘
┌─────────────────────────────────────────────┐
│ PER-4   │ Permissions checked at router...  │ spec │
│ AUD-1   │ Every mutation writes one audit...│ spec │
│ IDT-2   │ All user-facing IDs are ULIDs...  │ spec │
│ ...                                                 │
└─────────────────────────────────────────────┘
```
- Tab bar; active tab: accent bg + accent-ink
- List: 3-col grid `[160px id | 1fr text | auto layer]`
- Row: mono 12.5px, id in accent, layer in uppercase faint
- `max-height: 360px; overflow-y: auto` on the list

## 10. § 07 Compare (2-col)

```
§ 07 · COMPARE │ $40,000 vs. three months of a senior.

┌──────────────────┬──────────────────┐
│ HIRING THE       │ THE ENGAGEMENT   │
│ ENGINEER         │                  │
│                  │ (panel-bg cell)  │
│ ● Weeks 1–3...   │ ● Week one...    │
│ ● Month three... │ ● Proof of value │
│ ● Has not seen...│ ● Encodes history│
│ ● Perm cost...   │ ● Fixed payment  │
└──────────────────┴──────────────────┘
```
- 2-col grid, 1px `--rule-strong` border + divider
- Right column: `--panel` background
- H4 mono uppercase label
- `<ul>` serif 16px list, hairlines between items

## 11. § 08 Inventory (table + code blocks)

```
§ 08 · SYSTEM │ The underlying system, by count.

┌──────────────────────┬──────┬──────────────────────────┐
│ ARTIFACT             │ COUNT│ DETAIL                   │
├──────────────────────┼──────┼──────────────────────────┤
│ Pipeline skills      │ 29   │ contract, build-source...│
│ Domain rule files    │ 42   │ ~3,500 rule statements...│
│ Runtime hook scripts │ ~24  │ ~3,600 shell LOC...      │
│ ... 11 rows total                                        │
└──────────────────────┴──────┴──────────────────────────┘

┌──────────────────────┬──────────────────────┐
│ GATE COMMAND         │ EXPLICIT DENIES      │
│ $ pnpm gate          │ # Denied at .claude/ │
│   → format      OK   │ git stash            │
│   → lint        OK   │ git worktree         │
│   ... 12 stages      │ ...                  │
└──────────────────────┴──────────────────────┘
```
- Table: 3 cols, hairline between rows, hover row → `--panel` bg
- Count cell: accent color, tabular-nums
- Below table: 2-col grid of two `<pre.code>` blocks
- **Craft-only**: the left code block (GATE COMMAND) is replaced by `<LiveGate />` — see `components.md`.

## 12. § 09 Commit log (craft-optional, terminal-only)

```
§ 09 · EVIDENCE │ Recent commits on main.

┌──────────┬──────────┬─────────────────────────────────┐
│ 57be3e8  │ feat(qa) │ replace probabilistic healer... │
│ a1c2f43  │ chore    │ consolidate pipeline-v2...      │
│ b2e118a  │ feat(pip)│ canonical-identity migration... │
│ ... 22 rows                                            │
└──────────┴──────────┴─────────────────────────────────┘
```
- 3-col grid per row: `[92px hash | 96px type | 1fr message]`
- hash: `--ink-faint`; type: accent (except `chore` which is `--ink-dim`); message: `--ink`
- 22 rows, no scroll — full list visible
- Wrapped in `--rule` border

## 13. § 10 What isn't solved

```
§ 10 · UNSOLVED │ The operator publishes what he hasn't figured out.

    "I have no answer yet" — on making frontend
    implementation reliable enough that one agent
    can take a wireframe and a set of tRPC endpoints...

Documented publicly. The services page does not promise a
frontend-agent breakthrough; it promises the backend and QA...
```
- Callout: serif 22px italic, accent left border 2px, `--panel` bg, 24×28 padding
- Follow with a short serif-dim paragraph

## 14. CTA

```
┌───────────────────────────────────────────────────────────┐
│ One client at a time. New engagements are      OPERATOR   │
│ scheduled into availability.                   Maxwell... │
│                                                COMPANY    │
│ Expect a waitlist-style kickoff — weeks,       Code-Rescue│
│ not days. A short intake email...              LOCATION   │
│                                                Tampa, FL  │
│ [↪ max@code-rescue.com]  [Read the manifesto] SITE       │
│                                                maxwell... │
└───────────────────────────────────────────────────────────┘
```
- 2-col grid `[1.4fr | 1fr]`, border `--rule-strong`, `--panel` bg
- Left: H3 serif + lede-style sub + two buttons
- Right: key-value rows, mono, 96px label col + value col
- Primary button: accent bg, accent-ink text, mono 13px
- Secondary button: transparent, `--ink` text, `--rule-strong` border

## 15. Footer

```
────────────────────────────────────────────────────────────
Code-Rescue · Maxwell Collins · Tampa, FL · max@...
                     Manifesto · Crises · Rules · Essays
```
- 2-col flex, mono 12px, `--ink-faint`

## 16. System info (craft-only, above footer)

```
────────────────────────────────────────────────────────────
BUILD              RUNTIME            GATE               UPTIME
a7f3c91 · 2026... node 22.11.0 ...  12-stage · ...     1d 2h 18m 04s
VIEWPORT           TZ                 RENDERED           HAND-FMT
1920×1080          America/New_York   2026-04-24T...     yes · note
```
- 4-col grid, mono 11px
- Live uptime + viewport updating
