/**
 * Prints how every record in server/data/scholarships.json was normalized.
 * Run after updating the dataset:  npm run data:report
 */
import { readFileSync } from 'node:fs'
import { loadDataset, type RawDataset } from './normalize'

const file = process.argv[2] ?? new URL('./data/scholarships.json', import.meta.url)
const raw = JSON.parse(readFileSync(file, 'utf8')) as RawDataset
const { scholarships } = loadDataset(raw)


const section = (title: string) => console.log(`\n=== ${title} ===`)

section('Grade level → HS grades')
const grades = new Map<string, string>()
for (const s of scholarships) grades.set(s.gradeText, s.grades.join(',') || '— (not HS)')
for (const [k, v] of [...grades].sort((a, b) => a[1].localeCompare(b[1]))) console.log(`${v.padEnd(16)} ${k}`)

section('Location → states')
const locs = new Map<string, string>()
for (const s of scholarships) {
  const st = s.college ? `college` : s.states === 'national' ? 'national' : s.states.join(',')
  locs.set(s.locationText, `${st}${s.local ? ' (local)' : ''}`)
}
for (const [k, v] of [...locs].sort((a, b) => a[1].localeCompare(b[1]))) console.log(`${v.padEnd(24)} ${k}`)

section('Deadline → date')
const dls = new Map<string, string>()
for (const s of scholarships) dls.set(s.deadlineText, s.rolling ? 'rolling' : s.deadlineDate ? `${s.deadlineDate}${s.deadlineExact ? ' exact' : ' est.'}` : '—')
for (const [k, v] of [...dls].sort((a, b) => a[1].localeCompare(b[1]))) console.log(`${v.padEnd(18)} ${k}`)

section('Detected requirements')
for (const s of scholarships) {
  const r = s.requires
  const parts = [
    r.heritage.length && `heritage=${r.heritage.join('/')}`,
    r.otherHeritage && `other=${r.otherHeritage}`,
    r.women && 'women',
    r.lgbtq && 'lgbtq',
    r.circumstances.length && `circ=${r.circumstances.join('/')}`,
    r.membership && `member=${r.membership}`,
  ].filter(Boolean)
  if (parts.length) console.log(`${s.id} ${s.name.slice(0, 50).padEnd(50)} ${parts.join('  ')}`)
}

section('Summary')
const hs = scholarships.filter((s) => s.grades.length)
console.log(`records: ${scholarships.length}`)
console.log(`open to high schoolers: ${hs.length}`)
console.log(`not for high schoolers: ${scholarships.length - hs.length}`)
console.log(`citizenship confirmed: ${hs.filter((s) => s.statusConfirmed).length} / ${hs.length}`)
console.log(`with known $ max: ${hs.filter((s) => s.amountMax).length} / ${hs.length}`)
console.log(`with deadline date: ${hs.filter((s) => s.deadlineDate).length} (exact ${hs.filter((s) => s.deadlineExact).length})`)
