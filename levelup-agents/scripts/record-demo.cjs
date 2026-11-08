// Usage: start the app on :3456, then node scripts/record-demo.cjs <outDir>
// Records phone-sized clips of the real app at full 1080x1920 for social videos. Each clip is a
// folder of timestamped frames plus an ffconcat list.txt (assemble with ffmpeg -f concat).
const fs = require("fs");
const { chromium } = require("playwright");
const OUT = process.argv[2];
const BASE = process.env.BASE || "http://localhost:3456";

const monday = (d) => { const x = new Date(d); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x.toISOString().slice(0, 10); };
const weeks = (n) => Array.from({ length: n }, (_, i) => monday(Date.now() - (n - 1 - i) * 7 * 864e5));
const ALL_BADGES = "first-step talk-to-users scout offer-master brand-icon closer creator investor-ready shipper storyteller money-brain launcher deck-master goal-getter on-fire recruiter team-player measured first-dollar ten-talks all-in".split(" ");
const base = {
  profile: { founder: "Harish", startup: "Sweet Spot", idea: "sells homemade cupcakes at school events", customer: "students and parents at my school", stage: "idea" },
  results: {}, answers: {}, goals: [{ id: "g1", text: "Get 30 preorders", done: false }], deck: null, days: [], seen: { level: 1, badges: ALL_BADGES }, saved: [], traction: [],
  prefs: { character: "pip", palette: "royal", tourDone: true, picked: true, sound: false, voice: false },
};
const done = { sections: [{ title: "Your one-liner", items: ["Sweet Spot sells homemade cupcakes at school events."] }], source: "guided", at: Date.now() };

const tapDot = () => {
  const css = document.createElement("style");
  css.textContent = ".tapdot{position:fixed;z-index:99999;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:rgba(26,24,20,.25);border:2.5px solid rgba(255,255,255,.95);box-shadow:0 2px 10px rgba(0,0,0,.25);pointer-events:none;animation:td .55s ease-out forwards}@keyframes td{0%{transform:scale(.45);opacity:1}100%{transform:scale(1.35);opacity:0}}";
  document.addEventListener("DOMContentLoaded", () => document.head.appendChild(css));
  document.addEventListener("pointerdown", (e) => { const d = document.createElement("div"); d.className = "tapdot"; d.style.left = e.clientX + "px"; d.style.top = e.clientY + "px"; document.body.appendChild(d); setTimeout(() => d.remove(), 650); }, true);
};

async function clip(b, name, seed, fn) {
  const ctx = await b.newContext({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true });
  await ctx.addInitScript((s) => { if (!sessionStorage.getItem("seeded")) { localStorage.setItem("levelup-hq-v1", JSON.stringify(s)); sessionStorage.setItem("seeded", "1"); } }, seed);
  await ctx.addInitScript(tapDot);
  const p = await ctx.newPage();
  const dir = `${OUT}/${name}`; fs.mkdirSync(dir, { recursive: true });
  const cdp = await ctx.newCDPSession(p); const frames = []; let n = 0;
  cdp.on("Page.screencastFrame", (f) => {
    const file = `${dir}/${String(n++).padStart(5, "0")}.jpg`;
    fs.writeFileSync(file, Buffer.from(f.data, "base64")); frames.push([file, f.metadata.timestamp]);
    cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
  try { await fn(p); } catch (e) { console.log(name, "error:", e.message.split("\n")[0]); }
  await p.waitForTimeout(300);
  await cdp.send("Page.stopScreencast").catch(() => {});
  const lines = ["ffconcat version 1.0"];
  frames.forEach(([f, t], i) => { const next = frames[i + 1]?.[1] ?? t + 0.1; lines.push(`file '${f}'`, `duration ${Math.max(0.001, next - t).toFixed(4)}`); });
  if (frames.length) lines.push(`file '${frames[frames.length - 1][0]}'`);
  fs.writeFileSync(`${dir}/list.txt`, lines.join("\n"));
  console.log(name, frames.length, "frames");
  await ctx.close();
}
const tap = async (p, sel) => { const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); const bx = await el.boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); };
const type = async (p, sel, text) => { await tap(p, sel); await p.keyboard.type(text, { delay: 22 }); await p.waitForTimeout(200); };
const glide = async (p, px, steps = 30) => { for (let i = 0; i < steps; i++) { await p.mouse.wheel(0, px / steps); await p.waitForTimeout(16); } };

(async () => {
  const b = await chromium.launch({ args: ["--force-device-scale-factor=2.5"] }); // true 1080x1920 frames
  // 1. Idea in, plan out, level up (XP crosses 100 when the first agent finishes)
  await clip(b, "1-idea", base, async (p) => {
    await p.goto(BASE + "/app/agents/idea", { waitUntil: "networkidle" }); await p.waitForTimeout(700);
    await type(p, "#f-problem", "School events only have boring store-bought snacks");
    await type(p, "#f-today", "Grocery store cookies");
    await tap(p, "button[type=submit]");
    await p.waitForSelector("text=Copy all", { timeout: 60000 });
    await p.waitForTimeout(700); await glide(p, 520, 36); await p.waitForTimeout(3200);
  });
  // 3. Opportunities
  await clip(b, "3-opps", { ...base, results: { idea: done }, seen: { level: 2, badges: ALL_BADGES } }, async (p) => {
    await p.goto(BASE + "/app/opportunities", { waitUntil: "networkidle" }); await p.waitForTimeout(900);
    await glide(p, 1100, 50); await p.waitForTimeout(300); await glide(p, 1100, 50); await p.waitForTimeout(600);
  });
  // 4. Growth climbing week over week
  const users = [3, 5, 8, 12, 19, 27, 38, 52];
  const traction = weeks(8).map((w, i) => ({ week: w, conversations: 4 + i, users: users[i], revenue: [0, 0, 24, 48, 72, 120, 168, 240][i] }));
  await clip(b, "4-growth", { ...base, results: { idea: done }, seen: { level: 3, badges: ALL_BADGES }, traction }, async (p) => {
    await p.goto(BASE + "/app/growth", { waitUntil: "networkidle" }); await p.waitForTimeout(1200);
    await tap(p, "button[role=tab]:has-text('Revenue')"); await p.waitForTimeout(1300);
    await tap(p, "button[role=tab]:has-text('Users')"); await p.waitForTimeout(1300);
  });
  await b.close();
})();
