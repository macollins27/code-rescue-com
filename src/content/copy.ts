/* All prose copy for the page. No string literals in components — import from here. */

export const HERO = {
  eyebrow: "Code-Rescue · Services · One client at a time",
  headlineHtml:
    "The LLM shipped slop. Install the stack that catches it <em>before</em> it lands on main.",
  lede: "A single engagement. A fixed $40,000. DRDD — Domain-Rules-Driven Development — installed in your codebase, tuned to your stack, with one substantial deliverable shipped under the pipeline it enforces. You own every piece. No licensing, no retainers.",
  thesisLabel: "Canonical thesis",
  thesisQuote:
    "If you can't write an assertion for a specification, you don't have a specification yet.",
  thesisSourceName: "Maxwell Collins",
  thesisSourceHref: "https://maxwellacollins.com/about",
  thesisSourceLabel: "maxwellacollins.com/about",
} as const;

export const POSTURE = {
  idx: "§ 00 · Posture",
  title: "This is not AI consulting.",
  sub: 'The market is saturated with "AI transformation" and "AI-assisted development" pitches. The buyer on this page has trained themselves to ignore that category. What ships below is working infrastructure — commits, hooks, rules, gates, test suites — iterated across dozens of multi-hour sessions on a real production rebuild. Every rule traces to a specific observed failure documented in public.',
  columns: [
    {
      label: "What it is",
      body: "Installed enforcement infrastructure plus one substantial shipped deliverable. You choose the deliverable at kickoff.",
    },
    {
      label: "What it isn't",
      body: 'Staff augmentation. Fractional CTO. Training. Workshops. Slide decks. Code-by-the-hour. Generic "AI consulting."',
    },
    {
      label: "Credibility wall",
      body: "A published manifesto, dated incident essays, a browseable rules explorer, a live commit log. Every claim on this page ties to an artifact or a number.",
    },
  ],
} as const;

export const OFFER = {
  idx: "§ 01 · Offer",
  title: "One engagement. Fixed scope. Fixed price.",
  sub: "The full DRDD stack installed in your codebase, configured to your domain, plus one substantial deliverable shipped under the pipeline it enforces.",
  price: "$40,000",
  priceLabel: "Fixed price · single engagement · one client at a time",
  durationLabel: "Typical duration",
  duration: "4–8 weeks for deliverable (a) or (b) · 2–3 weeks for (c)",
  ownershipLabel: "You own everything",
  ownershipLine1: "No licensing · No ongoing fees · No lock-in",
  ownershipLine2: "Modify, extend, delete, or fork any piece of it.",
  installedLabel: "Installed in every engagement",
  installed: [
    "12-stage quality gate (pnpm gate / gate:static) tuned to your stack",
    "~24 runtime hooks + 48 hookify rules + 41 ast-grep structural rules",
    "Domain-rules authorship system: per-domain .md spec files, source-first pipeline",
    "Feature-level pipeline with per-layer fan-out and multi-agent review panel",
    "LLM-driven QA harness with stdio MCP emission + triple-verdict verification",
    "Persistent cross-session memory system auto-loaded into every session",
    "9-pass adversarial review skill with mechanical phase gate",
    "Six GitHub Actions workflows (ci, compliance, deploy, migration-check, qa, security)",
  ],
  chooseLabel: "Choose one deliverable at kickoff",
} as const;

export const OUTCOME = {
  idx: "§ 02 · After the engagement",
  title: "What is true of your codebase that wasn't before.",
  sub: "A junior engineer, internal or AI, reads the spec to learn what the system does. Source code has zero authority against the rules. Phase completion is a file on disk with a validity flag, a source hash, and a clean count — not a prose claim in a PR description.",
  stats: [
    { n: "~113", l: "Mechanical rules guarding every AI-authored commit" },
    { n: "12", l: "Gate stages between commit and the primary branch" },
    { n: "9", l: "Adversarial review passes ending in a mechanical phase marker" },
    { n: "5", l: "Enforcement layers — write-time, gate-time, runtime, lifecycle, session" },
  ],
  narrative: [
    {
      h: "Defect classes made mechanically impossible or mechanically caught",
      b: "Fake tests. Silent spec drift. Orchestrator lies. IDOR from forgotten org-scoping. Probabilistic flake-demotion. CSP-blocked emission. Attention-exhaustion compression. Rogue subagents racing shared state. Each one traces to a dated incident in the commit log.",
    },
    {
      h: "Due-diligence exposure drops meaningfully",
      b: "Classes previously surfaced in acquirer code review, SOC 2, or enterprise security review — hardcoded secrets, unsafe cryptography, missing audit-log entries, org-scoping bypasses, tests not exercising production code, framework-version drift — are blocked at commit time.",
    },
    {
      h: "Every procedure has a written specification",
      b: "Inputs, outputs, error codes, audit behavior, permissions, adversarial contract. A future engineer reads the rules, not the code, to learn what the system must do.",
    },
    {
      h: "Knowledge transfer by co-presence",
      b: "Your team watches the stack install, the rules authored, the pipeline run, the deliverable ship. DRDD becomes a live reference in your own codebase, not an abstract methodology.",
    },
  ],
} as const;

export const CRISES_SEC = {
  idx: "§ 03 · Three crises",
  title: "The classes of failure this stack was built to catch.",
  subHtml:
    "Three named, dated incidents. Each one shares the same root, published on the existing site: <em>prose specifications are easier to satisfy than machine-testable ones.</em> Every crisis maps to one or more case studies below.",
} as const;

