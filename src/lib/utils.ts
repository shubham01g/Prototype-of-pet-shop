import clsx, { type ClassValue } from 'clsx'

export const cn = (...c: ClassValue[]) => clsx(c)

export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}`

const DAY = 86400000

export function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** ISO date (yyyy-mm-dd) relative to today */
export function isoDay(offsetDays = 0) {
  const d = new Date(startOfToday().getTime() + offsetDays * DAY)
  return toIso(d)
}

export function toIso(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseIso(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Timestamp (ms) relative to now in minutes */
export const ago = (minutes: number) => Date.now() - minutes * 60000

export function daysUntil(iso: string) {
  return Math.round((parseIso(iso).getTime() - startOfToday().getTime()) / DAY)
}

export function addDays(iso: string, days: number) {
  return toIso(new Date(parseIso(iso).getTime() + days * DAY))
}

export function ageFrom(iso: string) {
  const b = parseIso(iso)
  const n = new Date()
  let years = n.getFullYear() - b.getFullYear()
  let months = n.getMonth() - b.getMonth()
  if (n.getDate() < b.getDate()) months--
  if (months < 0) { years--; months += 12 }
  return { years, months }
}

export const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n))

export function seeded(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

export const euro = (n: number, lang: 'en' | 'de' = 'de', digits = 0) =>
  new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: digits }).format(n)

export const num = (n: number, lang: 'en' | 'de' = 'de') => new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-GB').format(n)
