import { useState } from "preact/hooks";
import type { Pass } from "@content/types";

interface Props {
  passes: Pass[];
}

export default function NinePassInteractive({ passes }: Props) {
  const [active, setActive] = useState(0);
  const current = passes[active] ?? passes[0];
  if (!current) return null;

  return (
    <>
      <div className="passes" role="tablist" aria-label="Nine adversarial review passes">
        {passes.map((p, i) => (
          <button
            key={p.n}
            role="tab"
            aria-selected={i === active}
            className={`pass ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}
          >
            <div className="pn">PASS {p.n}</div>
            <div className="pt">{p.t}</div>
          </button>
        ))}
      </div>
      <div className="reviewer-state" aria-live="polite">
        <div>
          <span className="faint">$ cat</span>{" "}
          <span className="rs-str">.review/reviewer-state.json</span>
        </div>
        <div>{"{"}</div>
        <div style={{ paddingLeft: 20 }}>
          <span className="rs-k">&quot;phase&quot;</span>:{" "}
          <span className="rs-str">&quot;{current.t}&quot;</span>,
        </div>
        <div style={{ paddingLeft: 20 }}>
          <span className="rs-k">&quot;pass&quot;</span>:{" "}
          <span className="rs-str">&quot;{current.n}&quot;</span>,
        </div>
        <div style={{ paddingLeft: 20 }}>
          <span className="rs-k">&quot;validity&quot;</span>:{" "}
          <span className="rs-ok">&quot;valid&quot;</span>,
        </div>
        <div style={{ paddingLeft: 20 }}>
          <span className="rs-k">&quot;clean&quot;</span>: <span className="rs-ok">true</span>,
        </div>
        <div style={{ paddingLeft: 20 }}>
          <span className="rs-k">&quot;findingCount&quot;</span>: <span className="rs-ok">0</span>,
        </div>
        <div style={{ paddingLeft: 20 }}>
          <span className="rs-k">&quot;sourceHash&quot;</span>:{" "}
          <span className="rs-str">&quot;a7f3c91e4b0d&quot;</span>,
        </div>
        <div style={{ paddingLeft: 20 }}>
          <span className="rs-k">&quot;domain&quot;</span>:{" "}
          <span className="rs-str">&quot;properties-disposition&quot;</span>,
        </div>
        <div style={{ paddingLeft: 20 }}>
          <span className="rs-k">&quot;deferrals&quot;</span>: [],
        </div>
        <div style={{ paddingLeft: 20 }}>
          <span className="rs-k">&quot;stopHookGate&quot;</span>:{" "}
          <span className="rs-ok">&quot;PASS&quot;</span>
        </div>
        <div>{"}"}</div>
        <div style={{ marginTop: 14, color: "var(--ink-faint)" }}>
          # Stop hook refuses to close phase unless every key above is present and green.
        </div>
      </div>
    </>
  );
}
