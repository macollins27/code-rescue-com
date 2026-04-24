# code-rescue.com

The services page for Code-Rescue. One engagement, fixed price, one client at a time.

Built with Astro + TypeScript (strict). Deployed to Cloudflare Pages. No tracking, no
analytics, no third-party network requests. The page is the argument: if the infrastructure
that enforces quality on your codebase can't pass Lighthouse 100 on its own marketing site,
it wasn't going to enforce anything on yours either.

## Stack

- **Framework**: Astro 5 (static output)
- **Language**: TypeScript, strict mode, `noUncheckedIndexedAccess`
- **Styling**: Plain CSS with CSS custom properties; no framework
- **Fonts**: Self-hosted via `@fontsource-variable` (JetBrains Mono, Newsreader, Inter)
- **Interactivity**: React islands (craft layer only)
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

Every commit has to pass the gate. A pre-commit hook runs formatting; CI runs the rest.

## Deployment

Cloudflare Pages picks up pushes to `main`. Build command: `pnpm build`. Output: `dist/`.

Preview builds go to `<branch>.code-rescue.pages.dev`. Production is `code-rescue.com`.

## What lives where

```
src/
  components/   # Astro components (static) + React islands (craft layer)
  content/      # Typed content modules — copy, cases, crises, rules, commits, inventory
  layouts/      # Base.astro shell
  pages/        # Single route at /
  styles/       # tokens.css + global.css, no per-component CSS modules
public/
  .well-known/engagements.json
  humans.txt
  robots.txt
  _headers      # Cloudflare Pages response headers (CSP, cache, HSTS)
design/         # Design docs (not shipped; reference only)
```

## License

All rights reserved. Ask before reusing.
