# Components

Reusable components. Each spec: purpose → props → structure → styling notes → where used.

## StatusBar (craft-only)
**Purpose**: fixed top bar showing live build identity.
**Props**: `onOpenCmd: () => void`
**Structure**: accent dot · brand · sep · build SHA · sep · node version · sep · uptime counter · sep · live ISO clock | hint · ⌘K button
**Styling**: `position: fixed; top:0; height:26px; z-index:100; background:#050505; border-bottom:1px solid var(--rule); font:11px var(--mono); color:var(--ink-faint); padding:0 14px; gap:18px; display:flex; align-items:center;`
**Behavior**: clock updates every 1s; uptime updates every 1s; both use `tabular-nums`.

## TopBar
**Purpose**: sticky brand + nav.
**Structure**: `[CR]` mark + "Code-Rescue" wordmark + faint subdomain label | nav links (Offer, Crises, Cases, System, Engage)
**Styling**: `position:sticky; top:26px(craft)/0(default); z-index:50; border-bottom:1px solid var(--rule); backdrop-filter:blur(6px); background:color-mix(in oklab,var(--bg) 92%, transparent);`

## SectionHead
**Props**: `idx: string` (e.g. "§ 01 · Offer"), `title: ReactNode`, `sub?: ReactNode`
**Structure**: 2-col grid `[180px | 1fr]`, idx (mono 11px uppercase faint) | H2 serif + sub paragraph

## StatCard
**Props**: `n: string`, `label: string`
**Structure**: `.n` mono 600 clamp(28,3.2vw,44)px tabular-nums · `.l` mono 11px uppercase faint

## Deliverable
**Props**: `tag: string`, `title: string`, `plain: string`, `tech: ReactNode`
**Structure**: `.tag` accent uppercase 11px → H4 serif 500 22px → `.plain` serif italic 15px `--ink-dim` → `.tech` mono 12.5px `--ink-dim`
**Styling**: `border:1px solid var(--rule); padding:26px; display:flex; flex-direction:column;`

## CaseStudy
**Props**: `num, kicker, title, incident, observation, mechanism, code?, result, crises[], essay?`
**Structure**: 2-col `[200px meta | 1fr body]`; meta shows big mono number + kicker; body renders `<h3>` + 3 labeled paragraphs + optional `<pre.code>` + Result box + crisis tags
**Density**: hide Incident + Observation paragraphs + code block when `data-density` is `medium` or `tight`

## CrisisRow
**Props**: `n, name, date, desc, pull?`
**Structure**: 3-col `[64px mono-n | 200px name+date | 1fr desc+callout]`

## CodeBlock
**Props**: `children: string`
**Structure**: `<pre><code>...</code></pre>`, `--panel-2` bg, `--rule` border, mono 12.5px, `overflow-x: auto`
**Optional tokens**: `.k` accent, `.s` dim, `.c` faint italic

## NinePassViz (interactive)
**State**: `active: number` (0..8)
**Structure**: 9-col grid of `<button>` tabs; each `.pn` (PASS NN) + `.pt` (label); below: JSON block showing active pass state
**Reactivity**: clicking a tab updates `active`; JSON fields `phase`, `pass` bind to `PASSES[active]`.

## RulesExplorer (interactive)
**State**: `tab: 'spec' | 'consistency' | 'adversarial'`
**Structure**: tab bar with counts, below: list with `[160px id | 1fr text | auto layer]` rows, max-height 360 scroll
**Data**: `RULES` object from `content.md`

## Offer
**Structure**: 2-col grid `[1.2fr | 1fr]`, outer border `--rule-strong`, left-col border-right
**Left**: price `72px mono 600`, label, duration row, ownership row
**Right**: `--panel-2` bg, list of 8 installed items with accent `▸` bullets

## Compare
**Structure**: 2-col `[1fr | 1fr]`, outer border `--rule-strong`, center divider
**Right col**: `--panel` bg
**Each col**: H4 mono uppercase label + `<ul>` of 4 `<li>` with hairline separators

## InventoryTable
**Structure**: `<table>` 3-col, hover row → `--panel`
**Cells**: artifact name (ink 600), count (accent tabular-nums), detail (ink-dim)

## CommitLog
**Structure**: container `1px var(--rule)` bg `--panel`
**Each row**: 3-col `[92px hash | 96px type | 1fr msg]`, mono 12.5px, row border-top `--rule`

## CTA
**Structure**: 2-col `[1.4fr | 1fr]`, border `--rule-strong`, bg `--panel`, padding 56×48
**Buttons**: `.btn` accent + `.btn.secondary` transparent

## Footer
**Structure**: 2-col flex, mono 12px faint

---

## Craft-only components

## ScrollProgress
Thin fixed 1px line on top (below status bar), width = `scrollY / (scrollHeight - innerHeight) * 100%`, accent color with glow.

## LiveState
Fixed bottom-left panel, mono 11px, shows `reviewer-state.json` whose fields update on scroll:
- `phase`: derived from last section whose top is above viewport mid
- `pass`: count of sections scrolled past
- `validity`: `"valid"` when scrolled to bottom, else `"pending"`
- `clean`: `true` when at bottom, `false` otherwise
- `findingCount`: unread-section count
- `deferrals`: array of `"unread: §<id>"` strings
- `sourceHash`: static build SHA

## SelectionCite
Listens for `mouseup`; when a selection exists of length ≥ 12 chars, renders a pill at the selection's top-center reading `⧉ CITE · copy as quote`. Click → copies `"<text>" — Code-Rescue, <url>` to clipboard, fires toast, clears selection.

## PriceContextMenu
Listens for `contextmenu`; if target is inside `.price`, `preventDefault()` and render a menu with three rows (vs senior hire / vs incident / vs AI-consulting retainer). Dismiss on any click.

## CommandPalette
- Trigger: `⌘K` / `Ctrl+K`
- Overlay backdrop blur, centered modal 620px
- Input → filtered list → arrow keys + enter + esc
- Commands from `interactions.md`

## Cheatsheet
- Trigger: `?`
- Fixed bottom-right panel listing every keyboard binding
- Click anywhere in panel → close

## LiveGate
- Replaces the first `<pre.code>` in `§ 08 Inventory` that contains "pnpm gate"
- On mount (and on re-run event), sequentially runs 12 stages against a sample TS source string
- Each stage: show as pending → running (pulsing caret) → pass (✓) or fail (✗) with ms timing
- Final row: `GATE: PASSED` or `GATE: FAILED · N failures`
- Sample source + rule-pack lives in `interactions.md`

## SystemInfo
Injected above `<footer>`: 4-col mono 11px grid with Build / Runtime / Gate / Uptime / Viewport / TZ / Rendered / Hand-formatted cells. Uptime + viewport update live.

## Console banner
On first load, `console.log` a multi-line box containing the puzzle (ast-grep / CON-9) and contact info. Styled via `%c` CSS.
