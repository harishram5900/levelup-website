import express, { type NextFunction, type Request, type Response } from 'express'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  ACTIVITIES, CATEGORY_IDS, CIRCUMSTANCES, COLLEGE_PLANS, FIELDS, GENDERS, GPA, HERITAGE, INCOME,
  STATUS_OPTIONS, US_STATES,
} from '../shared/options'
import type { CategoryId, MatchResponse, StatsResponse, StudentProfile } from '../shared/types'
import { matchScholarships } from './match'
import { loadDataset, type RawDataset } from './normalize'

const here = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = process.env.DATA_FILE ?? path.join(here, 'data', 'scholarships.json')
const PORT = Number(process.env.PORT ?? 8787)

// ---------------------------------------------------------------- data

const { meta, scholarships } = loadDataset(JSON.parse(readFileSync(DATA_FILE, 'utf8')) as RawDataset)
const highSchool = scholarships.filter((s) => s.grades.length)
console.log(`Loaded ${scholarships.length} scholarships (${highSchool.length} open to high schoolers) from ${DATA_FILE}`)

const ILLINOIS_NOTICE = meta.warning?.split(/Illinois:\s*/)[1]?.trim()

// ---------------------------------------------------------------- validation

const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T | '' = ''): T | '' =>
  typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : fallback

const someOf = (v: unknown, allowed: readonly string[]) =>
  Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string' && allowed.includes(x)))] : []

/** Accepts only known option values, so free text never reaches the matcher. */
function parseProfile(body: unknown): StudentProfile | null {
  if (!body || typeof body !== 'object') return null
  const p = (body as { profile?: Record<string, unknown> }).profile
  if (!p || typeof p !== 'object') return null
  const profile: StudentProfile = {
    firstName: typeof p.firstName === 'string' ? p.firstName.slice(0, 40) : '',
    grade: oneOf(p.grade, ['9', '10', '11', '12', 'gap'] as const),
    state: oneOf(p.state, US_STATES.map(([c]) => c)),
    status: oneOf(p.status, STATUS_OPTIONS.map((s) => s.id)),
    gpa: oneOf(p.gpa, GPA.map((g) => g.id)),
    collegePlan: oneOf(p.collegePlan, COLLEGE_PLANS.map((c) => c.id)),
    fields: someOf(p.fields, FIELDS),
    income: oneOf(p.income, INCOME.map((i) => i.id)),
    firstGen: oneOf(p.firstGen, ['yes', 'no', 'unsure'] as const),
    heritage: someOf(p.heritage, HERITAGE),
    gender: oneOf(p.gender, GENDERS),
    circumstances: someOf(p.circumstances, CIRCUMSTANCES),
    activities: someOf(p.activities, ACTIVITIES),
    essayPref: oneOf(p.essayPref, ['none', 'short', 'any'] as const, 'any') || 'any',
    minAmount: Math.max(0, Math.min(100000, Number(p.minAmount) || 0)),
  }
  if (!profile.grade || !profile.state || !profile.status) return null
  return profile
}

function noticesFor(profile: StudentProfile) {
  const notices = ['Deadlines and award amounts change every cycle — always confirm on the official site before applying.']
  if (profile.state === 'IL' && ['undocumented', 'daca', 'tps', 'not_sure'].includes(profile.status) && ILLINOIS_NOTICE) {
    notices.push(`Illinois update: ${ILLINOIS_NOTICE}`)
  }
  return notices
}

// ---------------------------------------------------------------- app

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '20kb' }))

const allowedOrigins = (process.env.CORS_ORIGIN ?? '').split(',').map((s) => s.trim()).filter(Boolean)
app.use('/api', (req, res, next) => {
  const origin = req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  }
  if (req.method === 'OPTIONS') return void res.sendStatus(204)
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/stats', (_req, res) => {
  const categories: Partial<Record<CategoryId, number>> = {}
  for (const s of highSchool) for (const c of s.categories) categories[c] = (categories[c] ?? 0) + 1
  const body: StatsResponse = {
    total: scholarships.length,
    highSchoolEligible: highSchool.length,
    verified: highSchool.filter((s) => s.verified).length,
    categories,
    dataGenerated: meta.generated,
  }
  res.json(body)
})

app.get('/api/scholarships', (req, res) => {
  const category = oneOf(req.query.category, CATEGORY_IDS)
  const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase().slice(0, 100) : ''
  const results = highSchool.filter(
    (s) =>
      (!category || s.categories.includes(category)) &&
      (!q || `${s.name} ${s.provider} ${s.notes}`.toLowerCase().includes(q)),
  )
  res.json({ results, count: results.length })
})

app.get('/api/scholarships/:id', (req, res) => {
  const s = scholarships.find((x) => x.id === req.params.id)
  if (!s) return void res.status(404).json({ error: 'Not found' })
  res.json(s)
})

app.post('/api/match', (req, res) => {
  const profile = parseProfile(req.body)
  if (!profile) return void res.status(400).json({ error: 'A grade, state and status are required.' })
  const body: MatchResponse = {
    results: matchScholarships(profile, scholarships),
    scanned: highSchool.length,
    notices: noticesFor(profile),
    dataGenerated: meta.generated,
  }
  res.json(body)
})

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Serve the built web app when it exists (npm run build), so one process can host everything.
const dist = path.join(here, '..', 'dist')
if (existsSync(dist)) {
  app.use(express.static(dist, { index: false, maxAge: '1h' }))
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.use((err: Error & { type?: string }, _req: Request, res: Response, _next: NextFunction) => {
  if (err.type === 'entity.parse.failed') return void res.status(400).json({ error: 'Invalid JSON' })
  if (err.type === 'entity.too.large') return void res.status(413).json({ error: 'Request too large' })
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

app.listen(PORT, () => console.log(`LevelUp API listening on http://localhost:${PORT}`))
