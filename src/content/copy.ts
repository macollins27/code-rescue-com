import type { Channel, EngageFact, RuleAnatomyRow } from "./types";
import { CONTACT } from "./contact";

export const META = {
  title: "Code-Rescue — Install the stack that catches AI mistakes before they ship",
  description:
    "One engagement. Price fixed at kickoff. Install the mechanical stack that catches AI-written mistakes before they reach your main branch. One client at a time.",
} as const;

export const HERO = {
  eyebrow: "One engagement · Price fixed at kickoff · One client at a time",
  titleLine1: "Your team is shipping AI-written code.",
  titleLine2: "Something needs to be catching it.",
  lede: 'Most of what\'s sold as "AI governance" is advice. Code-Rescue is installation — a mechanical stack of rules, gates, and reviews, wired into your codebase, catching silent mistakes before they reach your main branch. One engagement. Price fixed at kickoff. You own everything.',
  ctaPrimary: { label: "Book a call", href: CONTACT.bookingUrl },
  ctaSecondary: { label: "See how it works", href: "#how" },
  meta: [
    { k: "Operator", v: "Maxwell Collins" },
    { k: "Based on", v: "A live production rebuild, documented publicly" },
    { k: "Availability", v: "Waitlist · weeks, not days" },
  ],
} as const;

export const PROBLEM = {
  kicker: "The problem",
  title: "AI writes code faster than any human can review it.",
  paragraphs: [
    "Your team is shipping more code than ever. Most of it written — or heavily assisted — by an AI agent. The code compiles. The tests pass. Pull requests look clean. And yet bugs are reaching production that your senior engineers would have caught a year ago.",
    "It's not that the AI is bad at writing code. It's that *nothing in your review pipeline was designed to catch the specific mistakes AI agents make.* Code review assumes a human author who knows what they don't know. Tests assume someone wrote them to assert the thing that actually matters. Neither assumption survives contact with an autonomous agent that's very good at producing convincing partial work.",
    "The result is a codebase that's drifting from what you thought you were building — silently, one well-intentioned commit at a time.",
  ],
  pullquote:
    '"You can specify software in a form an AI agent cannot silently overrule — as long as the form is mechanical enough to check against the source code at every commit."',
  pullquoteCite: "Maxwell Collins, DRDD Manifesto · maxwellacollins.com",
} as const;

export const WHAT_IT_IS = {
  kicker: "What gets installed",
  title: "A mechanical stack that catches what human review misses.",
  sub: "Every AI-written commit, every code change, every migration walks through this before it can land. Nothing is optional. Nothing can be overridden.",
  closingPara:
    "Underneath these four numbers is a specific stack: 42 domain rule files, ~3,500 mechanical rule statements across 24 domains, 48 write-time hooks, 41 structural code patterns, 26 lifecycle checks, 20 custom skills, 5 review agents, 7 shared authority files. Every piece is documented, every piece is yours, and every piece is tuned to the shape of your product.",
  closingMuted:
    "If the stack reads dense — good, it should. The point is that it's all there, installed, working, on day one.",
} as const;

export const HOW_IT_WORKS = {
  kicker: "How it works",
  title: "Six stages. Every change walks through all of them.",
  sub: "This is the pipeline that runs on every commit during the engagement, and keeps running after I leave.",
} as const;

export const DELIVERABLES_SEC = {
  kicker: "What you choose",
  title: "One engagement, one concrete deliverable.",
  sub: "The stack gets installed either way. At kickoff you pick one of three deliverables to ship under it.",
} as const;

export const PROOF = {
  kicker: "Receipts",
  title: "Four dated incidents from one production rebuild.",
  sub: "Each incident produced a new layer of the stack you'd be installing. None of this is theoretical.",
  footnote: "The full methodology, with every rule and every incident, is published at ",
  footnoteLinkText: "maxwellacollins.com",
  footnoteLinkHref: "https://maxwellacollins.com",
  footnoteTail: ". This page is the commercial installation of it.",
} as const;

export const RULE_ANATOMY = {
  kicker: "What one rule looks like",
  title: "A small, concrete example.",
  sub: 'If you\'re wondering what "a mechanical rule" actually is, here is one from the live rebuild — rendered the way it lives in the codebase. It exists because an attack vector was found, and it prevents that exact class of problem from ever shipping again.',
  id: "AUTH-5",
  type: "Adversarial",
  locked: "Locked 2026-04-07",
  ruleTitle: "Cross-organization access",
  rows: [
    {
      k: "Origin",
      parts: [
        {
          kind: "text",
          value:
            "An attacker probing the system could tell whether a record existed in another customer's account by the error code returned — enabling cross-customer enumeration.",
        },
      ],
    },
    {
      k: "What the rule says",
      parts: [
        {
          kind: "text",
          value:
            'Every request that looks up a single record must include the active organization\'s ID. If no row comes back — regardless of *why* — respond with "not found." Never use "access denied." That error leaks existence.',
        },
      ],
    },
    {
      k: "How it's enforced",
      parts: [
        {
          kind: "text",
          value: "Write-time: an AI agent trying to write ",
        },
        { kind: "code", value: '"Access denied"' },
        {
          kind: "text",
          value:
            " in a procedure file gets blocked before the edit lands. Commit-time: a static check refuses any database query missing the organization ID. Runtime: middleware verifies the session before any procedure body runs.",
        },
      ],
    },
    {
      k: "What it closes",
      parts: [
        {
          kind: "text",
          value:
            "Three distinct failure modes — record doesn't exist, record was deleted, record belongs to another customer — now return identical responses. A probing client can no longer distinguish between them. The enumeration attack stops being possible.",
        },
      ],
    },
  ] as RuleAnatomyRow[],
  footerText:
    "One of ~3,500 mechanical rule statements across 24 domains. Every one has the same six-part anatomy. ",
  footerLinkText: "View on maxwellacollins.com →",
  footerLinkHref: "https://maxwellacollins.com/rules/auth-5",
} as const;

