/**
 * Turns raw dataset records (mostly free text) into structured Scholarship objects.
 *
 * Every rule here is a heuristic over the source wording. Run `npm run data:report`
 * after updating server/data/scholarships.json to see what each record parsed to and
 * which values fell through to a default.
 */
import { CATEGORY_IDS, US_STATES } from '../shared/options'
import type { CategoryId, CitizenshipCode, Grade, ResidencyStatus, Scholarship } from '../shared/types'

export interface RawScholarship {
  id: string
  name: string
  provider: string
  amount: string
  max_amount_usd: number | null
  deadline: string
  grade_level: string
  min_gpa: string | null
  citizenship_code: string
  citizenship: string
  location: string
  category_codes: string[]
  categories: string[]
  url: string
  verification: string
  notes: string
  last_checked: string
}

export interface RawDataset {
  meta: { generated: string; count: number; warning?: string; [k: string]: unknown }
  scholarships: RawScholarship[]
}

const ALL_GRADES: Grade[] = ['9', '10', '11', '12', 'gap']
const HS_GRADES: Grade[] = ['9', '10', '11', '12']

// ---------------------------------------------------------------- citizenship

const STATUS_BY_CODE: Record<CitizenshipCode, ResidencyStatus[] | 'all'> = {
  ANY: 'all',
  CHECK: 'all', // unknown — shown to everyone, flagged as unconfirmed
  UNDOC: ['undocumented', 'daca', 'tps', 'not_sure'],
  DACA: ['citizen', 'permanent_resident', 'daca', 'not_sure'],
  INTL: ['f1', 'dependent_visa', 'other_visa', 'daca', 'not_sure'],
  // "eligible noncitizen" in federal-aid terms covers refugees and asylees
  CPR: ['citizen', 'permanent_resident', 'refugee_asylee', 'not_sure'],
}

function citizenship(code: string): CitizenshipCode {
  return (code in STATUS_BY_CODE ? code : 'CHECK') as CitizenshipCode
}

// ---------------------------------------------------------------- grades

/** Typical age → HS grade. 18-year-olds are seniors or just graduated. */
const AGE_GRADES: [number, Grade[]][] = [
  [14, ['9']], [15, ['9', '10']], [16, ['10', '11']], [17, ['11', '12']], [18, ['12', 'gap']], [19, ['gap']],
]

function gradesForAges(lo: number, hi: number): Grade[] {
  const set = new Set<Grade>()
  for (const [age, gs] of AGE_GRADES) if (age >= lo && age <= hi) gs.forEach((g) => set.add(g))
  return ALL_GRADES.filter((g) => set.has(g))
}

const CHILD = /\b(children|grandchildren|dependents|kids|youth)\b/i
const ADULT_ONLY = /\b([3-9]\d\+|mothers|heads of household|returning to school|partner abuse|veterans?|service members|guard members|professionals)/i
const COLLEGE_CODES = /\b(UG|GR|CC|JD|COD)\b/ // case-sensitive on purpose ("GR" vs "grades")
const COLLEGE_WORDS = /\b(college|graduate|PhD|doctoral|law\b|dental|nursing|health|major|pilot|geoscience|cybersecurity|aviation|hospitality|culinary|accounting|insurance|landscape|welding|trade school|beauty|tech\b|teacher|teaching|construction|waubonsee|special ed)/i

const sorted = (set: Set<Grade>) => ALL_GRADES.filter((g) => set.has(g))

/**
 * Parses grade_level text into high-school grades. Returns [] for awards that are
 * only for middle-school, college, graduate or adult students.
 */
