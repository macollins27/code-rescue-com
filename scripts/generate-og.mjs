#!/usr/bin/env node
// Generate public/og.png (1200x630) by screenshotting an inline HTML template.
// Run: node scripts/generate-og.mjs
import { chromium } from "playwright";
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { Buffer } from "node:buffer";
import path from "node:path";

const W = 1200;
const H = 630;
const OUT = "public/og.png";

// Inline the @fontsource-variable Newsreader + Inter WOFF2 as base64 so Playwright
// renders with the exact site typography. No Google Fonts runtime dep.
const fontFiles = {
  newsreader:
    "node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2",
  inter: "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  mono: "node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
};

async function fontToDataUri(filePath) {
  if (!existsSync(filePath)) {
    console.warn(`  (font missing, falling back to system: ${filePath})`);
    return null;
  }
  const buf = await readFile(filePath);
  return `data:font/woff2;base64,${Buffer.from(buf).toString("base64")}`;
}

const [newsreaderData, interData, monoData] = await Promise.all([
  fontToDataUri(fontFiles.newsreader),
  fontToDataUri(fontFiles.inter),
  fontToDataUri(fontFiles.mono),
]);

const fontFaces = [
  newsreaderData
    ? `@font-face { font-family: "Newsreader"; font-style: normal; font-display: block; font-weight: 200 800; src: url(${newsreaderData}) format("woff2-variations"); }`
    : "",
  interData
    ? `@font-face { font-family: "Inter"; font-style: normal; font-display: block; font-weight: 100 900; src: url(${interData}) format("woff2-variations"); }`
    : "",
  monoData
    ? `@font-face { font-family: "JetBrains Mono"; font-style: normal; font-display: block; font-weight: 100 800; src: url(${monoData}) format("woff2-variations"); }`
    : "",
].join("\n");

const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<style>
  ${fontFaces}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
  body {
    background: #f5f2ec;
    color: #1a1a1a;
    font-family: "Inter", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .wrap {
    width: 100%; height: 100%;
    padding: 72px 80px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .top { display: flex; align-items: center; gap: 16px; }
  .mark {
    width: 52px; height: 52px;
    background: #2a5f4f; color: #f5f2ec;
    display: grid; place-items: center;
    font-family: "Newsreader", Georgia, serif;
    font-weight: 700; font-size: 26px;
    letter-spacing: -0.01em;
  }
  .brand {
    font-family: "Newsreader", Georgia, serif;
    font-weight: 600;
    font-size: 30px;
    letter-spacing: -0.01em;
    color: #1a1a1a;
  }
  .center { display: flex; flex-direction: column; gap: 28px; max-width: 1000px; }
  .eyebrow {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #5a5a54;
    display: inline-flex; align-items: center; gap: 12px;
  }
  .pip {
    width: 10px; height: 10px; border-radius: 50%;
    background: #2a5f4f;
    box-shadow: 0 0 0 4px rgba(42, 95, 79, 0.15);
    display: inline-block;
  }
  h1 {
    font-family: "Newsreader", Georgia, serif;
    font-weight: 500;
    font-size: 72px;
    line-height: 1.02;
    letter-spacing: -0.025em;
    color: #1a1a1a;
  }
  h1 em {
    font-style: italic;
    color: #2a5f4f;
  }
  .foot {
    display: flex; justify-content: space-between; align-items: baseline;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 16px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #5a5a54;
  }
  .foot .dim { color: #8a877e; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div class="mark">CR</div>
      <div class="brand">Code-Rescue</div>
    </div>
    <div class="center">
      <div class="eyebrow"><span class="pip"></span><span>One engagement · Price fixed at kickoff</span></div>
      <h1>Install the stack that catches <em>AI mistakes</em> before they ship.</h1>
    </div>
    <div class="foot">
      <span>Maxwell Collins · Tampa, FL</span>
      <span class="dim">code-rescue.com</span>
    </div>
  </div>
</body></html>`;

await mkdir(path.dirname(OUT), { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
// font-display: block + data URIs means fonts are synchronous after setContent, but
// give the browser one frame to settle ligatures before shooting.
await page.waitForTimeout(150);
await page.screenshot({ path: OUT, type: "png", omitBackground: false, fullPage: false });
await browser.close();

// Also write a temp preview that isn't shipped — used for spot-check in screenshots dir.
await mkdir("artifacts", { recursive: true });
const buf = await readFile(OUT);
await writeFile("artifacts/og-preview.png", buf);

console.log(`Wrote ${OUT} (${buf.length} bytes)`);
