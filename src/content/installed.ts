import type { InstalledMetric } from "./types";

export const INSTALLED: InstalledMetric[] = [
  {
    n: "113",
    what: "Automated checks",
    plain:
      "Running against every line of AI-written code your team produces, before it reaches review.",
  },
  {
    n: "9",
    what: "Review rounds",
    plain:
      "An adversarial review that every change walks through before it can land on your main branch.",
  },
  {
    n: "12",
    what: "Gate stages",
    plain:
      "A quality gate between every commit and production. Any stage fails, the commit doesn't land. No overrides.",
  },
  {
    n: "5",
    what: "Enforcement layers",
    plain:
      "At write-time, at commit, at runtime, at session start, and at every tool call — so nothing slips through a single layer.",
  },
];
