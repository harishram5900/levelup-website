/**
 * DEMO DATA ONLY — fictional scholarships generated so the UI can be built and
 * stress-tested at real scale (~680 records). Replace with the real dataset
 * (spreadsheet import or backend API) — see README "Data schema".
 */
import type { CategoryId, EssayLevel, Grade, ResidencyStatus, Scholarship } from '../lib/types'
import { FIELDS, CIRCUMSTANCES, US_STATES } from './options'

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}
const rand = rng(20261013)
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)]
const pickN = <T,>(arr: readonly T[], n: number) => {
  const copy = [...arr]
  const out: T[] = []
  while (out.length < n && copy.length) out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0])
  return out
}

const ORGS = [
  'Horizon', 'Brightpath', 'Northstar', 'Lumen', 'Evergreen', 'Keystone', 'Summit', 'Beacon', 'Harbor',
  'Pioneer', 'Cedar', 'Meridian', 'Riverstone', 'Trailblazer', 'Open Door', 'Bridgeway', 'Starlight',
  'Compass', 'Liberty Bell', 'Golden Gate', 'Prairie', 'Bluebird', 'Oakridge', 'Silverline', 'Sunrise',
]
const ORG_SUFFIX = ['Foundation', 'Fund', 'Trust', 'Society', 'Alliance', 'Institute', 'Initiative', 'Council']

const TEMPLATES: {
  cats: CategoryId[]
  title: string[]
  desc: string
  essay?: EssayLevel
  statuses?: ResidencyStatus[] | 'all'
  fields?: string[]
  circ?: string[]
  minGpa?: number[]
  range: [number, number]
}[] = [
  { cats: ['merit'], title: ['Academic Excellence Award', 'Scholars Prize', 'Honor Roll Scholarship'], desc: 'Recognizes students with outstanding academic records and intellectual curiosity.', minGpa: [3.5, 3.7, 3.8], range: [1000, 20000] },
  { cats: ['need'], title: ['Opportunity Grant', 'Pathways Scholarship', 'Access Award'], desc: 'Supports students whose families face financial barriers to college.', range: [500, 15000] },
  { cats: ['stem'], title: ['Future Innovators Scholarship', 'STEM Scholars Award', 'Young Engineers Grant'], desc: 'For students pursuing science, technology, engineering or math.', fields: ['Engineering', 'Computer Science', 'Mathematics', 'Biology'], minGpa: [3.0, 3.3], range: [1000, 12000] },
  { cats: ['arts'], title: ['Creative Voices Award', 'Young Artists Scholarship', 'Storytellers Prize'], desc: 'Celebrates student artists, musicians, writers and performers. Portfolio or sample required.', fields: ['Arts & Design', 'Music', 'Journalism'], range: [500, 8000] },
  { cats: ['community'], title: ['Changemaker Scholarship', 'Service Hero Award', 'Neighbors Helping Neighbors Grant'], desc: 'Honors students who have made a measurable impact through volunteer service.', range: [500, 10000] },
  { cats: ['leadership'], title: ['Emerging Leaders Award', 'Student Voice Scholarship', 'Lead Forward Grant'], desc: 'For students who have led clubs, teams, or community initiatives.', range: [1000, 10000] },
  { cats: ['athletics'], title: ['Scholar-Athlete Award', 'Team Spirit Scholarship', 'Field & Classroom Grant'], desc: 'For students balancing athletics with strong academics.', minGpa: [3.0], range: [500, 5000] },
  { cats: ['first_gen'], title: ['First in the Family Scholarship', 'Trailblazer Award', 'New Generation Grant'], desc: 'For students who will be the first in their family to attend college.', range: [1000, 15000] },
  { cats: ['identity'], title: ['Heritage Scholars Award', 'Roots & Wings Scholarship', 'Cultural Leaders Grant'], desc: 'Supports students from underrepresented backgrounds and communities.', range: [1000, 10000] },
  { cats: ['immigrant', 'need'], title: ['Dreamers Opportunity Scholarship', 'New Americans Award', 'Open Borders of Learning Grant'], desc: 'Open to students regardless of immigration status, including DACA and undocumented students. No SSN required.', statuses: 'all', range: [1000, 25000] },
  { cats: ['immigrant'], title: ['Global Students Award', 'International Pathways Scholarship', 'World Scholars Grant'], desc: 'Designed for students on F-1, dependent and other visas studying in the U.S.', statuses: ['f1', 'dependent_visa', 'other_visa', 'permanent_resident', 'daca', 'undocumented', 'tps', 'refugee_asylee', 'citizen', 'not_sure'], range: [1000, 15000] },
  { cats: ['immigrant', 'community'], title: ['Refugee Resilience Scholarship', 'Safe Harbor Award'], desc: 'For refugee, asylee and TPS students rebuilding their education in the U.S.', statuses: ['refugee_asylee', 'tps', 'daca', 'undocumented', 'permanent_resident', 'not_sure'], range: [1000, 10000] },
  { cats: ['local'], title: ['Hometown Scholarship', 'Community Pride Award', 'County Scholars Grant'], desc: 'For graduating seniors from local high schools.', range: [500, 5000] },
  { cats: ['no_essay'], title: ['Quick Apply Scholarship', 'No-Essay Monthly Drawing', 'Easy Entry Award'], desc: 'Simple application — no essay required. Winners selected by drawing or short profile.', essay: 'none', statuses: 'all', range: [500, 10000] },
  { cats: ['career'], title: ['Skilled Trades Scholarship', 'Build Your Future Award', 'Career Tech Grant'], desc: 'For students entering trade school, apprenticeships or career-technical programs.', fields: ['Skilled Trades', 'Agriculture', 'Nursing'], range: [500, 7500] },
  { cats: ['military'], title: ['Military Family Scholarship', 'Service Families Award', 'Homefront Heroes Grant'], desc: 'For children of active-duty, reserve, or veteran service members.', circ: ['Military family'], range: [1000, 12000] },
  { cats: ['need', 'community'], title: ['Fresh Start Scholarship', 'Resilience Award'], desc: 'For students who have overcome significant hardship such as foster care or homelessness.', circ: ['Foster care / ward of the court', 'Experienced homelessness'], statuses: 'all', range: [1000, 10000] },
  { cats: ['stem', 'identity'], title: ['Women in STEM Award', 'Diversity in Tech Scholarship'], desc: 'Increases representation in STEM fields for underrepresented students.', fields: ['Engineering', 'Computer Science', 'Mathematics'], range: [1000, 10000] },
  { cats: ['merit', 'leadership'], title: ['Presidential Scholars Award', 'Distinguished Student Scholarship'], desc: 'A highly competitive award for top students with exceptional leadership.', minGpa: [3.8], essay: 'long', range: [5000, 40000] },
  { cats: ['need', 'first_gen'], title: ['College Bound Grant', 'Dream Big Scholarship'], desc: 'Supports low-income, first-generation students on their way to college.', range: [2000, 20000] },
  { cats: ['community', 'no_essay'], title: ['Volunteer Hours Award', 'Kindness Counts Scholarship'], desc: 'Submit your volunteer hours — no essay needed.', essay: 'none', range: [250, 2500] },
  { cats: ['arts', 'identity'], title: ['Diverse Voices in the Arts Award'], desc: 'Supports artists from diverse cultural backgrounds.', fields: ['Arts & Design', 'Music'], range: [500, 5000] },
  { cats: ['need', 'identity'], title: ['Disability Advocacy Scholarship', 'Ability First Award'], desc: 'For students with disabilities or chronic illnesses pursuing higher education.', circ: ['Disability or chronic illness'], statuses: 'all', range: [1000, 8000] },
]

