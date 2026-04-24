import { useEffect, useState } from "preact/hooks";
import { BUILD } from "./build";

interface State {
  phase: string;
  pass: number;
  clean: boolean;
  findingCount: number;
  deferrals: string[];
  validity: "valid" | "pending";
}

const SECTION_IDS = ["offer", "crises", "cases", "system", "engage"] as const;
const SECTION_LABELS: Record<(typeof SECTION_IDS)[number], string> = {
  offer: "offer-read",
  crises: "crises-understood",
  cases: "case-studies-walked",
  system: "inventory-inspected",
  engage: "engagement-considered",
};

export default function LiveState() {
  const [state, setState] = useState<State>({
    phase: "reading-hero",
    pass: 0,
    clean: false,
    findingCount: SECTION_IDS.length,
    deferrals: SECTION_IDS.map((id) => `unread: §${id}`),
    validity: "pending",
  });

  useEffect(() => {
    const onScroll = () => {
      const viewed = SECTION_IDS.filter((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        return el.getBoundingClientRect().top < window.innerHeight * 0.5;
      });
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 120;
      const lastViewed = viewed.length > 0 ? viewed[viewed.length - 1] : null;
      const phase =
        lastViewed !== undefined && lastViewed !== null
          ? SECTION_LABELS[lastViewed]
          : "reading-hero";

      setState({
        phase,
        pass: viewed.length,
        clean: atBottom,
        findingCount: atBottom ? 0 : SECTION_IDS.length - viewed.length,
        deferrals: atBottom
          ? []
          : SECTION_IDS.filter((id) => !viewed.includes(id)).map((id) => `unread: §${id}`),
        validity: atBottom ? "valid" : "pending",
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="live-state"
      title="reviewer-state.json — computed from your scroll position"
      aria-hidden="true"
    >
      <div className="ls-head">
        <span>reviewer-state.json</span>
        <span className="live">LIVE</span>
      </div>
      <div>{"{"}</div>
      <div style={{ paddingLeft: 12 }}>
        <span className="ls-k">&quot;phase&quot;</span>:{" "}
        <span className="ls-str">&quot;{state.phase}&quot;</span>,
      </div>
      <div style={{ paddingLeft: 12 }}>
        <span className="ls-k">&quot;pass&quot;</span>: <span className="ls-str">{state.pass}</span>
        ,
      </div>
      <div style={{ paddingLeft: 12 }}>
        <span className="ls-k">&quot;validity&quot;</span>:{" "}
        <span className={state.validity === "valid" ? "ls-ok" : "ls-bad"}>
          &quot;{state.validity}&quot;
        </span>
        ,
      </div>
      <div style={{ paddingLeft: 12 }}>
        <span className="ls-k">&quot;clean&quot;</span>:{" "}
        <span className={state.clean ? "ls-ok" : "ls-bad"}>{String(state.clean)}</span>,
      </div>
      <div style={{ paddingLeft: 12 }}>
        <span className="ls-k">&quot;findingCount&quot;</span>:{" "}
        <span className={state.findingCount === 0 ? "ls-ok" : "ls-bad"}>{state.findingCount}</span>,
      </div>
      <div style={{ paddingLeft: 12 }}>
        <span className="ls-k">&quot;sourceHash&quot;</span>:{" "}
        <span className="ls-str">&quot;{BUILD.sha}&quot;</span>
      </div>
      <div>{"}"}</div>
    </div>
  );
}
