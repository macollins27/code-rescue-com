# Design Tokens

All values are pinned. Do not introduce new colors, font sizes, or spacing units without updating this file first.

## Font stacks

```css
--mono:  "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace;
--serif: "Newsreader", Georgia, "Times New Roman", serif;
--sans:  "Inter", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
```

Google Fonts imports (via `next/font`):
- JetBrains Mono: weights 400, 500, 600, 700
- Newsreader: weights 400, 500, 600; italic 400; optical-sizing 6..72
- Inter: weights 400, 500, 600, 700

## Color tokens — `register: terminal` (default, shipped)

```css
--bg:           #0b0c0d;
--panel:        #111315;
--panel-2:      #15181b;
--ink:          #e8e6e1;   /* primary text */
--ink-dim:      #a7a49c;   /* secondary text */
--ink-faint:    #686560;   /* tertiary / labels */
--rule:         #26282b;   /* hairline */
--rule-strong:  #3a3d41;   /* heavy divider */
--accent:       #d9ff5c;   /* acid green */
--accent-ink:   #0b0c0d;   /* text on accent */
--ok:           #8cd47a;
--warn:         #e8b86a;
--crit:         #e87c6a;
```

## Color tokens — `register: editorial` (optional variant)

```css
--bg:           #f4f1ea;
--panel:        #ebe7de;
--panel-2:      #e2ddd1;
--ink:          #17181a;
--ink-dim:      #55524b;
--ink-faint:    #88847a;
--rule:         #cec8b8;
--rule-strong:  #b4ad9a;
--accent:       #c4410a;   /* burnt rust */
--accent-ink:   #f4f1ea;
```

## Color tokens — `register: spec` (optional variant)

```css
--bg:           #ffffff;
--panel:        #f6f6f4;
--panel-2:      #eceae4;
--ink:          #0a0a0a;
--ink-dim:      #4a4a48;
--ink-faint:    #8a8782;
--rule:         #d8d6d0;
--rule-strong:  #b0ada4;
--accent:       #1144cc;   /* RFC blue */
--accent-ink:   #ffffff;
```

## Register switching

Apply via `data-reg` on `<html>`:

```css
:root { /* terminal tokens */ }
[data-reg="editorial"] { /* editorial tokens */ }
[data-reg="spec"] { /* spec tokens */ }
```

Default (shipped) is terminal. Others live under a URL param during design review; omit from production nav.

## Typography scale

Body:
- `font-family: var(--mono)`
- `font-size: 14px`
- `line-height: 1.55`

| Role | Family | Weight | Size (clamp) | Line-height | Letter-spacing |
| --- | --- | --- | --- | --- | --- |
| H1 hero | serif | 500 | `clamp(40px, 5.6vw, 78px)` | 1.02 | −0.02em |
| H2 section | serif | 500 | `clamp(28px, 3vw, 40px)` | 1.1 | −0.01em |
| H3 case title | serif | 500 | `clamp(22px, 2.2vw, 30px)` | 1.2 | −0.01em |
| H4 card | serif | 500 | 22px | 1.25 | −0.01em |
| Lede | serif | 400 | `clamp(18px, 1.6vw, 22px)` | 1.5 | — |
| Body prose | serif | 400 | 16px | 1.65 | — |
| Mono body | mono | 400 | 13px | 1.6 | — |
| Eyebrow / label | mono | 500 | 11px | 1.45 | 0.14em uppercase |
| Meta / caption | mono | 400 | 11–12px | 1.5 | 0.08–0.12em upper |
| Stat number | mono | 600 | `clamp(28px, 3.2vw, 44px)` | 1 | −0.02em |
| Price display | mono | 600 | 72px | 1 | −0.03em |

Numbers: always `font-variant-numeric: tabular-nums`.

Text-wrap: `balance` on H1/H2; `pretty` on body paragraphs.

## Spacing

Section padding vertical: 80px (`.density-high`), 56px (`.density-tight`), 64px (default/medium).

Grid horizontal max-width: 1240px; outer padding 40px desktop, 24px mobile.

Gap between cards in grids: 2px (hairline separators via background color showing through).

## Borders

- `1px solid var(--rule)` — default hairline
- `1px solid var(--rule-strong)` — section boundaries, offer box, CTA
- No rounded corners anywhere. `border-radius: 0` is the default. Square corners are part of the aesthetic.

## Selection

```css
::selection { background: var(--accent); color: var(--accent-ink); }
```

## Focus

Never rely on the browser default. Every interactive element gets:

```css
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

## Accent

Single accent color used everywhere the design wants attention. Do not introduce a secondary brand color. The three register variants each have one accent. Status colors (`--ok`, `--warn`, `--crit`) are for the live gate and reviewer-state only; never use them for copy or chrome.