export function parseGrades(text: string): Grade[] {
  const t = text.replace(/[–—]/g, '-')
  const set = new Set<Grade>()
  const add = (gs: Grade[]) => gs.forEach((g) => set.add(g))

  // Explicit high-school wording wins over any age range that follows it.
  if (/\b(HS|high school|secondary|middle\/HS|NHS)\b/i.test(t)) {
    const senior = /senior/i.test(t)
    const junior = /junior/i.test(t) && !/college junior/i.test(t)
    const soph = /sophomore/i.test(t)
    if (/HS grad\b/i.test(t) && !senior) return ['gap']
    if (senior) add(['12'])
    if (junior) add(['11'])
    if (soph) add(['10'])
    if (/(senior|HS)[^,]*\/\s*grad|GED|senior\+/i.test(t)) add(['gap'])
    if (!set.size) add(HS_GRADES)
    return sorted(set)
  }

  // "Grades 9-12", "Grade 11", "Grades K-12"
  const gr = t.match(/grades?\s+(K|\d+)(?:\s*-\s*(\d+))?/i)
  if (gr) {
    const lo = gr[1].toUpperCase() === 'K' ? 0 : Number(gr[1])
    const hi = gr[2] ? Number(gr[2]) : lo
    for (const g of HS_GRADES) if (Number(g) >= lo && Number(g) <= hi) set.add(g)
    return sorted(set)
  }

  if (/incoming freshman|first-year UG|incoming .* students/i.test(t)) return ['12', 'gap']

  if (!CHILD.test(t) && (COLLEGE_CODES.test(t) || COLLEGE_WORDS.test(t) || ADULT_ONLY.test(t))) return []

  // Ages: "Ages 14-18", "Age 18 and under", "Under 19", "Students 16+", "Ages up to 30"
  let m: RegExpMatchArray | null
  if ((m = t.match(/\b(\d+)\s*-\s*(\d+)\b/))) return gradesForAges(Number(m[1]), Number(m[2]))
  if ((m = t.match(/(\d+)\s+(?:and|or) under|up to\s+(\d+)/i))) return gradesForAges(0, Number(m[1] ?? m[2]))
  if ((m = t.match(/under\s+(\d+)/i))) return gradesForAges(0, Number(m[1]) - 1)
  if ((m = t.match(/\b(\d+)\+/))) return gradesForAges(Number(m[1]), 99)

  return ALL_GRADES
}

// ---------------------------------------------------------------- location

const STATE_BY_NAME = new Map(US_STATES.map(([code, name]) => [name.toLowerCase(), code]))
const STATE_CODES = new Set(US_STATES.map(([code]) => code))

/** Sub-state places in the dataset → state. Extend when new places show up in the report. */
const PLACES: [RegExp, string[]][] = [
  [/midwest/i, ['IL', 'IN', 'IA', 'KS', 'MI', 'MN', 'MO', 'NE', 'ND', 'OH', 'SD', 'WI']],
  [/illinois|chicago|aurora|naperville|batavia|dupage|kane|kendall|\bcook\b|\bwill\b|cffrv|fox valley|\bD20[34]\b|benet|district 502|waubonsee|st\. charles|carol stream|ZIP 60\d{3}|metea|waubonsie/i, ['IL']],
  [/\bCA\b|bay area|san diego|san francisco|oakland|orange county|san fernando|northern (ca|california)|pg&e|southern california|\bLA\b|aliso viejo/i, ['CA']],
  [/new york city|\bNYC\b/i, ['NY']],
  [/DC area/i, ['DC', 'MD', 'VA']],
  [/pacific northwest/i, ['WA', 'OR', 'ID']],
  [/kansas \/ missouri|kansas city/i, ['KS', 'MO']],
]

/** Multi-city / nationwide programs that merely mention a city. */
const NATIONAL_OVERRIDE = /^US\b|posse cities|select markets|near simon|congressional|locked-out|worldwide/i

/** Colleges named in the location field — the award comes from the school, not a place. */
const COLLEGES = /^(Amherst|BU|CWRU|Dartmouth|Duke \/ UNC-Chapel Hill|Emory|Harvard|Iowa State|MIT|Princeton|RIT|UC Berkeley|UCLA Law|UNC-Chapel Hill|USC|University of Virginia|Vanderbilt|WashU|Yale|Berea, KY|Illinois public universities|Partner colleges|Partner universities)$/i

type Location = { states: string[] | 'national'; local: boolean; college: string | null }

export function parseLocation(text: string, provider = ''): Location {
  const loc = parsePlace(text.trim())
  // A college listing its own campus location ("Aliso Viejo, CA") isn't a residency limit.
  if (
    loc.states !== 'national' &&
    /\b(university|college)\b/i.test(provider) &&
    !/\b(fund|board|foundation|association)\b/i.test(provider) &&
    !/residen|attend|district|county|counties|area/i.test(text)
  ) {
    return { states: 'national', local: false, college: provider }
  }
  return loc
}

