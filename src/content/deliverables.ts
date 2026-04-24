import type { Deliverable } from "./types";

export const DELIVERABLES: Deliverable[] = [
  {
    tag: "a · Domain build",
    title: "One audit-grade domain built end-to-end from spec.",
    plain:
      "We rebuild one bounded area of your codebase from written specification to shipped production code under full mechanical review.",
    techHtml:
      'Domain rules authored, contract extracted, source produced layer-by-layer with per-procedure write-verify checks, 9-pass adversarial review run to <span class="path">clean: true</span>, QA auditor run against the domain\'s user journeys, regression tests locked on proven-correct behavior.',
  },
  {
    tag: "b · System migration",
    title: "One system-wide migration executed spec-first.",
    plain:
      "We execute one cross-cutting change — a vendor swap, a canonical identifier rename, a shared abstraction, a schema migration — using the feature pipeline with per-layer fan-out.",
    techHtml:
      'Feature doc authored, layered contract extracted via the 5-pass wrapper, each layer implemented with fresh attention-budget subagents, <span class="path">pnpm gate:static</span> between layers, panel-reviewed before consumption.',
  },
  {
    tag: "c · QA run",
    title: "One installation and live run of the QA harness.",
    plain:
      "We install the auditor on your app and run it against your existing code, handing you a filed-issue backlog with severity, reproduction steps, and fix-target paths.",
    techHtml:
      "Multi-user auditor configured, deterministic pre-scans wired (&lt;100ms), stdio MCP emission channel mounted, canary calibration tuned, triple-verdict verification chain running against your source tree.",
  },
];
