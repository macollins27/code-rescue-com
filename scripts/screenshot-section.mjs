#!/usr/bin/env node
// Screenshot a specific section by id at chosen viewports.
// Usage: node scripts/screenshot-section.mjs <section-id> [viewport-preset]
// e.g. node scripts/screenshot-section.mjs pricing
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const id = process.argv[2];
if (!id) {
  console.error("usage: node scripts/screenshot-section.mjs <section-id>");
  process.exit(1);
}
const URL = process.env.URL ?? "http://localhost:4321/";
const OUT = "artifacts/screenshots/sections";

const VIEWPORTS = [
  { name: "mobile-375", w: 375, h: 812 },
  { name: "tablet-768", w: 768, h: 1024 },
  { name: "desktop-1440", w: 1440, h: 900 },
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
  await page.waitForTimeout(200);
  const el = await page.$(`#${id}`);
  if (!el) {
    console.log(`${vp.name}: #${id} not found`);
    await ctx.close();
    continue;
  }
  const out = `${OUT}/${id}-${vp.name}.png`;
  await el.screenshot({ path: out });
  console.log(`saved ${out}`);
  await ctx.close();
}

await browser.close();
