import type { PipelineStage } from "./types";

export const PIPELINE: PipelineStage[] = [
  {
    stage: "1",
    title: "Rules are the specification",
    plain:
      "Your product's behavior is written down as mechanical rules. Not prose. Not wishes. Statements a machine can check.",
  },
  {
    stage: "2",
    title: "Contract extraction",
    plain:
      "An automated step reads the rules and produces the plan the implementation will follow, layer by layer.",
  },
  {
    stage: "3",
    title: "Source, one layer at a time",
    plain:
      "Code gets written layer by layer. Every procedure verified the moment it's written, with cross-procedure checks after each layer.",
  },
  {
    stage: "4",
    title: "Nine rounds of adversarial review",
    plain:
      "A structured review pass through the code — input handling, query correctness, error paths, audit trails, security surface — ending in a clean, zero-findings state.",
  },
  {
    stage: "5",
    title: "QA auditor",
    plain:
      "An autonomous agent walks your live app like a real user. Across time zones, devices, concurrency, accessibility. Files every bug it finds into a database.",
  },
  {
    stage: "6",
    title: "Regression tests",
    plain:
      "Tests get written after QA — one per real bug surfaced — so the same bug can never ship twice. Tests lock behavior; they don't define it.",
  },
];
