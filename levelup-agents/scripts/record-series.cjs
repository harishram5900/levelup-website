// Records the "Is your startup idea good?" series from the real app: one continuous 1080x1920 capture per
// idea, with a highlighter sweep on the advice being narrated and markers for the editor.
// Usage: start the app on :3456, then node scripts/record-series.cjs <outDir>
const fs = require("fs");
const { chromium } = require("playwright");
const OUT = process.argv[2];
const BASE = process.env.BASE || "http://localhost:3456";
const ALL_BADGES = "first-step talk-to-users scout offer-master brand-icon closer creator investor-ready shipper storyteller money-brain launcher deck-master goal-getter on-fire recruiter team-player measured first-dollar ten-talks all-in".split(" ");

const IDEAS = {
  cupcakes: {
    profile: { founder: "Aanya", startup: "Sweet Spot", idea: "sells homemade cupcakes at school events and through Instagram preorders", customer: "students and parents at my high school", stage: "launched" },
    idea: { problem: "School events have boring store-bought snacks and parents want something homemade", today: "They buy grocery store cookies", whyYou: "I've baked for 4 years and sold out at two bake sales" },
    second: { agent: "build", fields: { features: "Order form, Pickup schedule", skills: "No coding", hours: "8" }, section: "Tools to use", hl: "cottage food" },
  },
  thrift: {
    profile: { founder: "Jordan", startup: "ReThread", idea: "buys vintage streetwear at thrift stores and resells it on Depop with custom edits", customer: "Gen Z sneaker and streetwear fans", stage: "launched" },
    idea: { problem: "Good vintage is hard to find and fast fashion is wasteful", today: "They scroll Depop for hours", whyYou: "I've flipped 200 items and have 2k followers" },
    second: { agent: "pitch", fields: { story: "I started with $40 at Goodwill", traction: "$3,100 in sales in 6 months", ask: "An investor for inventory" }, section: "30-second pitch", hl: "I started with $40" },
  },
  tutor: {
    profile: { founder: "Maya", startup: "StudyBuddy", idea: "matches students with a peer tutor from their own school for the same class", customer: "high school students struggling in math", stage: "building" },
    idea: { problem: "Students are too embarrassed to ask teachers and tutors are expensive", today: "YouTube, Khan Academy, paid tutors", whyYou: "I've tutored 30 classmates for free" },
    second: { agent: "build", fields: { features: "Tutor matching, Chat, Scheduling", skills: "No coding", hours: "8" }, section: "Tools to use", hl: "Glide" },
    answers: { competitor: { niche: "peer tutoring app", alternatives: "Khan Academy, Chegg" } },
  },
};

const tapDot = () => {
  const css = document.createElement("style");
  css.textContent = `.tapdot{position:fixed;z-index:99999;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:rgba(26,24,20,.25);border:2.5px solid rgba(255,255,255,.95);pointer-events:none;animation:td .55s ease-out forwards}
    @keyframes td{0%{transform:scale(.45);opacity:1}100%{transform:scale(1.35);opacity:0}}
    .hlx{background-image:linear-gradient(transparent 52%, rgba(255,214,64,.85) 52%, rgba(255,214,64,.85) 92%, transparent 92%);background-repeat:no-repeat;background-size:0% 100%;animation:hlx .7s .1s cubic-bezier(.3,.8,.3,1) forwards;border-radius:4px}
    @keyframes hlx{to{background-size:100% 100%}}
    [role=status].fixed{display:none!important}`;
  document.addEventListener("DOMContentLoaded", () => document.head.appendChild(css));
  document.addEventListener("pointerdown", (e) => { const d = document.createElement("div"); d.className = "tapdot"; d.style.left = e.clientX + "px"; d.style.top = e.clientY + "px"; document.body.appendChild(d); setTimeout(() => d.remove(), 650); }, true);
};

