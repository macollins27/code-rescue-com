import type { Crisis } from "./types";

export const CRISES: Crisis[] = [
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
    desc: 'Agents default to hypothetical reasoning even when real systems exist, describing how systems "would" behave rather than testing actual behavior. Agents treated a live API as simulated and produced "pretend validations." Mechanical defense: MCP tooling forcing live interaction — real databases, real endpoints — eliminating simulation as the cheapest option.',
  },
];
