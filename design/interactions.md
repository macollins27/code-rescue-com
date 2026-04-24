# Interactions — craft-layer spec

Every behavior that makes the page feel built by hand. Implement in this order; each step should ship green before the next is attempted.

## 1. Build info object

One module-level constant seeds the live chrome:
```ts
export const BUILD = {
  sha: process.env.NEXT_PUBLIC_GIT_SHA ?? "a7f3c91",
  date: process.env.NEXT_PUBLIC_BUILD_DATE ?? new Date().toISOString().slice(0, 10),
  node: process.versions?.node ?? "22.11.0",
  pkgs: 847,
  bornAt: Date.now() - (1000 * 60 * 60 * 26 + 1000 * 60 * 18),
};
```
In production, wire `NEXT_PUBLIC_GIT_SHA` + `NEXT_PUBLIC_BUILD_DATE` from CI.

## 2. Live clock

`useEffect` `setInterval` 1000ms → set `new Date()`. Format: ISO 8601 with TZ offset, e.g. `2026-04-24T14:32:07-05:00`.

## 3. Uptime counter

Same interval, compute `Date.now() - BUILD.bornAt`, format as `Nd Nh Nm Ns`. Below an hour, omit days/hours.

## 4. Scroll progress

Listen `scroll` (`passive: true`), compute `scrollY / (scrollHeight - innerHeight) * 100`, write to inline `style.width`. 1px high, accent color, `box-shadow: 0 0 8px var(--accent)`, top:`26px` (below status bar), `transition: width 60ms linear`.

## 5. Blinking caret

Append `<span class="caret">` to the hero `<h1>`. CSS:
```css
.caret { display:inline-block; width:0.55em; height:0.92em; background:var(--accent); margin-left:0.1em; vertical-align:-0.08em; animation: blink 1.05s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .caret { animation: none; } }
```

## 6. Keyboard router

One `keydown` listener on window. Ignore events originating in `INPUT`, `TEXTAREA`, or `contenteditable`.

| Key | Action |
| --- | --- |
| `⌘K` / `Ctrl+K` | Toggle command palette |
| `?` | Toggle cheatsheet |
| `g` then `o` | Scroll to `#offer` |
| `g` then `x` | Scroll to `#crises` |
| `g` then `c` | Scroll to `#cases` |
| `g` then `i` | Scroll to `#system` |
| `g` then `e` | Scroll to `#engage` |
| `d` | Cycle density (tight → medium → high → tight) |
| `r` then `g` | Re-run the live gate |
| `Escape` | Reset key buffer; close overlays |

Buffer resets after 900ms of idleness.

## 7. Command palette (⌘K)

- Modal centered, 620px, backdrop blur 6px
- Input autofocus on open; clears on close
- `COMMANDS` list (see `craft.jsx`) — 11 items
- Fuzzy filter: match if label or hint contains substring (case-insensitive)
- Arrow up/down moves selection; `Enter` runs; `Escape` closes
- Hover on a row sets it as selected
- Foot shows result count

## 8. Cheatsheet (`?`)

Bottom-right fixed panel, mono 12px, one row per binding. Click anywhere in panel to dismiss.

## 9. Live reviewer-state panel

Bottom-left fixed. Tracks 5 section ids: `offer`, `crises`, `cases`, `system`, `engage`.

On each scroll event:
- `viewed` = section ids whose `bbox.top < innerHeight * 0.5`
- `atBottom` = `scrollY + innerHeight >= scrollHeight - 120`
- `phase` = label mapped from `viewed[last]`, or `"reading-hero"` if none
- `pass` = `viewed.length`
- `validity` = `atBottom ? "valid" : "pending"`
- `clean` = `atBottom`
- `findingCount` = `atBottom ? 0 : (5 - viewed.length)`
- `deferrals` = `atBottom ? [] : unread.map(id => "unread: §" + id)`
- `sourceHash` = `BUILD.sha`

Render as JSON with syntax colors: keys accent, strings ink-dim, booleans ok/crit, numbers ok/crit.

## 10. Selection-cite pill

`mouseup` listener; after 10ms, read `window.getSelection()`. If collapsed or `text.trim().length < 12`, hide. Otherwise position pill at `(range.left + range.width/2, range.top)` with `transform: translate(-50%, -130%)`.

Click → `navigator.clipboard.writeText('"' + text.slice(0,140) + (text.length > 140 ? "…" : "") + '" — Code-Rescue, ' + url)`, fire toast `citation copied`, clear selection.