export const PRICING = {
  kicker: "Price",
  title: "Starting at $10,000. Fixed at kickoff.",
  sub: "Engagements are scoped to your codebase and the problem. The number gets nailed down on the call — once we agree, it stops moving.",
  floor: {
    label: "Floor",
    amount: "$10,000",
    note: "Small codebase, one bounded problem, a QA run or a focused migration.",
  },
  scopeLabel: "What moves the number",
  scopeFactors: [
    "Codebase size and how many domains are in scope",
    "Which deliverable — a domain build, a system migration, or a QA run",
    "Depth of existing rules, hooks, and tests already in place",
    "Whether shared-authority files already exist or need to be authored",
  ],
  reassurance: "Fixed at kickoff. No hourly billing. No scope creep. No surprise invoices.",
  alternativesKicker: "The alternatives, honestly",
  alternativesTitle: "What you could do instead — and what each option leaves unsolved.",
  alternativesSub:
    "The stack Code-Rescue installs was built over months of production work and documented publicly at maxwellacollins.com. It isn't available as a product, a platform, or an off-the-shelf framework. Here's what the other paths produce, and the gap each one leaves.",
} as const;

export const NOT_THIS = {
  kicker: "What this is not",
  title: "The list of things Code-Rescue deliberately isn't.",
  columns: [
    {
      title: "Not AI consulting.",
      body: 'No slides. No workshops. No "AI enablement strategy." If the engagement produces a slide deck, the engagement has failed.',
    },
    {
      title: "Not staff augmentation.",
      body: "I'm not a fractional engineer or a fractional CTO. I install a system, ship one deliverable under it, and leave. Your team runs it after.",
    },
    {
      title: "Not a retainer.",
      body: "One engagement, price fixed at kickoff, clean exit. If you want ongoing help later, we talk later. Nothing about this engagement locks you in.",
    },
    {
      title: "Not a tool you license.",
      body: "Every rule, hook, gate, and test installed during the engagement is yours. Modify it, extend it, delete it, fork it. No ongoing fees.",
    },
  ],
  wide: {
    title: "Not a product you can buy elsewhere.",
    bodyHtml:
      'The stack is built from a live production rebuild, documented publicly at <a class="ilink-dark" href="https://maxwellacollins.com">maxwellacollins.com</a>, and installed during the engagement. Nothing about it is licensed, franchised, or sitting on a vendor\'s shelf.',
  },
} as const;

export const ENGAGE = {
  kicker: "Engage",
  title: "One client at a time. Three ways to reach me.",
  sub: "Pick the channel that fits. The call is structured — 30 minutes, we talk about your codebase and whether this is a fit. The phone is for the immediate question. Email is for the considered note.",
  channels: [
    {
      k: "Book a call",
      v: "Pick a time in the next 3 days",
      href: CONTACT.bookingUrl,
      primary: true,
    },
    { k: "Phone", v: CONTACT.phone, href: CONTACT.phoneHref },
    { k: "Email", v: CONTACT.email, href: CONTACT.emailHref },
  ] as Channel[],
  facts: [
    { k: "Operator", v: "Maxwell Collins" },
    { k: "Location", v: "Tampa, FL" },
    { k: "Price", v: "From $10k · fixed at kickoff" },
    { k: "Duration", v: "2 – 8 weeks" },
    { k: "Clients at a time", v: "One" },
    { k: "Next slot", v: "Inquire" },
  ] as EngageFact[],
} as const;

export const FOOTER = {
  tagline:
    "The commercial installation of Domain-Rules-Driven Development — the methodology by Maxwell Collins, documented publicly at ",
  taglineLinkText: "maxwellacollins.com",
  taglineLinkHref: "https://maxwellacollins.com",
  taglineTail: ".",
  cols: [
    {
      h: "Methodology",
      items: [
        { label: "Manifesto", href: "https://maxwellacollins.com/manifesto" },
        { label: "Three crises", href: "https://maxwellacollins.com/crises" },
        { label: "Rules explorer", href: "https://maxwellacollins.com/rules" },
        { label: "Field notes", href: "https://maxwellacollins.com/writing" },
      ],
    },
    {
      h: "Code-Rescue",
      items: [
        { label: "What it is", href: "#what" },
        { label: "How it works", href: "#how" },
        { label: "Proof", href: "#proof" },
        { label: "Engage", href: "#engage" },
      ],
    },
    {
      h: "Contact",
      items: [
        { label: "Book a call", href: CONTACT.bookingUrl },
        { label: CONTACT.phone, href: CONTACT.phoneHref },
        { label: CONTACT.email, href: CONTACT.emailHref },
      ],
    },
  ],
  contactPlain: "Tampa, FL",
  bottomLeft: "© 2026 Code-Rescue · Maxwell Collins · Published in public",
  bottomRight: "No analytics · No tracking · No cookies · View-source has a note",
  legal: [
    { label: "Privacy", href: "/legal/privacy-policy" },
    { label: "Terms", href: "/legal/terms-of-service" },
    { label: "Cookies", href: "/legal/cookie-policy" },
  ],
} as const;

export const TOPNAV = {
  links: [
    { label: "What", href: "#what" },
    { label: "How", href: "#how" },
    { label: "Proof", href: "#proof" },
  ],
  cta: { label: "Book a call", href: CONTACT.bookingUrl },
} as const;
