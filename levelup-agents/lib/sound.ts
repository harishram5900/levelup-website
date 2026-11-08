"use client";
/**
 * Sound for LevelUp: tiny synthesized effects (no audio files to load or license), a signature
 * "chirp" per character, and spoken lines. Voices come from ElevenLabs through /api/voice; if
 * that isn't set up, the device's built-in voice reads the same line with a matching pitch.
 * Everything respects the Sound and Voice switches in Settings.
 */
import { lineText, type CharacterId, type LineId } from "./cofounder/lines";

const KEY = "levelup-hq-v1";
function prefs(): { sound: boolean; voice: boolean } {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || "null")?.prefs ?? {};
    return { sound: p.sound !== false, voice: p.voice !== false };
  } catch { return { sound: true, voice: true }; }
}

let ctx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type Tone = { f: number; to?: number; t?: number; d: number; type?: OscillatorType; v?: number };
function tones(list: Tone[]) {
  const a = ac();
  if (!a) return;
  const now = a.currentTime;
  const master = a.createGain();
  master.gain.value = 0.18;
  master.connect(a.destination);
  for (const n of list) {
    const o = a.createOscillator();
    const g = a.createGain();
    const start = now + (n.t ?? 0);
    o.type = n.type ?? "sine";
    o.frequency.setValueAtTime(n.f, start);
    if (n.to) o.frequency.exponentialRampToValueAtTime(n.to, start + n.d);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(n.v ?? 0.8, start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, start + n.d);
    o.connect(g).connect(master);
    o.start(start);
    o.stop(start + n.d + 0.02);
  }
}

const SFX = {
  tap: () => tones([{ f: 520, to: 380, d: 0.06, type: "triangle", v: 0.5 }]),
  coin: () => tones([{ f: 988, d: 0.08, type: "square", v: 0.25 }, { f: 1319, t: 0.07, d: 0.22, type: "square", v: 0.25 }]),
  success: () => tones([{ f: 523, d: 0.12, type: "triangle" }, { f: 659, t: 0.09, d: 0.12, type: "triangle" }, { f: 784, t: 0.18, d: 0.25, type: "triangle" }]),
  levelup: () => tones([523, 659, 784, 1047, 1319].map((f, i) => ({ f, t: i * 0.08, d: i === 4 ? 0.45 : 0.14, type: "square" as const, v: 0.22 }))),
  pop: () => tones([{ f: 300, to: 900, d: 0.09, type: "sine", v: 0.6 }]),
};
export type Sfx = keyof typeof SFX;

/** Play a short UI effect. */
export function sfx(name: Sfx) {
  if (!prefs().sound) return;
  try { SFX[name](); } catch { /* audio unavailable */ }
}

/** Each character's signature sound: robot beeps, a dragon rumble, an owl hoot, a cat chirp, a raccoon chitter. */
const CHIRPS: Record<CharacterId, Tone[]> = {
  pip: [{ f: 880, d: 0.07, type: "square", v: 0.3 }, { f: 1175, t: 0.09, d: 0.07, type: "square", v: 0.3 }, { f: 1568, t: 0.18, d: 0.1, type: "square", v: 0.3 }],
  blaze: [{ f: 140, to: 70, d: 0.35, type: "sawtooth", v: 0.5 }, { f: 220, to: 520, t: 0.3, d: 0.18, type: "sawtooth", v: 0.35 }],
  sage: [{ f: 420, to: 380, d: 0.22, type: "sine" }, { f: 380, to: 330, t: 0.3, d: 0.32, type: "sine" }],
  nova: [{ f: 700, to: 1400, d: 0.14, type: "triangle" }, { f: 1300, to: 900, t: 0.14, d: 0.2, type: "triangle" }],
  rocco: [1200, 1500, 1100, 1600, 1250].map((f, i) => ({ f, t: i * 0.05, d: 0.04, type: "square" as const, v: 0.22 })),
};
export function chirp(c: CharacterId) {
  if (!prefs().sound) return;
  try { tones(CHIRPS[c] ?? CHIRPS.pip); } catch { /* audio unavailable */ }
}

// Built-in voice fallback, tuned per character.
const FALLBACK: Record<CharacterId, { pitch: number; rate: number }> = {
  pip: { pitch: 1.25, rate: 1.02 }, blaze: { pitch: 1.1, rate: 1.15 }, sage: { pitch: 0.8, rate: 0.92 }, nova: { pitch: 1.4, rate: 1.05 }, rocco: { pitch: 0.95, rate: 1.08 },
};
let current: HTMLAudioElement | null = null;
const listeners = new Set<(c: CharacterId | null) => void>();
let speaking: CharacterId | null = null;
function setSpeaking(c: CharacterId | null) { speaking = c; listeners.forEach((f) => f(c)); }
/** Subscribe to who is talking (for mouth animation or a "speaking" ring). */
export function onSpeaking(f: (c: CharacterId | null) => void) { listeners.add(f); f(speaking); return () => { listeners.delete(f); }; }

/** Stop any speech in progress. */
export function hush() {
  current?.pause(); current = null;
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
  setSpeaking(null);
}

/** A character says one of their lines out loud. Call from a tap so mobile browsers allow audio. */
export async function say(c: CharacterId, line: LineId) {
  if (!prefs().voice) return;
  const text = lineText(c, line);
  if (!text) return;
  hush();
  const audio = new Audio(`/api/voice?c=${c}&l=${encodeURIComponent(line)}`);
  current = audio;
  setSpeaking(c);
  audio.onended = () => { if (current === audio) setSpeaking(null); };
  try {
    await audio.play();
  } catch {
    // No voice service (or blocked): use the device voice so the character still talks.
    if (current !== audio) return;
    current = null;
    if (typeof speechSynthesis === "undefined") { setSpeaking(null); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.pitch = FALLBACK[c].pitch; u.rate = FALLBACK[c].rate; u.lang = "en-US";
    u.onend = () => setSpeaking(null);
    speechSynthesis.speak(u);
  }
}
