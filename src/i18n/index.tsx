import { useDemo } from '@/store/useDemoStore'
import { daysUntil, parseIso } from '@/lib/utils'

export type Lang = 'en' | 'de'
export type L = { en: string; de: string }

export function useI18n() {
  const lang = useDemo((s) => s.lang)
  const locale = lang === 'de' ? 'de-DE' : 'en-GB'
  const t = (en: string, de: string) => (lang === 'de' ? de : en)
  const tl = (l: L | string) => (typeof l === 'string' ? l : l[lang])

  const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) =>
    parseIso(iso).toLocaleDateString(locale, opts)
  const fmtShort = (iso: string) => fmtDate(iso, { day: 'numeric', month: 'short' })
  const fmtWeekday = (iso: string, long = false) => fmtDate(iso, { weekday: long ? 'long' : 'short' })
  const fmtTime = (ms: number) => new Date(ms).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })

  const relDays = (iso: string) => {
    const d = daysUntil(iso)
    if (d === 0) return t('Today', 'Heute')
    if (d === 1) return t('Tomorrow', 'Morgen')
    if (d === -1) return t('Yesterday', 'Gestern')
    if (d < 0) return t(`${-d} days overdue`, `${-d} Tage überfällig`)
    if (d < 14) return t(`in ${d} days`, `in ${d} Tagen`)
    if (d < 60) return t(`in ${Math.round(d / 7)} weeks`, `in ${Math.round(d / 7)} Wochen`)
    return t(`in ${Math.round(d / 30)} months`, `in ${Math.round(d / 30)} Monaten`)
  }

  const relTime = (ms: number) => {
    const m = Math.round((Date.now() - ms) / 60000)
    if (m < 1) return t('just now', 'gerade eben')
    if (m < 60) return t(`${m} min ago`, `vor ${m} Min.`)
    const h = Math.round(m / 60)
    if (h < 24) return t(`${h} h ago`, `vor ${h} Std.`)
    const d = Math.round(h / 24)
    return t(`${d} d ago`, `vor ${d} T.`)
  }

  return { lang, locale, t, tl, fmtDate, fmtShort, fmtWeekday, fmtTime, relDays, relTime }
}