function parsePlace(t: string): Location {
  if (COLLEGES.test(t)) return { states: 'national', local: false, college: t }

  // "preferred" means not restricted
  if (/preferred/i.test(t)) return { states: 'national', local: false, college: null }

  // Explicit lists of state names / codes: "NC, SC, GA residents", "NY, NJ", "Colorado"
  const found = new Set<string>()
  for (const part of t.split(/[,/+&]| and /)) {
    const p = part.replace(/\b(residents?|area|counties|county)\b/gi, '').trim()
    const byName = STATE_BY_NAME.get(p.toLowerCase())
    if (byName) found.add(byName)
    else if (STATE_CODES.has(p) && p !== 'US') found.add(p)
  }
  const wholeState = found.size > 0 && t.split(/[,/+&]| and /).every((part) => {
    const p = part.replace(/\b(residents?)\b/gi, '').trim()
    return STATE_BY_NAME.has(p.toLowerCase()) || STATE_CODES.has(p)
  })
  if (wholeState) return { states: [...found], local: false, college: null }

  if (NATIONAL_OVERRIDE.test(t)) return { states: 'national', local: false, college: null }

  for (const [re, states] of PLACES) {
    if (re.test(t)) return { states, local: !/^(illinois|california)\b/i.test(t), college: null }
  }
  if (found.size) return { states: [...found], local: false, college: null }
  return { states: 'national', local: false, college: null }
}

// ---------------------------------------------------------------- deadlines

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const SEASONS: Record<string, [number, number]> = {
  spring: [3, 31], summer: [6, 30], fall: [11, 1], winter: [1, 31],
}

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** Next occurrence of month/day on or after `today`. */
function nextOccurrence(today: Date, month: number, day: number) {
  const y = today.getFullYear()
  const candidate = iso(y, month, day)
  return candidate >= iso(y, today.getMonth() + 1, today.getDate()) ? candidate : iso(y + 1, month, day)
}

function lastDay(month: number, year = 2027) {
  return new Date(year, month, 0).getDate()
}

const MONTH_RE = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\.?'
const monthNum = (tok: string) => MONTHS.indexOf(tok.slice(0, 3)) + 1

export function parseDeadline(text: string, today = new Date()): { date: string | null; exact: boolean; rolling: boolean } {
  // "opens Oct 1" / "after Oct 1" describe when an application opens, not when it closes
  const t = text
    .toLowerCase()
    .replace(/\(?\bopens?\b[^,)]*\)?,?/g, ' ')
    .replace(/\bafter\s+\w+\s+\d+/g, ' ')
  if (/rolling|monthly|quarterly|recurring|every month|season-long/.test(t)) return { date: null, exact: false, rolling: true }
  const todayIso = iso(today.getFullYear(), today.getMonth() + 1, today.getDate())

  // "December 15, 2026" — exact. A past exact date means the next cycle, so estimate a year on.
  const full = t.match(new RegExp(`\\b${MONTH_RE}\\s+(\\d{1,2}),\\s*(\\d{4})`))
  if (full) {
    const date = iso(Number(full[3]), monthNum(full[1]), Number(full[2]))
    if (date >= todayIso) return { date, exact: true, rolling: false }
    return { date: nextOccurrence(today, monthNum(full[1]), Number(full[2])), exact: false, rolling: false }
  }

  // Ranges like "Nov 1 – May 5": the closing date.
  const range = t.match(new RegExp(`\\b${MONTH_RE}\\s+\\d{1,2}\\s*[–-]\\s*${MONTH_RE}\\s+(\\d{1,2})\\b`))
  if (range) return { date: nextOccurrence(today, monthNum(range[2]), Number(range[3])), exact: false, rolling: false }

  // "Typically March 15", "Oct 1 / Mar 1 / Jun 15", "Typically late Sept / Oct 1": earliest upcoming
  const candidates: string[] = []
  for (const m of t.matchAll(new RegExp(`\\b${MONTH_RE}\\s+(\\d{1,2})\\b`, 'g'))) {
    candidates.push(nextOccurrence(today, monthNum(m[1]), Number(m[2])))
  }
  // Month only: "Typically February", "Dec–Jan", "closes Jan", "late October"
  const closes = t.match(new RegExp(`closes\\s+${MONTH_RE}`))
  const bare = [...t.matchAll(new RegExp(`(late\\s+|early\\s+)?\\b${MONTH_RE}(?!\\s+\\d)\\b`, 'g'))]
  if (closes) {
    candidates.push(nextOccurrence(today, monthNum(closes[1]), 15))
  } else if (bare.length) {
    // in a span ("Jan–Feb", "Dec–Jan") the later month is the closing one
    const m = /[–-]/.test(t) ? bare[bare.length - 1] : bare[0]
    const month = monthNum(m[2])
    const day = m[1]?.startsWith('late') ? lastDay(month) : m[1]?.startsWith('early') ? 5 : 15
    candidates.push(nextOccurrence(today, month, day))
  }
  if (candidates.length) {
    const date = candidates.sort()[0]
    const cycle = t.match(/\((\d{4}) cycle\)/)
    return { date, exact: !!cycle && date.startsWith(cycle[1]), rolling: false }
  }

  const season = Object.keys(SEASONS).find((s) => t.includes(s))
  if (season) {
    const [m, d] = SEASONS[season]
    return { date: nextOccurrence(today, m, d), exact: false, rolling: false }
  }

  return { date: null, exact: false, rolling: false }
}

