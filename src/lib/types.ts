/** Immigration / residency status — drives eligibility filtering. */
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

export type CategoryId =
  | 'merit'
  | 'need'
  | 'stem'
  | 'arts'
  | 'community'
  | 'leadership'
  | 'athletics'
  | 'first_gen'
  | 'identity'
  | 'immigrant'
  | 'local'
  | 'no_essay'
  | 'career'
  | 'military'

export type EssayLevel = 'none' | 'short' | 'long'

export interface Scholarship {
  id: string
  name: string
  provider: string
  /** Award in USD. For ranges use amountMax as the upper bound. */
  amount: number
  amountMax?: number
  /** ISO date (YYYY-MM-DD). Omit for rolling deadlines. */
  deadline?: string
  categories: CategoryId[]
  /** 'all' = no status restriction. */
  eligibleStatuses: ResidencyStatus[] | 'all'
  /** Two-letter state codes, or 'national'. */
  states: string[] | 'national'
  grades: Grade[]
  minGpa?: number
  essay: EssayLevel
  fields?: string[]
  circumstances?: string[]
  renewable?: boolean
  awardsCount?: number
  description: string
  requirements: string[]
  url: string
}

export type Grade = '9' | '10' | '11' | '12' | 'gap'

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
  reasons: string[]
}
