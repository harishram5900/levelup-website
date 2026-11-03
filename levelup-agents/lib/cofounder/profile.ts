"use client";
import { useCallback, useEffect, useState } from "react";
import type { AgentId } from "../agents";

export type Stage = "idea" | "building" | "launched";
export type Profile = { founder: string; startup: string; idea: string; customer: string; stage: Stage };
export type Section = { title: string; items: string[] };
export type AgentResult = { sections: Section[]; source: "ai" | "guided"; at: number };
export type Goal = { id: string; text: string; done: boolean };
export type Workspace = { profile: Profile | null; results: Partial<Record<AgentId, AgentResult>>; answers: Partial<Record<AgentId, Record<string, string>>>; goals: Goal[] };

const KEY = "levelup-hq-v1";
const EMPTY: Workspace = { profile: null, results: {}, answers: {}, goals: [] };

function read(): Workspace {
  try { const w = JSON.parse(localStorage.getItem(KEY) || "null"); if (w && typeof w === "object") return { ...EMPTY, ...w }; } catch { /* storage blocked */ }
  return EMPTY;
}

/** The founder's workspace, saved in this browser. Swap for a database when accounts are added. */
export function useWorkspace() {
  const [ws, setWs] = useState<Workspace>(EMPTY);
  const [ready, setReady] = useState(false);
  useEffect(() => { setWs(read()); setReady(true); }, []);
  const update = useCallback((fn: (w: Workspace) => Workspace) => {
    setWs((cur) => { const next = fn(cur); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } return next; });
  }, []);
  return { ws, ready, update };
}
