export function scrollToId(id: string, offset = 96): void {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function cycleDensity(): string {
  const cur = document.documentElement.getAttribute("data-density") ?? "high";
  const next: Record<string, string> = { tight: "medium", medium: "high", high: "tight" };
  const nextVal = next[cur] ?? "high";
  document.documentElement.setAttribute("data-density", nextVal);
  return nextVal;
}
