import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight, Compass, RotateCcw, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'
import { useDemo } from '@/store/useDemoStore'
import { ME } from '@/data/seed'

export function DemoGuide() {
  const { t } = useI18n()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const s = useDemo()
  const loc = useLocation()

  const myNew = s.bookings.filter((b) => b.ownerId === ME && !['b1', 'b2'].includes(b.id))
  const steps = [
    { done: s.signedIn, to: '/app', en: 'Open the owner app and sign in', de: 'Halter-App öffnen und anmelden' },
    { done: myNew.length > 0, to: '/app', en: 'Book an appointment for Bruno', de: 'Termin für Bruno buchen' },
    { done: myNew.some((b) => ['confirmed', 'proposed', 'declined'].includes(b.status)), to: '/clinic/requests', en: 'Answer the request in the clinic dashboard', de: 'Anfrage im Praxis-Dashboard beantworten' },
    { done: s.notifications.some((n) => n.kind === 'booking' && Date.now() - n.at < 3600_000), to: '/app', en: 'See the push notification on the phone', de: 'Push-Benachrichtigung am Handy sehen' },
    { done: s.consents.some((c) => ['p1', 'p2', 'p3'].includes(c.petId) && c.partyType === 'clinic' && !c.active), to: '/app', en: 'Revoke record sharing in the Privacy center', de: 'Freigabe im Datenschutz-Center widerrufen' },
    { done: s.audit.some((a) => a.actorRole === 'owner' && Date.now() - a.at < 3600_000 && a.action.en.includes('Revoked')), to: '/admin/compliance', en: 'Find it in the admin audit log', de: 'Im Admin-Audit-Log nachverfolgen' },
  ]
  const doneCount = steps.filter((x) => x.done).length

  return (
    <div className={cn('fixed bottom-5 right-5 z-[70]', loc.pathname === '/app' && 'hidden sm:block')}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
            className="absolute bottom-16 right-0 w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-3xl border border-line bg-surface shadow-float"
          >
            <div className="relative overflow-hidden bg-brand px-5 pb-5 pt-4 text-brand-fg">
              <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-12 right-10 h-24 w-24 rounded-full bg-coral/30" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80"><Sparkles size={13} /> {t('Guided demo', 'Geführte Demo')}</div>
                <button onClick={() => setOpen(false)} className="opacity-70 hover:opacity-100"><X size={16} /></button>
              </div>
              <div className="relative mt-2 font-display text-xl font-semibold leading-snug">{t('See the whole platform work together', 'Erleben Sie, wie alles zusammenspielt')}</div>
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
                <motion.div className="h-full rounded-full bg-white" animate={{ width: `${(doneCount / steps.length) * 100}%` }} />
              </div>
              <div className="relative mt-1.5 text-xs opacity-80">{doneCount}/{steps.length} {t('steps completed', 'Schritte erledigt')}</div>
            </div>
            <div className="p-2">
              {steps.map((st, i) => (
                <button key={i} onClick={() => { nav(st.to); }} className="group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left hover:bg-muted">
                  <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition', st.done ? 'bg-brand text-brand-fg' : 'bg-muted text-ink-3 ring-1 ring-line')}>
                    {st.done ? <Check size={14} strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={cn('flex-1 text-[13.5px]', st.done && 'text-ink-3 line-through decoration-ink-3/40')}>{t(st.en, st.de)}</span>
                  <ChevronRight size={15} className="text-ink-3 opacity-0 transition group-hover:opacity-100" />
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-line bg-muted/40 px-4 py-3">
              <button onClick={() => nav('/live')} className="text-xs font-semibold text-brand hover:underline">{t('Open live side-by-side →', 'Live nebeneinander öffnen →')}</button>
              <button
                onClick={() => { s.resetDemo(); s.toast({ title: t('Demo data reset', 'Demo-Daten zurückgesetzt') }) }}
                className="flex items-center gap-1.5 text-xs font-medium text-ink-3 hover:text-ink"
              >
                <RotateCcw size={13} /> {t('Reset', 'Zurücksetzen')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 items-center gap-2.5 rounded-full bg-ink pl-3 pr-4 text-sm font-semibold text-canvas shadow-float"
      >
        <span className="relative grid h-7 w-7 place-items-center rounded-full bg-coral text-white">
          <Compass size={15} />
          {doneCount < steps.length && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-ink bg-sun" />}
        </span>
        <span className="hidden sm:inline">{t('Demo guide', 'Demo-Guide')}</span>
        <span className="rounded-full bg-canvas/15 px-2 py-0.5 text-[11px]">{doneCount}/{steps.length}</span>
      </motion.button>
    </div>
  )
}
