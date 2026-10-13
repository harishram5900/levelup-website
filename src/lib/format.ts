export const moneyFull = (n: number) => `$${n.toLocaleString()}`

export function daysUntil(iso: string | null) {
  if (!iso) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((new Date(iso + 'T00:00:00').getTime() - today.getTime()) / 86400000)
}

export function shortDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Sort key: soonest real or estimated deadline first, rolling next, unknown last. */
export function deadlineSortKey(s: { deadlineDate: string | null; rolling: boolean }) {
  return s.deadlineDate ?? (s.rolling ? '9998' : '9999')
}
