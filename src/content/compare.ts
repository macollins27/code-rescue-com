import type { CompareRow } from "./types";

export const COMPARE: CompareRow[] = [
  {
    label: "Hire a senior engineer",
    produces:
      "Code at the rate one person can write it, reviewed by the standards they already know.",
    gap: "They can't install this stack. It isn't on the market. You'd be asking them to build it from the published methodology — and that's a multi-year undertaking, not a hire.",
  },
  {
    label: "Retain an AI-consulting firm",
    produces: "Slides, workshops, maturity assessments, a governance framework document.",
    gap: "Nothing installed, nothing shipped, nothing running against your actual codebase when they leave. The code keeps drifting while the engagement reports say it isn't.",
  },
  {
    label: "License a code-quality tool",
    produces: "A dashboard. Generic rules. A monthly invoice.",
    gap: "Off-the-shelf rules can't encode your domain, your failure modes, or the specific ways an AI agent drifts on your codebase. The rules have to be written from incidents — and those incidents are yours.",
  },
  {
    label: "Wait for the AI tooling to mature",
    produces: "Nothing. The wait is the strategy.",
    gap: "Codebase drift compounds. Every month you wait is a month of silent regressions and a harder cleanup when you finally stop waiting.",
  },
];
