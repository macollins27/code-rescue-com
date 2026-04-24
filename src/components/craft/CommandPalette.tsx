import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { scrollToId, cycleDensity } from "./scroll";
import { toast } from "./toast";

interface Command {
  id: string;
  label: string;
  hint: string;
  do: () => void;
}

const COMMANDS: Command[] = [
  { id: "go-offer", label: "Jump to § 01 Offer", hint: "g o", do: () => scrollToId("offer") },
  { id: "go-crises", label: "Jump to § 03 Crises", hint: "g x", do: () => scrollToId("crises") },
  {
    id: "go-cases",
    label: "Jump to § 04 Case studies",
    hint: "g c",
    do: () => scrollToId("cases"),
  },
  {
    id: "go-system",
    label: "Jump to § 08 Inventory",
    hint: "g i",
    do: () => scrollToId("system"),
  },
  { id: "go-cta", label: "Jump to § Engage", hint: "g e", do: () => scrollToId("engage") },
  {
    id: "email",
    label: "Email max@code-rescue.com",
    hint: "↪",
    do: () => {
      window.location.href = "mailto:max@code-rescue.com";
    },
  },
  {
    id: "manifesto",
    label: "Open the manifesto",
    hint: "↗",
    do: () => window.open("https://maxwellacollins.com/manifesto", "_blank", "noopener"),
  },
  {
    id: "rules",
    label: "Open the full rules registry",
    hint: "↗",
    do: () => window.open("https://maxwellacollins.com/rules", "_blank", "noopener"),
  },
  {
    id: "run-gate",
    label: "Re-run in-browser gate",
    hint: "r g",
    do: () => window.dispatchEvent(new Event("cr:rungate")),
  },
  {
    id: "copy-price",
    label: "Copy price ($40,000) to clipboard",
    hint: "c p",
    do: () => {
      void navigator.clipboard.writeText("$40,000");
      toast("copied: $40,000");
    },
  },
  {
    id: "toggle-density",
    label: "Cycle density (tight/med/high)",
    hint: "d",
    do: () => {
      const v = cycleDensity();
      toast(`density: ${v}`);
    },
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 10);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [open]);

  const filtered = useMemo(() => {
    if (!q) return COMMANDS;
    const s = q.toLowerCase();
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(s) || c.hint.toLowerCase().includes(s)
    );
  }, [q]);

  if (!open) return null;

  const run = (c: Command) => {
    c.do();
    onClose();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(filtered.length - 1, s + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (e.key === "Enter") {
      const item = filtered[sel];
      if (item) {
        e.preventDefault();
        run(item);
      }
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- modal backdrop dismiss region
    <div
      className="cmdk-backdrop"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      tabIndex={-1}
    >
      <div
        className="cmdk"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKey}
        role="presentation"
      >
        <input
          ref={inputRef}
          className="cmdk-input"
          value={q}
          onInput={(e) => {
            setQ((e.currentTarget as HTMLInputElement).value);
            setSel(0);
          }}
          placeholder="Type a command or jump to a section…"
          aria-label="Command search"
        />
        <div className="cmdk-list" role="listbox">
          {filtered.map((c, i) => (
            <div
              key={c.id}
              className={`cmdk-item ${i === sel ? "sel" : ""}`}
              role="option"
              aria-selected={i === sel}
              tabIndex={-1}
              onMouseEnter={() => setSel(i)}
              onClick={() => run(c)}
              onKeyDown={(e) => {
                if (e.key === "Enter") run(c);
              }}
            >
              <span className="ico" aria-hidden="true">
                ▸
              </span>
              <span>{c.label}</span>
              <kbd>{c.hint}</kbd>
            </div>
          ))}
          {filtered.length === 0 ? (
            <div className="cmdk-item">
              <span className="ico faint">—</span>
              <span className="faint">No matches</span>
              <span></span>
            </div>
          ) : null}
        </div>
        <div className="cmdk-foot">
          <span>↑↓ navigate · ↵ select · esc close</span>
          <span>
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
