"use client";
import { useEffect, useRef } from "react";
import { applyPalette } from "@/lib/cofounder/palettes";
import { getWorkspace, onWorkspaceChange, replaceWorkspace, useWorkspace, type Workspace } from "@/lib/cofounder/profile";
import { supabase, useAuth } from "@/lib/supabase";

const MAX_BYTES = 5_000_000; // keep rows well under the database size check

/**
 * Keeps the local workspace and the signed-in user's saved workspace in sync,
 * and applies the user's chosen dashboard colors.
 */
export function AuthSync() {
  const { user } = useAuth();
  const { ws, ready } = useWorkspace();
  const uid = user?.id;
  const loadedFor = useRef<string | null>(null);

  useEffect(() => { if (ready) applyPalette(ws.prefs.palette); }, [ready, ws.prefs.palette]);

  // On sign-in: pull the saved workspace, or upload this device's progress if the account is new.
  useEffect(() => {
    const sb = supabase();
    if (!sb || !uid || loadedFor.current === uid) return;
    loadedFor.current = uid;
    (async () => {
      const { data, error } = await sb.from("workspaces").select("data, updated_at").eq("user_id", uid).maybeSingle();
      if (error) { console.error("Couldn't load your saved progress", error.message); return; }
      const local = getWorkspace();
      const remote = data?.data as Partial<Workspace> | undefined;
      if (remote && (remote.profile || !local.profile) && (remote.updatedAt ?? 0) >= (local.updatedAt ?? 0)) replaceWorkspace(remote);
      else await push(local);
    })();
  }, [uid]);

  // Every local change is saved to the account shortly after.
  useEffect(() => {
    if (!uid) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const off = onWorkspaceChange((w) => { clearTimeout(t); t = setTimeout(() => push(w), 1200); });
    return () => { off(); clearTimeout(t); };
  }, [uid]);

  async function push(w: Workspace) {
    const sb = supabase();
    if (!sb || !uid) return;
    let data = w;
    if (JSON.stringify(w).length > MAX_BYTES && w.deck) data = { ...w, deck: { ...w.deck, logo: undefined, slides: w.deck.slides.map((s) => ({ ...s, image: undefined })) } };
    const { error } = await sb.from("workspaces").upsert({ user_id: uid, data, updated_at: new Date().toISOString() });
    if (error) console.error("Couldn't save to your account", error.message);
  }

  return null;
}
