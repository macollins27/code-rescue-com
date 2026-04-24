/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle */
const { useState, useEffect, useMemo, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "register": "terminal",
  "density": "high",
  "accent": "#d9ff5c",
  "showCommits": true
}/*EDITMODE-END*/;

function getUrlOverrides() {
  try {
    const p = new URLSearchParams(window.location.search);
    const o = {};
    if (p.get("register")) o.register = p.get("register");
    if (p.get("density")) o.density = p.get("density");
    if (p.get("accent")) o.accent = "#" + p.get("accent").replace("#", "");
    if (p.get("variant")) o.variant = p.get("variant");
    return o;
  } catch { return {}; }
}
window.CR_URL = getUrlOverrides();

function Tweaks() {
  const [t, set] = useTweaks(TWEAK_DEFAULTS);
  const urlOv = window.CR_URL;
  const eff = { ...t, ...urlOv };
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-reg", eff.register);
    root.setAttribute("data-density", eff.density);
    root.setAttribute("data-variant", eff.variant || "default");
    root.style.setProperty("--accent", eff.accent);
  }, [eff.register, eff.density, eff.accent, eff.variant]);
  if (urlOv.register || urlOv.variant) return null; // no tweaks UI when locked by URL
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Register">
        <TweakRadio
          value={t.register}
          options={[
            { value: "terminal", label: "Terminal" },
            { value: "editorial", label: "Editorial" },
            { value: "spec", label: "Spec doc" },
          ]}
          onChange={(v) => set({ register: v })}
        />
      </TweakSection>
      <TweakSection label="Density">
        <TweakRadio
          value={t.density}
          options={[
            { value: "tight", label: "Tight" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
          onChange={(v) => set({ density: v })}
        />
      </TweakSection>
      <TweakSection label="Accent">
        <TweakColor value={t.accent} onChange={(v) => set({ accent: v })} />
      </TweakSection>
      <TweakSection label="Commit log">
        <TweakToggle value={t.showCommits} onChange={(v) => set({ showCommits: v })} />
      </TweakSection>
    </TweaksPanel>
  );
}

function TopBar() {
  return (
    <div className="topbar">
      <div className="wrap">
        <div className="brand">
          <span className="mark">CR</span>
          <span>Code-Rescue</span>
          <span className="faint" style={{ marginLeft: 10, fontSize: 11, letterSpacing: "0.08em" }}>MAXWELLACOLLINS.COM</span>
        </div>
        <nav>
          <a href="#offer">Offer</a>
          <a href="#crises">Crises</a>
          <a href="#cases">Case studies</a>
          <a href="#system">System</a>
          <a href="#engage">Engage</a>
        </nav>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" style={{ borderTop: 0, paddingTop: 72 }}>
      <div className="wrap">
        <div className="eyebrow"><span className="dot"></span><span>Code-Rescue · Services · One client at a time</span></div>
        <h1>The LLM shipped slop. Install the stack that catches it <em>before</em> it lands on main.</h1>
        <p className="lede">
          A single engagement. A fixed $40,000. DRDD — Domain-Rules-Driven Development — installed in your codebase, tuned to your stack, with one substantial deliverable shipped under the pipeline it enforces. You own every piece. No licensing, no retainers.
        </p>
        <div className="thesis">
          <div className="label">Canonical thesis</div>
          <div className="q">"If you can't write an assertion for a specification, you don't have a specification yet."</div>
          <div className="src">— Maxwell Collins, <a className="link" href="https://maxwellacollins.com/about">maxwellacollins.com/about</a></div>
        </div>
      </div>
    </section>
  );
}

function Posture() {
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <div className="idx">§ 00 · Posture</div>
          <div>
            <h2>This is not AI consulting.</h2>
            <div className="sub">
              The market is saturated with "AI transformation" and "AI-assisted development" pitches. The buyer on this page has trained themselves to ignore that category. What ships below is working infrastructure — commits, hooks, rules, gates, test suites — iterated across dozens of multi-hour sessions on a real production rebuild. Every rule traces to a specific observed failure documented in public.
            </div>
          </div>
        </div>
        <div className="grid-3">
          <div>
            <div className="up faint" style={{ fontSize: 11, marginBottom: 12 }}>What it is</div>
            <div className="serif" style={{ fontSize: 17, lineHeight: 1.5 }}>Installed enforcement infrastructure plus one substantial shipped deliverable. You choose the deliverable at kickoff.</div>
          </div>
          <div>
            <div className="up faint" style={{ fontSize: 11, marginBottom: 12 }}>What it isn't</div>
            <div className="serif" style={{ fontSize: 17, lineHeight: 1.5 }}>Staff augmentation. Fractional CTO. Training. Workshops. Slide decks. Code-by-the-hour. Generic "AI consulting."</div>
          </div>
          <div>
            <div className="up faint" style={{ fontSize: 11, marginBottom: 12 }}>Credibility wall</div>
            <div className="serif" style={{ fontSize: 17, lineHeight: 1.5 }}>A published manifesto, dated incident essays, a browseable rules explorer, a live commit log. Every claim on this page ties to an artifact or a number.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Offer() {
  return (
    <section id="offer">
      <div className="wrap">
        <div className="sec-head">
          <div className="idx">§ 01 · Offer</div>
          <div>
            <h2>One engagement. Fixed scope. Fixed price.</h2>
            <div className="sub">The full DRDD stack installed in your codebase, configured to your domain, plus one substantial deliverable shipped under the pipeline it enforces.</div>
          </div>
        </div>

        <div className="offer">
          <div className="left">
            <div className="price num">$40,000</div>
            <div className="price-label">Fixed price · single engagement · one client at a time</div>
            <div style={{ marginTop: 32 }}>
              <div className="up faint" style={{ fontSize: 11, marginBottom: 10 }}>Typical duration</div>
              <div className="mono" style={{ fontSize: 15 }}>4–8 weeks for deliverable (a) or (b) · 2–3 weeks for (c)</div>
            </div>
            <div style={{ marginTop: 24 }}>
              <div className="up faint" style={{ fontSize: 11, marginBottom: 10 }}>You own everything</div>
              <div className="mono dim" style={{ fontSize: 13, lineHeight: 1.7 }}>No licensing · No ongoing fees · No lock-in<br/>Modify, extend, delete, or fork any piece of it.</div>
            </div>
          </div>
          <div className="right">
            <div className="up faint" style={{ fontSize: 11, marginBottom: 18 }}>Installed in every engagement</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--ink)" }}>
              {[
                "12-stage quality gate (pnpm gate / gate:static) tuned to your stack",
                "~24 runtime hooks + 48 hookify rules + 41 ast-grep structural rules",
                "Domain-rules authorship system: per-domain .md spec files, source-first pipeline",
                "Feature-level pipeline with per-layer fan-out and multi-agent review panel",
                "LLM-driven QA harness with stdio MCP emission + triple-verdict verification",
                "Persistent cross-session memory system auto-loaded into every session",
                "9-pass adversarial review skill with mechanical phase gate",
                "Six GitHub Actions workflows (ci, compliance, deploy, migration-check, qa, security)",
              ].map((x, i) => (
                <li key={i} style={{ padding: "8px 0", borderTop: i ? "1px solid var(--rule)" : 0, display:"grid", gridTemplateColumns:"20px 1fr", gap: 8 }}>
                  <span className="accent mono">▸</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <div className="up faint" style={{ fontSize: 11, marginBottom: 18 }}>Choose one deliverable at kickoff</div>
          <div className="grid-3">
            <div className="deliverable">
              <div className="tag">a · Domain build</div>
              <h4>One audit-grade domain built end-to-end from spec.</h4>
              <div className="plain">We rebuild one bounded area of your codebase from written specification to shipped production code under full mechanical review.</div>
              <div className="tech">Domain rules authored, contract extracted, source produced layer-by-layer with per-procedure write-verify checks, 9-pass adversarial review run to <span className="path">clean: true</span>, QA auditor run against the domain's user journeys, regression tests locked on proven-correct behavior.</div>
            </div>
            <div className="deliverable">
              <div className="tag">b · System migration</div>
              <h4>One system-wide migration executed spec-first.</h4>
              <div className="plain">We execute one cross-cutting change — a vendor swap, a canonical identifier rename, a shared abstraction, a schema migration — using the feature pipeline with per-layer fan-out.</div>
              <div className="tech">Feature doc authored, layered contract extracted via the 5-pass wrapper, each layer implemented with fresh attention-budget subagents, <span className="path">pnpm gate:static</span> between layers, panel-reviewed before consumption.</div>
            </div>
            <div className="deliverable">
              <div className="tag">c · QA run</div>
              <h4>One installation and live run of the QA harness.</h4>
              <div className="plain">We install the auditor on your app and run it against your existing code, handing you a filed-issue backlog with severity, reproduction steps, and fix-target paths.</div>
              <div className="tech">Multi-user auditor configured, deterministic pre-scans wired (&lt;100ms), stdio MCP emission channel mounted, canary calibration tuned, triple-verdict verification chain running against your source tree.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Outcome() {
  const items = [
    { n: "~113", l: "Mechanical rules guarding every AI-authored commit" },
    { n: "12", l: "Gate stages between commit and the primary branch" },
    { n: "9", l: "Adversarial review passes ending in a mechanical phase marker" },
    { n: "5", l: "Enforcement layers — write-time, gate-time, runtime, lifecycle, session" },
  ];
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <div className="idx">§ 02 · After the engagement</div>
          <div>
            <h2>What is true of your codebase that wasn't before.</h2>
            <div className="sub">A junior engineer, internal or AI, reads the spec to learn what the system does. Source code has zero authority against the rules. Phase completion is a file on disk with a validity flag, a source hash, and a clean count — not a prose claim in a PR description.</div>
          </div>
        </div>

        <div className="grid-4">
          {items.map((i, idx) => (
            <div key={idx} className="stat">
              <div className="n">{i.n}</div>
              <div className="l">{i.l}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, background: "var(--rule)", border: "1px solid var(--rule)" }}>
          {[
            ["Defect classes made mechanically impossible or mechanically caught", "Fake tests. Silent spec drift. Orchestrator lies. IDOR from forgotten org-scoping. Probabilistic flake-demotion. CSP-blocked emission. Attention-exhaustion compression. Rogue subagents racing shared state. Each one traces to a dated incident in the commit log."],
            ["Due-diligence exposure drops meaningfully", "Classes previously surfaced in acquirer code review, SOC 2, or enterprise security review — hardcoded secrets, unsafe cryptography, missing audit-log entries, org-scoping bypasses, tests not exercising production code, framework-version drift — are blocked at commit time."],
            ["Every procedure has a written specification", "Inputs, outputs, error codes, audit behavior, permissions, adversarial contract. A future engineer reads the rules, not the code, to learn what the system must do."],
            ["Knowledge transfer by co-presence", "Your team watches the stack install, the rules authored, the pipeline run, the deliverable ship. DRDD becomes a live reference in your own codebase, not an abstract methodology."],
          ].map(([h, b], i) => (
            <div key={i} style={{ background: "var(--bg)", padding: 28 }}>
              <div className="up faint" style={{ fontSize: 11, marginBottom: 14 }}>{h}</div>
              <div className="serif" style={{ fontSize: 16, lineHeight: 1.55 }}>{b}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Crises() {
  return (
    <section id="crises">
      <div className="wrap">
        <div className="sec-head">
          <div className="idx">§ 03 · Three crises</div>
          <div>
            <h2>The classes of failure this stack was built to catch.</h2>
            <div className="sub">Three named, dated incidents. Each one shares the same root, published on the existing site: <em>prose specifications are easier to satisfy than machine-testable ones.</em> Every crisis maps to one or more case studies below.</div>
          </div>
        </div>

        <div>
          {window.CR.CRISES.map((c) => (
            <div className="crisis-row" key={c.n}>
              <div className="n num">{c.n}</div>
              <div>
                <div className="name">{c.name}</div>
                <div className="date">{c.date}</div>
              </div>
              <div>
                <div className="desc">{c.desc}</div>
                {c.pull && <div className="callout" style={{ marginTop: 16, marginBottom: 0 }}>"{c.pull}"</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudies() {
  return (
    <section id="cases">
      <div className="wrap">
        <div className="sec-head">
          <div className="idx">§ 04 · Case studies</div>
          <div>
            <h2>Seven engineering problems, encountered in private, closed with mechanism.</h2>
            <div className="sub">Each one describes the incident, the root-cause observation, the mechanism installed to close the failure class, and the measured result. All claims are grounded in committed work in a production monorepo.</div>
          </div>
        </div>

        <div>
          {window.CR.CASES.map((c) => (
            <article className="case" key={c.num}>
              <div className="meta">
                <span className="num">{c.num}</span>
                <div>{c.kicker}</div>
              </div>
              <div>
                <h3>{c.title}</h3>
                <div className="body">
                  <p className="case-extra"><span className="lbl">Incident</span>{c.incident}</p>
                  <p className="case-extra"><span className="lbl">Observation</span>{c.observation}</p>
                  <p><span className="lbl">Mechanism</span>{c.mechanism}</p>
                  {c.code && (
                    <pre className="code case-extra"><code>{c.code}</code></pre>
                  )}
                  <div className="result"><span className="lbl" style={{ color: "var(--accent)" }}>Result</span>{c.result}</div>
                  <div>
                    {c.crises.map((cr) => <span key={cr} className="crisis-tag" style={{ marginRight: 8 }}>↳ {cr}</span>)}
                    {c.essay && <a className="link" href={`https://maxwellacollins.com${c.essay}`} style={{ marginLeft: 10, fontSize: 12 }}>Read essay →</a>}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NinePass() {
  const [active, setActive] = useState(0);
  const passes = window.CR.PASSES;
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <div className="idx">§ 05 · 9-pass review</div>
          <div>
            <h2>Phase completion is a file on disk, not a claim in a PR.</h2>
            <div className="sub">Nine sequential passes walk the domain source. A Stop hook blocks phase completion unless <span className="path">reviewer-state.json</span> shows <span className="path">validity: valid</span>, <span className="path">clean: true</span>, and <span className="path">sourceHash</span> matching HEAD. Click a pass to see its scope.</div>
          </div>
        </div>

        <div className="passes">
          {passes.map((p, i) => (
            <button key={p.n} className={`pass ${i === active ? "active" : ""}`} onClick={() => setActive(i)}>
              <div className="pn">PASS {p.n}</div>
              <div className="pt">{p.t}</div>
            </button>
          ))}
        </div>

        <div className="reviewer-state">
          <div><span className="faint">$ cat</span> <span className="v-str">.review/reviewer-state.json</span></div>
          <div>{"{"}</div>
          <div style={{ paddingLeft: 20 }}><span className="k">"phase"</span>: <span className="v-str">"{passes[active].t}"</span>,</div>
          <div style={{ paddingLeft: 20 }}><span className="k">"pass"</span>: <span className="v-str">"{passes[active].n}"</span>,</div>
          <div style={{ paddingLeft: 20 }}><span className="k">"validity"</span>: <span className="v-ok">"valid"</span>,</div>
          <div style={{ paddingLeft: 20 }}><span className="k">"clean"</span>: <span className="v-ok">true</span>,</div>
          <div style={{ paddingLeft: 20 }}><span className="k">"findingCount"</span>: <span className="v-ok">0</span>,</div>
          <div style={{ paddingLeft: 20 }}><span className="k">"sourceHash"</span>: <span className="v-str">"a7f3c91e4b0d"</span>,</div>
          <div style={{ paddingLeft: 20 }}><span className="k">"domain"</span>: <span className="v-str">"properties-disposition"</span>,</div>
          <div style={{ paddingLeft: 20 }}><span className="k">"deferrals"</span>: [],</div>
          <div style={{ paddingLeft: 20 }}><span className="k">"stopHookGate"</span>: <span className="v-ok">"PASS"</span></div>
          <div>{"}"}</div>
          <div style={{ marginTop: 14, color: "var(--ink-faint)" }}># Stop hook refuses to close phase unless every key above is present and green.</div>
        </div>
      </div>
    </section>
  );
}

function RulesExplorer() {
  const [tab, setTab] = useState("spec");
  const rules = window.CR.RULES;
  const tabs = [
    { k: "spec", l: "Spec", n: rules.spec.length },
    { k: "consistency", l: "Consistency", n: rules.consistency.length },
    { k: "adversarial", l: "Adversarial", n: rules.adversarial.length },
  ];
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <div className="idx">§ 06 · Rules</div>
          <div>
            <h2>~3,500 rule statements across 24 domains. A sample.</h2>
            <div className="sub">The full rule set lives at <a className="link" href="https://maxwellacollins.com/rules">maxwellacollins.com/rules</a>. Rules are monotonic — they strengthen or multiply but never delete. Below: a filtered view of the three layers every domain is classified into.</div>
          </div>
        </div>

        <div className="rx">
          <div className="rx-tabs">
            {tabs.map((t) => (
              <button key={t.k} className={`rx-tab ${tab === t.k ? "active" : ""}`} onClick={() => setTab(t.k)}>
                <span>{t.l}</span><span className="count">[{t.n}]</span>
              </button>
            ))}
          </div>
          <div className="rx-list">
            {rules[tab].map((r) => (
              <div key={r.id} className="rx-item">
                <div className="rid">{r.id}</div>
                <div className="txt">{r.txt}</div>
                <div className="layer">{r.layer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CompareHire() {
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <div className="idx">§ 07 · The comparison</div>
          <div>
            <h2>$40,000 vs. three months of a senior engineer.</h2>
            <div className="sub">A CTO comparing options is comparing a transplant against a hire. Salary math: $40k is roughly three months of a senior at US rates, or four of a mid-level.</div>
          </div>
        </div>

        <div className="compare">
          <div className="col">
            <h4>Hiring the engineer</h4>
            <ul>
              <li>Weeks 1–3 onboarding. Weeks 4–8 building infrastructure they'll learn is wrong on contact with reality.</li>
              <li>Month three: reaches your actual product problem. Enforcement infrastructure still not production-hardened.</li>
              <li>Has not seen a test suite pass with 4,800 tautologies, a probabilistic healer demote a real CRITICAL, or 72 concurrent subagents race shared storage-state. Learns these in your production.</li>
              <li>Permanent operational cost. Salary, benefits, management overhead.</li>
            </ul>
          </div>
          <div className="col">
            <h4>The engagement</h4>
            <ul>
              <li>Week one: the iterated, production-hardened stack installs in your codebase. Rules tuned to your stack. Gate green.</li>
              <li>Proof-of-value deliverable (a/b/c) ships during the same window — not in month three.</li>
              <li>Encodes failure history a new hire does not have. Every rule traces to a specific observed incident with a date.</li>
              <li>Fixed payment for installed infrastructure you own outright. No licensing, no retainer, no lock-in.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Inventory() {
  return (
    <section id="system">
      <div className="wrap">
        <div className="sec-head">
          <div className="idx">§ 08 · Inventory</div>
          <div>
            <h2>The underlying system, by count.</h2>
            <div className="sub">Raw counts and artifact names for the buyer who wants to know what's installing. Stack-neutral: hooks are shell, hookify rules are regex, ast-grep rules are language-configurable, the domain-rules system is plain Markdown, the gate is composable per language, the QA harness uses Playwright and MCP.</div>
          </div>
        </div>

        <table className="inv">
          <thead>
            <tr>
              <th>Artifact</th>
              <th style={{ width: 90 }}>Count</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {window.CR.INVENTORY.map(([k, n, d]) => (
              <tr key={k}>
                <td>{k}</td>
                <td className="accent num">{n}</td>
                <td>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div className="up faint" style={{ fontSize: 11, marginBottom: 12 }}>Gate command</div>
            <pre className="code" style={{ margin: 0 }}>{`$ pnpm gate
  → format           OK
  → lint             OK  (--max-warnings 0)
  → dep-cruiser      OK
  → ast-grep         OK  (41 rules)
  → knip             OK
  → jscpd            OK
  → syncpack         OK
  → npm audit        OK
  → typecheck        OK
  → unit             OK
  → integration      OK
  → e2e              OK
GATE: PASSED`}</pre>
          </div>
          <div>
            <div className="up faint" style={{ fontSize: 11, marginBottom: 12 }}>Explicit command denies</div>
            <pre className="code" style={{ margin: 0 }}>{`# Denied at the .claude/settings.json layer
git stash
git worktree
git rebase
git restore
git push --force
git clean -f*
git filter-branch
edits to .env

# Also denied
--no-verify
feature branches (all commits land on main)`}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommitLog() {
  const [t] = useTweaks(TWEAK_DEFAULTS);
  if (!t.showCommits) return null;
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <div className="idx">§ 09 · Evidence</div>
          <div>
            <h2>Recent commits on the primary branch.</h2>
            <div className="sub">Most recent first. Every commit passes <span className="path">pnpm gate:static</span> before push. No feature branches, no <span className="path">--no-verify</span>, no force-push, no <span className="path">git stash</span>. The entire history of the stack is legible at the repo.</div>
          </div>
        </div>

        <div className="commit-log">
          {window.CR.COMMITS.map(([h, t, m], i) => (
            <div className="commit" key={i}>
              <div className="hash">{h}</div>
              <div className={`type ${t === "chore" ? "chore" : ""}`}>{t}</div>
              <div className="msg">{m}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Unsolved() {
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <div className="idx">§ 10 · What isn't solved</div>
          <div>
            <h2>The operator publishes what he has not figured out.</h2>
            <div className="sub">Asymmetric signal. From the <a className="link" href="https://maxwellacollins.com/now">/now</a> page:</div>
          </div>
        </div>
        <div className="callout" style={{ maxWidth: "72ch", fontSize: 22, lineHeight: 1.4 }}>
          "I have no answer yet" — on making frontend implementation reliable enough that one agent can take a wireframe and a set of tRPC endpoints and produce a production-grade React page without extensive human review cycles.
        </div>
        <div className="serif dim" style={{ fontSize: 16, lineHeight: 1.6, maxWidth: "62ch", marginTop: 20 }}>
          Documented publicly. The services page does not promise a frontend-agent breakthrough; it promises the backend and QA rigor that has been proven. When the frontend problem is closed, it will be closed in public.
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="engage">
      <div className="wrap">
        <div className="cta">
          <div>
            <h3>One client at a time. New engagements are scheduled into availability.</h3>
            <div className="sub">Expect a waitlist-style kickoff — weeks, not days. A short intake email describing your stack, team size, and the class of problem you want the engagement to close is enough to start.</div>
            <div style={{ marginTop: 28, display:"flex", gap: 12, flexWrap:"wrap" }}>
              <a className="btn" href="mailto:max@code-rescue.com?subject=Code-Rescue%20engagement%20inquiry">
                <span>↪</span> max@code-rescue.com
              </a>
              <a className="btn secondary" href="https://maxwellacollins.com/manifesto">Read the manifesto</a>
            </div>
          </div>
          <div className="cta-info">
            <div className="row"><span className="k">OPERATOR</span><span className="v">Maxwell Collins</span></div>
            <div className="row"><span className="k">COMPANY</span><span className="v">Code-Rescue</span></div>
            <div className="row"><span className="k">LOCATION</span><span className="v">Tampa, FL</span></div>
            <div className="row"><span className="k">SITE</span><span className="v"><a className="link" href="https://maxwellacollins.com">maxwellacollins.com</a></span></div>
            <div className="row"><span className="k">PRICE</span><span className="v">$40,000 · fixed</span></div>
            <div className="row"><span className="k">DURATION</span><span className="v">2–8 weeks</span></div>
            <div className="row"><span className="k">CLIENTS</span><span className="v">One at a time</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div>Code-Rescue · Maxwell Collins · Tampa, FL · <a className="link" href="mailto:max@code-rescue.com">max@code-rescue.com</a></div>
        <div>
          <a className="link" href="https://maxwellacollins.com/manifesto">Manifesto</a> ·{" "}
          <a className="link" href="https://maxwellacollins.com/crises">Crises</a> ·{" "}
          <a className="link" href="https://maxwellacollins.com/rules">Rules</a> ·{" "}
          <a className="link" href="https://maxwellacollins.com/writing/fake-tests-weekend">Essays</a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <Tweaks />
      <TopBar />
      <Hero />
      <Posture />
      <Offer />
      <Outcome />
      <Crises />
      <CaseStudies />
      <NinePass />
      <RulesExplorer />
      <CompareHire />
      <Inventory />
      <CommitLog />
      <Unsolved />
      <CTA />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
