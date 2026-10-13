import type { CategoryId, ResidencyStatus } from '../lib/types'

export const US_STATES: [string, string][] = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'],
  ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'],
  ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'],
  ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'],
  ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'],
  ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'],
  ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'], ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'],
  ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'],
  ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
  ['PR', 'Puerto Rico'], ['GU', 'Guam'], ['VI', 'U.S. Virgin Islands'], ['AS', 'American Samoa'],
  ['MP', 'Northern Mariana Islands'],
]

export const STATUS_OPTIONS: { id: ResidencyStatus; label: string; hint: string }[] = [
  { id: 'citizen', label: 'U.S. Citizen', hint: 'Born or naturalized in the U.S.' },
  { id: 'permanent_resident', label: 'Permanent Resident', hint: 'Green card holder' },
  { id: 'daca', label: 'DACA Recipient', hint: 'Current or expired DACA' },
  { id: 'undocumented', label: 'Undocumented', hint: 'No current legal status' },
  { id: 'tps', label: 'TPS Holder', hint: 'Temporary Protected Status' },
  { id: 'refugee_asylee', label: 'Refugee / Asylee', hint: 'Including pending asylum' },
  { id: 'f1', label: 'F-1 Student Visa', hint: 'International student' },
  { id: 'dependent_visa', label: 'Dependent Visa', hint: 'H-4, L-2, E-2, etc.' },
  { id: 'other_visa', label: 'Other Visa', hint: 'J-1, B-2, U/T visa, etc.' },
  { id: 'not_sure', label: "I'm not sure", hint: "That's okay — we'll show broad options" },
]

export const STATUS_SHORT: Record<ResidencyStatus, string> = {
  citizen: 'Citizens',
  permanent_resident: 'Green card',
  daca: 'DACA',
  undocumented: 'Undocumented',
  tps: 'TPS',
  refugee_asylee: 'Refugee/Asylee',
  f1: 'F-1',
  dependent_visa: 'Dependent visa',
  other_visa: 'Other visa',
  not_sure: 'Unsure',
}

export const CATEGORIES: { id: CategoryId; label: string; emoji: string; color: string }[] = [
  { id: 'merit', label: 'Merit & Academic', emoji: '🏆', color: 'bg-amber-50 text-amber-700 ring-amber-200' },
  { id: 'need', label: 'Need-Based', emoji: '💛', color: 'bg-yellow-50 text-yellow-800 ring-yellow-200' },
  { id: 'stem', label: 'STEM', emoji: '🔬', color: 'bg-sky-50 text-sky-700 ring-sky-200' },
  { id: 'arts', label: 'Arts & Humanities', emoji: '🎨', color: 'bg-pink-50 text-pink-700 ring-pink-200' },
  { id: 'community', label: 'Community Service', emoji: '🤝', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  { id: 'leadership', label: 'Leadership', emoji: '🧭', color: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  { id: 'athletics', label: 'Athletics', emoji: '🏅', color: 'bg-orange-50 text-orange-700 ring-orange-200' },
  { id: 'first_gen', label: 'First-Generation', emoji: '🌱', color: 'bg-lime-50 text-lime-700 ring-lime-200' },
  { id: 'identity', label: 'Heritage & Identity', emoji: '🌍', color: 'bg-violet-50 text-violet-700 ring-violet-200' },
  { id: 'immigrant', label: 'Immigrant & Visa-Friendly', emoji: '🗽', color: 'bg-teal-50 text-teal-700 ring-teal-200' },
  { id: 'local', label: 'State & Local', emoji: '📍', color: 'bg-rose-50 text-rose-700 ring-rose-200' },
  { id: 'no_essay', label: 'No Essay', emoji: '⚡', color: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200' },
  { id: 'career', label: 'Career & Trades', emoji: '🛠️', color: 'bg-stone-100 text-stone-700 ring-stone-200' },
  { id: 'military', label: 'Military Families', emoji: '🎖️', color: 'bg-slate-100 text-slate-700 ring-slate-200' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  (typeof CATEGORIES)[number]
>

export const FIELDS = [
  'Engineering', 'Computer Science', 'Medicine & Health', 'Nursing', 'Biology', 'Business',
  'Education', 'Law & Policy', 'Arts & Design', 'Music', 'Journalism', 'Environmental Science',
  'Mathematics', 'Psychology', 'Agriculture', 'Skilled Trades', 'Undecided',
]

export const CIRCUMSTANCES = [
  'Military family', 'Foster care / ward of the court', 'Disability or chronic illness',
  'Single-parent household', 'Works part-time', 'LGBTQ+', 'Rural community', 'Caregiver for family',
  'Experienced homelessness', 'English language learner',
]

export const HERITAGE = [
  'Hispanic / Latino', 'Black / African American', 'Asian American', 'South Asian', 'Middle Eastern / North African',
  'Native American / Alaska Native', 'Native Hawaiian / Pacific Islander', 'White', 'African (immigrant)', 'Caribbean',
  'Prefer not to say',
]

export const ACTIVITIES = [
  'Sports', 'Visual arts', 'Music / Band', 'Theater', 'Community service', 'STEM / Robotics club',
  'Debate / Speech', 'Student government', 'Entrepreneurship', 'Faith-based groups', 'Part-time job',
  'Writing / Journalism', 'JROTC', 'Coding', 'Cultural clubs', 'Environmental club',
]

export const INCOME = [
  { id: 'lt30', label: 'Under $30k' },
  { id: '30-60', label: '$30k – $60k' },
  { id: '60-100', label: '$60k – $100k' },
  { id: '100-150', label: '$100k – $150k' },
  { id: 'gt150', label: 'Over $150k' },
  { id: 'unknown', label: "Not sure" },
]

export const GPA = [
  { id: '4.0', label: '3.9 – 4.0+' },
  { id: '3.5', label: '3.5 – 3.89' },
  { id: '3.0', label: '3.0 – 3.49' },
  { id: '2.5', label: '2.5 – 2.99' },
  { id: '2.0', label: 'Below 2.5' },
]

export const COLLEGE_PLANS = [
  { id: '4yr', label: '4-year university' },
  { id: 'cc', label: 'Community college' },
  { id: 'trade', label: 'Trade / vocational' },
  { id: 'undecided', label: 'Still deciding' },
]
