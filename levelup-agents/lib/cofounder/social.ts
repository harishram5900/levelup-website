"use client";
import { supabase } from "../supabase";

/** Friends, invites, leaderboard and teams. All calls go through Supabase row-level security / functions. */

export type Board = "global" | "friends" | "team";
export type BoardRow = { id?: string; name: string; startup: string | null; character: string; total_xp: number; is_me: boolean };
export type Member = { name: string; role: string | null; character: string; xp: number; is_me: boolean; is_owner: boolean };
export type TeamGoal = { id: number; text: string; done: boolean };
export type Team = {
  name: string; invite_code: string; is_owner: boolean; members: Member[];
  startup: { profile?: { startup?: string; idea?: string; customer?: string; founder?: string }; results?: Record<string, { sections: { title: string; items: string[] }[] }> } | null;
};
export type Social = { invite_code: string | null; bonus_xp: number; on_leaderboard: boolean; friends: number };

const sb = () => { const c = supabase(); if (!c) throw new Error("Accounts aren't switched on yet."); return c; };
/** Turns database errors into plain words (and a hint if the upgrade SQL hasn't been run). */
const clean = (e: { message?: string; code?: string } | null) => {
  if (!e) return null;
  if (e.code === "42883" || e.code === "PGRST202" || /does not exist|could not find/i.test(e.message ?? "")) return new Error("This feature is being switched on. Please try again soon.");
  return new Error(e.message?.replace(/^.*?:\s*/, "") || "Something went wrong.");
};

export async function mySocial(uid: string): Promise<Social> {
  const c = sb();
  const { data, error } = await c.from("profiles").select("invite_code, bonus_xp, on_leaderboard").eq("id", uid).maybeSingle();
  if (error) throw clean(error);
  const { count } = await c.from("friendships").select("friend_id", { count: "exact", head: true }).eq("user_id", uid);
  return { invite_code: data?.invite_code ?? null, bonus_xp: data?.bonus_xp ?? 0, on_leaderboard: !!data?.on_leaderboard, friends: count ?? 0 };
}

export async function setOnLeaderboard(uid: string, on: boolean) {
  const { error } = await sb().from("profiles").update({ on_leaderboard: on }).eq("id", uid);
  if (error) throw clean(error);
}

export async function leaderboard(scope: Board): Promise<BoardRow[]> {
  const { data, error } = await sb().rpc("leaderboard", { scope });
  if (error) throw clean(error);
  return (data ?? []) as BoardRow[];
}

export async function reportUser(id: string, reason: string) {
  const { error } = await sb().from("reports").insert({ target_id: id, reason: reason.slice(0, 300) });
  if (error && error.code !== "23505") throw clean(error); // 23505: already reported
}
export async function blockUser(id: string) {
  const { error } = await sb().from("blocks").insert({ blocked_id: id });
  if (error && error.code !== "23505") throw clean(error);
}

/** Masks offensive words in names other people chose (simple, conservative list). */
const BAD = /\b(f+u+c+k\w*|sh[i1]t(s|ty|head)?|b[i1]tch(es|y)?|c+u+n+t+s?|d[i1]ck(s|head)?|puss(y|ies)|n[i1]gg(a|er)s?|f[a@]g(s|got|gots)?|wh[o0]re(s)?|slut(s|ty)?|rap(e|ed|es|ist)|porn\w*|sexy|nazis?|kys)\b/gi;
export const cleanName = (s: string | null | undefined) => (s ?? "").replace(BAD, (w) => w[0] + "•".repeat(Math.max(1, w.length - 1)));

export async function addFriend(code: string): Promise<string> {
  const { data, error } = await sb().rpc("add_friend", { code });
  if (error) throw clean(error);
  return data as string;
}

export async function getTeam(): Promise<Team | null> {
  const { data, error } = await sb().rpc("team_overview");
  if (error) throw clean(error);
  return (data ?? null) as Team | null;
}
export async function createTeam(name: string, role: string) {
  const { error } = await sb().rpc("create_team", { team_name: name, my_role: role });
  if (error) throw clean(error);
}
export async function joinTeam(code: string, role: string): Promise<string> {
  const { data, error } = await sb().rpc("join_team", { code, my_role: role });
  if (error) throw clean(error);
  return data as string;
}
export async function leaveTeam() {
  const { error } = await sb().rpc("leave_team");
  if (error) throw clean(error);
}

export async function teamGoals(): Promise<TeamGoal[]> {
  const { data, error } = await sb().from("team_goals").select("id, text, done").order("created_at", { ascending: true }).limit(50);
  if (error) throw clean(error);
  return (data ?? []) as TeamGoal[];
}
export async function addTeamGoal(teamCode: string, text: string, uid: string) {
  const c = sb();
  const { data: t } = await c.from("teams").select("id").eq("invite_code", teamCode).maybeSingle();
  if (!t) throw new Error("Team not found");
  const { error } = await c.from("team_goals").insert({ team_id: t.id, text: text.slice(0, 120), created_by: uid });
  if (error) throw clean(error);
}
export async function toggleTeamGoal(id: number, done: boolean) {
  const { error } = await sb().from("team_goals").update({ done }).eq("id", id);
  if (error) throw clean(error);
}
export async function removeTeamGoal(id: number) {
  const { error } = await sb().from("team_goals").delete().eq("id", id);
  if (error) throw clean(error);
}

export const inviteLink = (code: string) => `${typeof window !== "undefined" ? location.origin : "https://www.levelupinnovations.tech"}/signup?ref=${code}`;
export const teamLink = (code: string) => `${typeof window !== "undefined" ? location.origin : "https://www.levelupinnovations.tech"}/app/team?join=${code}`;
