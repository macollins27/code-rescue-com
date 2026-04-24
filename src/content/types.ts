export type RuleLayer = "spec" | "consistency" | "adversarial";

export interface CaseStudy {
  num: string;
  kicker: string;
  title: string;
  incident: string;
  observation: string;
  mechanism: string;
  code?: string;
  resultHtml: string;
  crises: string[];
  essay?: string;
}

export interface Crisis {
  n: string;
  name: string;
  date: string;
  desc: string;
  pull?: string;
}

export type CommitType = "feat(qa)" | "feat(qa-v2)" | "feat(pipeline)" | "feat(cto)" | "chore";

export type Commit = readonly [hash: string, type: CommitType, message: string];

export interface Rule {
  id: string;
  txt: string;
  layer: RuleLayer;
}

export interface RulesIndex {
  spec: Rule[];
  consistency: Rule[];
  adversarial: Rule[];
}

export type InventoryRow = readonly [artifact: string, count: string, detail: string];

export interface Pass {
  n: string;
  t: string;
}

export interface Deliverable {
  tag: string;
  title: string;
  plain: string;
  techHtml: string;
}
