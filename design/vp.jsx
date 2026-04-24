/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

// ───────────────────────────────────────────────────────────────────
// Code-Rescue — VP page
// ───────────────────────────────────────────────────────────────────

const INCIDENTS = [
  {
    date: "March 30, 2026",
    headline: "20 minutes. 100+ critical bugs. A green test suite.",
    body: "A codebase with 4,800 passing tests shipped to production. A single QA audit — 20 minutes — surfaced over 100 critical bugs. Every bug had a passing test sitting on top of it. The test suite was the problem: tests assert at call sites, and users don't live at call sites. They live in sequences — a page load, a click, a navigation away, a return five minutes later to check if the record stuck. None of that is a function return value.",
    takeaway: "Tests that pass while the software breaks are worse than no tests at all. They make the break invisible."
  },
  {
    date: "February 21, 2026",
    headline: "24,367 lines of research, deleted in a morning.",
    body: "A rebuild's research phase had been completed — cleanly, confidently, with thorough deliverables. The phase covered residential properties only. The actual business serves residential, commercial, industrial, institutional, and government property types. The AI agents had been told this, in passing, and had narrowed the scope anyway because the residential case was easier. Nothing flagged. It only surfaced on read-through.",
    takeaway: "AI agents narrow scope silently. Smart agents do it more, not less, because they're better at producing convincing partial work."
  },
  {
    date: "February 26–27, 2026",
    headline: "184 architecture documents, archived in one day.",
    body: "Twelve phases of architecture docs had been written by AI agents reading other AI-generated documents instead of the actual source code. 24 direct contradictions with the live codebase. 31 aspirational features described as already shipped. 9 architecture decision records entirely hallucinated. 44 commits in one day to clean it up.",
    takeaway: "AI-written documentation that cites AI-written documentation is confidence without substance. It reads right and points nowhere."
  },
  {
    date: "March 1, 2026",
    headline: "\u201CPLW is real, not simulated.\u201D",
    body: "Architecture validation was supposed to run against a live API. The agents rewrote the brief as a \u201Crisk-inventory and tiny-experiment approach,\u201D treated the live system as a simulation, and produced pretend validations. Five commits and fifty-one minutes to revert. The revert commit message became a standing rule: when a real system exists, reason against the real system.",
    takeaway: "AI agents default to reasoning against simulations, even when the real thing is wired up and available. The simulation always agrees with them."
  }
];

const DELIVERABLES = [
  {
    letter: "a",
    label: "Domain Build",
    oneline: "One area of your product, rebuilt end-to-end under full mechanical review.",
    plain: "Pick one bounded part of your codebase — a checkout flow, a permissions system, a reporting module. I rebuild it from written specification to shipped production code, with every rule, gate, and review in place the entire time.",
    duration: "4 – 8 weeks",
    bestFor: "You have one area that keeps breaking, or one area you know is load-bearing for the next 18 months."
  },
  {
    letter: "b",
    label: "System Migration",
    oneline: "One cross-cutting change, executed spec-first without regressions.",
    plain: "A vendor swap. A database migration. A shared abstraction renamed across the codebase. The kind of change that touches every domain and usually ships bugs quietly for months. I execute one of these under the full pipeline — nothing lands until it's verified, everywhere.",
    duration: "4 – 8 weeks",
    bestFor: "You have a migration your team has been avoiding because the blast radius is too large."
  },
  {
    letter: "c",
    label: "QA Run",
    oneline: "An autonomous auditor walks your app and files every bug it finds.",
    plain: "I install the QA harness on your production app and run it against your existing code. It behaves like a real user — across time zones, screen sizes, concurrent sessions, accessibility checks, edge-case inputs — and hands you a filed-and-prioritized backlog. No change to your codebase; pure diagnostic.",
    duration: "2 – 3 weeks",
    bestFor: "You want to know what's broken before an investor, an auditor, or a customer finds out."
  }
];

