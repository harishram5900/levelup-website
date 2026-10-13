import { SAMPLE_SCHOLARSHIPS } from '../data/sampleScholarships'
import { matchScholarships } from './matching'
import type { MatchedScholarship, StudentProfile } from './types'

/**
 * Backend integration point.
 *
 * Set VITE_API_URL (e.g. in .env.local) and the app will POST the student's
 * questionnaire answers to `${VITE_API_URL}/match` and expect
 * `{ results: MatchedScholarship[] }` back. Without it, the bundled demo data
 * and client-side matcher are used.
 */
const API_URL = import.meta.env.VITE_API_URL as string | undefined

export const usingDemoData = !API_URL

export async function findScholarships(profile: StudentProfile): Promise<MatchedScholarship[]> {
  if (API_URL) {
    const res = await fetch(`${API_URL.replace(/\/$/, '')}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    })
    if (!res.ok) throw new Error(`Matching service returned ${res.status}`)
    const data = (await res.json()) as { results: MatchedScholarship[] }
    return data.results
  }
  return matchScholarships(profile, SAMPLE_SCHOLARSHIPS)
}

export const TOTAL_INDEXED = SAMPLE_SCHOLARSHIPS.length
