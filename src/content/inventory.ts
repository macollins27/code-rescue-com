import type { InventoryRow } from "./types";

export const INVENTORY: InventoryRow[] = [
  [
    "Pipeline skills",
    "29",
    "contract, build-source, review-source, contract-feature, build-feature, qa-audit, qa-verify, qa-dr-adversary, qa-severity-classifier, cto, cto-decide, architecture-audit, …",
  ],
  [
    "Domain rule files",
    "42",
    "~3,500 rule statements across 24 domains, organized by three layers. Seven shared-authority files inherited by every domain.",
  ],
  [
    "Runtime hook scripts",
    "~24",
    "~3,600 shell LOC wired through .claude/settings.json at every tool boundary.",
  ],
  [
    "Hookify pattern-blocks",
    "48",
    "block-uuidv4, block-hardcoded-secrets, block-empty-cast-in-tests, block-timestamp-without-tz, block-test-skipping, block-direct-vitest, block-batched-implementer, block-aes-cbc, …",
  ],
  [
    "ast-grep structural rules",
    "41",
    "require-timestamptz, require-zod-string-bounds, no-generic-throw-in-routers, no-aes-cbc-cipher, no-disabled-ssl-verification, no-deep-relative-imports, require-caller-in-tests, no-catch-in-tests, …",
  ],
  [
    "Gate stages",
    "12",
    "format → lint (max-warnings 0) → dep-cruiser → ast-grep → knip → jscpd → syncpack → npm audit → typecheck → unit → integration → e2e. Exclusive lock.",
  ],
  [
    "QA flow YAMLs",
    "66",
    "auth, hub, product surfaces, security (XSS, CSP, file-upload, IDOR, CSRF, rate-limit, predictable-IDs, auth-bypass, org-scoping), sweeps.",
  ],
  [
    "Deterministic probes",
    "3",
    "qa-prescan.ts (94ms), qa-fuzz-inputs.ts (60+ payloads, 60ms), qa-state-walk.ts (orphan-route smoke, 52ms).",
  ],
  [
    "GitHub Actions workflows",
    "6",
    "ci, compliance, deploy, migration-check, qa, security — ~900 lines total.",
  ],
  [
    "Verification cost",
    "~$0.10",
    "per finding, deterministic. Down from ~$3/critical probabilistic under the prior healer.",
  ],
  [
    "Memory types",
    "4",
    "user, feedback (incident-driven rules with Why + How-to-apply body), project (session handoffs), reference (external pointers).",
  ],
];
