import { useEffect } from "preact/hooks";
import { scrollToId, cycleDensity } from "./scroll";
import { toast } from "./toast";

interface Options {
  onCmdK: () => void;
  onToggleCheat: () => void;
}

export function useKeyboard({ onCmdK, onToggleCheat }: Options): void {
  useEffect(() => {
    let buf = "";
    let bufTimer: number | null = null;
    const resetBuf = () => {
      buf = "";
    };

    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target;
      const inField =
        tgt instanceof HTMLElement &&
        (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA" || tgt.isContentEditable);
      if (inField) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onCmdK();
        return;
      }
      if (e.key === "?") {
        e.preventDefault();
        onToggleCheat();
        return;
      }
      if (e.key === "Escape") {
        resetBuf();
        return;
      }
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        buf += e.key.toLowerCase();
        if (bufTimer !== null) window.clearTimeout(bufTimer);
        bufTimer = window.setTimeout(resetBuf, 900);

        const hits: Record<string, () => void> = {
          go: () => scrollToId("offer"),
          gx: () => scrollToId("crises"),
          gc: () => scrollToId("cases"),
          gi: () => scrollToId("system"),
          ge: () => scrollToId("engage"),
          d: () => {
            const v = cycleDensity();
            toast(`density: ${v}`);
          },
          rg: () => window.dispatchEvent(new Event("cr:rungate")),
        };
        for (const seq of Object.keys(hits)) {
          if (buf.endsWith(seq)) {
            const fn = hits[seq];
            if (fn) fn();
            resetBuf();
            return;
          }
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (bufTimer !== null) window.clearTimeout(bufTimer);
    };
  }, [onCmdK, onToggleCheat]);
}
