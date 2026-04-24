let toastTimer: number | null = null;

export function toast(msg: string): void {
  if (typeof document === "undefined") return;
  let el = document.getElementById("__cr_toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "__cr_toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = "block";
  if (toastTimer !== null) clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    if (el) el.style.display = "none";
  }, 1800);
}
