/* global React, ReactDOM */
const { useState } = React;

// ───── Config ──────────────────────────────────────────────────
// Wire this to your backend. Shape is the submit payload.
const SUBMIT_ENDPOINT = "/api/book"; // POST; returns { ok: true }

// ───── Mock data (replace with API calls) ──────────────────────
const DATES = [
  { key: "mon", dow: "Mon", day: "28", mon: "Apr", pill: "Today" },
  { key: "tue", dow: "Tue", day: "29", mon: "Apr", pill: "Tomorrow" },
  { key: "wed", dow: "Wed", day: "30", mon: "Apr", pill: "" },
];
const MORNING = [
  { t: "9:00 AM", taken: true }, { t: "9:30 AM", taken: false },
  { t: "10:00 AM", taken: true }, { t: "10:30 AM", taken: false },
  { t: "11:00 AM", taken: false }, { t: "11:30 AM", taken: true },
];
const AFTERNOON = [
  { t: "12:00 PM", taken: true }, { t: "1:00 PM", taken: false },
  { t: "2:00 PM", taken: false }, { t: "2:30 PM", taken: true },
  { t: "3:00 PM", taken: false }, { t: "3:30 PM", taken: false },
  { t: "4:00 PM", taken: false }, { t: "4:30 PM", taken: true },
];
const DELIVS = [
  { k: "domain", label: "Domain Build", sub: "Rebuild one area" },
  { k: "migration", label: "System Migration", sub: "One cross-cutting change" },
  { k: "qa", label: "QA Run", sub: "Diagnostic only" },
  { k: "unsure", label: "Not sure yet", sub: "Let's talk first" },
];
const TIMELINES = ["As soon as possible", "Within 30 days", "Within 60\u201390 days", "Q3 or later", "Just exploring"];

// ───── Widgets ─────────────────────────────────────────────────
function TopNav() {
  return (
    <div className="topnav">
      <div className="topnav-inner">
        <a href="/" className="brand"><span className="brand-mark">CR</span> Code-Rescue</a>
        <a href="/" className="back-link">← Back to site</a>
      </div>
    </div>
  );
}

function DateStrip({ value, onChange }) {
  return (
    <div className="date-strip">
      {DATES.map(d => (
        <button key={d.key} onClick={() => onChange(d.key)} className={"date-chip" + (value === d.key ? " is-selected" : "")}>
          <div className="date-chip-pill">{d.pill || "\u00A0"}</div>
          <div className="date-chip-dow">{d.dow}</div>
          <div className="date-chip-day">{d.day}</div>
          <div className="date-chip-mon">{d.mon}</div>
        </button>
      ))}
    </div>
  );
}

function TimeGrid({ value, onChange }) {
  return (
    <>
      <div className="time-group-label">Morning</div>
      <div className="time-grid">
        {MORNING.map(s => (
          <button key={s.t} disabled={s.taken} onClick={() => onChange(s.t)} className={"time-slot" + (value === s.t ? " is-selected" : "")}>{s.t}</button>
        ))}
      </div>
      <div className="time-group-label">Afternoon</div>
      <div className="time-grid">
        {AFTERNOON.map(s => (
          <button key={s.t} disabled={s.taken} onClick={() => onChange(s.t)} className={"time-slot" + (value === s.t ? " is-selected" : "")}>{s.t}</button>
        ))}
      </div>
    </>
  );
}

function DelivTiles({ value, onChange }) {
  return (
    <div className="radio-group">
      {DELIVS.map(d => (
        <button key={d.k} type="button" onClick={() => onChange(d.k)} className={"radio-tile" + (value === d.k ? " is-selected" : "")}>
          <div className="radio-tile-label">{d.label}</div>
          <div className="radio-tile-sub">{d.sub}</div>
        </button>
      ))}
    </div>
  );
}

function dateLabel(key) {
  const d = DATES.find(x => x.key === key);
  return d ? `${d.dow} ${d.day} ${d.mon}` : "";
}

function Confirmation({ date, time }) {
  return (
    <div>
      <div className="confirm-check">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <h2 style={{fontFamily:"var(--serif)", fontWeight:500, fontSize:32, letterSpacing:"-0.02em", margin:"24px 0 12px"}}>You're booked.</h2>
      <p style={{fontFamily:"var(--serif)", fontSize:18, color:"var(--ink-2)", margin:0}}>A calendar invite is on its way. Reply to it with anything you'd like me to read before we talk.</p>
      <dl className="confirm-summary">
        <dt>When</dt><dd>{dateLabel(date)} · {time} · 30 min</dd>
        <dt>Who</dt><dd>You & Maxwell Collins</dd>
        <dt>Where</dt><dd className="mono">Google Meet link in the invite</dd>
        <dt>Reschedule</dt><dd><a href="#" className="ilink">One-click link in your invite</a></dd>
      </dl>
      <h3 style={{fontFamily:"var(--serif)", fontWeight:500, fontSize:22, margin:"32px 0 16px"}}>What to have ready</h3>
      <ol className="prep-list">
        <li><span className="prep-num">01</span><span>The one area of your codebase that's causing the most trouble right now. A sentence is enough.</span></li>
        <li><span className="prep-num">02</span><span>A rough sense of team size and how much of the code is AI-assisted. No numbers need to be exact.</span></li>
        <li><span className="prep-num">03</span><span>The outcome that would make this worth your 30 minutes. &ldquo;Know if this is for us&rdquo; is a fine answer.</span></li>
      </ol>
      <p style={{fontSize:13, color:"var(--ink-dim)", margin:"40px 0 0", fontFamily:"var(--mono)"}}>No prep doc is required. Come as you are.</p>
    </div>
  );
}

