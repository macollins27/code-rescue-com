import { useState } from "preact/hooks";
import type { RuleLayer, RulesIndex } from "@content/types";

interface Props {
  rules: RulesIndex;
}

const TABS: Array<{ k: RuleLayer; l: string }> = [
  { k: "spec", l: "Spec" },
  { k: "consistency", l: "Consistency" },
  { k: "adversarial", l: "Adversarial" },
];

export default function RulesExplorerInteractive({ rules }: Props) {
  const [tab, setTab] = useState<RuleLayer>("spec");
  const active = rules[tab];

  return (
    <div className="rx">
      <div className="rx-tabs" role="tablist" aria-label="Rule layers">
        {TABS.map((t) => (
          <button
            key={t.k}
            role="tab"
            aria-selected={tab === t.k}
            className={`rx-tab ${tab === t.k ? "active" : ""}`}
            onClick={() => setTab(t.k)}
          >
            <span>{t.l}</span>
            <span className="count">[{rules[t.k].length}]</span>
          </button>
        ))}
      </div>
      <div className="rx-list">
        {active.map((r) => (
          <div key={r.id} className="rx-item">
            <div className="rid">{r.id}</div>
            <div className="txt">{r.txt}</div>
            <div className="layer">{r.layer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
