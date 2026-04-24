#!/usr/bin/env node
// Take full-page screenshots of the dev server at mobile/tablet/desktop viewports.
// Usage: pnpm dev in one terminal, then: node scripts/screenshot-viewports.mjs
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL = process.env.URL ?? "http://localhost:4321/";
const OUT = "artifacts/screenshots";

const VIEWPORTS = [
  { name: "mobile-375", w: 375, h: 812 }, // iPhone SE-ish
  { name: "mobile-390", w: 390, h: 844 }, // iPhone 14 portrait
  { name: "tablet-768", w: 768, h: 1024 }, // iPad portrait
  { name: "laptop-1024", w: 1024, h: 768 }, // small laptop
  { name: "desktop-1440", w: 1440, h: 900 }, // design target
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  // tiny wait for the live clock to tick in
  await page.waitForTimeout(200);

  // full-page
  const full = `${OUT}/${vp.name}-full.png`;
  await page.screenshot({ path: full, fullPage: true });

  // above-the-fold
  const fold = `${OUT}/${vp.name}-fold.png`;
  await page.screenshot({ path: fold, fullPage: false });

  // grab bbox info for every section id so we can detect overflow
  const sections = await page.evaluate(() => {
    const ids = [
      "problem",
      "what",
      "how",
      "deliverables",
      "proof",
      "rule",
      "pricing",
      "notthis",
      "engage",
    ];
    const vw = window.innerWidth;
    return ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return { id, missing: true };
      const r = el.getBoundingClientRect();
      const css = window.getComputedStyle(el);
      // check if any descendant has scrollWidth > clientWidth (horizontal overflow)
      let overflowEl = null;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT);
      while (walker.nextNode()) {
        const n = walker.currentNode;
        if (n.scrollWidth > n.clientWidth + 1 && n.clientWidth > 0) {
          overflowEl = {
            tag: n.tagName,
            cls: n.className,
            sw: n.scrollWidth,
            cw: n.clientWidth,
          };
          break;
        }
      }
      return {
        id,
        width: Math.round(r.width),
        height: Math.round(r.height),
        scrollWidth: el.scrollWidth,
        viewportWidth: vw,
        overflow: el.scrollWidth > vw,
        overflowChild: overflowEl,
        padLeft: css.paddingLeft,
        padRight: css.paddingRight,
      };
    });
  });
  console.log(`\n── ${vp.name} (${vp.w}×${vp.h}) ──`);
  for (const s of sections) {
    if (s.missing) {
      console.log(`  !${s.id}: MISSING`);
      continue;
    }
    const overflowMark = s.overflow ? " OVERFLOW-ROOT" : "";
    const childMark = s.overflowChild
      ? ` child-overflow:${s.overflowChild.tag}.${s.overflowChild.cls.split(" ")[0]} sw=${s.overflowChild.sw} cw=${s.overflowChild.cw}`
      : "";
    console.log(`  ${s.id}: ${s.width}×${s.height}${overflowMark}${childMark}`);
  }

  // body horizontal overflow check
  const bodyOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  console.log(`  body scroll-width-overhang: ${bodyOverflow}px`);

  await ctx.close();
}

await browser.close();
console.log("\nDone. Screenshots in", OUT);
