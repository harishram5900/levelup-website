import type { Scholarship } from './types'

export const money = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n.toLocaleString()}`

export const moneyFull = (n: number) => `$${n.toLocaleString()}`

export function amountLabel(s: Scholarship) {
  return s.amountMax ? `${money(s.amount)} – ${money(s.amountMax)}` : money(s.amount)
}

export function daysUntil(iso?: string) {
  if (!iso) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((new Date(iso + 'T00:00:00').getTime() - today.getTime()) / 86400000)
}

export function deadlineLabel(iso?: string) {
  if (!iso) return 'Rolling'
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
