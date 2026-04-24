import { useEffect, useState } from "preact/hooks";
import { toast } from "./toast";

interface Pos {
  x: number;
  y: number;
  text: string;
}

export default function SelectionCite() {
  const [pos, setPos] = useState<Pos | null>(null);

  useEffect(() => {
    const onUp = () => {
      window.setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          setPos(null);
          return;
        }
        const text = sel.toString();
        if (text.trim().length < 12) {
          setPos(null);
          return;
        }
        const range = sel.getRangeAt(0);
        const r = range.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) {
          setPos(null);
          return;
        }
        setPos({ x: r.left + r.width / 2, y: r.top, text });
      }, 10);
    };
    const onChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) setPos(null);
    };
    document.addEventListener("mouseup", onUp);
    document.addEventListener("selectionchange", onChange);
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("selectionchange", onChange);
    };
  }, []);

  if (!pos) return null;

  const copy = () => {
    const url = window.location.href.split("#")[0];
    const truncated = pos.text.slice(0, 140) + (pos.text.length > 140 ? "…" : "");
    const cite = `"${truncated}" — Code-Rescue, ${url}`;
    void navigator.clipboard.writeText(cite);
    toast("citation copied");
    setPos(null);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div
      className="cite-pill"
      style={{ left: pos.x, top: pos.y }}
      onClick={copy}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") copy();
      }}
    >
      <span>⧉ CITE</span>
      <span className="fade">· copy as quote</span>
    </div>
  );
}
