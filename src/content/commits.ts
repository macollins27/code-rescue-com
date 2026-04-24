import type { Commit } from "./types";

export const COMMITS: readonly Commit[] = [
  ["57be3e8", "feat(qa)", "replace probabilistic healer with deterministic source-code verifier"],
  ["a1c2f43", "chore", "consolidate pipeline-v2 + opportunity-scout + qa-verify work"],
  ["b2e118a", "feat(pipeline)", "canonical-identity migration — pipeline v2 skills + Layer 0a"],
  ["d7a4c21", "feat(qa-v2)", "harness follow-ups — timed-out reason parsing + greenfield plan"],
  ["9f12e08", "feat(qa-v2)", "discover flows — minimal-shape YAMLs, probe-anchoring removed"],
  ["6be73c4", "feat(qa-v2)", "mcp rebuild steps 7+8 — T11/T12 synthetic claude-p integration gate"],
  [
    "3d0a2b9",
    "feat(qa-v2)",
    "mcp rebuild steps 11+12 — delete HTTP emit-server + revert CSP patch",
  ],
  [
    "8c7719f",
    "feat(qa-v2)",
    "mcp rebuild 9+10 — skill emission rewrites: browser_evaluate fetch → MCP tool-use",
  ],
  [
    "e44a1b3",
    "feat(qa-v2)",
    "mcp rebuild step 6 — qa-verify auto-verifies deterministic-probe findings",
  ],
  [
    "2fa0c58",
    "feat(qa-v2)",
    "mcp rebuild step 5 — qa-summary reads .timed-out.list, annotates killed flows",
  ],
  [
    "71b93d2",
    "feat(qa-v2)",
    "mcp rebuild step 4 — runner per-flow MCP config mounts qa_emit alongside playwright",
  ],
  ["cc1204e", "feat(qa-v2)", "mcp rebuild steps 2+3 — scripts/qa-emit-mcp.ts + SDK pin + T5-T10"],
  ["4a89077", "feat(qa-v2)", "mcp rebuild step 1 — scripts/qa-emit-writer.ts + T1-T4 gate suite"],
  ["11ee632", "feat(qa)", "migrate plw-qa-auditor subagent to skill-invocation pattern"],
  ["0b5518c", "feat(cto)", "rebuild CTO as skill-invocation-from-clean-subagent"],
  ["5e20a91", "feat(qa)", "Phase G — harness self-tests lock parseVerdict regression"],
  ["f3a7c04", "feat(qa)", "Phase F — state-space route smoke (Layer 0b) — orphan routes <100ms"],
  ["7bb1d29", "feat(qa)", "Phase E — adversarial input fuzzer (Layer 0a) — 60+ payloads <100ms"],
  ["2d90155", "feat(qa)", "Phase D — fresh-user signup flow (auth-fresh-signup)"],
  [
    "c48f2a6",
    "feat(qa)",
    "Phase C — historical-baseline cross-check surfaces coverage regressions",
  ],
  ["96e3f7b", "feat(qa)", "Phase B — deterministic pre-scan (Layer 1) — grep-findable bugs <100ms"],
  [
    "18d4e02",
    "feat(qa)",
    "Phase A — inject edge-case probes on auth; auto-generate explore companions",
  ],
];
