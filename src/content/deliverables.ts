import type { Deliverable } from "./types";

export const DELIVERABLES: Deliverable[] = [
  {
    letter: "a",
    label: "Domain Build",
    oneline: "One area of your product, rebuilt end-to-end under full mechanical review.",
    plain:
      "Pick one bounded part of your codebase — a checkout flow, a permissions system, a reporting module. I rebuild it from written specification to shipped production code, with every rule, gate, and review in place the entire time.",
    duration: "4 – 8 weeks",
    bestFor:
      "You have one area that keeps breaking, or one area you know is load-bearing for the next 18 months.",
  },
  {
    letter: "b",
    label: "System Migration",
    oneline: "One cross-cutting change, executed spec-first without regressions.",
    plain:
      "A vendor swap. A database migration. A shared abstraction renamed across the codebase. The kind of change that touches every domain and usually ships bugs quietly for months. I execute one of these under the full pipeline — nothing lands until it's verified, everywhere.",
    duration: "4 – 8 weeks",
    bestFor:
      "You have a migration your team has been avoiding because the blast radius is too large.",
  },
  {
    letter: "c",
    label: "QA Run",
    oneline: "An autonomous auditor walks your app and files every bug it finds.",
    plain:
      "I install the QA harness on your production app and run it against your existing code. It behaves like a real user — across time zones, screen sizes, concurrent sessions, accessibility checks, edge-case inputs — and hands you a filed-and-prioritized backlog. No change to your codebase; pure diagnostic.",
    duration: "2 – 3 weeks",
    bestFor:
      "You want to know what's broken before an investor, an auditor, or a customer finds out.",
  },
];