const COMPARE = [
  {
    label: "Hire a senior engineer",
    produces: "Code at the rate one person can write it, reviewed by the standards they already know.",
    gap: "They can't install this stack. It isn't on the market. You'd be asking them to build it from the published methodology — and that's a multi-year undertaking, not a hire."
  },
  {
    label: "Retain an AI-consulting firm",
    produces: "Slides, workshops, maturity assessments, a governance framework document.",
    gap: "Nothing installed, nothing shipped, nothing running against your actual codebase when they leave. The code keeps drifting while the engagement reports say it isn't."
  },
  {
    label: "License a code-quality tool",
    produces: "A dashboard. Generic rules. A monthly invoice.",
    gap: "Off-the-shelf rules can't encode your domain, your failure modes, or the specific ways an AI agent drifts on your codebase. The rules have to be written from incidents — and those incidents are yours."
  },
  {
    label: "Wait for the AI tooling to mature",
    produces: "Nothing. The wait is the strategy.",
    gap: "Codebase drift compounds. Every month you wait is a month of silent regressions and a harder cleanup when you finally stop waiting."
  }
];

const INSTALLED = [
  { n: "113", what: "Automated checks", plain: "Running against every line of AI-written code your team produces, before it reaches review." },
  { n: "9", what: "Review rounds", plain: "An adversarial review that every change walks through before it can land on your main branch." },
  { n: "12", what: "Gate stages", plain: "A quality gate between every commit and production. Any stage fails, the commit doesn't land. No overrides." },
  { n: "5", what: "Enforcement layers", plain: "At write-time, at commit, at runtime, at session start, and at every tool call — so nothing slips through a single layer." }
];

const PIPELINE = [
  { stage: "1", title: "Rules are the specification", plain: "Your product's behavior is written down as mechanical rules. Not prose. Not wishes. Statements a machine can check." },
  { stage: "2", title: "Contract extraction", plain: "An automated step reads the rules and produces the plan the implementation will follow, layer by layer." },
  { stage: "3", title: "Source, one layer at a time", plain: "Code gets written layer by layer. Every procedure verified the moment it's written, with cross-procedure checks after each layer." },
  { stage: "4", title: "Nine rounds of adversarial review", plain: "A structured review pass through the code — input handling, query correctness, error paths, audit trails, security surface — ending in a clean, zero-findings state." },
  { stage: "5", title: "QA auditor", plain: "An autonomous agent walks your live app like a real user. Across time zones, devices, concurrency, accessibility. Files every bug it finds into a database." },
  { stage: "6", title: "Regression tests", plain: "Tests get written after QA — one per real bug surfaced — so the same bug can never ship twice. Tests lock behavior; they don't define it." }
];

const CONTACT = {
  bookingUrl: "https://www.code-rescue.com/book/",
  phone: "+1 (813) 480-7797",
  phoneHref: "tel:+18134807797",
  email: "max@code-rescue.com",
  emailHref: "mailto:max@code-rescue.com?subject=Code-Rescue%20engagement%20inquiry"
};

// ───────────────────────────────────────────────────────────────────
// Components
// ───────────────────────────────────────────────────────────────────

function TopNav() {
  return (
    <nav className="topnav">
      <div className="wrap topnav-inner">
        <a href="#top" className="brand">
          <span className="brand-mark">CR</span>
          <span className="brand-name">Code-Rescue</span>
        </a>
        <div className="topnav-links">
          <a href="#what">What it is</a>
          <a href="#how">How it works</a>
          <a href="#proof">Proof</a>
          <a href={CONTACT.bookingUrl} className="topnav-cta">Book a call</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap">
        <div className="hero-eyebrow">
          <span className="pip" />
          One engagement · Price fixed at kickoff · One client at a time
        </div>
        <h1 className="hero-title">
          Your team is shipping AI-written code.<br/>
          <em>Something needs to be catching it.</em>
        </h1>
        <p className="hero-lede">
          Most of what's sold as &ldquo;AI governance&rdquo; is advice. Code-Rescue is installation — a mechanical stack of rules, gates, and reviews, wired into your codebase, catching silent mistakes before they reach your main branch. One engagement. Price fixed at kickoff. You own everything.
        </p>
        <div className="hero-ctas">
          <a href={CONTACT.bookingUrl} className="btn btn-primary">Book a call</a>
          <a href="#how" className="btn btn-ghost">See how it works</a>
        </div>
        <div className="hero-meta">
          <div><span className="meta-k">Operator</span><span className="meta-v">Maxwell Collins</span></div>
          <div><span className="meta-k">Based on</span><span className="meta-v">A live production rebuild, documented publicly</span></div>
          <div><span className="meta-k">Availability</span><span className="meta-v">Waitlist · weeks, not days</span></div>
        </div>
      </div>
    </header>
  );
}

