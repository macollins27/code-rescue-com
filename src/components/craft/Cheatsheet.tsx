interface Props {
  open: boolean;
  onClose: () => void;
}

const KEYS: ReadonlyArray<readonly [string, string]> = [
  ["⌘K", "command palette"],
  ["g o", "jump to Offer"],
  ["g x", "jump to Crises"],
  ["g c", "jump to Case studies"],
  ["g i", "jump to Inventory"],
  ["g e", "jump to Engage"],
  ["d", "cycle density"],
  ["r g", "re-run gate"],
  ["?", "toggle this panel"],
  ["esc", "close overlays"],
];

export default function Cheatsheet({ open, onClose }: Props) {
  if (!open) return null;
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- dialog dismiss region
    <div
      className="cheat"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Escape") onClose();
      }}
      role="dialog"
      aria-label="Keyboard shortcuts"
      tabIndex={-1}
      style={{ cursor: "pointer" }}
    >
      <h5>Keyboard · press ? to close</h5>
      {KEYS.map(([k, l]) => (
        <div key={k} className="row">
          <span className="label">{l}</span>
          <kbd>{k}</kbd>
        </div>
      ))}
    </div>
  );
}
