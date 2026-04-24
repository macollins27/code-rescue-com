# code-rescue.com

The services page for Code-Rescue. One engagement, price fixed at kickoff, one client at a time.

Built with Astro + TypeScript (strict). Deployed to Cloudflare Pages. No tracking, no
analytics, no third-party network requests.

## Stack

- **Framework**: Astro 6 (static output)
- **Language**: TypeScript, strict mode, `noUncheckedIndexedAccess`
- **Styling**: Plain CSS with CSS custom properties; no framework
- **Fonts**: Self-hosted via `@fontsource-variable` (Newsreader, JetBrains Mono, Inter)
- **Interactivity**: one inline `<script>` — the footer live clock. No client framework.
- **Hosting**: Cloudflare Pages
- **Node**: 22 LTS (pinned via `.nvmrc`)
- **Package manager**: pnpm 10

## Local development

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

## The gate

```bash
pnpm gate       # format:check + lint + typecheck + build
```

Every commit has to pass the gate. A pre-commit hook runs formatting; CI runs the full gate.

## Deployment

Cloudflare Pages picks up pushes to `main`. Build command: `pnpm build`. Output: `dist/`.

Preview builds go to `<branch>.code-rescue-com.pages.dev`. Production is `code-rescue.com`.

## What lives where

```
src/
  components/   # 12 Astro section components
  content/      # Typed content modules — copy, incidents, deliverables, compare, installed, pipeline
  layouts/      # Base.astro shell
  pages/        # Single route at /
  styles/       # tokens.css + fonts.css + global.css (includes section shell)
public/
  .well-known/engagements.json
  humans.txt
  robots.txt
  favicon.svg
  _headers      # Cloudflare Pages response headers (CSP, cache, HSTS, Permissions-Policy)
design/         # Design docs (not shipped; reference only)
```

## Branches

- `main` — current design (warm cream + forest green, VP/CTO buyer audience)
- `archive/terminal-v1` — earlier technical-audience design (dark terminal + acid green). Preserved for reference; not deployed.

## License

All rights reserved. Ask before reusing.
