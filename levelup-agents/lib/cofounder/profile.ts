"use client";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { AgentId } from "../agents";

export type Stage = "idea" | "building" | "launched";
export type Profile = { founder: string; startup: string; idea: string; customer: string; stage: Stage };
export type Section = { title: string; items: string[] };
export type AgentResult = { sections: Section[]; source: "ai" | "guided"; at: number };
export type Goal = { id: string; text: string; done: boolean };
export type SlideKind = "cover" | "content" | "closing";
export type Slide = { id: string; kind: SlideKind; kicker: string; title: string; bullets: string[] };
export type DeckTheme = "blue" | "tangerine" | "paper";
export type Deck = { theme: DeckTheme; slides: Slide[]; at: number };
export type Workspace = {
  profile: Profile | null;
  results: Partial<Record<AgentId, AgentResult>>;
  answers: Partial<Record<AgentId, Record<string, string>>>;
  goals: Goal[];
  deck: Deck | null;
  days: string[]; // dates (YYYY-MM-DD) the founder showed up, for the streak
  seen: { level: number; badges: string[] }; // what we've already celebrated
};

const KEY = "levelup-hq-v1";
const EMPTY: Workspace = { profile: null, results: {}, answers: {}, goals: [], deck: null, days: [], seen: { level: 1, badges: [] } };

function read(): Workspace {
  try {
    const w = JSON.parse(localStorage.getItem(KEY) || "null");
    if (w && typeof w === "object") return { ...EMPTY, ...w, seen: { ...EMPTY.seen, ...(w.seen ?? {}) } };
  } catch { /* storage blocked */ }
  return EMPTY;
}

// One shared store, so the top bar, dashboard and agents all see the same state.
let state: Workspace = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
function load() { if (!loaded && typeof window !== "undefined") { state = read(); loaded = true; } }
function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; }
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

export function setWorkspace(fn: (w: Workspace) => Workspace) {
  load();
  state = fn(state);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  emit();
}

/** The founder's workspace, saved in this browser. Swap for a database when accounts are added. */
export function useWorkspace() {
  const ws = useSyncExternalStore(subscribe, () => { load(); return state; }, () => EMPTY);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  // Count today toward the streak once the founder has a startup set up.
  useEffect(() => {
    if (ready && state.profile && !state.days.includes(today())) setWorkspace((w) => ({ ...w, days: [...w.days, today()].slice(-60) }));
  }, [ready, ws.profile]);
  const update = useCallback((fn: (w: Workspace) => Workspace) => setWorkspace(fn), []);
  return { ws, ready, update };
}

export function resetWorkspace() { setWorkspace(() => EMPTY); }
