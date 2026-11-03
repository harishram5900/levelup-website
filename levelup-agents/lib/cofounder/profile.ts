"use client";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { AgentId } from "../agents";

export type Stage = "idea" | "building" | "launched";
export type Profile = { founder: string; startup: string; idea: string; customer: string; stage: Stage };
export type Section = { title: string; items: string[] };
export type AgentResult = { sections: Section[]; source: "ai" | "guided"; at: number };
export type Goal = { id: string; text: string; done: boolean };
export type SlideKind = "cover" | "content" | "closing";
export type Slide = { id: string; kind: SlideKind; kicker: string; title: string; bullets: string[]; image?: string };
export type DeckTheme = "blue" | "tangerine" | "paper";
export type DeckTemplate = "bold" | "minimal" | "split" | "editorial";
export type DeckFont = "bebas" | "serif" | "sans" | "mono";
export type DeckStyle = { template: DeckTemplate; font: DeckFont; bg: string; fg: string; accent: string; gradient: boolean };
export type Deck = { theme?: DeckTheme; style: DeckStyle; logo?: string; slides: Slide[]; at: number };
export type PaletteId = "royal" | "emerald" | "sunset" | "violet" | "crimson" | "ocean";
export type Prefs = { character: "pip" | "blaze" | "sage" | "nova" | "rocco"; palette: PaletteId; tourDone: boolean; picked: boolean };
export type Workspace = {
  profile: Profile | null;
  results: Partial<Record<AgentId, AgentResult>>;
  answers: Partial<Record<AgentId, Record<string, string>>>;
  goals: Goal[];
  deck: Deck | null;
  days: string[]; // dates (YYYY-MM-DD) the founder showed up, for the streak
  seen: { level: number; badges: string[] }; // what we've already celebrated
  prefs: Prefs;
  saved: string[]; // bookmarked opportunity ids
  team?: string | null; // name of the team you're on (for the Team Player badge)
  updatedAt?: number; // for syncing with the account backend
};

export const DEFAULT_STYLE: DeckStyle = { template: "bold", font: "bebas", bg: "#0B1030", fg: "#FFFFFF", accent: "#FE8500", gradient: true };

const KEY = "levelup-hq-v1";
const EMPTY: Workspace = { profile: null, results: {}, answers: {}, goals: [], deck: null, days: [], seen: { level: 1, badges: [] }, saved: [], prefs: { character: "pip", palette: "royal", tourDone: false, picked: false } };

const LEGACY: Record<DeckTheme, Partial<DeckStyle>> = {
  blue: { bg: "#0B1030", fg: "#FFFFFF", accent: "#FE8500", gradient: true },
  tangerine: { bg: "#FE8500", fg: "#1A1100", accent: "#14151D", gradient: true },
  paper: { bg: "#F7F5F0", fg: "#14151D", accent: "#105BFF", gradient: false },
};

/** Fills in fields added in later versions so old saved workspaces keep working. */
export function normalize(w: Partial<Workspace>): Workspace {
  const out: Workspace = { ...EMPTY, ...w, seen: { ...EMPTY.seen, ...(w.seen ?? {}) }, prefs: { ...EMPTY.prefs, ...(w.prefs ?? {}) } } as Workspace;
  if (out.deck && !out.deck.style) out.deck = { ...out.deck, style: { ...DEFAULT_STYLE, ...(out.deck.theme ? LEGACY[out.deck.theme] : {}) } };
  return out;
}

function read(): Workspace {
  try {
    const w = JSON.parse(localStorage.getItem(KEY) || "null");
    if (w && typeof w === "object") return normalize(w);
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

type Listener = (w: Workspace) => void;
const changeHooks = new Set<Listener>();
/** Lets the account sync layer hear about every local change. */
export function onWorkspaceChange(fn: Listener) { changeHooks.add(fn); return () => { changeHooks.delete(fn); }; }

export function setWorkspace(fn: (w: Workspace) => Workspace, opts: { silent?: boolean } = {}) {
  load();
  state = fn(state);
  if (!opts.silent) { state = { ...state, updatedAt: Date.now() }; changeHooks.forEach((h) => h(state)); }
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
export function getWorkspace() { load(); return state; }
/** Replace local state with data from the account (no echo back to the server). */
export function replaceWorkspace(w: Partial<Workspace>) { setWorkspace(() => normalize(w), { silent: true }); }