// ---------------------------------------------------------------- GPA

export function parseGpa(text: string | null): number | null {
  if (!text) return null
  const m = text.match(/\d\.\d+/)
  return m ? Number(m[0]) : null
}

// ---------------------------------------------------------------- requirements from text

const HERITAGE_RULES: [RegExp, string[]][] = [
  [/native american|american indian|indigenous|tribal|\btribes?\b|\bAISES\b|cobell|native forward/i, ['Native American / Alaska Native']],
  [/hispanic|latin[oax]|chican|puerto rican|\b(LULAC|HACU|SHPE|HOLA|HACER|ILACHE|MALDEF|TELACU|NAHJ)\b|beca foundation/i, ['Hispanic / Latino']],
  [/\bblack\b|african american|\b(NSBE|NABJ|UNCF|HBCUs?|NAACP)\b|thurgood marshall|ron brown|juneteenth/i, ['Black / African American']],
  [/south asian|indian-american|asian-indian|born in india|\bupakar\b/i, ['South Asian']],
  [/asian pacific|\bAPIA\b/i, ['Asian American', 'Native Hawaiian / Pacific Islander', 'South Asian']],
  [/asian american|korean|japanese|\b(JACL|SASE|AAJA|AAGEN)\b/i, ['Asian American']],
]

/** Heritage requirements not covered by the questionnaire — surfaced as a note, never filtered on. */
const OTHER_HERITAGE = /\b(norwegian|italian|armenian|jewish|greek|polish|irish|german)\b/i

/** Heritage awards that are open to anyone or to several groups — never filter on these. */
const HERITAGE_OPEN = /open to all backgrounds|students of color|underrepresented|national recognition|diversity|all welcome/i

const CIRCUMSTANCE_RULES: [RegExp, string][] = [
  [/foster/i, 'Foster care / ward of the court'],
  [/\b(military|marines?|veterans?|fallen)\b|gold star|folds of honor|fisher house|thanksusa|american legion legacy/i, 'Military family'],
  [/disabilit|(?<!need-)\bblind\b|visually impaired|\bdeaf\b|hard-of-hearing|cochlear|autis|\bADHD\b|diabetes|cancer|hemophilia|bleeding disorder|dwarfism|physical challenges/i, 'Disability or chronic illness'],
  [/homeless/i, 'Experienced homelessness'],
  [/\bmigra(nt|tory)\b|farmworker/i, 'Migrant / farmworker family'],
  [/incarcerat/i, 'Parent incarcerated'],
  [/AFL-CIO|union members/i, 'Union family'],
]

const MEMBERSHIP_RULES: [RegExp, string][] = [
  [/\bFFA\b/, 'FFA'], [/\b4-H\b/, '4-H'], [/\bDECA\b/, 'DECA'], [/\bFBLA\b/, 'FBLA'], [/key club/i, 'Key Club'],
  [/skillsusa/i, 'SkillsUSA'], [/eagle scout/i, 'Eagle Scouts'], [/gold award/i, 'Girl Scouts Gold Award'],
  [/\bNSDA\b/, 'NSDA (speech & debate)'], [/\bFIRST\b/, 'FIRST Robotics'], [/girls inc/i, 'Girls Inc.'],
  [/caddie/i, 'Golf caddie experience'], [/\bNHS\b/, 'National Honor Society'], [/\bJA\b|junior achievement/i, 'Junior Achievement'],
  [/\bNFTE\b/, 'NFTE'], [/elks/i, 'Elks family'], [/membership (often )?required/i, 'Organization membership'],
]

