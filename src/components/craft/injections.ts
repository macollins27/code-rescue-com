import { toast } from "./toast";
import { BUILD } from "./build";

export function injectCaret(): void {
  const h1 = document.querySelector(".hero h1");
  if (!h1) return;
  if (h1.querySelector(".caret")) return;
  const span = document.createElement("span");
  span.className = "caret";
  span.setAttribute("aria-hidden", "true");
  h1.appendChild(span);
}

export function annotateAnchors(): void {
  let idx = 0;
  const selectors = [
    ".case .body p",
    ".case .body .result",
    ".crisis-row .desc",
    ".deliverable",
    ".rx-item",
  ].join(", ");
  document.querySelectorAll(selectors).forEach((el) => {
    if (el.classList.contains("anchorable")) return;
    idx++;
    el.classList.add("anchorable");
    const id = `L${String(idx).padStart(3, "0")}`;
    el.id = id;
    const pin = document.createElement("a");
    pin.href = `#${id}`;
    pin.className = "anchor-pin";
    pin.textContent = `#${id}`;
    pin.addEventListener("click", (e) => {
      e.preventDefault();
      const url = window.location.href.split("#")[0] + "#" + id;
      void navigator.clipboard.writeText(url);
      toast(`anchor #${id} copied`);
    });
    el.appendChild(pin);
  });
}

let bannerShown = false;
export function consoleBanner(): void {
  if (bannerShown) return;
  bannerShown = true;
  try {
    const hdr = "color:#d9ff5c;font-family:monospace;font-size:12px;font-weight:bold";
    const dim = "color:#686560;font-family:monospace;font-size:11px";
    const ink = "color:#e8e6e1;font-family:monospace";
    // eslint-disable-next-line no-console
    console.log(
      "%c┌─ CODE-RESCUE ──────────────────────────────────────────┐\n" +
        "│                                                        │\n" +
        "│  You opened devtools. Good instinct.                   │\n" +
        "│                                                        │\n" +
        "│  Every claim on this page ties to a file path, a       │\n" +
        "│  commit hash, or a dated incident. view-source is      │\n" +
        "│  hand-formatted. robots.txt has a note.                │\n" +
        "│                                                        │\n" +
        "│  Puzzle: the rule CON-9 blocks UUIDv4 generation.      │\n" +
        "│  Which tool enforces it at commit time? Email the      │\n" +
        "│  answer to max@code-rescue.com and move up the         │\n" +
        "│  waitlist by one slot.                                 │\n" +
        "│                                                        │\n" +
        "│  — max                                                 │\n" +
        "└────────────────────────────────────────────────────────┘",
      hdr
    );
    // eslint-disable-next-line no-console
    console.log("%cbuild %c" + BUILD.sha, dim, ink);
  } catch {
    /* noop */
  }
}

export function enableCraftFlag(): void {
  document.documentElement.setAttribute("data-craft", "on");
}

export function applyRegisterFromUrl(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const reg = params.get("reg");
    if (reg === "editorial" || reg === "spec" || reg === "terminal") {
      document.documentElement.setAttribute("data-reg", reg);
    }
  } catch {
    /* noop */
  }
}
