import { useEffect, useState } from "preact/hooks";

const SAMPLE = `
// src/server/trpc/routers/properties.ts
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { db } from "@/server/db";
import { auditLog } from "@/server/audit";

export const propertiesRouter = router({
  list: protectedProcedure
    .input(z.object({
      cursor: z.string().max(128).optional(),
      limit: z.number().int().min(1).max(100).default(25),
    }))
    .query(async ({ ctx, input }) => {
      return db.query.properties.findMany({
        where: (p, { eq }) => eq(p.orgId, ctx.orgId),
        limit: input.limit,
      });
    }),
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(200),
      kind: z.enum(["residential","commercial","industrial","institutional","government"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const row = await db.insert(properties).values({
        ...input, orgId: ctx.orgId, createdAt: new Date(),
      }).returning();
      await auditLog({ actor: ctx.userId, org: ctx.orgId, resource: "property", action: "create", at: new Date() });
      return row[0];
    }),
});
`;

type Status = "pending" | "running" | "pass" | "fail";

interface Stage {
  name: string;
  ms: number;
  check: (s: string) => boolean;
}

const RULES_PACK: Stage[] = [
  { name: "format", ms: 42, check: () => true },
  {
    name: "lint",
    ms: 128,
    check: (s) => {
      const code = s.replace(/\/\/.*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
      if (/console\.log/.test(code)) return false;
      if (/:\s*any\b|<any>|any\[\]|\bas\s+any\b/.test(code)) return false;
      return true;
    },
  },
  { name: "dep-cruiser", ms: 71, check: (s) => !/\.\.\/\.\.\/\.\./.test(s) },
  {
    name: "ast-grep",
    ms: 94,
    check: (s) => {
      if (/uuid.?v4|uuid\.v4/i.test(s)) return false;
      if (/aes-cbc|createCipheriv\(['"]aes-[^'"]*cbc/i.test(s)) return false;
      if (/z\.string\(\)(?!\s*\.(max|min|length|regex|email|url|uuid))/.test(s)) return false;
      return true;
    },
  },
  { name: "knip", ms: 88, check: () => true },
  { name: "jscpd", ms: 62, check: () => true },
  { name: "syncpack", ms: 29, check: () => true },
  { name: "npm-audit", ms: 201, check: () => true },
  { name: "typecheck", ms: 612, check: () => true },
  { name: "unit", ms: 445, check: (s) => /auditLog\(/.test(s) },
  { name: "integration", ms: 384, check: () => true },
  { name: "e2e", ms: 512, check: () => true },
];

interface Row {
  name: string;
  ms: number;
  status: Status;
  actualMs: number | null;
}

function initRows(): Row[] {
  return RULES_PACK.map((r) => ({
    name: r.name,
    ms: r.ms,
    status: "pending",
    actualMs: null,
  }));
}

export default function LiveGate() {
  const [runId, setRunId] = useState(0);
  const [rows, setRows] = useState<Row[]>(initRows);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onRun = () => setRunId((x) => x + 1);
    window.addEventListener("cr:rungate", onRun);
    return () => window.removeEventListener("cr:rungate", onRun);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setDone(false);
    setRows(initRows());
    let idx = 0;

    const next = () => {
      if (cancelled || idx >= RULES_PACK.length) {
        if (!cancelled) setDone(true);
        return;
      }
      const i = idx;
      setRows((r) => r.map((x, k) => (k === i ? { ...x, status: "running" } : x)));
      const t0 = performance.now();
      const stage = RULES_PACK[i];
      if (!stage) return;
      window.setTimeout(
        () => {
          if (cancelled) return;
          const pass = stage.check(SAMPLE);
          const actualMs = Math.round(performance.now() - t0);
          setRows((r) =>
            r.map((x, k) => (k === i ? { ...x, status: pass ? "pass" : "fail", actualMs } : x))
          );
          idx++;
          window.setTimeout(next, 80 + Math.random() * 80);
        },
        Math.max(80, stage.ms * 0.25)
      );
    };

    next();
    return () => {
      cancelled = true;
    };
  }, [runId]);

  const allPass = done && rows.every((r) => r.status === "pass");
  const failed = rows.filter((r) => r.status === "fail").length;

  const markFor = (s: Status) => {
    if (s === "pass") return "✓";
    if (s === "fail") return "✗";
    if (s === "running") return "●";
    return "◦";
  };

  return (
    <div className="gate-live" aria-live="polite">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
          alignItems: "baseline",
        }}
      >
        <span className="up faint" style={{ fontSize: 10.5, letterSpacing: "0.14em" }}>
          live gate · sample: src/server/trpc/routers/properties.ts
        </span>
        <button onClick={() => setRunId((x) => x + 1)} className="sb-btn" aria-label="Re-run gate">
          ↻ re-run
        </button>
      </div>
      {rows.map((r) => (
        <div key={r.name} className={`gl-line ${r.status}`}>
          <span className="mark">{markFor(r.status)}</span>
          <span className="name">{r.name}</span>
          <span className="ms">{r.actualMs !== null ? `${r.actualMs}ms` : "—"}</span>
          <span className="note">
            {r.status === "running"
              ? "running…"
              : r.status === "pending"
                ? ""
                : r.name === "ast-grep"
                  ? "41 rules"
                  : r.name === "lint"
                    ? "--max-warnings 0"
                    : ""}
          </span>
        </div>
      ))}
      {done ? (
        <div className="gl-foot">
          GATE: {allPass ? "PASSED" : `FAILED · ${failed} failure${failed === 1 ? "" : "s"}`} · ran
          at {new Date().toLocaleTimeString()}
        </div>
      ) : null}
    </div>
  );
}
