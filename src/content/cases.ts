import type { CaseStudy } from "./types";

export const CASES: CaseStudy[] = [
  {
    num: "01",
    kicker: "QA harness",
    title: "An LLM-driven QA harness producing 53 filed issues in one end-to-end run.",
    incident:
      "Browser-level QA at scope for a multi-product application is typically manual (slow, expensive, inconsistent) or scripted (high-maintenance, low-discovery). LLM auditors without mechanical discipline produce hallucinated findings or narrow regression locks.",
    observation:
      "A working LLM-driven QA harness requires several orthogonal discipline mechanisms simultaneously: canary calibration, per-flow isolation, rogue-subagent prevention at the CLI level, observability into the subprocess's tool calls, macOS-specific process-group handling, browser orphan reaping, CSP-aware emission, deterministic verification separating source defects from runtime flakes, and a severity classifier with a fixed rubric.",
    mechanism:
      "66 flow YAMLs across auth, hub, product surfaces, security (XSS, CSP, file-upload, IDOR, CSRF, rate-limit, predictable-IDs, auth-bypass, org-scoping), and sweeps. Three storage-state files per run with tRPC fixture seeding. A canary page renders exactly 6 deterministic violations; auditor reports ≠6 exits 78 before downstream flows execute. claude -p --agent <name> removes the Agent tool; without this the main session spawned up to 72 concurrent agents racing shared storage-state. Three deterministic probes each <100ms. Triple-verdict verification chain.",
    resultHtml:
      "One clean end-to-end run produced <strong>152 raw findings</strong>, reduced to <strong>53 filed GitHub issues</strong>. Zero false positives at triage. One CRITICAL (client crash blocking every property click). Three HIGH security findings. Nine shared-component collapse targets (one Dialog fix collapsed eight findings; one sidebar-landmark fix collapsed ~25).",
    crises: ["Scope Narrowing", "Documentation Contamination", "Simulated Reasoning"],
  },
  {
    num: "02",
    kicker: "Fake tests",
    title: "Deleting 4,800 fake tests in a weekend.",
    incident:
      "March 30, 2026. A 20-minute QA audit on six weeks of work surfaced over 100 critical bugs in production — IDOR at the first endpoint checked (90 seconds in), broken mutations the tests said worked, nil UUIDs shipped with matching assertions, stored XSS on validated fields, timezone corruption on every write, dead routes returning 200. The test suite was 4,800 passing tests. None had caught any of it.",
    observation:
      "Every test followed the same pattern: vi.mock(...) a dependency to return a canned object; assert the procedure returned the canned object. Mock returned data; procedure returned data; assertion compared data to itself. Deleting the repository file would not have failed any test. Claude Code reliably produces this shape — passes human review because the scaffold looks correct; only tracing mocks back to production code reveals nothing is being tested.",
    mechanism:
      "Two ast-grep rules installed at commit time, neither silenceable short of disabling the gate. require-caller-in-tests fails any it() block without a createCaller invocation. require-router-import-in-tests fails any test file with zero tRPC router imports.",
    code: `id: require-caller-in-tests
rule:
  all:
    - pattern: it($DESC, $FN)
    - not:
        has:
          any:
            - pattern: createCaller($$$)
            - pattern: createMockCaller($$$)`,
    resultHtml:
      '<strong>4,800 tests deleted</strong> that weekend. Replaced over three weeks by approximately 1,800 tests that all call <span class="path">createCaller</span> or do not pass the gate. The new suite found <strong>8 production bugs</strong> in its first week — bugs the old suite had missed for months. The rules are live and have prevented the pattern from recurring.',
    crises: ["Documentation Contamination"],
    essay: "/writing/fake-tests-weekend",
  },
  {
    num: "03",
    kicker: "9-pass review",
    title: "A 9-pass adversarial review with a mechanical phase gate.",
    incident:
      'During DRDD stack development, orchestrator agents repeatedly claimed domain completion based on their own prose summaries ("Layer 0a verified, gate:static PASSED") without having actually run the gate. In one instance three dispatched subagents all reported "cannot verify work, tests failing" and the orchestrator said "all 3 fixed" and moved on.',
    observation:
      "Completion bias: the orchestrator optimizes for throughput rather than correctness. Behavioral rules in the boot prompt (\"don't trust summaries\") fail because they depend on the violator's compliance. Phase completion cannot be prose-claimed; it must be mechanically marked.",
    mechanism:
      "/review-source runs nine sequential passes. Pass 0 uses an Extraction-Then-Verification protocol — each rule walked twice, once listing COMPLIANT expressions, once listing VIOLATING expressions; both columns mandatory. Passes 1–8 walk the domain procedure by procedure. Findings double-classified (actionClass ∈ {FIX, SPEC-GAP, RISK}; auditSeverity ∈ {CRITICAL, HIGH, MEDIUM, LOW}). SPEC-GAP can only ADD rules, never weaken. A Stop hook blocks phase completion unless reviewer-state.json shows validity: valid, clean: true, and sourceHash matching HEAD.",
    resultHtml:
      'Across the current rebuild\'s Stage 2, <strong>fifteen domains reached clean:true, findingCount:0</strong> under the 9-pass review. <strong>168 findings across 19 audits reconciled to zero with no deferrals.</strong> Zero-Deferral Policy is a locked rule — no "Stage 6 tech debt," no "flag for future," no speed/time tradeoff language. The Stop-hook has caught multiple regressions where prose completion claims were attempted before a valid marker existed.',
    crises: ["Documentation Contamination"],
  },
  {
    num: "04",
    kicker: "Fan-out pipeline",
    title: "Per-layer fan-out to defeat LLM attention exhaustion on large multi-section emits.",
    incident:
      "A cross-domain feature contract for a canonical-identity migration required 16 Layer Briefs of 100–200 verbatim lines each, preserving every spec, consistency, and adversarial rule without summarization. A single subagent invoked to emit all 16 produced three rounds with 170, 126, and 141 defects. Paraphrase detection exposed the pattern: _shared rule paragraphs compressed 3×–15× in the later half of the emit. Rule PER-4 compressed from 270 words to 18 words in Layer 11 — a 15:1 ratio.",
    observation:
      "Attention-budget exhaustion across an 18-layer emit in a single subagent. Instructional patches (worked examples, explicit verbatim-preservation language) held for the first ~8 layers; the remaining budget was insufficient to maintain discipline. A skill-level fix was structurally capped.",
    mechanism:
      "The skill was redesigned so it never authors Layer Briefs directly. A five-pass wrapper script orchestrates: (1) preamble + pending-layer table, (2) N parallel claude -p subprocesses, one per layer with fresh attention budget, (3) concatenate in Layer-Summary order, (4) seven review-panel agents including two invoking /cto-decide, (5) .panel-review-passed-{date}.flag marker on all-PASS. /build-feature refuses to consume a contract without the marker.",
    resultHtml:
      'Late-layer compression class eliminated. <span class="path">/build-feature</span> consumed a marker-flagged contract and produced Layer 0a — five files implementing a vendor-abstraction interface with Zod validators, AbortController wiring, lazy env validation, in-process failover state, and a 10-success failback threshold. <strong>pnpm gate:static PASSED.</strong> Pattern generalized: large multi-section LLM emits cannot be single-subagent tasks.',
    crises: ["Scope Narrowing"],
  },
  {
    num: "05",
    kicker: "Skill-from-fresh-subagent",
    title: "Closing an ~80% → ~100% LLM compliance gap via skill-from-fresh-subagent.",
    incident:
      "Two dispatched personas — a CTO decision-maker and a QA auditor — failed to follow mandatory protocol. The CTO skipped required file reads and fabricated rationale. The QA auditor ignored its STOP CONDITION and ran 21–77 additional tool calls after deliverables were complete, producing screenshots unrelated to the audit.",
    observation:
      "Both personas were specified via agent frontmatter, delivered into the subagent's system prompt, where long directives hit an empirical compliance ceiling near ~80% — the model treats them as background rather than as the task. Verification required a falsification-grade test: construct a question whose correct answer exists ONLY in a specific section of the persona file and is not reasonably derivable from general knowledge.",
    mechanism:
      'Each persona rebuilt as a Skill at .claude/skills/<name>/SKILL.md with the entire persona inlined. Invocation: orchestrator dispatches a fresh general-purpose subagent with "Invoke the /<skill-name> skill via the Skill tool with args: <payload>". Skill content is delivered into the user message, processed as the task itself.',
    resultHtml:
      "CTO fact-recall test passed with <strong>zero extra tool calls</strong>. QA auth-signup flow dropped from a <strong>77-tool runaway</strong> (no report written) to <strong>37-tool clean completion</strong> with both reports written. A previously-missed CRITICAL was classified correctly on the first post-migration run. Agent-frontmatter files deleted; pattern locked as a permanent memory rule.",
    crises: ["Simulated Reasoning"],
  },
  {
    num: "06",
    kicker: "Deterministic verifier",
    title: "Replacing a probabilistic flake-detector with a deterministic source-code verifier.",
    incident:
      "April 20, 2026. The harness surfaced CRITICAL: /auth/forgot-password returns 404 in a real browser. The healer pass — which re-ran each critical three times to filter flakes — failed to reproduce on two of three attempts due to LLM variance and demoted the finding to low [FLAKE-NEEDS-INVESTIGATION]. The bug was real and deterministic. find apps/app/app -name 'forgot*' returned zero results. The route file did not exist.",
    observation:
      "Two bugs compounded. First, the healer matched f.id against a hash-set of findingId(...) values — the IDs were human-readable, not hashes, so every critical mis-classified as unreproduced. Second, the fundamental premise — \"LLM didn't reproduce → bug isn't real\" — treats probabilistic variance as signal. Cost model inverted: ~$3 per critical re-run, probabilistic outcome, real bugs hidden behind LLM noise.",
    mechanism:
      "The probabilistic healer was deleted. /qa-verify — a Skill invoked from a fresh general-purpose subagent — replaced it. A source-code verifier reads the source tree for each finding and classifies it into {verified, refuted, runtime-only, inconclusive}. Each verdict carries a file:line citation. Deterministic-probe findings auto-tag as CONFIRMED-BY-PROBE without spawning an LLM.",
    resultHtml:
      'Iteration 2 of the migrated harness produced <strong>verified=18 refuted=0 runtime-only=1 inconclusive=1</strong> across 20 findings. The forgot-password → 404 CRITICAL was preserved with source citation. <strong>Cost inverted from ~$3/critical probabilistic to ~$0.10/finding deterministic.</strong> Commit: <span class="path">57be3e8</span>.',
    crises: ["Simulated Reasoning"],
  },
  {
    num: "07",
    kicker: "MCP emission",
    title: "Rebuilding findings-emission as a stdio MCP server to bypass browser CSP.",
    incident:
      "The harness's real-time findings channel was an HTTP endpoint at 127.0.0.1:3012. Auditor agents used browser_evaluate + fetch() to post findings as they were discovered. On the first real discovery run, the app's Content-Security-Policy connect-src rejected the fetch as unapproved origin. The agent fell back to batch-writing at end-of-run; the 60-minute watchdog killed the subprocess before batch write fired. A 67-tool-call discovery that had root-cause-cited a CRITICAL client crash emitted zero persisted output.",
    observation:
      "browser_evaluate runs in page context; page CSP applies. HTTP-from-browser inherited every page-level security restriction — CSP, CORS, SameSite. CSP could not be loosened without weakening the production threat model. MCP tool-use never traverses the browser: JSON-RPC moves between the claude -p subprocess and the spawned MCP server over process stdin/stdout. No browser-side code path, no CSP surface.",
    mechanism:
      "HTTP server deleted. Stdio MCP server built against @modelcontextprotocol/sdk@1.29.0 exposes finding_emit, flow_open, flow_close, status. Shared durability primitive: fsync-per-write + O_EXCL lockfile + TTL-based stale-holder recovery + in-memory Promise chain. Per-flow .mcp-${flow}.json configs mount qa_emit alongside playwright; --strict-mcp-config and --allowedTools gate tool access.",
    resultHtml:
      "Three synthetic test suites validate the chain without a QA dispatch. <strong>All twelve green</strong>: cross-proc atomicity above PIPE_BUF, stale-lockfile reclaim in &lt;2s, SIGKILL-during-burst producing zero partial lines, handshake + lifecycle + SIGTERM drain, real claude -p subprocess integration. Production CSP restored to original shape.",
    crises: ["Documentation Contamination"],
  },
];