// ───── Page ────────────────────────────────────────────────────
function Book() {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [form, setForm] = useState({ company: "", role: "", size: "", stack: "", deliv: "", broken: "", timeline: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canSubmit = date && time && form.company && form.role && form.broken;

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(SUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time, ...form }),
      });
      if (!res.ok) throw new Error("Booking failed");
      setSubmitted(true);
    } catch (e) {
      setError("Couldn't book that slot. Try another time or email max@code-rescue.com.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <TopNav />
      <div className="paper">
        <div className="marginalia">
          <span>A letter before we talk</span>
          <span>Max Collins</span>
          <span>Tampa, FL</span>
        </div>

        {submitted ? <Confirmation date={date} time={time} /> : (<>
          <p className="salutation">To the person considering this —</p>
          <h1 className="headline">Thirty minutes is enough to know if this is a <em>fit.</em></h1>
          <p className="body">I take one client at a time. Before I take yours, we talk. You tell me what's breaking in your codebase and I tell you honestly whether the stack I install will help or whether you need something else. If it's the second thing, I'll usually know someone.</p>
          <p className="body">Pick a day. Pick a time. Answer a few questions. That's the whole thing.</p>

          <div className="divider"></div>

          <h2 className="section-h">One. Pick a day.</h2>
          <DateStrip value={date} onChange={setDate} />

          {date && (<>
            <div style={{height: 40}}></div>
            <h2 className="section-h">Two. Pick a time.</h2>
            <TimeGrid value={time} onChange={setTime} />
          </>)}

          {time && (<>
            <div className="divider"></div>
            <h2 className="section-h">Three. A few things to read before we talk.</h2>
            <p className="body" style={{fontSize:16, color:"var(--ink-dim)"}}>The more honest you are here, the more useful the call is. If you're not sure about something, say so.</p>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:24}}>
              <div className="field"><label className="field-label">Company</label><input className="input" value={form.company} onChange={e => setField("company", e.target.value)} /></div>
              <div className="field"><label className="field-label">Your role</label><input className="input" value={form.role} onChange={e => setField("role", e.target.value)} placeholder="VP Eng, CTO, …" /></div>
              <div className="field"><label className="field-label">Eng team size</label><select className="select" value={form.size} onChange={e => setField("size", e.target.value)}><option value="">Select…</option><option>1–5</option><option>6–20</option><option>21–50</option><option>51–100</option><option>100+</option></select></div>
              <div className="field"><label className="field-label">Stack</label><input className="input" value={form.stack} onChange={e => setField("stack", e.target.value)} placeholder="TS + Postgres, Go, Python…" /></div>
              <div className="field" style={{gridColumn:"1 / -1"}}><label className="field-label">Which deliverable, if any, you're circling</label><DelivTiles value={form.deliv} onChange={v => setField("deliv", v)} /></div>
              <div className="field" style={{gridColumn:"1 / -1"}}>
                <label className="field-label">Tell me, plainly, what's broken</label>
                <span className="field-hint">One paragraph. The thing that made you book this. No buzzwords — just what's happening.</span>
                <textarea className="textarea" value={form.broken} onChange={e => setField("broken", e.target.value)} placeholder="The checkout flow has been quietly shipping bugs for two months. The tests all pass…" />
              </div>
              <div className="field" style={{gridColumn:"1 / -1"}}><label className="field-label">Timeline</label><select className="select" value={form.timeline} onChange={e => setField("timeline", e.target.value)}><option value="">Select…</option>{TIMELINES.map(t => <option key={t}>{t}</option>)}</select></div>
            </div>

            <div className="divider"></div>
            <p className="body" style={{fontStyle:"italic"}}>I'll read this before the call. If we're not a fit, I'll tell you on the call and point you somewhere that is.</p>
            {error && <p style={{color: "var(--warn, #a25f1f)", fontFamily: "var(--mono)", fontSize: 13}}>{error}</p>}
            <button className="btn btn-wide" disabled={!canSubmit || submitting} onClick={submit} style={{marginTop: 24}}>
              {submitting ? "Booking…" : `Send — book me in on ${dateLabel(date)} at ${time}`}
            </button>
            <div className="signature">— Max</div>
            <div className="signoff-sub">Operator, Code-Rescue · Tampa, FL</div>
          </>)}
        </>)}
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Book />);