export const CASES_SEC = {
  idx: "§ 04 · Case studies",
  title: "Seven engineering problems, encountered in private, closed with mechanism.",
  sub: "Each one describes the incident, the root-cause observation, the mechanism installed to close the failure class, and the measured result. All claims are grounded in committed work in a production monorepo.",
} as const;

export const NINE_PASS = {
  idx: "§ 05 · 9-pass review",
  title: "Phase completion is a file on disk, not a claim in a PR.",
  subHtml:
    'Nine sequential passes walk the domain source. A Stop hook blocks phase completion unless <span class="path">reviewer-state.json</span> shows <span class="path">validity: valid</span>, <span class="path">clean: true</span>, and <span class="path">sourceHash</span> matching HEAD. Click a pass to see its scope.',
} as const;

export const RULES_SEC = {
  idx: "§ 06 · Rules",
  title: "~3,500 rule statements across 24 domains. A sample.",
  subHtml:
    'The full rule set lives at <a class="link" href="https://maxwellacollins.com/rules">maxwellacollins.com/rules</a>. Rules are monotonic — they strengthen or multiply but never delete. Below: a filtered view of the three layers every domain is classified into.',
} as const;

export const COMPARE = {
  idx: "§ 07 · The comparison",
  title: "$40,000 vs. three months of a senior engineer.",
  sub: "A CTO comparing options is comparing a transplant against a hire. Salary math: $40k is roughly three months of a senior at US rates, or four of a mid-level.",
  hire: {
    label: "Hiring the engineer",
    bullets: [
      "Weeks 1–3 onboarding. Weeks 4–8 building infrastructure they'll learn is wrong on contact with reality.",
      "Month three: reaches your actual product problem. Enforcement infrastructure still not production-hardened.",
      "Has not seen a test suite pass with 4,800 tautologies, a probabilistic healer demote a real CRITICAL, or 72 concurrent subagents race shared storage-state. Learns these in your production.",
      "Permanent operational cost. Salary, benefits, management overhead.",
    ],
  },
  engagement: {
    label: "The engagement",
    bullets: [
      "Week one: the iterated, production-hardened stack installs in your codebase. Rules tuned to your stack. Gate green.",
      "Proof-of-value deliverable (a/b/c) ships during the same window — not in month three.",
      "Encodes failure history a new hire does not have. Every rule traces to a specific observed incident with a date.",
      "Fixed payment for installed infrastructure you own outright. No licensing, no retainer, no lock-in.",
    ],
  },
} as const;

export const INVENTORY_SEC = {
  idx: "§ 08 · Inventory",
  title: "The underlying system, by count.",
  sub: "Raw counts and artifact names for the buyer who wants to know what's installing. Stack-neutral: hooks are shell, hookify rules are regex, ast-grep rules are language-configurable, the domain-rules system is plain Markdown, the gate is composable per language, the QA harness uses Playwright and MCP.",
  gateCommand: `$ pnpm gate
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
GATE: PASSED`,
  denies: `# Denied at the .claude/settings.json layer
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
feature branches (all commits land on main)`,
} as const;

export const COMMIT_LOG = {
  idx: "§ 09 · Evidence",
  title: "Recent commits on the primary branch.",
  subHtml:
    'Most recent first. Every commit passes <span class="path">pnpm gate:static</span> before push. No feature branches, no <span class="path">--no-verify</span>, no force-push, no <span class="path">git stash</span>. The entire history of the stack is legible at the repo.',
} as const;

export const UNSOLVED = {
  idx: "§ 10 · What isn't solved",
  title: "The operator publishes what he has not figured out.",
  subHtml:
    'Asymmetric signal. From the <a class="link" href="https://maxwellacollins.com/now">/now</a> page:',
  callout:
    '"I have no answer yet" — on making frontend implementation reliable enough that one agent can take a wireframe and a set of tRPC endpoints and produce a production-grade React page without extensive human review cycles.',
  follow:
    "Documented publicly. The services page does not promise a frontend-agent breakthrough; it promises the backend and QA rigor that has been proven. When the frontend problem is closed, it will be closed in public.",
} as const;

export const CTA = {
  h3: "One client at a time. New engagements are scheduled into availability.",
  sub: "Expect a waitlist-style kickoff — weeks, not days. A short intake email describing your stack, team size, and the class of problem you want the engagement to close is enough to start.",
  primary: {
    label: "max@code-rescue.com",
    href: "mailto:max@code-rescue.com?subject=Code-Rescue%20engagement%20inquiry",
  },
  secondary: {
    label: "Read the manifesto",
    href: "https://maxwellacollins.com/manifesto",
  },
  info: [
    ["OPERATOR", "Maxwell Collins"],
    ["COMPANY", "Code-Rescue"],
    ["LOCATION", "Tampa, FL"],
    ["SITE", "maxwellacollins.com", "https://maxwellacollins.com"],
    ["PRICE", "$40,000 · fixed"],
    ["DURATION", "2–8 weeks"],
    ["CLIENTS", "One at a time"],
  ] as ReadonlyArray<readonly [string, string, string?]>,
} as const;

export const FOOTER = {
  left: "Code-Rescue · Maxwell Collins · Tampa, FL · ",
  email: "max@code-rescue.com",
  links: [
    { label: "Manifesto", href: "https://maxwellacollins.com/manifesto" },
    { label: "Crises", href: "https://maxwellacollins.com/crises" },
    { label: "Rules", href: "https://maxwellacollins.com/rules" },
    { label: "Essays", href: "https://maxwellacollins.com/writing" },
  ],
} as const;