function ProblemSection() {
  return (
    <section className="section section-problem">
      <div className="wrap narrow">
        <div className="kicker">The problem</div>
        <h2 className="h2">AI writes code faster than any human can review it.</h2>
        <div className="prose">
          <p>Your team is shipping more code than ever. Most of it written — or heavily assisted — by an AI agent. The code compiles. The tests pass. Pull requests look clean. And yet bugs are reaching production that your senior engineers would have caught a year ago.</p>
          <p>It's not that the AI is bad at writing code. It's that <em>nothing in your review pipeline was designed to catch the specific mistakes AI agents make.</em> Code review assumes a human author who knows what they don't know. Tests assume someone wrote them to assert the thing that actually matters. Neither assumption survives contact with an autonomous agent that's very good at producing convincing partial work.</p>
          <p>The result is a codebase that's drifting from what you thought you were building — silently, one well-intentioned commit at a time.</p>
        </div>
        <aside className="pullquote">
          <blockquote>
            &ldquo;You can specify software in a form an AI agent cannot silently overrule — as long as the form is mechanical enough to check against the source code at every commit.&rdquo;
          </blockquote>
          <cite>Maxwell Collins, DRDD Manifesto · maxwellacollins.com</cite>
        </aside>
      </div>
    </section>
  );
}

