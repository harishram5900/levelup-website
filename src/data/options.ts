import type { CategoryId } from '../lib/types'
import { CATEGORY_LABELS } from '../../shared/options'

export * from '../../shared/options'

const STYLE: Record<CategoryId, { emoji: string; color: string }> = {
  UND: { emoji: '🗽', color: 'bg-teal-50 text-teal-700 ring-teal-200' },
  INT: { emoji: '🌐', color: 'bg-cyan-50 text-cyan-700 ring-cyan-200' },
  ILL: { emoji: '📍', color: 'bg-rose-50 text-rose-700 ring-rose-200' },
  MER: { emoji: '🏆', color: 'bg-amber-50 text-amber-700 ring-amber-200' },
  NEED: { emoji: '💛', color: 'bg-yellow-50 text-yellow-800 ring-yellow-200' },
  ETH: { emoji: '🌍', color: 'bg-violet-50 text-violet-700 ring-violet-200' },
  STEM: { emoji: '🔬', color: 'bg-sky-50 text-sky-700 ring-sky-200' },
  PROJ: { emoji: '🚀', color: 'bg-orange-50 text-orange-700 ring-orange-200' },
  ART: { emoji: '🎨', color: 'bg-pink-50 text-pink-700 ring-pink-200' },
  LEAD: { emoji: '🤝', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  GEN: { emoji: '🌈', color: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200' },
  SPEC: { emoji: '🧩', color: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  FIELD: { emoji: '🛠️', color: 'bg-stone-100 text-stone-700 ring-stone-200' },
  SMALL: { emoji: '⚡', color: 'bg-lime-50 text-lime-700 ring-lime-200' },
}

export const CATEGORIES = (Object.keys(CATEGORY_LABELS) as CategoryId[]).map((id) => ({
  id,
  label: CATEGORY_LABELS[id],
  ...STYLE[id],
}))

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  (typeof CATEGORIES)[number]
>
