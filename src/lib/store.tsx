import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { MatchedScholarship, StudentProfile } from './types'

export const EMPTY_PROFILE: StudentProfile = {
  firstName: '',
  grade: '',
  state: '',
  status: '',
  gpa: '',
  collegePlan: '',
  fields: [],
  income: '',
  firstGen: '',
  heritage: [],
  gender: '',
  circumstances: [],
  activities: [],
  essayPref: 'any',
  minAmount: 0,
}

interface Store {
  profile: StudentProfile | null
  setProfile: (p: StudentProfile | null) => void
  results: MatchedScholarship[] | null
  setResults: (r: MatchedScholarship[] | null) => void
  saved: string[]
  toggleSaved: (id: string) => void
  applied: string[]
  toggleApplied: (id: string) => void
  reset: () => void
}

const Ctx = createContext<Store | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => load(key, fallback))
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable — keep in memory */
    }
  }, [key, value])
  return [value, setValue] as const
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = usePersisted<StudentProfile | null>('lu.profile', null)
  const [results, setResults] = usePersisted<MatchedScholarship[] | null>('lu.results', null)
  const [saved, setSaved] = usePersisted<string[]>('lu.saved', [])
  const [applied, setApplied] = usePersisted<string[]>('lu.applied', [])

  const toggle = (set: typeof setSaved) => (id: string) =>
    set((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const reset = useCallback(() => {
    setProfile(null)
    setResults(null)
    setSaved([])
    setApplied([])
  }, [setProfile, setResults, setSaved, setApplied])

  return (
    <Ctx.Provider
      value={{
        profile,
        setProfile,
        results,
        setResults,
        saved,
        toggleSaved: toggle(setSaved),
        applied,
        toggleApplied: toggle(setApplied),
        reset,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
