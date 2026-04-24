import { useEffect, useState } from "preact/hooks";

interface Ctx {
  x: number;
  y: number;
}

export default function PriceContextMenu() {
  const [ctx, setCtx] = useState<Ctx | null>(null);

  useEffect(() => {
    const onCtx = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.closest(".price")) return;
      e.preventDefault();
      setCtx({ x: e.clientX, y: e.clientY });
    };
    const onClick = () => setCtx(null);
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCtx(null);
    };
    document.addEventListener("contextmenu", onCtx);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("contextmenu", onCtx);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  if (!ctx) return null;

  return (
    <div
      className="price-ctx"
      style={{
        left: Math.min(ctx.x, window.innerWidth - 340),
        top: Math.min(ctx.y, window.innerHeight - 200),
      }}
      role="menu"
    >
      <div className="head">$40,000 · comparison anchors</div>
      <div className="row">
        <div className="l">vs senior engineer</div>
        <div className="v">
          <span className="hi">≈ 3 months</span> of a US senior at $160k/yr fully-loaded
        </div>
      </div>
      <div className="row">
        <div className="l">vs a single incident</div>
        <div className="v">
          A filed IDOR in a Series-B acquirer diligence: <span className="hi">deal-delaying</span>{" "}
          cost of remediation + legal review &gt; 10×
        </div>
      </div>
      <div className="row">
        <div className="l">vs AI-consulting retainer</div>
        <div className="v">
          Typical &ldquo;AI transformation&rdquo; retainer: <span className="hi">$25–50k/mo</span> ·
          this is a one-time installation
        </div>
      </div>
    </div>
  );
}