const STATUS_DEFAULTS: (ResidencyStatus[] | 'all')[] = [
  ['citizen', 'permanent_resident'],
  ['citizen', 'permanent_resident'],
  ['citizen', 'permanent_resident', 'refugee_asylee'],
  'all',
  ['citizen', 'permanent_resident', 'daca', 'undocumented', 'tps', 'refugee_asylee', 'not_sure'],
]

const GRADE_SETS: Grade[][] = [['12'], ['12'], ['11', '12'], ['9', '10', '11', '12'], ['12', 'gap'], ['10', '11']]

function roundAmount(n: number) {
  if (n < 1000) return Math.round(n / 50) * 50
  return Math.round(n / 250) * 250
}

function deadlineFrom(i: number): string | undefined {
  if (i % 11 === 0) return undefined // rolling
  const start = new Date('2026-10-20').getTime()
  const day = Math.floor(rand() * 260)
  return new Date(start + day * 86400000).toISOString().slice(0, 10)
}

function build(count: number): Scholarship[] {
  const list: Scholarship[] = []
  for (let i = 0; i < count; i++) {
    const t = TEMPLATES[i % TEMPLATES.length]
    const org = `${pick(ORGS)} ${pick(ORG_SUFFIX)}`
    const isLocal = t.cats.includes('local') || rand() < 0.18
    const states = isLocal ? pickN(US_STATES.map((s) => s[0]), 1 + Math.floor(rand() * 2)) : 'national'
    const amount = roundAmount(t.range[0] + rand() * (t.range[1] - t.range[0]))
    const hasRange = rand() < 0.15
    const essay: EssayLevel = t.essay ?? (rand() < 0.15 ? 'none' : rand() < 0.6 ? 'short' : 'long')
    const cats = new Set<CategoryId>(t.cats)
    if (isLocal) cats.add('local')
    if (essay === 'none') cats.add('no_essay')
    const statuses = t.statuses ?? pick(STATUS_DEFAULTS)
    if (statuses === 'all' && !cats.has('immigrant') && rand() < 0.5) cats.add('immigrant')
    const title = pick(t.title)
    list.push({
      id: `demo-${i + 1}`,
      name: `${org.split(' ')[0]} ${title}`,
      provider: `The ${org}`,
      amount,
      amountMax: hasRange ? roundAmount(amount * 2) : undefined,
      deadline: deadlineFrom(i),
      categories: [...cats],
      eligibleStatuses: statuses,
      states,
      grades: pick(GRADE_SETS),
      minGpa: t.minGpa ? pick(t.minGpa) : rand() < 0.3 ? pick([2.5, 2.75, 3.0]) : undefined,
      essay,
      fields: t.fields ?? (rand() < 0.2 ? pickN(FIELDS, 2) : undefined),
      circumstances: t.circ ?? (rand() < 0.08 ? pickN(CIRCUMSTANCES, 1) : undefined),
      renewable: rand() < 0.3,
      awardsCount: 1 + Math.floor(rand() * 40),
      description: t.desc,
      requirements: [
        essay === 'none' ? 'Short online profile' : essay === 'short' ? 'Short essay (250–500 words)' : 'Personal essay (650+ words)',
        rand() < 0.5 ? 'One letter of recommendation' : 'Unofficial transcript',
        statuses === 'all' ? 'No SSN or citizenship proof required' : 'Proof of eligibility status',
      ],
      url: 'https://example.com/scholarship',
    })
  }
  return list
}

export const SAMPLE_SCHOLARSHIPS: Scholarship[] = build(684)