async function record(b, name, seed, fn) {
  const ctx = await b.newContext({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true });
  await ctx.addInitScript((s) => { if (!sessionStorage.getItem("seeded")) { localStorage.setItem("levelup-hq-v1", JSON.stringify(s)); sessionStorage.setItem("seeded", "1"); } }, seed);
  await ctx.addInitScript(tapDot);
  const p = await ctx.newPage();
  const dir = `${OUT}/${name}`; fs.mkdirSync(dir, { recursive: true });
  const cdp = await ctx.newCDPSession(p); const frames = []; let n = 0; let t0 = null; const marks = {};
  cdp.on("Page.screencastFrame", (f) => {
    const file = `${dir}/${String(n++).padStart(5, "0")}.jpg`; fs.writeFileSync(file, Buffer.from(f.data, "base64"));
    if (t0 === null) t0 = f.metadata.timestamp; frames.push([file, f.metadata.timestamp]);
    cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  const mark = async (k) => { await p.waitForTimeout(120); marks[k] = frames.length ? frames[frames.length - 1][1] - frames[0][1] : 0; };
  const wall0 = Date.now() / 1000;
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1080, maxHeight: 1920 });
  try { await fn(p, mark); } catch (e) { console.log(name, "error:", e.message.split("\n")[0]); }
  await p.waitForTimeout(400);
  await cdp.send("Page.stopScreencast").catch(() => {});
  const lines = ["ffconcat version 1.0"];
  frames.forEach(([f, t], i) => { const next = frames[i + 1]?.[1] ?? t + 0.1; lines.push(`file '${f}'`, `duration ${Math.max(0.001, next - t).toFixed(4)}`); });
  if (frames.length) lines.push(`file '${frames[frames.length - 1][0]}'`);
  fs.writeFileSync(`${dir}/list.txt`, lines.join("\n"));
  // markers are on the frame clock (time of the latest captured frame)
  const rel = Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +v.toFixed(3)]));
  fs.writeFileSync(`${dir}/marks.json`, JSON.stringify(rel, null, 1));
  console.log(name, frames.length, "frames", JSON.stringify(rel));
  await ctx.close();
}
const tap = async (p, sel) => { const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); const bx = await el.boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); };
const type = async (p, sel, text) => { await tap(p, sel); await p.keyboard.type(text, { delay: 14 }); await p.waitForTimeout(120); };
async function scrollTo(p, text) {
  // smallest element containing the text, scrolled smoothly into the upper third (works inside scroll panels)
  await p.evaluate((text) => {
    const el = [...document.querySelectorAll("body *")].filter((e) => e.textContent.includes(text)).sort((a, b) => a.textContent.length - b.textContent.length)[0];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, text);
  await p.waitForTimeout(700);
  await p.mouse.wheel(0, -150); await p.waitForTimeout(250); // leave a little room above the heading
}
async function highlight(p, text) {
  await p.evaluate((text) => {
    const all = [...document.querySelectorAll("li,p,div")].filter((e) => e.textContent.includes(text)).sort((a, b) => a.textContent.length - b.textContent.length);
    const el = all.find((e) => e.tagName === "LI") || all[0];
    if (el) el.classList.add("hlx");
  }, text);
}

(async () => {
  const b = await chromium.launch({ args: ["--force-device-scale-factor=2.5"] });
  const only = process.argv[3];
  for (const [key, I] of Object.entries(IDEAS)) {
    if (only && only !== key) continue;
    const seed = { profile: I.profile, results: {}, answers: I.answers || {}, goals: [], deck: null, days: [], seen: { level: 9, badges: ALL_BADGES }, saved: [], traction: [],
      prefs: { character: "pip", palette: "royal", tourDone: true, picked: true, sound: false, voice: false } };
    await record(b, key, seed, async (p, mark) => {
      await p.goto(BASE + "/app/agents/idea", { waitUntil: "networkidle" }); await p.waitForTimeout(500);
      await mark("type");
      for (const [f, v] of Object.entries(I.idea)) await type(p, `#f-${f}`, v);
      await tap(p, "button[type=submit]");
      await p.waitForSelector("text=Copy all", { timeout: 60000 }); await mark("result"); await p.waitForTimeout(900);
      await scrollTo(p, "Biggest risks"); await mark("risk"); await p.waitForTimeout(500); await highlight(p, "Riskiest assumption"); await p.waitForTimeout(2600);
      await scrollTo(p, "Test it this week"); await mark("test"); await p.waitForTimeout(500);
      await highlight(p, key === "cupcakes" ? "Take preorders" : key === "thrift" ? "List it where buyers" : "Fake the product"); await p.waitForTimeout(2600);
      if (key === "thrift") { await scrollTo(p, "What's strong"); await mark("strong"); await p.waitForTimeout(400); await highlight(p, "Founder fit"); await p.waitForTimeout(2200); }
      const S = I.second;
      await p.goto(BASE + `/app/agents/${S.agent}`, { waitUntil: "networkidle" }); await p.waitForTimeout(500); await mark("second");
      for (const [f, v] of Object.entries(S.fields)) { if (await p.locator(`#f-${f}`).count()) await type(p, `#f-${f}`, v); }
      await tap(p, "button[type=submit]");
      await p.waitForSelector("text=Copy all", { timeout: 60000 }); await p.waitForTimeout(700);
      await scrollTo(p, S.section); await mark("second_hl"); await p.waitForTimeout(500); await highlight(p, S.hl); await p.waitForTimeout(2600);
      if (key === "tutor") { await scrollTo(p, "Your 2-week plan"); await mark("plan"); await p.waitForTimeout(2400); }
    });
  }
  await b.close();
})();
