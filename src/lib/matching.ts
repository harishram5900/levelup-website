import { daysUntil } from './format'
import type { MatchedScholarship, ResidencyStatus, Scholarship, StudentProfile } from './types'

const OPEN_STATUSES: ResidencyStatus[] = ['daca', 'undocumented', 'tps', 'f1', 'dependent_visa', 'other_visa']

export function isStatusEligible(s: Scholarship, status: StudentProfile['status']) {
  if (s.eligibleStatuses === 'all' || !status) return true
  if (status === 'not_sure') return true
  return s.eligibleStatuses.includes(status)
}

/**
 * Client-side eligibility + ranking. Placeholder for the AI matching backend —
 * the backend should return the same MatchedScholarship shape.
 */
export function matchScholarships(profile: StudentProfile, all: Scholarship[]): MatchedScholarship[] {
  const gpa = parseFloat(profile.gpa) || 0
  const out: MatchedScholarship[] = []

  for (const s of all) {
    if (!isStatusEligible(s, profile.status)) continue
    const days = daysUntil(s.deadline)
    if (days !== null && days < 0) continue
    if (s.states !== 'national' && profile.state && !s.states.includes(profile.state)) continue
    if (profile.grade && !s.grades.includes(profile.grade)) continue
    if (s.minGpa && gpa && gpa < s.minGpa - 0.01) continue
    if (s.circumstances?.length && !s.circumstances.some((c) => profile.circumstances.includes(c))) continue
    if (profile.essayPref === 'none' && s.essay !== 'none') continue
    if (profile.essayPref === 'short' && s.essay === 'long') continue
    if ((s.amountMax ?? s.amount) < profile.minAmount) continue

    let score = 55
    const reasons: string[] = []

    if (s.states !== 'national') {
      score += 12
      reasons.push('Local to your state')
    }
    if (s.fields?.some((f) => profile.fields.includes(f))) {
      score += 14
      reasons.push('Matches your intended field')
    }
    if (s.circumstances?.length) {
      score += 12
      reasons.push('Fits your background')
    }
    if (profile.status && OPEN_STATUSES.includes(profile.status as ResidencyStatus) && s.categories.includes('immigrant')) {
      score += 14
      reasons.push('Designed for students with your status')
    }
    if (profile.firstGen === 'yes' && s.categories.includes('first_gen')) {
      score += 12
      reasons.push('First-generation student')
    }
    if (['lt30', '30-60'].includes(profile.income) && s.categories.includes('need')) {
      score += 10
      reasons.push('Need-based support')
    }
    if (s.minGpa && gpa >= s.minGpa) {
      score += 6
      reasons.push(`GPA meets ${s.minGpa.toFixed(1)}+`)
    }
    if (profile.heritage.length && !profile.heritage.includes('Prefer not to say') && s.categories.includes('identity')) {
      score += 6
    }
    const act = profile.activities
    if (act.includes('Sports') && s.categories.includes('athletics')) score += 8
    if (act.includes('Community service') && s.categories.includes('community')) score += 8
    if ((act.includes('Student government') || act.includes('Debate / Speech')) && s.categories.includes('leadership')) score += 6
    if ((act.includes('Visual arts') || act.includes('Music / Band') || act.includes('Theater')) && s.categories.includes('arts')) score += 8
    if ((act.includes('STEM / Robotics club') || act.includes('Coding')) && s.categories.includes('stem')) score += 8
    if (profile.collegePlan === 'trade' && s.categories.includes('career')) score += 10

    if (!reasons.length) reasons.push('You meet the eligibility requirements')
    out.push({ ...s, score: Math.min(99, score), reasons })
  }

  return out.sort((a, b) => b.score - a.score || b.amount - a.amount)
}
