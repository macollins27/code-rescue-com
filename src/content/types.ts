export interface Incident {
  date: string;
  headline: string;
  body: string;
  takeaway: string;
}

export type DeliverableLetter = "a" | "b" | "c";

export interface Deliverable {
  letter: DeliverableLetter;
  label: string;
  oneline: string;
  plain: string;
  duration: string;
  bestFor: string;
}

export interface CompareRow {
  label: string;
  produces: string;
  gap: string;
}

export interface InstalledMetric {
  n: string;
  what: string;
  plain: string;
}

export interface PipelineStage {
  stage: string;
  title: string;
  plain: string;
}

export interface Contact {
  bookingUrl: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
}

export interface RuleAnatomyRowTextPart {
  kind: "text";
  value: string;
}
export interface RuleAnatomyRowCodePart {
  kind: "code";
  value: string;
}
export type RuleAnatomyRowPart = RuleAnatomyRowTextPart | RuleAnatomyRowCodePart;

export interface RuleAnatomyRow {
  k: string;
  parts: RuleAnatomyRowPart[];
}

export interface Channel {
  k: string;
  v: string;
  href: string;
  primary?: boolean;
}

export interface EngageFact {
  k: string;
  v: string;
}
