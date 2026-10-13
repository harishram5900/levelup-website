import { useEffect, useState } from 'react'
import { getStats } from './api'
import type { StatsResponse } from './types'

let cache: StatsResponse | null = null

/** Dataset stats for marketing copy; null until loaded (or if the API is unreachable). */
export function useStats() {
  const [stats, setStats] = useState<StatsResponse | null>(cache)
  useEffect(() => {
    if (cache) return
    getStats()
      .then((s) => {
        cache = s
        setStats(s)
      })
      .catch(() => {})
  }, [])
  return stats
}