function WhatItIs() {
  return (
    <section className="section section-what" id="what">
      <div className="wrap narrow">
        <div className="kicker">What gets installed</div>
        <h2 className="h2">A mechanical stack that catches what human review misses.</h2>
        <p className="sub">Every AI-written commit, every code change, every migration walks through this before it can land. Nothing is optional. Nothing can be overridden.</p>
      </div>
      <div className="wrap">
        <div className="installed-grid">
          {INSTALLED.map(i => (
            <div key={i.what} className="installed-card">
              <div className="installed-n">{i.n}</div>
              <div className="installed-what">{i.what}</div>
              <div className="installed-plain">{i.plain}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="wrap narrow">
        <div className="prose">
          <p>Underneath these four numbers is a specific stack: 42 domain rule files, ~3,500 mechanical rule statements across 24 domains, 48 write-time hooks, 41 structural code patterns, 26 lifecycle checks, 20 custom skills, 5 review agents, 7 shared authority files. Every piece is documented, every piece is yours, and every piece is tuned to the shape of your product.</p>
          <p className="muted small">If the stack reads dense — good, it should. The point is that it's all there, installed, working, on day one.</p>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="section section-how" id="how">
      <div className="wrap narrow">
        <div className="kicker">How it works</div>
        <h2 className="h2">Six stages. Every change walks through all of them.</h2>
        <p className="sub">This is the pipeline that runs on every commit during the engagement, and keeps running after I leave.</p>
      </div>
      <div className="wrap">
        <ol className="pipeline">
          {PIPELINE.map((p, i) => (
            <li key={p.stage} className="pipeline-step">
              <div className="pipeline-num">{p.stage}</div>
              <div className="pipeline-body">
                <div className="pipeline-title">{p.title}</div>
                <div className="pipeline-plain">{p.plain}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function DeliverablesSection() {
  return (
    <section className="section section-deliverables" id="deliverables">
      <div className="wrap narrow">
        <div className="kicker">What you choose</div>
        <h2 className="h2">One engagement, one concrete deliverable.</h2>
        <p className="sub">The stack gets installed either way. At kickoff you pick one of three deliverables to ship under it.</p>
      </div>
      <div className="wrap">
        <div className="deliv-grid">
          {DELIVERABLES.map(d => (
            <article key={d.letter} className="deliv-card">
              <div className="deliv-letter">{d.letter}</div>
              <h3 className="deliv-label">{d.label}</h3>
              <p className="deliv-oneline">{d.oneline}</p>
              <p className="deliv-plain">{d.plain}</p>
              <div className="deliv-foot">
                <div><span className="deliv-k">Duration</span><span className="deliv-v">{d.duration}</span></div>
                <div><span className="deliv-k">Best for</span><span className="deliv-v">{d.bestFor}</span></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section className="section section-proof" id="proof">
      <div className="wrap narrow">
        <div className="kicker">Receipts</div>
        <h2 className="h2">Four dated incidents from one production rebuild.</h2>
        <p className="sub">Each incident produced a new layer of the stack you'd be installing. None of this is theoretical.</p>
      </div>
      <div className="wrap narrow">
        <div className="incidents">
          {INCIDENTS.map((inc, i) => (
            <article key={i} className="incident">
              <div className="incident-date mono">{inc.date}</div>
              <h3 className="incident-headline">{inc.headline}</h3>
              <p className="incident-body">{inc.body}</p>
              <div className="incident-takeaway">
                <span className="takeaway-k">Takeaway</span>
                <span className="takeaway-v">{inc.takeaway}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="wrap narrow">
        <div className="proof-footnote muted small">
          The full methodology, with every rule and every incident, is published at <a href="https://maxwellacollins.com" className="ilink">maxwellacollins.com</a>. This page is the commercial installation of it.
        </div>
      </div>
    </section>
  );
}

function RuleAnatomy() {
  return (
    <section className="section section-rule">
      <div className="wrap narrow">
        <div className="kicker">What one rule looks like</div>
        <h2 className="h2">A small, concrete example.</h2>
        <p className="sub">If you're wondering what &ldquo;a mechanical rule&rdquo; actually is, here is one from the live rebuild — rendered the way it lives in the codebase. It exists because an attack vector was found, and it prevents that exact class of problem from ever shipping again.</p>
      </div>
      <div className="wrap narrow">
        <div className="rule-card">
          <div className="rule-head">
            <span className="rule-id mono">AUTH-5</span>
            <span className="rule-type">Adversarial</span>
            <span className="rule-locked mono">Locked 2026-04-07</span>
          </div>
          <h3 className="rule-title">Cross-organization access</h3>
          <div className="rule-anatomy">
            <div className="rule-row">
              <div className="rule-k">Origin</div>
              <div className="rule-v">An attacker probing the system could tell whether a record existed in another customer's account by the error code returned — enabling cross-customer enumeration.</div>
            </div>
            <div className="rule-row">
              <div className="rule-k">What the rule says</div>
              <div className="rule-v">Every request that looks up a single record must include the active organization's ID. If no row comes back — regardless of <em>why</em> — respond with &ldquo;not found.&rdquo; Never use &ldquo;access denied.&rdquo; That error leaks existence.</div>
            </div>
            <div className="rule-row">
              <div className="rule-k">How it's enforced</div>
              <div className="rule-v">Write-time: an AI agent trying to write <code className="mono">&ldquo;Access denied&rdquo;</code> in a procedure file gets blocked before the edit lands. Commit-time: a static check refuses any database query missing the organization ID. Runtime: middleware verifies the session before any procedure body runs.</div>
            </div>
            <div className="rule-row">
              <div className="rule-k">What it closes</div>
              <div className="rule-v">Three distinct failure modes — record doesn't exist, record was deleted, record belongs to another customer — now return identical responses. A probing client can no longer distinguish between them. The enumeration attack stops being possible.</div>
            </div>
          </div>
          <div className="rule-foot muted small">
            One of ~3,500 mechanical rule statements across 24 domains. Every one has the same six-part anatomy. <a className="ilink" href="https://maxwellacollins.com/rules/auth-5">View on maxwellacollins.com →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="section section-pricing" id="price">
      <div className="wrap narrow">
        <div className="kicker">Price</div>
        <h2 className="h2">$10,000 to $100,000. Fixed at kickoff.</h2>
        <p className="sub">Engagements are scoped to your codebase and the problem. Once we've talked through the surface area and agreed on a number, it stops moving. No hourly billing. No scope creep. No surprise invoices.</p>
      </div>
      <div className="wrap narrow">
        <div className="price-range">
          <div className="price-range-row">
            <div className="price-range-label">Floor</div>
            <div className="price-range-amount mono">$10,000</div>
            <div className="price-range-note">Small codebase, one bounded problem, a QA run or a focused migration.</div>
          </div>
          <div className="price-range-bar"><div className="price-range-bar-fill" /></div>
          <div className="price-range-row">
            <div className="price-range-label">Ceiling</div>
            <div className="price-range-amount mono">$100,000</div>
            <div className="price-range-note">Large codebase, multi-domain scope, full stack installed with a substantial deliverable shipped under it.</div>
          </div>
        </div>
      </div>
      <div className="wrap narrow">
        <div className="kicker" style={{marginTop: 72}}>The alternatives, honestly</div>
        <h3 className="h3">What you could do instead — and what each option leaves unsolved.</h3>
        <p className="sub small-sub">The stack Code-Rescue installs was built over months of production work and documented publicly at <a className="ilink" href="https://maxwellacollins.com">maxwellacollins.com</a>. It isn't available as a product, a platform, or an off-the-shelf framework. Here's what the other paths produce, and the gap each one leaves.</p>
        <div className="compare-v2">
          {COMPARE.map((c, i) => (
            <div key={i} className="compare-v2-row">
              <div className="compare-v2-label">{c.label}</div>
              <div className="compare-v2-cell">
                <div className="compare-v2-k">What it produces</div>
                <div className="compare-v2-v">{c.produces}</div>
              </div>
              <div className="compare-v2-cell">
                <div className="compare-v2-k">What it leaves</div>
                <div className="compare-v2-v">{c.gap}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NotThis() {
  return (
    <section className="section section-notthis">
      <div className="wrap narrow">
        <div className="kicker">What this is not</div>
        <h2 className="h2">The list of things Code-Rescue deliberately isn't.</h2>
        <div className="notthis-grid">
          <div className="notthis-col">
            <div className="notthis-title">Not AI consulting.</div>
            <div className="notthis-body">No slides. No workshops. No &ldquo;AI enablement strategy.&rdquo; If the engagement produces a slide deck, the engagement has failed.</div>
          </div>
          <div className="notthis-col">
            <div className="notthis-title">Not staff augmentation.</div>
            <div className="notthis-body">I'm not a fractional engineer or a fractional CTO. I install a system, ship one deliverable under it, and leave. Your team runs it after.</div>
          </div>
          <div className="notthis-col">
            <div className="notthis-title">Not a retainer.</div>
            <div className="notthis-body">One engagement, price fixed at kickoff, clean exit. If you want ongoing help later, we talk later. Nothing about this engagement locks you in.</div>
          </div>
          <div className="notthis-col">
            <div className="notthis-title">Not a tool you license.</div>
            <div className="notthis-body">Every rule, hook, gate, and test installed during the engagement is yours. Modify it, extend it, delete it, fork it. No ongoing fees.</div>
          </div>
          <div className="notthis-col notthis-col-wide">
            <div className="notthis-title">Not a product you can buy elsewhere.</div>
            <div className="notthis-body">The stack is built from a live production rebuild, documented publicly at <a className="ilink-dark" href="https://maxwellacollins.com">maxwellacollins.com</a>, and installed during the engagement. Nothing about it is licensed, franchised, or sitting on a vendor's shelf.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Engage() {
  return (
    <section className="section section-engage" id="engage">
      <div className="wrap narrow">
        <div className="kicker">Engage</div>
        <h2 className="h2">One client at a time. Three ways to reach me.</h2>
        <p className="sub">Pick the channel that fits. The call is structured — 30 minutes, we talk about your codebase and whether this is a fit. The phone is for the immediate question. Email is for the considered note.</p>
        <div className="channels">
          <a href={CONTACT.bookingUrl} className="channel channel-primary">
            <div className="channel-k">Book a call</div>
            <div className="channel-v">Pick a time in the next 3 days</div>
            <div className="channel-arrow">→</div>
          </a>
          <a href={CONTACT.phoneHref} className="channel">
            <div className="channel-k">Phone</div>
            <div className="channel-v mono">{CONTACT.phone}</div>
            <div className="channel-arrow">→</div>
          </a>
          <a href={CONTACT.emailHref} className="channel">
            <div className="channel-k">Email</div>
            <div className="channel-v mono">{CONTACT.email}</div>
            <div className="channel-arrow">→</div>
          </a>
        </div>
        <dl className="engage-facts">
          <div><dt>Operator</dt><dd>Maxwell Collins</dd></div>
          <div><dt>Location</dt><dd>Tampa, FL</dd></div>
          <div><dt>Price</dt><dd>$10k – $100k · fixed at kickoff</dd></div>
          <div><dt>Duration</dt><dd>2 – 8 weeks</dd></div>
          <div><dt>Clients at a time</dt><dd>One</dd></div>
          <div><dt>Next slot</dt><dd>Inquire</dd></div>
        </dl>
      </div>
    </section>
  );
}

function Footer() {
  const [tz, setTz] = useState("");
  const [time, setTime] = useState("");
  useEffect(() => {
    try { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone); } catch (e) { setTz("UTC"); }
    const tick = () => {
      const d = new Date();
      setTime(String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0"));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-mark">CR</span>
              <span className="brand-name">Code-Rescue</span>
            </div>
            <p className="footer-tagline">The commercial installation of Domain-Rules-Driven Development — the methodology by Maxwell Collins, documented publicly at <a className="ilink" href="https://maxwellacollins.com">maxwellacollins.com</a>.</p>
          </div>
          <div className="footer-cols">
            <div>
              <div className="footer-h">Methodology</div>
              <a href="https://maxwellacollins.com/manifesto">Manifesto</a>
              <a href="https://maxwellacollins.com/crises">Three crises</a>
              <a href="https://maxwellacollins.com/rules">Rules explorer</a>
              <a href="https://maxwellacollins.com/writing">Field notes</a>
            </div>
            <div>
              <div className="footer-h">Code-Rescue</div>
              <a href="#what">What it is</a>
              <a href="#how">How it works</a>
              <a href="#proof">Proof</a>
              <a href="#engage">Engage</a>
            </div>
            <div>
              <div className="footer-h">Contact</div>
              <a href={CONTACT.bookingUrl}>Book a call</a>
              <a href={CONTACT.phoneHref} className="mono">{CONTACT.phone}</a>
              <a href={CONTACT.emailHref}>{CONTACT.email}</a>
              <span className="footer-plain">Tampa, FL</span>
              <span className="footer-plain mono">{time ? time + " · " + tz : "\u00A0"}</span>
            </div>
          </div>
        </div>
        <div className="footer-bot">
          <div className="mono small muted">&copy; 2026 Code-Rescue · Maxwell Collins · Published in public</div>
          <div className="mono small muted">No analytics · No tracking · No cookies · View-source has a note</div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <TopNav />
      <Hero />
      <ProblemSection />
      <WhatItIs />
      <HowItWorks />
      <DeliverablesSection />
      <Proof />
      <RuleAnatomy />
      <Pricing />
      <NotThis />
      <Engage />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
