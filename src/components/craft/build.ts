export interface BuildInfo {
  readonly sha: string;
  readonly date: string;
  readonly node: string;
  readonly pkgs: number;
  readonly bornAt: number;
}

const sha = import.meta.env.PUBLIC_GIT_SHA ?? "a7f3c91";
const date = import.meta.env.PUBLIC_BUILD_DATE ?? new Date().toISOString().slice(0, 10);

export const BUILD: BuildInfo = {
  sha,
  date,
  node: "22.11.0",
  pkgs: 847,
  bornAt: Date.now() - (1000 * 60 * 60 * 26 + 1000 * 60 * 18),
};

export function fmtISO(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const tz = -d.getTimezoneOffset();
  const sgn = tz >= 0 ? "+" : "-";
  const tzh = pad(Math.floor(Math.abs(tz) / 60));
  const tzm = pad(Math.abs(tz) % 60);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${sgn}${tzh}:${tzm}`;
}

export function fmtDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  return `${m}m ${sec}s`;
}
