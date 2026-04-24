import { useEffect, useState } from "preact/hooks";
import { BUILD, fmtDuration, fmtISO } from "./build";

interface Props {
  onOpenCmd: () => void;
}

export default function StatusBar({ onOpenCmd }: Props) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="statusbar" role="status" aria-live="off">
      <span className="sb-dot" aria-hidden="true"></span>
      <span className="sb-k">code-rescue</span>
      <span className="sb-sep">│</span>
      <span className="sb-k">build</span>
      <span className="sb-v">{BUILD.sha}</span>
      <span className="sb-sep">│</span>
      <span className="sb-k">node</span>
      <span className="sb-v">{BUILD.node}</span>
      <span className="sb-sep">│</span>
      <span className="sb-k">uptime-since-green</span>
      <span className="sb-v">{fmtDuration(now.getTime() - BUILD.bornAt)}</span>
      <span className="sb-sep">│</span>
      <span className="sb-v">{fmtISO(now)}</span>
      <span className="sb-right">
        <span className="sb-hint">
          press <kbd>?</kbd> for keys · <kbd>⌘</kbd>
          <kbd>K</kbd> command
        </span>
        <button onClick={onOpenCmd} className="sb-btn" aria-label="Open command palette">
          ⌘K
        </button>
      </span>
    </div>
  );
}
