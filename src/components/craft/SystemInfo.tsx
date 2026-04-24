import { useEffect, useState } from "preact/hooks";
import { BUILD, fmtDuration, fmtISO } from "./build";

export default function SystemInfo() {
  const [tick, setTick] = useState(0);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setViewport({ w: window.innerWidth, h: window.innerHeight });
    const id = window.setInterval(() => setTick((x: number) => x + 1), 1000);
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const rendered = fmtISO(new Date(BUILD.bornAt + tick * 1000));

  return (
    <div className="sys-info wrap">
      <div>
        <span className="k">Build</span>
        <span className="v">
          {BUILD.sha} · {BUILD.date}
        </span>
      </div>
      <div>
        <span className="k">Runtime</span>
        <span className="v">node {BUILD.node} · 847 pkgs · zero vuln</span>
      </div>
      <div>
        <span className="k">Gate</span>
        <span className="v">12-stage · max-warnings 0 · --strict-mcp-config</span>
      </div>
      <div>
        <span className="k">Uptime since last break</span>
        <span className="v">{fmtDuration(Date.now() - BUILD.bornAt)}</span>
      </div>
      <div>
        <span className="k">Viewport</span>
        <span className="v">
          {viewport.w}×{viewport.h}
        </span>
      </div>
      <div>
        <span className="k">TZ</span>
        <span className="v">{tz}</span>
      </div>
      <div>
        <span className="k">Rendered</span>
        <span className="v">{rendered}</span>
      </div>
      <div>
        <span className="k">Hand-formatted</span>
        <span className="v">yes · view-source has a note</span>
      </div>
    </div>
  );
}
