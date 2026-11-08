// Usage: start the app on :3456, then node scripts/record-demo.cjs <outDir>
// Records phone-sized demo clips of the real app for the reel. Output: webm files in argv[2].
const { chromium } = require("playwright");
const OUT = process.argv[2];
const BASE = "http://localhost:3456";
const seed = {
  profile: { founder: "Harish", startup: "Sweet Spot", idea: "sells homemade cupcakes at school events", customer: "students and parents at my school", stage: "idea" },
  results: {}, answers: {}, goals: [{ id: "g1", text: "Get 30 preorders", done: false }], deck: null, days: [], seen: { level: 1, badges: [] }, saved: [],
  prefs: { character: "pip", palette: "royal", tourDone: true, picked: true, sound: false, voice: false },
};
const tapDot = () => {
  const css = document.createElement("style");
  css.textContent = ".tapdot{position:fixed;z-index:99999;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(26,24,20,.28);border:2px solid rgba(255,255,255,.9);pointer-events:none;animation:td .5s ease-out forwards}@keyframes td{0%{transform:scale(.4);opacity:1}100%{transform:scale(1.4);opacity:0}}";
  document.addEventListener("DOMContentLoaded", () => document.head.appendChild(css));
  document.addEventListener("pointerdown", (e) => { const d = document.createElement("div"); d.className = "tapdot"; d.style.left = e.clientX + "px"; d.style.top = e.clientY + "px"; document.body.appendChild(d); setTimeout(() => d.remove(), 600); }, true);
};
async function clip(b, name, fn, theSeed = seed) {
  const ctx = await b.newContext({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true });
  await ctx.addInitScript((s) => { if (!sessionStorage.getItem("seeded")) { localStorage.setItem("levelup-hq-v1", JSON.stringify(s)); sessionStorage.setItem("seeded", "1"); } }, theSeed);
  await ctx.addInitScript(tapDot);
  const p = await ctx.newPage();
  // Full-resolution frames straight from the compositor (1080x1920), timestamped for assembly.
  const fs = require("fs"); const dir = OUT + "/" + name; fs.mkdirSync(dir, { recursive: true });
  const cdp = await ctx.newCDPSession(p); const frames = []; let n = 0;
  cdp.on("Page.screencastFrame", async (f) => { const file = `${dir}/${String(n++).padStart(5, "0")}.jpg`; fs.writeFileSync(file, Buffer.from(f.data, "base64")); frames.push([file, f.metadata.timestamp]); cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
  try { await fn(p); } catch (e) { console.log(name, "error:", e.message.split("\n")[0]); }
  await p.waitForTimeout(300);
  await cdp.send("Page.stopScreencast").catch(() => {});
  // ffconcat list with real durations
  const lines = ["ffconcat version 1.0"];
  frames.forEach(([f, t], i) => { const next = frames[i + 1]?.[1] ?? t + 0.1; lines.push(`file '${f}'`, `duration ${Math.max(0.001, next - t).toFixed(4)}`); });
  if (frames.length) lines.push(`file '${frames[frames.length - 1][0]}'`);
  fs.writeFileSync(`${dir}/list.txt`, lines.join("\n"));
  console.log(name, frames.length, "frames");
  await ctx.close();
}
const tap = async (p, sel) => { const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); const bx = await el.boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); };
const type = async (p, sel, text) => { await tap(p, sel); await p.keyboard.type(text, { delay: 28 }); await p.waitForTimeout(250); };
const glide = async (p, px, steps = 30) => { for (let i = 0; i < steps; i++) { await p.mouse.wheel(0, px / steps); await p.waitForTimeout(16); } };

(async () => {
  const b = await chromium.launch();
  // 1. Idea in, plan out, level up
  await clip(b, "1-idea", async (p) => {
    await p.goto(BASE + "/app/agents/idea", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
    await type(p, "#f-problem", "School events only have boring store-bought snacks");
    await type(p, "#f-today", "Grocery store cookies");
    await type(p, "#f-whyYou", "I've baked for 4 years and sold out twice");
    await tap(p, "button[type=submit]");
    await p.waitForTimeout(1600);
    await glide(p, 700, 40); await p.waitForTimeout(600); await glide(p, 700, 40);
    await p.waitForTimeout(2600);
  });
  // 2. Scout finds real competitors
  await clip(b, "2-scout", async (p) => {
    await p.goto(BASE + "/app/agents/competitor", { waitUntil: "networkidle" }); await p.waitForTimeout(700);
    await type(p, "#f-niche", "custom cupcakes");
    await type(p, "#f-alternatives", "Crumbl, grocery store bakeries");
    await tap(p, "button[type=submit]");
    await p.waitForSelector("text=Copy all", { timeout: 90000 });
    await p.waitForTimeout(900);
    await glide(p, 650, 40); await p.waitForTimeout(700); await glide(p, 650, 40); await p.waitForTimeout(1200);
  }, { ...seed, results: { idea: { sections: [{ title: "Your one-liner", items: ["Sweet Spot sells homemade cupcakes at school events."] }], source: "guided", at: Date.now() } }, seen: { level: 2, badges: ["first"] } });
  // 3. Opportunities
  await clip(b, "3-opps", async (p) => {
    await p.goto(BASE + "/app/opportunities", { waitUntil: "networkidle" }); await p.waitForTimeout(1000);
    await glide(p, 900, 60); await p.waitForTimeout(400); await glide(p, 900, 60); await p.waitForTimeout(400); await glide(p, 900, 60); await p.waitForTimeout(800);
  }, { ...seed, seen: { level: 1, badges: [] } });
  // 4. Tap Pip on HQ
  await clip(b, "4-pip", async (p) => {
    await p.goto(BASE + "/app", { waitUntil: "networkidle" }); await p.waitForTimeout(1200);
    await tap(p, "button[aria-label^='Hear']");
    await p.waitForTimeout(4200);
  }, { ...seed, results: { idea: { sections: [{ title: "x", items: ["y"] }], source: "guided", at: Date.now() } }, seen: { level: 2, badges: ["first"] } });
  await b.close();
})();