const FIELD_RULES: [RegExp, string][] = [
  [/engineer|ABET|\bSWE\b|SHPE|NSBE/i, 'Engineering'],
  [/computer|\bCS\b|\bCIS\b|coding|cyber|software|computing|\bAI\b|\btech\b|technology/i, 'Computer Science'],
  [/health|medic|dental|pharm/i, 'Medicine & Health'],
  [/nurs/i, 'Nursing'],
  [/biolog|life science|chemistry/i, 'Biology'],
  [/business|accounting|finance|actuar|entrepreneur|insurance|risk management|MBA|DECA|FBLA|CPA/i, 'Business'],
  [/teach|education major|special ed/i, 'Education'],
  [/\blaw\b|legal|paralegal|public policy|public service|public affairs/i, 'Law & Policy'],
  [/\barts?\b|design|film|architect|photograph/i, 'Arts & Design'],
  [/music/i, 'Music'],
  [/journalism|writing|communications|poetry|essay/i, 'Journalism'],
  [/environment|geoscience|sustainab|climate|conservation/i, 'Environmental Science'],
  [/\bmath/i, 'Mathematics'],
  [/psycholog/i, 'Psychology'],
  [/agri|farm|\bFFA\b|4-H|wine/i, 'Agriculture'],
  [/trade|welding|construction|electric|vocational|culinary|cosmetology|beauty|barber/i, 'Skilled Trades'],
]

function detectRequirements(r: RawScholarship, cats: CategoryId[]): Scholarship['requires'] {
  const text = `${r.name} | ${r.grade_level} | ${r.notes}`
  const heritage = new Set<string>()
  if (cats.includes('ETH') && !HERITAGE_OPEN.test(text)) {
    for (const [re, hs] of HERITAGE_RULES) {
      if (re.test(text)) {
        hs.forEach((h) => heritage.add(h))
        break
      }
    }
  }
  const women =
    /\bwomen\b|\bgirls?\b|female|chicana\/latina|P\.E\.O|AAUW|zonta|soroptimist|mothers/i.test(text) &&
    !/open to all genders|prioritized|preferred/i.test(text)
  const lgbtq = /lgbtq|\bgay\b|queer|point foundation|pflag/i.test(text)

  const circumstances = new Set<string>()
  for (const [re, c] of CIRCUMSTANCE_RULES) if (re.test(text) && !/ROTC/.test(r.name)) circumstances.add(c)

  let membership: string | null = null
  for (const [re, m] of MEMBERSHIP_RULES) {
    if (re.test(text)) {
      membership = m
      break
    }
  }

  const fields = new Set<string>()
  for (const [re, f] of FIELD_RULES) if (re.test(`${r.name} | ${r.notes}`)) fields.add(f)

  const other = text.match(OTHER_HERITAGE)
  const otherHeritage = other ? `${other[1][0].toUpperCase()}${other[1].slice(1).toLowerCase()} heritage` : null

  return { heritage: [...heritage], otherHeritage, women, lgbtq, circumstances: [...circumstances], membership, fields: [...fields] }
}

// ---------------------------------------------------------------- record

export function normalize(r: RawScholarship, today = new Date()): Scholarship {
  const code = citizenship(r.citizenship_code)
  const categories = r.category_codes.filter((c): c is CategoryId => (CATEGORY_IDS as string[]).includes(c))
  const deadline = parseDeadline(r.deadline, today)
  const loc = parseLocation(r.location, r.provider)
  return {
    id: r.id,
    name: r.name,
    provider: r.provider,
    url: r.url,
    notes: r.notes,
    amountText: r.amount,
    amountMax: typeof r.max_amount_usd === 'number' ? r.max_amount_usd : null,
    deadlineText: r.deadline,
    deadlineDate: deadline.date,
    deadlineExact: deadline.exact,
    rolling: deadline.rolling,
    gradeText: r.grade_level,
    grades: parseGrades(r.grade_level),
    minGpa: parseGpa(r.min_gpa),
    minGpaText: r.min_gpa,
    citizenshipCode: code,
    citizenshipText: r.citizenship,
    eligibleStatuses: STATUS_BY_CODE[code],
    statusConfirmed: code !== 'CHECK',
    locationText: r.location,
    states: loc.states,
    local: loc.local,
    college: loc.college,
    categories,
    verified: /^confirmed/i.test(r.verification),
    verificationText: r.verification,
    lastChecked: r.last_checked,
    requires: detectRequirements(r, categories),
  }
}

export function loadDataset(raw: RawDataset, today = new Date()) {
  const scholarships = raw.scholarships.map((r) => normalize(r, today))
  return { meta: raw.meta, scholarships }
}
