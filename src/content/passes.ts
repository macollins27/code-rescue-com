import type { Pass } from "./types";

export const PASSES: Pass[] = [
  { n: "00", t: "Shared infrastructure" },
  { n: "01", t: "Procedure inventory" },
  { n: "02", t: "Input validation" },
  { n: "03", t: "Query correctness" },
  { n: "04", t: "Error handling" },
  { n: "05", t: "Audit log" },
  { n: "06", t: "Response shape" },
  { n: "07", t: "Security surface" },
  { n: "08", t: "Engineering quality" },
];
