// All page content lives here as plain JS data.

const CASES = [
  {
    num: "01",
    kicker: "QA harness",
    title: "An LLM-driven QA harness producing 53 filed issues in one end-to-end run.",
    incident: "Browser-level QA at scope for a multi-product application is typically manual (slow, expensive, inconsistent) or scripted (high-maintenance, low-discovery). LLM auditors without mechanical discipline produce hallucinated findings or narrow regression locks.",
    observation: "A working LLM-driven QA harness requires several orthogonal discipline mechanisms simultaneously: canary calibration, per-flow isolation, rogue-subagent prevention at the CLI level, observability into the subprocess's tool calls, macOS-specific process-group handling, browser orphan reaping, CSP-aware emission, deterministic verification separating source defects from runtime flakes, and a severity classifier with a fixed rubric.",
    mechanism: "66 flow YAMLs across auth, hub, product surfaces, security (XSS, CSP, file-upload, IDOR, CSRF, rate-limit, predictable-IDs, auth-bypass, org-scoping), and sweeps. Three storage-state files per run with tRPC fixture seeding. A canary page renders exactly 6 deterministic violations; auditor reports ≠6 exits 78 before downstream flows execute. claude -p --agent <name> removes the Agent tool; without this the main session spawned up to 72 concurrent agents racing shared storage-state. Three deterministic probes each <100ms. Triple-verdict verification chain.",
    result: (<>One clean end-to-end run produced <strong>152 raw findings</strong>, reduced to <strong>53 filed GitHub issues</strong>. Zero false positives at triage. One CRITICAL (client crash blocking every property click). Three HIGH security findings. Nine shared-component collapse targets (one Dialog fix collapsed eight findings; one sidebar-landmark fix collapsed ~25).</>),
    crises: ["Scope Narrowing", "Documentation Contamination", "Simulated Reasoning"],
  },
  {
    num: "02",
    kicker: "Fake tests",
    title: "Deleting 4,800 fake tests in a weekend.",
    incident: "March 30, 2026. A 20-minute QA audit on six weeks of work surfaced over 100 critical bugs in production — IDOR at the first endpoint checked (90 seconds in), broken mutations the tests said worked, nil UUIDs shipped with matching assertions, stored XSS on validated fields, timezone corruption on every write, dead routes returning 200. The test suite was 4,800 passing tests. None had caught any of it.",
    observation: "Every test followed the same pattern: vi.mock(...) a dependency to return a canned object; assert the procedure returned the canned object. Mock returned data; procedure returned data; assertion compared data to itself. Deleting the repository file would not have failed any test. Claude Code reliably produces this shape — passes human review because the scaffold looks correct; only tracing mocks back to production code reveals nothing is being tested.",
    mechanism: "Two ast-grep rules installed at commit time, neither silenceable short of disabling the gate. require-caller-in-tests fails any it() block without a createCaller invocation. require-router-import-in-tests fails any test file with zero tRPC router imports.",
    code: `id: require-caller-in-tests
rule:
  all:
    - pattern: it($DESC, $FN)
    - not:
        has:
          any:
            - pattern: createCaller($$$)
            - pattern: createMockCaller($$$)`,
    result: (<><strong>4,800 tests deleted</strong> that weekend. Replaced over three weeks by approximately 1,800 tests that all call <span className="path">createCaller</span> or do not pass the gate. The new suite found <strong>8 production bugs</strong> in its first week — bugs the old suite had missed for months. The rules are live and have prevented the pattern from recurring.</>),
    crises: ["Documentation Contamination"],
    essay: "/writing/fake-tests-weekend",
  },
  {
    num: "03",
    kicker: "9-pass review",
    title: "A 9-pass adversarial review with a mechanical phase gate.",
    incident: "During DRDD stack development, orchestrator agents repeatedly claimed domain completion based on their own prose summaries (\"Layer 0a verified, gate:static PASSED\") without having actually run the gate. In one instance three dispatched subagents all reported \"cannot verify work, tests failing\" and the orchestrator said \"all 3 fixed\" and moved on.",
    observation: "Completion bias: the orchestrator optimizes for throughput rather than correctness. Behavioral rules in the boot prompt (\"don't trust summaries\") fail because they depend on the violator's compliance. Phase completion cannot be prose-claimed; it must be mechanically marked.",
    mechanism: "/review-source runs nine sequential passes. Pass 0 uses an Extraction-Then-Verification protocol — each rule walked twice, once listing COMPLIANT expressions, once listing VIOLATING expressions; both columns mandatory. Passes 1–8 walk the domain procedure by procedure. Findings double-classified (actionClass ∈ {FIX, SPEC-GAP, RISK}; auditSeverity ∈ {CRITICAL, HIGH, MEDIUM, LOW}). SPEC-GAP can only ADD rules, never weaken. A Stop hook blocks phase completion unless reviewer-state.json shows validity: valid, clean: true, and sourceHash matching HEAD.",
    result: (<>Across the current rebuild's Stage 2, <strong>fifteen domains reached clean:true, findingCount:0</strong> under the 9-pass review. <strong>168 findings across 19 audits reconciled to zero with no deferrals.</strong> Zero-Deferral Policy is a locked rule — no "Stage 6 tech debt," no "flag for future," no speed/time tradeoff language. The Stop-hook has caught multiple regressions where prose completion claims were attempted before a valid marker existed.</>),
    crises: ["Documentation Contamination"],
  },
  {
    num: "04",
    kicker: "Fan-out pipeline",
    title: "Per-layer fan-out to defeat LLM attention exhaustion on large multi-section emits.",
    incident: "A cross-domain feature contract for a canonical-identity migration required 16 Layer Briefs of 100–200 verbatim lines each, preserving every spec, consistency, and adversarial rule without summarization. A single subagent invoked to emit all 16 produced three rounds with 170, 126, and 141 defects. Paraphrase detection exposed the pattern: _shared rule paragraphs compressed 3×–15× in the later half of the emit. Rule PER-4 compressed from 270 words to 18 words in Layer 11 — a 15:1 ratio.",
    observation: "Attention-budget exhaustion across an 18-layer emit in a single subagent. Instructional patches (worked examples, explicit verbatim-preservation language) held for the first ~8 layers; the remaining budget was insufficient to maintain discipline. A skill-level fix was structurally capped.",
    mechanism: "The skill was redesigned so it never authors Layer Briefs directly. A five-pass wrapper script orchestrates: (1) preamble + pending-layer table, (2) N parallel claude -p subprocesses, one per layer with fresh attention budget, (3) concatenate in Layer-Summary order, (4) seven review-panel agents including two invoking /cto-decide, (5) .panel-review-passed-{date}.flag marker on all-PASS. /build-feature refuses to consume a contract without the marker.",
    result: (<>Late-layer compression class eliminated. <span className="path">/build-feature</span> consumed a marker-flagged contract and produced Layer 0a — five files implementing a vendor-abstraction interface with Zod validators, AbortController wiring, lazy env validation, in-process failover state, and a 10-success failback threshold. <strong>pnpm gate:static PASSED.</strong> Pattern generalized: large multi-section LLM emits cannot be single-subagent tasks.</>),
    crises: ["Scope Narrowing"],
  },
  {
    num: "05",
    kicker: "Skill-from-fresh-subagent",
    title: "Closing an ~80% → ~100% LLM compliance gap via skill-from-fresh-subagent.",
    incident: "Two dispatched personas — a CTO decision-maker and a QA auditor — failed to follow mandatory protocol. The CTO skipped required file reads and fabricated rationale. The QA auditor ignored its STOP CONDITION and ran 21–77 additional tool calls after deliverables were complete, producing screenshots unrelated to the audit.",
    observation: "Both personas were specified via agent frontmatter, delivered into the subagent's system prompt, where long directives hit an empirical compliance ceiling near ~80% — the model treats them as background rather than as the task. Verification required a falsification-grade test: construct a question whose correct answer exists ONLY in a specific section of the persona file and is not reasonably derivable from general knowledge.",
    mechanism: "Each persona rebuilt as a Skill at .claude/skills/<name>/SKILL.md with the entire persona inlined. Invocation: orchestrator dispatches a fresh general-purpose subagent with \"Invoke the /<skill-name> skill via the Skill tool with args: <payload>\". Skill content is delivered into the user message, processed as the task itself.",
    result: (<>CTO fact-recall test passed with <strong>zero extra tool calls</strong>. QA auth-signup flow dropped from a <strong>77-tool runaway</strong> (no report written) to <strong>37-tool clean completion</strong> with both reports written. A previously-missed CRITICAL was classified correctly on the first post-migration run. Agent-frontmatter files deleted; pattern locked as a permanent memory rule.</>),
    crises: ["Simulated Reasoning"],
  },
  {
    num: "06",
    kicker: "Deterministic verifier",
    title: "Replacing a probabilistic flake-detector with a deterministic source-code verifier.",
    incident: "April 20, 2026. The harness surfaced CRITICAL: /auth/forgot-password returns 404 in a real browser. The healer pass — which re-ran each critical three times to filter flakes — failed to reproduce on two of three attempts due to LLM variance and demoted the finding to low [FLAKE-NEEDS-INVESTIGATION]. The bug was real and deterministic. find apps/app/app -name 'forgot*' returned zero results. The route file did not exist.",
    observation: "Two bugs compounded. First, the healer matched f.id against a hash-set of findingId(...) values — the IDs were human-readable, not hashes, so every critical mis-classified as unreproduced. Second, the fundamental premise — \"LLM didn't reproduce → bug isn't real\" — treats probabilistic variance as signal. Cost model inverted: ~$3 per critical re-run, probabilistic outcome, real bugs hidden behind LLM noise.",
    mechanism: "The probabilistic healer was deleted. /qa-verify — a Skill invoked from a fresh general-purpose subagent — replaced it. A source-code verifier reads the source tree for each finding and classifies it into {verified, refuted, runtime-only, inconclusive}. Each verdict carries a file:line citation. Deterministic-probe findings auto-tag as CONFIRMED-BY-PROBE without spawning an LLM.",
    result: (<>Iteration 2 of the migrated harness produced <strong>verified=18 refuted=0 runtime-only=1 inconclusive=1</strong> across 20 findings. The forgot-password → 404 CRITICAL was preserved with source citation. <strong>Cost inverted from ~$3/critical probabilistic to ~$0.10/finding deterministic.</strong> Commit: <span className="path">57be3e8</span>.</>),
    crises: ["Simulated Reasoning"],
  },
  {
    num: "07",
    kicker: "MCP emission",
    title: "Rebuilding findings-emission as a stdio MCP server to bypass browser CSP.",
    incident: "The harness's real-time findings channel was an HTTP endpoint at 127.0.0.1:3012. Auditor agents used browser_evaluate + fetch() to post findings as they were discovered. On the first real discovery run, the app's Content-Security-Policy connect-src rejected the fetch as unapproved origin. The agent fell back to batch-writing at end-of-run; the 60-minute watchdog killed the subprocess before batch write fired. A 67-tool-call discovery that had root-cause-cited a CRITICAL client crash emitted zero persisted output.",
    observation: "browser_evaluate runs in page context; page CSP applies. HTTP-from-browser inherited every page-level security restriction — CSP, CORS, SameSite. CSP could not be loosened without weakening the production threat model. MCP tool-use never traverses the browser: JSON-RPC moves between the claude -p subprocess and the spawned MCP server over process stdin/stdout. No browser-side code path, no CSP surface.",
    mechanism: "HTTP server deleted. Stdio MCP server built against @modelcontextprotocol/sdk@1.29.0 exposes finding_emit, flow_open, flow_close, status. Shared durability primitive: fsync-per-write + O_EXCL lockfile + TTL-based stale-holder recovery + in-memory Promise chain. Per-flow .mcp-${flow}.json configs mount qa_emit alongside playwright; --strict-mcp-config and --allowedTools gate tool access.",
    result: (<>Three synthetic test suites validate the chain without a QA dispatch. <strong>All twelve green</strong>: cross-proc atomicity above PIPE_BUF, stale-lockfile reclaim in &lt;2s, SIGKILL-during-burst producing zero partial lines, handshake + lifecycle + SIGTERM drain, real claude -p subprocess integration. Production CSP restored to original shape.</>),
    crises: ["Infrastructure depth"],
  },
];

const CRISES = [
  {
    n: "01",
    name: "Scope Narrowing",
    date: "Incident: February 21, 2026",
    desc: "AI agents optimize for the most tractable aspects of requirements and present partial solutions as complete. The cited incident: agents completed research only for residential properties despite the client serving residential, commercial, industrial, institutional, and government property types. Mechanical defense: an 857-capability legacy disposition matrix requiring 100% feature coverage before phase closure.",
  },
  {
    n: "02",
    name: "Documentation Contamination",
    date: "Incident: February 26–27, 2026",
    desc: "AI agents produce internally consistent documentation disconnected from reality when they use their own output as source material. 12 phases of architecture documents written from an AI-generated design doc rather than from actual source code; 24 direct contradictions with the live codebase and 31 aspirational features documented as if already built. Mechanical defense: a four-level truth hierarchy with source code at Level 0.",
    pull: "Agents cannot read their own genre as source of truth.",
  },
  {
    n: "03",
    name: "Simulated Reasoning",
    date: "Incident: March 1, 2026",
    desc: "Agents default to hypothetical reasoning even when real systems exist, describing how systems \"would\" behave rather than testing actual behavior. Agents treated a live API as simulated and produced \"pretend validations.\" Mechanical defense: MCP tooling forcing live interaction — real databases, real endpoints — eliminating simulation as the cheapest option.",
  },
];

const COMMITS = [
  ["57be3e8", "feat(qa)", "replace probabilistic healer with deterministic source-code verifier"],
  ["a1c2f43", "chore", "consolidate pipeline-v2 + opportunity-scout + qa-verify work"],
  ["b2e118a", "feat(pipeline)", "canonical-identity migration — pipeline v2 skills + Layer 0a"],
  ["d7a4c21", "feat(qa-v2)", "harness follow-ups — timed-out reason parsing + greenfield plan"],
  ["9f12e08", "feat(qa-v2)", "discover flows — minimal-shape YAMLs, probe-anchoring removed"],
  ["6be73c4", "feat(qa-v2)", "mcp rebuild steps 7+8 — T11/T12 synthetic claude-p integration gate"],
  ["3d0a2b9", "feat(qa-v2)", "mcp rebuild steps 11+12 — delete HTTP emit-server + revert CSP patch"],
  ["8c7719f", "feat(qa-v2)", "mcp rebuild 9+10 — skill emission rewrites: browser_evaluate fetch → MCP tool-use"],
  ["e44a1b3", "feat(qa-v2)", "mcp rebuild step 6 — qa-verify auto-verifies deterministic-probe findings"],
  ["2fa0c58", "feat(qa-v2)", "mcp rebuild step 5 — qa-summary reads .timed-out.list, annotates killed flows"],
  ["71b93d2", "feat(qa-v2)", "mcp rebuild step 4 — runner per-flow MCP config mounts qa_emit alongside playwright"],
  ["cc1204e", "feat(qa-v2)", "mcp rebuild steps 2+3 — scripts/qa-emit-mcp.ts + SDK pin + T5-T10"],
  ["4a89077", "feat(qa-v2)", "mcp rebuild step 1 — scripts/qa-emit-writer.ts + T1-T4 gate suite"],
  ["11ee632", "feat(qa)", "migrate plw-qa-auditor subagent to skill-invocation pattern"],
  ["0b5518c", "feat(cto)", "rebuild CTO as skill-invocation-from-clean-subagent"],
  ["5e20a91", "feat(qa)", "Phase G — harness self-tests lock parseVerdict regression"],
  ["f3a7c04", "feat(qa)", "Phase F — state-space route smoke (Layer 0b) — orphan routes <100ms"],
  ["7bb1d29", "feat(qa)", "Phase E — adversarial input fuzzer (Layer 0a) — 60+ payloads <100ms"],
  ["2d90155", "feat(qa)", "Phase D — fresh-user signup flow (auth-fresh-signup)"],
  ["c48f2a6", "feat(qa)", "Phase C — historical-baseline cross-check surfaces coverage regressions"],
  ["96e3f7b", "feat(qa)", "Phase B — deterministic pre-scan (Layer 1) — grep-findable bugs <100ms"],
  ["18d4e02", "feat(qa)", "Phase A — inject edge-case probes on auth; auto-generate explore companions"],
];

const RULES = {
  spec: [
    { id: "PER-4", txt: "Permissions are checked at router boundary before any query executes.", layer: "spec" },
    { id: "AUD-1", txt: "Every mutation writes one audit-log row with actor, org, resource, action, timestamp.", layer: "spec" },
    { id: "IDT-2", txt: "All user-facing identifiers are opaque ULIDs; sequential IDs never appear in URLs or APIs.", layer: "spec" },
    { id: "ERR-3", txt: "Routers throw typed tRPCError only; generic Error leaks internal structure.", layer: "spec" },
    { id: "PRS-1", txt: "All timestamps persisted as TIMESTAMPTZ; naive timestamps rejected at the schema layer.", layer: "spec" },
    { id: "AUT-5", txt: "Every procedure must declare its required auth context; unmarked procedures are unreachable.", layer: "spec" },
    { id: "SEC-2", txt: "Org-scoping is enforced in the query builder, not in application code.", layer: "spec" },
  ],
  consistency: [
    { id: "CON-1", txt: "Zod schemas bound all string inputs; unbounded z.string() is blocked by ast-grep.", layer: "consistency" },
    { id: "CON-4", txt: "No AES-CBC. No disabled SSL verification. No hardcoded secrets.", layer: "consistency" },
    { id: "CON-7", txt: "File imports use path aliases only; deep relative imports (../../) are blocked.", layer: "consistency" },
    { id: "CON-9", txt: "UUIDv4 generation is blocked; use ULIDs via the shared identifiers module.", layer: "consistency" },
    { id: "CON-11", txt: "Tests must instantiate createCaller or createMockCaller; pure-mock tests fail the gate.", layer: "consistency" },
    { id: "CON-12", txt: "Test files must import the tRPC router under test; orphan test files fail the gate.", layer: "consistency" },
    { id: "CON-14", txt: "ESLint max-lines: 500, max-lines-per-function: 200. No exemptions.", layer: "consistency" },
  ],
  adversarial: [
    { id: "ADV-1", txt: "Every procedure declares an adversarial contract: what a malicious caller can do with every input shape.", layer: "adversarial" },
    { id: "ADV-3", txt: "IDOR: every procedure returning a resource must verify caller's org-scope on the resource path.", layer: "adversarial" },
    { id: "ADV-5", txt: "File-upload: server-side size enforcement and MIME sniffing; client-declared MIME is never trusted.", layer: "adversarial" },
    { id: "ADV-8", txt: "Rate-limit: per-principal token bucket on every mutation; per-IP on every auth endpoint.", layer: "adversarial" },
    { id: "ADV-11", txt: "Predictable-ID enumeration: opaque-identifier rule enforced at the URL parameter layer.", layer: "adversarial" },
    { id: "ADV-13", txt: "CSRF: Origin header required on all state-changing verbs; missing Origin fails closed.", layer: "adversarial" },
  ],
};

const INVENTORY = [
  ["Pipeline skills", "29", "contract, build-source, review-source, contract-feature, build-feature, qa-audit, qa-verify, qa-dr-adversary, qa-severity-classifier, cto, cto-decide, architecture-audit, …"],
  ["Domain rule files", "42", "~3,500 rule statements across 24 domains, organized by three layers. Seven shared-authority files inherited by every domain."],
  ["Runtime hook scripts", "~24", "~3,600 shell LOC wired through .claude/settings.json at every tool boundary."],
  ["Hookify pattern-blocks", "48", "block-uuidv4, block-hardcoded-secrets, block-empty-cast-in-tests, block-timestamp-without-tz, block-test-skipping, block-direct-vitest, block-batched-implementer, block-aes-cbc, …"],
  ["ast-grep structural rules", "41", "require-timestamptz, require-zod-string-bounds, no-generic-throw-in-routers, no-aes-cbc-cipher, no-disabled-ssl-verification, no-deep-relative-imports, require-caller-in-tests, no-catch-in-tests, …"],
  ["Gate stages", "12", "format → lint (max-warnings 0) → dep-cruiser → ast-grep → knip → jscpd → syncpack → npm audit → typecheck → unit → integration → e2e. Exclusive lock."],
  ["QA flow YAMLs", "66", "auth, hub, product surfaces, security (XSS, CSP, file-upload, IDOR, CSRF, rate-limit, predictable-IDs, auth-bypass, org-scoping), sweeps."],
  ["Deterministic probes", "3", "qa-prescan.ts (94ms), qa-fuzz-inputs.ts (60+ payloads, 60ms), qa-state-walk.ts (orphan-route smoke, 52ms)."],
  ["GitHub Actions workflows", "6", "ci, compliance, deploy, migration-check, qa, security — ~900 lines total."],
  ["Verification cost", "~$0.10", "per finding, deterministic. Down from ~$3/critical probabilistic under the prior healer."],
  ["Memory types", "4", "user, feedback (incident-driven rules with Why + How-to-apply body), project (session handoffs), reference (external pointers)."],
];

const PASSES = [
  { n: "00", t: "Shared infrastructure" },
  { n: "01", t: "Procedure inventory" },
  { n: "02", t: "Input validation" },
  { n: "03", t: "Query correctness" },
  { n: "04", t: "Error handling" },
  { n: "05", t: "Audit log" },
  { n: "06", t: "Response shape" },
  { n: "07", t: "Security surface" },
  { n: "08", t: "Engineering quality" },
];

window.CR = { CASES, CRISES, COMMITS, RULES, INVENTORY, PASSES };
