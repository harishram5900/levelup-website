import { GPA, STATUS_SHORT } from '../shared/options'
import type { MatchedScholarship, ResidencyStatus, Scholarship, StudentProfile } from '../shared/types'

const NON_CITIZEN: ResidencyStatus[] = ['daca', 'undocumented', 'tps', 'refugee_asylee', 'f1', 'dependent_visa', 'other_visa', 'not_sure']
const UNDOC_LIKE: ResidencyStatus[] = ['daca', 'undocumented', 'tps']
const VISA: ResidencyStatus[] = ['f1', 'dependent_visa', 'other_visa']

/** Activities in the questionnaire that satisfy a detected membership requirement. */
const MEMBERSHIP_ACTIVITY: Record<string, string[]> = {
  FFA: ['FFA / 4-H'],
  '4-H': ['FFA / 4-H'],
  DECA: ['DECA / FBLA'],
  FBLA: ['DECA / FBLA'],
  'Key Club': ['Community service'],
  SkillsUSA: ['DECA / FBLA', 'Part-time job'],
  'Eagle Scouts': ['Scouts'],
  'Girl Scouts Gold Award': ['Scouts'],
  'NSDA (speech & debate)': ['Debate / Speech'],
  'FIRST Robotics': ['STEM / Robotics club'],
  'National Honor Society': ['National Honor Society'],
  'Junior Achievement': ['Entrepreneurship', 'DECA / FBLA'],
  NFTE: ['Entrepreneurship'],
}

const ACTIVITY_CATEGORY: [string[], Scholarship['categories'][number], string][] = [
  [['STEM / Robotics club', 'Coding'], 'STEM', 'Fits your STEM activities'],
  [['Visual arts', 'Music / Band', 'Theater', 'Writing / Journalism'], 'ART', 'Fits your creative work'],
  [['Student government', 'Debate / Speech', 'Community service'], 'LEAD', 'Fits your leadership & service'],
  [['Entrepreneurship', 'DECA / FBLA', 'STEM / Robotics club', 'Coding'], 'PROJ', 'Fits your projects & competitions'],
]

function statusEligible(s: Scholarship, status: ResidencyStatus | '') {
  if (!status || s.eligibleStatuses === 'all') return true
  return s.eligibleStatuses.includes(status)
}

