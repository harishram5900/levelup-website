/** Types shared by the API server (server/) and the web app (src/). */

export type ResidencyStatus =
  | 'citizen'
  | 'permanent_resident'
  | 'daca'
  | 'undocumented'
  | 'tps'
  | 'refugee_asylee'
  | 'f1'
  | 'dependent_visa'
  | 'other_visa'
  | 'not_sure'

/** Category codes as they appear in the scholarship dataset. */
export type CategoryId =
  | 'UND' | 'INT' | 'ILL' | 'MER' | 'NEED' | 'ETH' | 'STEM'
  | 'PROJ' | 'ART' | 'LEAD' | 'GEN' | 'SPEC' | 'FIELD' | 'SMALL'

/** Citizenship codes as they appear in the scholarship dataset. */
export type CitizenshipCode = 'ANY' | 'UNDOC' | 'DACA' | 'INTL' | 'CPR' | 'CHECK'

export type Grade = '9' | '10' | '11' | '12' | 'gap'

/** A dataset record after normalization. Original free-text values are kept alongside parsed ones. */
export interface Scholarship {
  id: string
  name: string
  provider: string
  url: string
  notes: string

  amountText: string
  /** Max award in USD when known. */
  amountMax: number | null

  deadlineText: string
  /** Next (possibly estimated) deadline, ISO date. Null when it can't be inferred. */
  deadlineDate: string | null
  /** True when deadlineDate comes from an exact date in the source, not an estimate. */
  deadlineExact: boolean
  rolling: boolean

  gradeText: string
  /** High-school grades this award is open to. Empty = not for high schoolers. */
  grades: Grade[]

  minGpa: number | null
  minGpaText: string | null

  citizenshipCode: CitizenshipCode
  citizenshipText: string
  eligibleStatuses: ResidencyStatus[] | 'all'
  /** False when the source says citizenship rules are unconfirmed (CHECK). */
  statusConfirmed: boolean

  locationText: string
  /** State codes the award is limited to, or 'national'. */
  states: string[] | 'national'
  /** Limited to a city, county, district or region within a state. */
  local: boolean
  /** Name of the college that awards it, when it's college-specific. */
  college: string | null

  categories: CategoryId[]
  verified: boolean
  verificationText: string
  lastChecked: string

  /** Eligibility requirements detected from the record's text. */
  requires: {
    heritage: string[]
    /** A heritage requirement the questionnaire doesn't ask about (e.g. "Norwegian heritage"). */
    otherHeritage: string | null
    women: boolean
    lgbtq: boolean
    circumstances: string[]
    membership: string | null
    fields: string[]
  }
}

export interface StudentProfile {
  firstName: string
  grade: Grade | ''
  state: string
  status: ResidencyStatus | ''
  gpa: string
  collegePlan: string
  fields: string[]
  income: string
  firstGen: 'yes' | 'no' | 'unsure' | ''
  heritage: string[]
  gender: string
  circumstances: string[]
  activities: string[]
  essayPref: 'none' | 'short' | 'any'
  minAmount: number
}

export interface MatchedScholarship extends Scholarship {
  score: number
  /** Why it matched. */
  reasons: string[]
  /** Things the student should double-check before applying. */
  warnings: string[]
}

export interface MatchResponse {
  results: MatchedScholarship[]
  /** Scholarships considered (high-school eligible records). */
  scanned: number
  notices: string[]
  dataGenerated: string
}

export interface StatsResponse {
  total: number
  highSchoolEligible: number
  verified: number
  categories: Partial<Record<CategoryId, number>>
  dataGenerated: string
}
