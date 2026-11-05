/**
 * Smoke + regression + device + slow-network + accessibility checks.
 * Usage: BASE=http://localhost:3000 node scripts/smoke.mjs   (or BASE=https://www.levelupinnovations.tech)
 * Exits 1 if anything fails. Needs the `playwright` package and a Chromium browser.
 */
import { readFileSync } from "fs";
import { createRequire } from "module";

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/$/, "");
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright"); // CommonJS require honors NODE_PATH (pre-installed Playwright)
const AXE = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const failures = [];
const ok = (cond, msg) => { if (!cond) { failures.push(msg); console.log(`  ✗ ${msg}`); } else console.log(`  ✓ ${msg}`); };

const PAGES = ["/", "/signin", "/signup", "/privacy", "/terms", "/delete-account", "/app", "/app/agents", "/app/opportunities", "/app/playbooks", "/app/upgrade"];
const DEVICES = [["iPhone SE", devices["iPhone SE"]], ["Pixel 7", devices["Pixel 7"]], ["iPad Mini", devices["iPad Mini"]], ["Desktop", { viewport: { width: 1440, height: 900 } }]];

const browser = await chromium.launch();

// 1. Every page loads on every device, with no crashes and no sideways scrolling.
for (const [name, dev] of DEVICES) {
  console.log(`\n${name}`);
  const ctx = await browser.newContext({ ...dev, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    const errors = [];
    const onErr = (e) => errors.push(e.message);
    page.on("pageerror", onErr);
    const res = await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    page.off("pageerror", onErr);
    ok(res?.status() === 200 && errors.length === 0 && overflow <= 1, `${path} → ${res?.status()}${errors.length ? ` errors: ${errors[0]}` : ""}${overflow > 1 ? ` overflows by ${overflow}px` : ""}`);
  }
  await ctx.close();
}

// 2. Regression flows on a phone.
console.log("\nFlows (iPhone 13)");
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"], deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const r404 = await page.goto(`${BASE}/this-page-does-not-exist`);
  ok(r404?.status() === 404 && (await page.getByText("This page doesn't exist").count()) > 0, "404 page");

  await page.goto(`${BASE}/app`);
  await page.getByText("Get started").click();
  await page.locator("button[type=submit]").click(); // co-founder
  await page.fill("#hq-founder", "Smoke"); await page.fill("#hq-startup", "TestCo");
  await page.locator("button[type=submit]").click();
  await page.fill("#hq-idea", "helps students find study partners"); await page.locator("button[type=submit]").click();
  await page.fill("#hq-customer", "high school students"); await page.locator("button[type=submit]").click();
  await page.locator("button[type=submit]").click(); // colors → enter HQ
  await page.waitForTimeout(1500);
  ok((await page.getByText("TestCo").count()) > 0, "first launch: welcome → setup → HQ");
  const skip = page.getByText("Skip tour"); if (await skip.count()) await skip.click();
  ok(await page.locator('nav[aria-label="Main"]').isVisible(), "tab bar visible after setup");

  await page.goto(`${BASE}/app/agents/idea`);
  await page.fill("#f-problem", "Students study alone and lose motivation");
  await page.locator("button[type=submit]").click();
  await page.waitForTimeout(3000);
  ok((await page.getByText("Your one-liner").count()) > 0, "Idea agent returns a plan");

  await page.goto(`${BASE}/app/opportunities`);
  const intro = await page.locator("h2 + p").first().innerText();
  ok(/\b3\d\d\b/.test(intro), `opportunities page lists 300+ (${intro.slice(0, 40)}…)`);

  await page.goto(`${BASE}/app/upgrade`);
  await page.evaluate(() => document.documentElement.classList.add("native"));
  const webOnlyVisible = await page.evaluate(() => [...document.querySelectorAll(".web-only")].some((e) => getComputedStyle(e).display !== "none"));
  ok(!webOnlyVisible, "native app hides web checkout, prices and promo codes");

  for (const p of ["/robots.txt", "/sitemap.xml", "/manifest.webmanifest", "/opengraph-image.png", "/favicon.ico"]) {
    const r = await page.goto(BASE + p); ok(r?.status() === 200, `${p} → ${r?.status()}`);
  }
  const h = await page.goto(`${BASE}/health`);
  ok([200, 503].includes(h?.status() ?? 0) && JSON.parse(await page.locator("body").innerText()).checks?.app === "ok", `/health → ${h?.status()}`);
  await ctx.close();
}

// 3. Slow network (3G): the app still becomes usable.
console.log("\nSlow 3G (Pixel 7)");
{
  const ctx = await browser.newContext({ ...devices["Pixel 7"], deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 400, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8 });
  const t0 = Date.now();
  await page.goto(`${BASE}/app`, { timeout: 60000 });
  await page.getByText("Get started").waitFor({ timeout: 60000 });
  const secs = (Date.now() - t0) / 1000;
  ok(secs < 30, `first screen usable on slow 3G in ${secs.toFixed(1)}s`);
  await ctx.close();
}

// 4. Accessibility (axe-core): no critical issues.
console.log("\nAccessibility");
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"], deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const p of ["/", "/app", "/signin", "/signup", "/app/opportunities"]) {
    await page.goto(BASE + p); await page.waitForTimeout(1200);
    await page.addScriptTag({ content: AXE });
    const r = await page.evaluate(async () => (await window.axe.run(document, { resultTypes: ["violations"] })).violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length })));
    const critical = r.filter((v) => v.impact === "critical");
    const serious = r.filter((v) => v.impact === "serious");
    ok(critical.length === 0, `${p}: ${critical.length} critical${critical.length ? ` (${critical.map((v) => v.id).join(", ")})` : ""}, ${serious.length} serious${serious.length ? ` (${serious.map((v) => `${v.id}×${v.n}`).join(", ")})` : ""}`);
  }
  await ctx.close();
}

await browser.close();
console.log(failures.length ? `\n${failures.length} check(s) failed` : "\nAll checks passed");
process.exit(failures.length ? 1 : 0);
