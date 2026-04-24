#!/usr/bin/env node
import { chromium } from "playwright";

const URL = process.env.URL ?? "http://localhost:4321/";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });

const dump = await page.evaluate(() => {
  const result = {
    priceFloor: null,
    matchedRules: [],
    allStylesheets: [],
  };
  const floor = document.querySelector(".price-floor");
  if (floor) {
    result.priceFloor = {
      html: floor.outerHTML.slice(0, 400),
      attrs: Array.from(floor.attributes).map((a) => `${a.name}="${a.value}"`),
    };
  }
  // find any stylesheet rule matching .price-floor
  for (const sheet of document.styleSheets) {
    try {
      const rules = sheet.cssRules ? Array.from(sheet.cssRules) : [];
      for (const r of rules) {
        if (
          r.cssText &&
          r.cssText.includes("price-floor") &&
          !r.cssText.includes("-label") &&
          !r.cssText.includes("-amount") &&
          !r.cssText.includes("-note")
        ) {
          result.matchedRules.push({
            href: sheet.href,
            text: r.cssText.slice(0, 400),
          });
        }
      }
      result.allStylesheets.push({
        href: sheet.href,
        ruleCount: rules.length,
      });
    } catch {
      result.allStylesheets.push({ href: sheet.href, error: "CORS" });
    }
  }
  return result;
});

console.log("price-floor element:");
console.log(JSON.stringify(dump.priceFloor, null, 2));
console.log("\nmatched .price-floor rules:");
for (const r of dump.matchedRules) console.log(r);
console.log("\nall stylesheets:");
for (const s of dump.allStylesheets) console.log(s);

await browser.close();
