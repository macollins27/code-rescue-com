import type { RulesIndex } from "./types";

export const RULES: RulesIndex = {
  spec: [
    {
      id: "PER-4",
      txt: "Permissions are checked at router boundary before any query executes.",
      layer: "spec",
    },
    {
      id: "AUD-1",
      txt: "Every mutation writes one audit-log row with actor, org, resource, action, timestamp.",
      layer: "spec",
    },
    {
      id: "IDT-2",
      txt: "All user-facing identifiers are opaque ULIDs; sequential IDs never appear in URLs or APIs.",
      layer: "spec",
    },
    {
      id: "ERR-3",
      txt: "Routers throw typed tRPCError only; generic Error leaks internal structure.",
      layer: "spec",
    },
    {
      id: "PRS-1",
      txt: "All timestamps persisted as TIMESTAMPTZ; naive timestamps rejected at the schema layer.",
      layer: "spec",
    },
    {
      id: "AUT-5",
      txt: "Every procedure must declare its required auth context; unmarked procedures are unreachable.",
      layer: "spec",
    },
    {
      id: "SEC-2",
      txt: "Org-scoping is enforced in the query builder, not in application code.",
      layer: "spec",
    },
  ],
  consistency: [
    {
      id: "CON-1",
      txt: "Zod schemas bound all string inputs; unbounded z.string() is blocked by ast-grep.",
      layer: "consistency",
    },
    {
      id: "CON-4",
      txt: "No AES-CBC. No disabled SSL verification. No hardcoded secrets.",
      layer: "consistency",
    },
    {
      id: "CON-7",
      txt: "File imports use path aliases only; deep relative imports (../../) are blocked.",
      layer: "consistency",
    },
    {
      id: "CON-9",
      txt: "UUIDv4 generation is blocked; use ULIDs via the shared identifiers module.",
      layer: "consistency",
    },
    {
      id: "CON-11",
      txt: "Tests must instantiate createCaller or createMockCaller; pure-mock tests fail the gate.",
      layer: "consistency",
    },
    {
      id: "CON-12",
      txt: "Test files must import the tRPC router under test; orphan test files fail the gate.",
      layer: "consistency",
    },
    {
      id: "CON-14",
      txt: "ESLint max-lines: 500, max-lines-per-function: 200. No exemptions.",
      layer: "consistency",
    },
  ],
  adversarial: [
    {
      id: "ADV-1",
      txt: "Every procedure declares an adversarial contract: what a malicious caller can do with every input shape.",
      layer: "adversarial",
    },
    {
      id: "ADV-3",
      txt: "IDOR: every procedure returning a resource must verify caller's org-scope on the resource path.",
      layer: "adversarial",
    },
    {
      id: "ADV-5",
      txt: "File-upload: server-side size enforcement and MIME sniffing; client-declared MIME is never trusted.",
      layer: "adversarial",
    },
    {
      id: "ADV-8",
      txt: "Rate-limit: per-principal token bucket on every mutation; per-IP on every auth endpoint.",
      layer: "adversarial",
    },
    {
      id: "ADV-11",
      txt: "Predictable-ID enumeration: opaque-identifier rule enforced at the URL parameter layer.",
      layer: "adversarial",
    },
    {
      id: "ADV-13",
      txt: "CSRF: Origin header required on all state-changing verbs; missing Origin fails closed.",
      layer: "adversarial",
    },
  ],
};