## 11. Paragraph anchors

After initial render, walk every `case .body p`, `case .body .result`, `crisis-row .desc`, `deliverable`, `rx-item`. For each: assign `id="L###"` (zero-padded index), append `<a class="anchor-pin" href="#L###">#L###</a>`. Pin shows at `left: -28px`, opacity 0 by default, opacity 1 on parent hover.

Click → copy permalink to clipboard, fire toast `anchor #L### copied`.

## 12. Custom context menu on price

`contextmenu` listener on document. If `target.closest(".price")`, `preventDefault()` and render `<PriceContextMenu>` at `(clientX, clientY)`, clamped to viewport. Dismiss on any click. Three rows (copy in `content.md`).

## 13. In-browser live gate

Mounts where the GATE COMMAND `<pre.code>` used to be.

Sample source to run against (inline constant):
```ts
// see craft.jsx SAMPLE — a realistic tRPC router for a properties domain
```

Rule pack (12 stages):
| Name | ms (target) | Check |
| --- | --- | --- |
| format | 42 | always true |
| lint | 128 | strip comments, then: no `console.log`, no `/:\s*any\b|<any>|any\[\]|\bas\s+any\b/` |
| dep-cruiser | 71 | no `../../../` |
| ast-grep | 94 | no `uuidv4`; no `aes-cbc`; no unbounded `z.string()` (must be followed by `.max/.min/.length/.regex/.email/.url/.uuid`) |
| knip | 88 | always true |
| jscpd | 62 | always true |
| syncpack | 29 | always true |
| npm-audit | 201 | always true |
| typecheck | 612 | always true |
| unit | 445 | `auditLog(` appears in source |
| integration | 384 | always true |
| e2e | 512 | always true |

Runner:
- Sequential
- Each stage: set `status="running"` → after `max(80, target * 0.25)` ms, compute `pass` with the check, set `status="pass"` or `status="fail"` with a real `performance.now()` delta
- After all stages, show `GATE: PASSED` or `GATE: FAILED · N failures` with wall-clock time
- `↻ re-run` button in the top-right resets state and runs again
- Listens for `cr:rungate` custom event (dispatched by the `r g` keybinding and the palette's "Re-run" command)

Visual: each row is a 4-col grid `[16px mark | 120px name | 60px ms | 1fr note]`. Pass ✓ accent; fail ✗ crit; running ● warn blinking; pending ◦ faint.

## 14. Console banner

On initial client render (one-shot):
```js
console.log("%c<banner>...%c", headerStyle, dimStyle)
```
Banner is a box-drawn ASCII block with the CON-9 / ast-grep puzzle.

## 15. Toast

Single shared element, created on first call, `position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 220; background: var(--accent); color: var(--accent-ink); padding: 10px 16px; font-family: var(--mono); font-size: 12px;`. Timer clears previous, hides after 1800ms.

## 16. System-info footer block

Injected above `<footer>` on mount. 4-col grid, 8 cells:
- Build (sha · date)
- Runtime (node N.N.N · 847 pkgs · zero vuln)
- Gate (12-stage · max-warnings 0 · --strict-mcp-config)
- Uptime since last break (live)
- Viewport (live, updates on `resize`)
- TZ (`Intl.DateTimeFormat().resolvedOptions().timeZone`)
- Rendered (ISO at render time, not live)
- Hand-formatted (`yes · view-source has a note`)

## 17. View-source note

In the shipped HTML head (via Next.js `<head>`):
```html
<!--
  ── CODE-RESCUE ──────────────────────────────────────────
  You opened view-source. Welcome.

  This page is hand-laid. Markup is canonical HTML5 —
  every non-void element closes explicitly, every attribute
  is double-quoted, no self-closing on non-void tags.

  There is no tracking, no analytics, no third-party scripts.
  Fonts are self-hosted. JS is <40KB gzipped.

  If you find a bug, email max@code-rescue.com.

  Puzzle: which three-character tool enforces rule CON-9
  (no UUIDv4) at commit time? First correct email moves
  up the waitlist by one slot.
  ─────────────────────────────────────────────────────────
-->
```

## 18. Graceful degradation

Every craft-layer component must guard against SSR (`typeof window === "undefined"`) and must render nothing server-side — they're all `"use client"` + `useEffect`-gated.

With JS disabled, the static page should still render identically minus: status bar, scroll progress, caret, live state, cite pill, palette, cheatsheet, price context menu (native contextmenu takes over), live gate (shows the static `<pre>` fallback), system-info block.
