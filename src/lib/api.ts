import type { MatchResponse, StatsResponse, StudentProfile } from './types'

/**
 * Base URL of the LevelUp API (server/). Defaults to same-origin `/api`, which the Vite
 * dev server proxies to the API and which `npm start` serves directly. Set VITE_API_URL
 * when the API is hosted elsewhere.
 */
const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '/api').replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, init)
  } catch {
    throw new Error("Can't reach the LevelUp server. Check your connection and try again.")
  }
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error((body as { error?: string } | null)?.error ?? `Server error (${res.status})`)
  return body as T
}

export function findScholarships(profile: StudentProfile) {
  return request<MatchResponse>('/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile }),
  })
}

export function getStats() {
  return request<StatsResponse>('/stats')
}