/** Rule-based eligibility filter + ranking over the normalized dataset. */
export function matchScholarships(profile: StudentProfile, all: Scholarship[]): MatchedScholarship[] {
  const gpaMax = GPA.find((g) => g.id === profile.gpa)?.max ?? null
  const heritage = profile.heritage.filter((h) => h !== 'Prefer not to say')
  const has = (c: string) => profile.circumstances.includes(c)
  const out: MatchedScholarship[] = []

  for (const s of all) {
    // ---- hard eligibility filters
    if (!s.grades.length) continue
    if (profile.grade && !s.grades.includes(profile.grade)) continue
    if (!statusEligible(s, profile.status)) continue
    if (s.states !== 'national' && profile.state && !s.states.includes(profile.state)) continue
    if (s.minGpa !== null && gpaMax !== null && gpaMax < s.minGpa) continue
    if (s.amountMax !== null && s.amountMax < profile.minAmount) continue
    if (s.requires.circumstances.length && !s.requires.circumstances.some(has)) continue
    if (s.requires.heritage.length && heritage.length && !s.requires.heritage.some((h) => heritage.includes(h))) continue
    if (s.requires.women && profile.gender === 'Male') continue

    let score = 50
    const reasons: string[] = []
    const warnings: string[] = []

    // ---- status
    const status = profile.status
    if (status && UNDOC_LIKE.includes(status) && (s.categories.includes('UND') || s.citizenshipCode === 'UNDOC')) {
      score += 20
      reasons.push('Built for undocumented, DACA & TPS students')
    } else if (status && VISA.includes(status) && (s.categories.includes('INT') || s.citizenshipCode === 'INTL')) {
      score += 20
      reasons.push('Open to international & visa students')
    } else if (status && NON_CITIZEN.includes(status) && s.citizenshipCode === 'ANY') {
      score += 10
      reasons.push('Open regardless of citizenship')
    } else if (status && status !== 'not_sure' && s.statusConfirmed && s.eligibleStatuses !== 'all') {
      score += 4
      reasons.push(`Confirmed open to ${STATUS_SHORT[status]}`)
    }
    if (!s.statusConfirmed && status && NON_CITIZEN.includes(status)) {
      score -= 15
      warnings.push('Citizenship rules not confirmed — check the official site before applying')
    }
    if (status === 'not_sure' && s.citizenshipCode === 'CPR') {
      warnings.push('Requires U.S. citizenship, a green card, or eligible-noncitizen status')
    }

    // ---- location
    if (s.states !== 'national') {
      score += s.local ? 16 : 12
      reasons.push(s.local ? `Local award — ${s.locationText}` : `For ${s.locationText} students`)
      if (s.local) warnings.push(`Limited to ${s.locationText} — confirm you live or attend school there`)
    }
    if (s.college) warnings.push(`Awarded by ${s.college} — usually requires admission or enrollment there`)

    // ---- background
    const circ = s.requires.circumstances.filter(has)
    if (circ.length) {
      score += 16
      reasons.push(`For students with your background (${circ[0].toLowerCase()})`)
    }
    if (s.requires.heritage.length) {
      if (s.requires.heritage.some((h) => heritage.includes(h))) {
        score += 15
        reasons.push('Matches your heritage')
      } else {
        score -= 5
        warnings.push(`For students of ${s.requires.heritage.join(' / ')} heritage`)
      }
    }
    if (s.requires.otherHeritage) warnings.push(`Requires ${s.requires.otherHeritage}`)
    if (s.requires.women) {
      if (profile.gender === 'Female') {
        score += 12
        reasons.push('For women & girls')
      } else {
        warnings.push('For women & girls (some also accept non-binary students)')
      }
    }
    if (s.requires.lgbtq) {
      if (has('LGBTQ+')) {
        score += 12
        reasons.push('For LGBTQ+ students')
      } else {
        warnings.push('For LGBTQ+ students (some also accept allies)')
      }
    }
    if (s.requires.membership) {
      const acts = MEMBERSHIP_ACTIVITY[s.requires.membership] ?? []
      if (acts.some((a) => profile.activities.includes(a))) {
        score += 14
        reasons.push(`Matches your ${s.requires.membership} involvement`)
      } else {
        score -= 6
        warnings.push(`Requires ${s.requires.membership}`)
      }
    }

    const lowIncome = ['lt30', '30-60'].includes(profile.income)
    if (s.categories.includes('NEED') && (lowIncome || profile.firstGen === 'yes')) {
      score += 10
      reasons.push(profile.firstGen === 'yes' && /first/i.test(`${s.name} ${s.notes}`) ? 'For first-generation students' : 'Need-based support')
    }

    // ---- academics & interests
    const field = s.requires.fields.find((f) => profile.fields.includes(f))
    if (field) {
      score += 12
      reasons.push(`Matches your interest in ${field}`)
    }
    if (s.minGpa !== null && gpaMax !== null) reasons.push(`Your GPA meets the ${s.minGpa} minimum`)
    if (s.categories.includes('MER') && ['4.0', '3.5'].includes(profile.gpa)) {
      score += 8
      reasons.push('Rewards strong academics')
    }
    for (const [acts, cat, why] of ACTIVITY_CATEGORY) {
      if (s.categories.includes(cat) && acts.some((a) => profile.activities.includes(a))) {
        score += 8
        reasons.push(why)
        break
      }
    }
    if (profile.collegePlan === 'trade' && s.requires.fields.includes('Skilled Trades')) score += 10
    if (profile.essayPref !== 'any' && s.categories.includes('SMALL')) {
      score += 8
      reasons.push('Quick application')
    }

    // ---- data quality
    if (s.verified) score += 3
    else warnings.push('Known program — confirm the current cycle on the official site')
    if (s.minGpaText && s.minGpa === null && !/varies|good standing/i.test(s.minGpaText)) {
      warnings.push(`GPA requirement: ${s.minGpaText}`)
    }

    if (!reasons.length) reasons.push('You meet the listed eligibility requirements')
    out.push({ ...s, score: Math.max(10, Math.min(99, score)), reasons, warnings })
  }

  return out.sort((a, b) => b.score - a.score || (b.amountMax ?? 0) - (a.amountMax ?? 0))
}
