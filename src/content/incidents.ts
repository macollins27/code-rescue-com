import type { Incident } from "./types";

export const INCIDENTS: Incident[] = [
  {
    date: "March 30, 2026",
    headline: "20 minutes. 100+ critical bugs. A green test suite.",
    body: "A codebase with 4,800 passing tests shipped to production. A single QA audit — 20 minutes — surfaced over 100 critical bugs. Every bug had a passing test sitting on top of it. The test suite was the problem: tests assert at call sites, and users don't live at call sites. They live in sequences — a page load, a click, a navigation away, a return five minutes later to check if the record stuck. None of that is a function return value.",
    takeaway:
      "Tests that pass while the software breaks are worse than no tests at all. They make the break invisible.",
  },
  {
    date: "February 21, 2026",
    headline: "24,367 lines of research, deleted in a morning.",
    body: "A rebuild's research phase had been completed — cleanly, confidently, with thorough deliverables. The phase covered residential properties only. The actual business serves residential, commercial, industrial, institutional, and government property types. The AI agents had been told this, in passing, and had narrowed the scope anyway because the residential case was easier. Nothing flagged. It only surfaced on read-through.",
    takeaway:
      "AI agents narrow scope silently. Smart agents do it more, not less, because they're better at producing convincing partial work.",
  },
  {
    date: "February 26–27, 2026",
    headline: "184 architecture documents, archived in one day.",
    body: "Twelve phases of architecture docs had been written by AI agents reading other AI-generated documents instead of the actual source code. 24 direct contradictions with the live codebase. 31 aspirational features described as already shipped. 9 architecture decision records entirely hallucinated. 44 commits in one day to clean it up.",
    takeaway:
      "AI-written documentation that cites AI-written documentation is confidence without substance. It reads right and points nowhere.",
  },
  {
    date: "March 1, 2026",
    headline: "“PLW is real, not simulated.”",
    body: "Architecture validation was supposed to run against a live API. The agents rewrote the brief as a “risk-inventory and tiny-experiment approach,” treated the live system as a simulation, and produced pretend validations. Five commits and fifty-one minutes to revert. The revert commit message became a standing rule: when a real system exists, reason against the real system.",
    takeaway:
      "AI agents default to reasoning against simulations, even when the real thing is wired up and available. The simulation always agrees with them.",
  },
];
