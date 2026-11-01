import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle, BellRing, CalendarCheck2, CalendarClock, CalendarDays, Check, CheckCheck, ChevronLeft, ChevronRight, Clock3, FileSignature, FileText, Inbox, LayoutDashboard,
  Lock, MessageSquare, Paperclip, Plug, Search, SendHorizonal, Settings2, ShieldCheck, Stethoscope, TrendingDown, UserX, Users, X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DocThumb, PetAvatar, SPECIES_LABEL } from '@/components/illustrations'
import { DashboardShell, PageHeader } from '@/components/shell'
import { Badge, Button, Initials, Modal, Segmented, StatCard, Switch } from '@/components/ui'
import { useI18n } from '@/i18n'
import { addDays, ageFrom, cn, daysUntil, isoDay, parseIso } from '@/lib/utils'
import { REPEAT_LABEL, useDemo } from '@/store/useDemoStore'
import { MY_CLINIC } from '@/data/seed'
import type { Booking } from '@/data/types'
import { TYPE_META, dueTone } from '@/portals/owner/kit'
import { SVC_ICON } from '@/portals/owner/screens/Clinics'

/* ------------------------------------------------------------------ helpers */
function useClinicData() {
  const s = useDemo()
  const clinic = s.clinics.find((c) => c.id === MY_CLINIC)!
  const bookings = s.bookings.filter((b) => b.clinicId === MY_CLINIC)
  const consentFor = (petId: string) => s.consents.find((c) => c.petId === petId && c.partyType === 'clinic' && c.partyId === MY_CLINIC)
  const patients = s.pets.filter((p) => p.clinicId === MY_CLINIC || consentFor(p.id))
  const threads = s.threads.filter((t) => t.clinicId === MY_CLINIC)
  const owner = (id: string) => s.owners.find((o) => o.id === id)
  const pet = (id: string) => s.pets.find((p) => p.id === id)
  const service = (id: string) => clinic.services.find((x) => x.id === id)
  return { s, clinic, bookings, patients, threads, consentFor, owner, pet, service }
}

/** Toast when a new booking / message arrives (e.g. from another tab or the live demo iframe) */
function useIncomingAlerts() {
  const { t } = useI18n()
  const { bookings, threads, s, pet, owner } = useClinicData()
  const pending = bookings.filter((b) => b.status === 'pending')
  const lastIds = useRef(new Set(pending.map((b) => b.id)))
  const ownerMsgs = threads.reduce((a, th) => a + th.messages.filter((m) => m.from === 'owner').length, 0)
  const lastMsgs = useRef(ownerMsgs)
  useEffect(() => {
    pending.forEach((b) => {
      if (!lastIds.current.has(b.id)) {
        s.toast({ title: t('New booking request 🔔', 'Neue Terminanfrage 🔔'), body: `${pet(b.petId)?.name} · ${owner(b.ownerId)?.name} · ${b.time}`, tone: 'coral' })
      }
    })
    lastIds.current = new Set(pending.map((b) => b.id))
  }, [pending.length]) // eslint-disable-line
  useEffect(() => {
    if (ownerMsgs > lastMsgs.current) s.toast({ title: t('New message from a pet owner', 'Neue Nachricht von Tierhalter:in'), tone: 'brand' })
    lastMsgs.current = ownerMsgs
  }, [ownerMsgs]) // eslint-disable-line
}

/* ===================================================================== root */
export default function Clinic() {
  const { t } = useI18n()
  const { bookings, threads } = useClinicData()
  const nav = useNavigate()
  useIncomingAlerts()
  const pending = bookings.filter((b) => b.status === 'pending').length
  const unread = threads.reduce((a, th) => a + th.messages.filter((m) => m.from === 'owner' && !m.read).length, 0)

  return (
    <DashboardShell
      portal="clinic"
      sub={t('Clinic', 'Praxis')}
      accentHue={214}
      user={{ name: 'Dr. Katrin Lehmann', role: t('Owner · Praxis Lehmann', 'Inhaberin · Praxis Lehmann'), hue: 168 }}
      bellCount={pending + unread}
      onBell={() => nav('/clinic/requests')}
      nav={[
        {
          items: [
            { to: '/clinic', label: t('Overview', 'Übersicht'), icon: LayoutDashboard, end: true },
            { to: '/clinic/requests', label: t('Booking requests', 'Terminanfragen'), icon: Inbox, badge: pending },
            { to: '/clinic/calendar', label: t('Calendar', 'Kalender'), icon: CalendarDays },
            { to: '/clinic/patients', label: t('Patients', 'Patienten'), icon: Users },
            { to: '/clinic/messages', label: t('Messages', 'Nachrichten'), icon: MessageSquare, badge: unread },
            { to: '/clinic/reminders', label: t('Reminders', 'Erinnerungen'), icon: BellRing },
          ],
        },
        {
          section: t('Practice', 'Praxis'),
          items: [
            { to: '/clinic/settings', label: t('Hours & services', 'Zeiten & Leistungen'), icon: Settings2 },
            { to: '/clinic/integrations', label: t('Integrations', 'Schnittstellen'), icon: Plug },
            { to: '/clinic/team', label: t('Team & compliance', 'Team & Compliance'), icon: ShieldCheck },
          ],
        },
      ]}
      footer={
        <div className="rounded-2xl bg-brand-soft p-3.5 text-[12px] text-brand">
          <div className="flex items-center gap-1.5 font-semibold"><ShieldCheck size={14} />{t('AVV signed · EU hosted', 'AVV unterzeichnet · EU-Hosting')}</div>
          <div className="mt-0.5 opacity-80">{t('You only see consented records.', 'Sie sehen nur freigegebene Akten.')}</div>
        </div>
      }
    >
      <Routes>
        <Route index element={<Overview />} />
        <Route path="requests" element={<Requests />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientRecord />} />
        <Route path="messages" element={<Messages />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="settings" element={<SettingsView />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="team" element={<Team />} />
        <Route path="*" element={<Navigate to="/clinic" />} />
      </Routes>
    </DashboardShell>
  )
}

/* ================================================================= overview */
function Overview() {
  const { t, tl, fmtDate } = useI18n()
  const { bookings, pet, owner, service, threads } = useClinicData()
  const nav = useNavigate()
  const today = bookings.filter((b) => b.date === isoDay(0) && ['confirmed', 'completed', 'noshow'].includes(b.status)).sort((a, b) => a.time.localeCompare(b.time))
  const pending = bookings.filter((b) => b.status === 'pending')
  const unread = threads.reduce((a, th) => a + th.messages.filter((m) => m.from === 'owner' && !m.read).length, 0)
  const week = [
    { d: t('Mon', 'Mo'), online: 14, phone: 9 }, { d: t('Tue', 'Di'), online: 18, phone: 7 }, { d: t('Wed', 'Mi'), online: 11, phone: 5 },
    { d: t('Thu', 'Do'), online: 21, phone: 6 }, { d: t('Fri', 'Fr'), online: 17, phone: 8 }, { d: t('Sat', 'Sa'), online: 6, phone: 2 },
  ]
  const nowHM = new Date().toTimeString().slice(0, 5)
  return (
    <>
      <PageHeader
        eyebrow={fmtDate(isoDay(0), { weekday: 'long', day: 'numeric', month: 'long' })}
        title={t('Good morning, Dr. Lehmann', 'Guten Morgen, Dr. Lehmann')}
        sub={t(`${today.length} appointments today · ${pending.length} requests waiting for you`, `${today.length} Termine heute · ${pending.length} Anfragen warten auf Sie`)}
        actions={<><Button variant="outline" icon={<BellRing size={16} />} onClick={() => nav('/clinic/reminders')}>{t('Send reminder', 'Erinnerung senden')}</Button><Button icon={<Inbox size={16} />} onClick={() => nav('/clinic/requests')}>{t('Review requests', 'Anfragen prüfen')}</Button></>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('Appointments today', 'Termine heute')} value={today.length + 9} icon={<CalendarCheck2 size={18} />} tone="brand" delta={12} hint={t('vs. last Mon', 'ggü. letztem Mo')} spark={[8, 10, 9, 12, 11, 13, 12]} />
        <StatCard label={t('Open requests', 'Offene Anfragen')} value={pending.length} icon={<Inbox size={18} />} tone="coral" hint={t('avg. response 38 min', 'Ø Antwort 38 Min.')} spark={[3, 5, 2, 4, 6, 3, pending.length]} />
        <StatCard label={t('No-show rate (30 d)', 'No-Show-Quote (30 T)')} value="3.1%" icon={<TrendingDown size={18} />} tone="sage" delta={-38} invert hint={t('since auto reminders', 'seit Auto-Erinnerungen')} spark={[6.2, 5.8, 5.1, 4.4, 3.9, 3.4, 3.1]} />
        <StatCard label={t('Phone calls saved', 'Eingesparte Anrufe')} value="126" icon={<Clock3 size={18} />} tone="sky" delta={24} hint={t('≈ 10.5 h staff time / month', '≈ 10,5 Std. Personalzeit / Monat')} spark={[60, 72, 80, 94, 101, 118, 126]} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">{t('Today’s schedule', 'Heutiger Ablauf')}</h3>
            <button onClick={() => nav('/clinic/calendar')} className="text-sm font-semibold text-brand">{t('Open calendar', 'Kalender öffnen')}</button>
          </div>
          <div className="relative space-y-1">
            {today.map((b) => {
              const p = pet(b.petId)!
              const past = b.time < nowHM
              return (
                <div key={b.id} className={cn('flex items-center gap-4 rounded-2xl px-3 py-2.5 transition hover:bg-muted/60', past && 'opacity-60')}>
                  <div className="w-12 text-sm font-semibold tabular-nums">{b.time}</div>
                  <div className={cn('h-10 w-1 rounded-full', b.status === 'noshow' ? 'bg-berry' : b.status === 'completed' ? 'bg-sage' : 'bg-brand')} />
                  <PetAvatar species={p.species} hue={p.hue} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{p.name} <span className="font-normal text-ink-3">· {p.breed}</span></div>
                    <div className="truncate text-xs text-ink-3">{tl(service(b.serviceId)?.name ?? '')} · {owner(b.ownerId)?.name}</div>
                  </div>
                  <div className="hidden text-xs text-ink-3 sm:block">{b.vet}</div>
                  {b.status === 'completed' ? <Badge tone="sage">{t('Done', 'Erledigt')}</Badge> : b.status === 'noshow' ? <Badge tone="berry">No-show</Badge> : <Badge tone="brand" dot>{t('Confirmed', 'Bestätigt')}</Badge>}
                </div>
              )
            })}
            {[['11:00', 'Balu', 'dog', 40, 'Impfung', 'Tim Koch'], ['12:30', 'Minka', 'cat', 300, 'Zahnkontrolle', 'Ella Fuchs'], ['15:15', 'Hoppel', 'rabbit', 95, 'Krallenpflege', 'Ida Roth']].map(([time, n, sp, h, sv, o]) => (
              <div key={n as string} className={cn('flex items-center gap-4 rounded-2xl px-3 py-2.5 hover:bg-muted/60', (time as string) < nowHM && 'opacity-60')}>
                <div className="w-12 text-sm font-semibold tabular-nums">{time}</div>
                <div className="h-10 w-1 rounded-full bg-ink-3/40" />
                <PetAvatar species={sp as 'dog'} hue={h as number} size={40} />
                <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{n}</div><div className="text-xs text-ink-3">{sv} · {o} · {t('booked by phone', 'telefonisch gebucht')}</div></div>
                <Badge>{t('Phone', 'Telefon')}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{t('Waiting for you', 'Wartet auf Sie')}</h3>
              <Badge tone="coral">{pending.length} {t('new', 'neu')}</Badge>
            </div>
            {pending.length === 0 && <div className="py-6 text-center text-sm text-ink-3">{t('All requests handled 🎉', 'Alle Anfragen bearbeitet 🎉')}</div>}
            {pending.slice(0, 3).map((b) => {
              const p = pet(b.petId)!
              return (
                <button key={b.id} onClick={() => nav('/clinic/requests')} className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left hover:bg-muted/60">
                  <PetAvatar species={p.species} hue={p.hue} size={38} />
                  <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{p.name} · {tl(service(b.serviceId)?.name ?? '')}</div><div className="text-xs text-ink-3">{fmtDate(b.date, { weekday: 'short', day: 'numeric', month: 'short' })} · {b.time}</div></div>
                  <ChevronRight size={16} className="text-ink-3" />
                </button>
              )
            })}
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-muted/60 p-3 text-sm">
              <MessageSquare size={17} className="text-sky" /><span className="flex-1">{t(`${unread} unread messages`, `${unread} ungelesene Nachrichten`)}</span>
              <button onClick={() => nav('/clinic/messages')} className="text-xs font-semibold text-brand">{t('Open', 'Öffnen')}</button>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold">{t('Bookings this week', 'Buchungen diese Woche')}</h3>
            <p className="text-xs text-ink-3">{t('Online via Vetly vs. phone', 'Online über Vetly vs. Telefon')}</p>
            <div className="mt-4 h-44">
              <ResponsiveContainer>
                <BarChart data={week} barGap={4}>
                  <CartesianGrid vertical={false} stroke="rgb(var(--c-line))" strokeDasharray="3 3" />
                  <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'rgb(var(--c-ink-3))' }} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'rgb(var(--c-muted))' }} contentStyle={{ borderRadius: 12, border: '1px solid rgb(var(--c-line))', background: 'rgb(var(--c-surface))', fontSize: 12 }} />
                  <Bar dataKey="online" name="Online" fill="rgb(var(--c-brand))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="phone" name={t('Phone', 'Telefon')} fill="rgb(var(--c-line))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ================================================================= requests */
function Requests() {
  const { t, tl, fmtDate, relTime } = useI18n()
  const { bookings, pet, owner, service, consentFor, s, clinic } = useClinicData()
  const [tab, setTab] = useState<'pending' | 'proposed' | 'all'>('pending')
  const [propose, setPropose] = useState<Booking | null>(null)
  const list = bookings
    .filter((b) => (tab === 'all' ? true : b.status === tab))
    .sort((a, b) => b.createdAt - a.createdAt)
  const statusBadge = (b: Booking) =>
    ({ pending: <Badge tone="coral" dot>{t('New', 'Neu')}</Badge>, proposed: <Badge tone="sun" dot>{t('Waiting for owner', 'Wartet auf Halter')}</Badge>, confirmed: <Badge tone="sage" dot>{t('Confirmed', 'Bestätigt')}</Badge>, declined: <Badge tone="berry">{t('Declined', 'Abgelehnt')}</Badge>, completed: <Badge>{t('Completed', 'Erledigt')}</Badge>, cancelled: <Badge>{t('Cancelled by owner', 'Vom Halter storniert')}</Badge>, noshow: <Badge tone="berry">No-show</Badge> })[b.status]

  return (
    <>
      <PageHeader title={t('Booking requests', 'Terminanfragen')} sub={t('Requests from the Vetly app arrive here in real time. Accept, propose a new time or decline. The owner is notified instantly.', 'Anfragen aus der Vetly-App erscheinen hier in Echtzeit. Annehmen, neue Zeit vorschlagen oder ablehnen. Halter:innen werden sofort benachrichtigt.')} />
      <Segmented
        value={tab} onChange={setTab}
        options={[
          { value: 'pending', label: <>{t('New', 'Neu')} <span className="ml-1 rounded-full bg-coral px-1.5 text-[10px] font-bold text-white">{bookings.filter((b) => b.status === 'pending').length}</span></> },
          { value: 'proposed', label: t('Rescheduled', 'Umgeplant') },
          { value: 'all', label: t('All', 'Alle') },
        ]}
      />
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card col-span-full grid place-items-center py-16 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-sage-soft text-sage"><Check size={26} /></div>
              <div className="mt-3 font-display text-lg font-semibold">{t('Inbox zero', 'Alles erledigt')}</div>
              <div className="mt-1 max-w-sm text-sm text-ink-3">{t('Book an appointment in the owner app and watch it appear here.', 'Buchen Sie in der Halter-App einen Termin und sehen Sie ihn hier erscheinen.')}</div>
            </motion.div>
          )}
          {list.map((b) => {
            const p = pet(b.petId)!
            const o = owner(b.ownerId)
            const sv = service(b.serviceId)
            const cs = consentFor(b.petId)
            const isNew = Date.now() - b.createdAt < 120000
            return (
              <motion.div key={b.id} layout initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className={cn('card relative overflow-hidden p-5', isNew && b.status === 'pending' && 'ring-2 ring-coral/60')}>
                {isNew && b.status === 'pending' && <span className="absolute right-4 top-4 flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-70" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-coral" /></span>}
                <div className="flex items-start gap-4">
                  <PetAvatar species={p.species} hue={p.hue} size={52} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><span className="font-display text-lg font-semibold">{p.name}</span>{statusBadge(b)}</div>
                    <div className="text-sm text-ink-3">{p.breed} · {o?.name} · {t('received', 'eingegangen')} {relTime(b.createdAt)}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-muted/60 p-3 text-sm">
                  <div><div className="text-[11px] text-ink-3">{t('Service', 'Leistung')}</div><div className="truncate font-semibold">{sv ? tl(sv.name) : '—'}</div></div>
                  <div><div className="text-[11px] text-ink-3">{t('Requested', 'Wunschtermin')}</div><div className="font-semibold">{fmtDate(b.date, { weekday: 'short', day: 'numeric', month: 'short' })}</div></div>
                  <div><div className="text-[11px] text-ink-3">{t('Time', 'Uhrzeit')}</div><div className="font-semibold">{b.time} · {sv?.durationMin} min</div></div>
                </div>
                {b.status === 'proposed' && <div className="mt-2 rounded-xl bg-sun-soft px-3 py-2 text-xs text-ink">{t('You proposed', 'Vorgeschlagen')}: <b>{b.proposedDate && fmtDate(b.proposedDate, { weekday: 'short', day: 'numeric', month: 'short' })} · {b.proposedTime}</b></div>}
                {b.note && <div className="mt-3 rounded-xl border-l-4 border-sky bg-sky-soft/60 px-3 py-2 text-sm text-ink">“{b.note}”</div>}
                <div className="mt-3 flex items-center gap-2 text-xs">
                  {cs?.active ? <span className="flex items-center gap-1.5 font-medium text-sage"><ShieldCheck size={14} />{t('Record shared by owner', 'Akte vom Halter freigegeben')}</span> : <span className="flex items-center gap-1.5 font-medium text-ink-3"><Lock size={13} />{t('Record not shared', 'Akte nicht freigegeben')}</span>}
                </div>
                {b.status === 'pending' && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" icon={<Check size={15} />} onClick={() => { s.clinicRespond(b.id, 'accept'); s.toast({ title: t('Confirmed, owner notified ✓', 'Bestätigt, Halter benachrichtigt ✓'), body: `${p.name} · ${b.time}` }) }}>{t('Accept', 'Annehmen')}</Button>
                    <Button size="sm" variant="outline" icon={<CalendarClock size={15} />} onClick={() => setPropose(b)}>{t('Propose new time', 'Neue Zeit vorschlagen')}</Button>
                    <Button size="sm" variant="ghost" icon={<X size={15} />} onClick={() => { s.clinicRespond(b.id, 'decline'); s.toast({ title: t('Request declined', 'Anfrage abgelehnt'), tone: 'coral' }) }}>{t('Decline', 'Ablehnen')}</Button>
                  </div>
                )}
                {b.status === 'confirmed' && daysUntil(b.date) <= 0 && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => s.clinicRespond(b.id, 'complete')}>{t('Mark completed', 'Als erledigt markieren')}</Button>
                    <Button size="sm" variant="ghost" icon={<UserX size={15} />} onClick={() => s.clinicRespond(b.id, 'noshow')}>No-show</Button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      <ProposeModal booking={propose} onClose={() => setPropose(null)} clinicHours={clinic.hours} />
    </>
  )
}

function ProposeModal({ booking, onClose, clinicHours }: { booking: Booking | null; onClose: () => void; clinicHours: ({ open: string; close: string } | null)[] }) {
  const { t, fmtDate } = useI18n()
  const s = useDemo()
  const [date, setDate] = useState(isoDay(2))
  const [time, setTime] = useState('10:00')
  useEffect(() => { if (booking) { setDate(addDays(booking.date, 1)); setTime('10:00') } }, [booking])
  const days = Array.from({ length: 10 }, (_, i) => isoDay(i + 1)).filter((d) => clinicHours[(parseIso(d).getDay() + 6) % 7])
  return (
    <Modal open={!!booking} onClose={onClose} title={t('Propose a new time', 'Neue Zeit vorschlagen')}
      footer={<><Button variant="ghost" onClick={onClose}>{t('Cancel', 'Abbrechen')}</Button><Button onClick={() => { if (booking) { s.clinicRespond(booking.id, 'propose', { date, time }); s.toast({ title: t('New time sent to owner', 'Neue Zeit an Halter gesendet') }) } onClose() }}>{t('Send proposal', 'Vorschlag senden')}</Button></>}
    >
      <div className="label">{t('Day', 'Tag')}</div>
      <div className="flex flex-wrap gap-2">
        {days.map((d) => <button key={d} onClick={() => setDate(d)} className={cn('rounded-xl px-3 py-2 text-sm font-medium', date === d ? 'bg-brand text-brand-fg' : 'bg-muted')}>{fmtDate(d, { weekday: 'short', day: 'numeric', month: 'short' })}</button>)}
      </div>
      <div className="label mt-4">{t('Time', 'Uhrzeit')}</div>
      <div className="grid grid-cols-5 gap-2">
        {['08:30', '09:00', '10:00', '10:30', '11:30', '13:00', '14:00', '15:30', '16:00', '17:00'].map((x) => <button key={x} onClick={() => setTime(x)} className={cn('rounded-xl py-2 text-sm font-semibold', time === x ? 'bg-brand text-brand-fg' : 'bg-muted')}>{x}</button>)}
      </div>
      <p className="mt-4 text-xs text-ink-3">{t('The owner gets a push notification and can accept or decline in the app.', 'Halter:innen erhalten eine Push-Nachricht und können in der App annehmen oder ablehnen.')}</p>
    </Modal>
  )
}

/* ================================================================= calendar */
function CalendarView() {
  const { t, tl, lang } = useI18n()
  const { bookings, pet, service } = useClinicData()
  const [offset, setOffset] = useState(0)
  const monday = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offset * 7)
    return d
  }, [offset])
  const days = Array.from({ length: 6 }, (_, i) => { const d = new Date(monday); d.setDate(d.getDate() + i); return d })
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const hours = Array.from({ length: 11 }, (_, i) => 8 + i)
  const filler = [['Balu', 'dog', 40, 1, '11:00', 2], ['Minka', 'cat', 300, 0, '12:30', 1], ['Hoppel', 'rabbit', 95, 2, '15:00', 1], ['Rex', 'dog', 200, 3, '09:30', 2], ['Coco', 'cat', 20, 4, '13:00', 1], ['Bello', 'dog', 120, 1, '16:30', 1], ['Luna', 'cat', 250, 3, '14:00', 2]] as const
  const ROW = 64
  const top = (time: string) => { const [h, m] = time.split(':').map(Number); return (h - 8 + m / 60) * ROW }
  const items = bookings.filter((b) => ['confirmed', 'pending', 'proposed', 'completed'].includes(b.status))
  return (
    <>
      <PageHeader
        title={t('Calendar', 'Kalender')}
        sub={monday.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { month: 'long', year: 'numeric' })}
        actions={<div className="flex items-center gap-2"><Button size="sm" variant="outline" onClick={() => setOffset(offset - 1)}><ChevronLeft size={16} /></Button><Button size="sm" variant="outline" onClick={() => setOffset(0)}>{t('Today', 'Heute')}</Button><Button size="sm" variant="outline" onClick={() => setOffset(offset + 1)}><ChevronRight size={16} /></Button></div>}
      />
      <div className="mb-3 flex flex-wrap gap-4 text-xs text-ink-2">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-brand" />{t('Confirmed (Vetly)', 'Bestätigt (Vetly)')}</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2 border-dashed border-coral" />{t('Request pending', 'Anfrage offen')}</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-muted ring-1 ring-line" />{t('Phone / PMS', 'Telefon / PVS')}</span>
      </div>
      <div className="card overflow-x-auto">
        <div className="min-w-[860px]">
          <div className="grid grid-cols-[64px_repeat(6,1fr)] border-b border-line">
            <div />
            {days.map((d) => {
              const today = iso(d) === isoDay(0)
              return (
                <div key={d.toISOString()} className="border-l border-line px-3 py-3 text-center">
                  <div className="text-xs font-semibold uppercase text-ink-3">{d.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { weekday: 'short' })}</div>
                  <div className={cn('mx-auto mt-1 grid h-9 w-9 place-items-center rounded-full font-display text-lg font-semibold', today && 'bg-brand text-brand-fg')}>{d.getDate()}</div>
                </div>
              )
            })}
          </div>
          <div className="relative grid grid-cols-[64px_repeat(6,1fr)]">
            <div>{hours.map((h) => <div key={h} style={{ height: ROW }} className="pr-2 pt-1 text-right text-[11px] text-ink-3">{h}:00</div>)}</div>
            {days.map((d, di) => {
              const dIso = iso(d)
              const dayItems = items.filter((b) => (b.status === 'proposed' ? b.proposedDate : b.date) === dIso)
              return (
                <div key={dIso} className="relative border-l border-line">
                  {hours.map((h) => <div key={h} style={{ height: ROW }} className="border-b border-line/50" />)}
                  {offset === 0 && filler.filter((f) => f[3] === di).map((f) => (
                    <div key={f[0]} className="absolute inset-x-1.5 rounded-xl bg-muted px-2 py-1.5 ring-1 ring-line" style={{ top: top(f[4]), height: ROW * 0.5 * f[5] - 4 }}>
                      <div className="truncate text-[11px] font-semibold text-ink-2">{f[4]} {f[0]}</div>
                    </div>
                  ))}
                  {dayItems.map((b) => {
                    const p = pet(b.petId)!
                    const sv = service(b.serviceId)
                    const time = b.status === 'proposed' ? b.proposedTime! : b.time
                    const h = Math.max(ROW * 0.55, ((sv?.durationMin ?? 30) / 60) * ROW) - 4
                    return (
                      <motion.div key={b.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={cn('absolute inset-x-1.5 overflow-hidden rounded-xl px-2 py-1.5', b.status === 'pending' || b.status === 'proposed' ? 'border-2 border-dashed border-coral bg-coral-soft' : b.status === 'completed' ? 'bg-sage-soft' : 'bg-brand text-brand-fg shadow-soft')} style={{ top: top(time), height: h }}>
                        <div className="flex items-center gap-1.5"><PetAvatar species={p.species} hue={p.hue} size={18} /><span className="truncate text-[11.5px] font-semibold">{time} {p.name}</span></div>
                        <div className="truncate text-[10.5px] opacity-80">{sv ? tl(sv.name) : ''}</div>
                      </motion.div>
                    )
                  })}
                  {iso(d) === isoDay(0) && (() => { const n = new Date(); const tp = (n.getHours() - 8 + n.getMinutes() / 60) * ROW; return tp > 0 && tp < ROW * hours.length ? <div className="absolute inset-x-0 z-10 flex items-center" style={{ top: tp }}><span className="-ml-1 h-2.5 w-2.5 rounded-full bg-coral" /><span className="h-0.5 flex-1 bg-coral" /></div> : null })()}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

/* ================================================================= patients */
function Patients() {
  const { t, tl, fmtDate, relDays } = useI18n()
  const { patients, consentFor, owner, s } = useClinicData()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const list = patients.filter((p) => (p.name + p.breed + (owner(p.ownerId)?.name ?? '')).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHeader title={t('Patients', 'Patienten')} sub={t('Records are only visible when the owner has shared them with your practice. Revocations take effect instantly.', 'Akten sind nur sichtbar, wenn Halter:innen sie mit Ihrer Praxis geteilt haben. Widerrufe wirken sofort.')} />
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <input className="input pl-9" placeholder={t('Search name, breed or owner…', 'Name, Rasse oder Halter suchen…')} value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Badge tone="sage" dot>{patients.filter((p) => consentFor(p.id)?.active).length} {t('shared', 'freigegeben')}</Badge>
          <Badge dot>{patients.filter((p) => !consentFor(p.id)?.active).length} {t('locked', 'gesperrt')}</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead><tr className="border-b border-line text-left text-xs font-semibold text-ink-3">
              <th className="px-5 py-3">{t('Patient', 'Patient')}</th><th className="px-3 py-3">{t('Owner', 'Halter:in')}</th><th className="px-3 py-3">{t('Age', 'Alter')}</th><th className="px-3 py-3">{t('Next due', 'Nächste Fälligkeit')}</th><th className="px-3 py-3">{t('Sharing', 'Freigabe')}</th><th />
            </tr></thead>
            <tbody>
              {list.map((p) => {
                const c = consentFor(p.id)
                const ok = !!c?.active
                const next = s.treatments.filter((x) => x.petId === p.id && x.repeat !== 'daily').sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]
                const age = ageFrom(p.birthDate)
                return (
                  <tr key={p.id} onClick={() => ok && nav(`/clinic/patients/${p.id}`)} className={cn('border-b border-line/60 last:border-0', ok ? 'cursor-pointer hover:bg-muted/50' : 'bg-muted/30')}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative"><PetAvatar species={p.species} hue={p.hue} size={40} className={cn(!ok && 'opacity-40 grayscale')} />{!ok && <Lock size={14} className="absolute -bottom-1 -right-1 rounded-full bg-surface p-0.5 text-ink-3" />}</div>
                        <div><div className="font-semibold">{p.name}</div><div className="text-xs text-ink-3">{tl(SPECIES_LABEL[p.species])} · {p.breed}</div></div>
                      </div>
                    </td>
                    <td className="px-3 py-3">{owner(p.ownerId)?.name}</td>
                    <td className="px-3 py-3 text-ink-2">{age.years ? t(`${age.years} y`, `${age.years} J.`) : t(`${age.months} mo`, `${age.months} M.`)}</td>
                    <td className="px-3 py-3">{ok && next ? <div><div className="font-medium">{next.name}</div><div className={`text-xs font-semibold text-${dueTone(next.dueDate)}`}>{relDays(next.dueDate)}</div></div> : <span className="text-ink-3">—</span>}</td>
                    <td className="px-3 py-3">{ok ? <Badge tone="sage" dot>{c?.expiresAt ? t(`until ${fmtDate(c.expiresAt)}`, `bis ${fmtDate(c.expiresAt)}`) : t('Shared', 'Freigegeben')}</Badge> : <Badge><Lock size={10} />{t('Not shared', 'Nicht freigegeben')}</Badge>}</td>
                    <td className="px-5 py-3 text-right">{ok ? <ChevronRight size={16} className="ml-auto text-ink-3" /> : <span className="text-xs text-ink-3">{t('Ask owner in chat', 'Im Chat anfragen')}</span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function PatientRecord() {
  const { id } = useParams()
  const { t, tl, fmtDate, relDays, fmtShort } = useI18n()
  const { pet, owner, consentFor, s } = useClinicData()
  const nav = useNavigate()
  const p = pet(id!)
  const c = consentFor(id!)
  if (!p) return <Navigate to="/clinic/patients" />
  if (!c?.active) {
    return (
      <div className="card mx-auto mt-10 max-w-lg p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-muted text-ink-3"><Lock size={28} /></div>
        <h2 className="mt-4 font-display text-2xl font-semibold">{t('Access revoked', 'Zugriff widerrufen')}</h2>
        <p className="mt-2 text-sm text-ink-2">{t(`${owner(p.ownerId)?.name} is no longer sharing ${p.name}’s record with your practice. The record is hidden immediately; past appointments remain in your own PMS.`, `${owner(p.ownerId)?.name} teilt ${p.name}s Akte nicht mehr mit Ihrer Praxis. Die Akte ist sofort ausgeblendet; vergangene Termine bleiben in Ihrem PVS.`)}</p>
        <Button className="mt-6" variant="outline" onClick={() => nav('/clinic/patients')}>{t('Back to patients', 'Zurück zu Patienten')}</Button>
      </div>
    )
  }
  const ts = s.treatments.filter((x) => x.petId === p.id)
  const docs = s.documents.filter((d) => d.petId === p.id)
  const has = (k: string) => c.scope.includes(k as never)
  const age = ageFrom(p.birthDate)
  return (
    <>
      <button onClick={() => nav('/clinic/patients')} className="mb-4 flex items-center gap-1 text-sm font-medium text-ink-3 hover:text-ink"><ChevronLeft size={16} />{t('Patients', 'Patienten')}</button>
      <div className="card relative overflow-hidden p-6">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-60" style={{ background: `hsl(${p.hue} 70% 92%)` }} />
        <div className="relative flex flex-wrap items-center gap-5">
          <PetAvatar species={p.species} hue={p.hue} size={84} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2"><h1 className="font-display text-3xl font-semibold">{p.name}</h1><Badge tone="sage" dot><ShieldCheck size={11} />{t('Shared by owner', 'Vom Halter freigegeben')}</Badge></div>
            <div className="mt-1 text-sm text-ink-2">{tl(SPECIES_LABEL[p.species])} · {p.breed} · {p.sex === 'm' ? '♂' : '♀'}{p.neutered ? ` · ${t('neutered', 'kastriert')}` : ''} · {t(`${age.years} y ${age.months} m`, `${age.years} J. ${age.months} M.`)} · {p.weightKg} kg</div>
            <div className="mt-1 font-mono text-xs text-ink-3">Chip {p.chip}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" icon={<MessageSquare size={16} />} onClick={() => nav('/clinic/messages')}>{t('Message owner', 'Halter anschreiben')}</Button>
            <Button icon={<BellRing size={16} />} onClick={() => nav(`/clinic/reminders?pet=${p.id}`)}>{t('Send reminder', 'Erinnerung senden')}</Button>
          </div>
        </div>
        <div className="relative mt-5 flex flex-wrap gap-2 text-xs">
          <span className="text-ink-3">{t('Shared scope:', 'Freigegebener Umfang:')}</span>
          {c.scope.map((x) => <Badge key={x} tone="brand">{x}</Badge>)}
          {p.allergies && <Badge tone="berry"><AlertTriangle size={11} />{t('Allergy', 'Allergie')}: {p.allergies}</Badge>}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="card p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">{t('Health record', 'Gesundheitsakte')}</h3>
          {!has('treatments') && !has('vaccinations') ? <Hidden /> : (
            <div className="space-y-2">
              {ts.filter((x) => (x.type === 'vaccination' ? has('vaccinations') : has('treatments'))).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((x) => {
                const m = TYPE_META[x.type]
                return (
                  <div key={x.id} className="flex items-center gap-3 rounded-2xl border border-line/70 p-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl bg-${m.tone}-soft text-${m.tone}`}><m.icon size={18} /></span>
                    <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{x.name}</div><div className="text-xs text-ink-3">{t(m.en, m.de)} · {tl(REPEAT_LABEL[x.repeat])}{x.lastDone ? ` · ${t('last', 'zuletzt')} ${fmtDate(x.lastDone)}` : ''}</div></div>
                    <div className="text-right"><div className="text-sm font-medium">{fmtDate(x.dueDate)}</div><div className={`text-xs font-semibold text-${dueTone(x.dueDate)}`}>{relDays(x.dueDate)}</div></div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="mb-3 font-display text-lg font-semibold">{t('Weight', 'Gewicht')}</h3>
            {!has('weight') ? <Hidden /> : (
              <div className="flex h-24 items-end gap-1.5">
                {p.weightHistory.map((w) => {
                  const min = Math.min(...p.weightHistory.map((x) => x.kg)) * 0.9
                  const max = Math.max(...p.weightHistory.map((x) => x.kg))
                  return <div key={w.date} title={`${fmtShort(w.date)}: ${w.kg} kg`} className="flex-1 rounded-t-md bg-brand/70" style={{ height: `${((w.kg - min) / (max - min || 1)) * 80 + 20}%` }} />
                })}
              </div>
            )}
          </div>
          <div className="card p-6">
            <h3 className="mb-3 font-display text-lg font-semibold">{t('Documents', 'Dokumente')}</h3>
            {!has('documents') ? <Hidden /> : docs.length === 0 ? <div className="text-sm text-ink-3">—</div> : (
              <div className="grid grid-cols-2 gap-2">
                {docs.map((d) => (
                  <div key={d.id} className="overflow-hidden rounded-xl ring-1 ring-line"><div className="h-20"><DocThumb kind={d.kind} category={d.category} dataUrl={d.dataUrl} /></div><div className="truncate p-2 text-xs font-semibold">{d.title}</div></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-3"><FileText size={13} />{t('Every view of this record is written to the audit log, visible to the owner on request.', 'Jeder Aufruf dieser Akte wird im Audit-Log protokolliert und ist für Halter:innen einsehbar.')}</p>
    </>
  )
}

function Hidden() {
  const { t } = useI18n()
  return <div className="flex items-center gap-2 rounded-2xl bg-muted/60 p-4 text-sm text-ink-3"><Lock size={15} />{t('Not included in the owner’s sharing scope', 'Nicht im Freigabe-Umfang enthalten')}</div>
}

/* ================================================================= messages */
function Messages() {
  const { t, fmtTime, relTime } = useI18n()
  const { threads, owner, pet, s } = useClinicData()
  const sorted = [...threads].sort((a, b) => (b.messages.at(-1)?.at ?? 0) - (a.messages.at(-1)?.at ?? 0))
  const [active, setActive] = useState(sorted[0]?.id)
  const th = threads.find((x) => x.id === active)
  const [text, setText] = useState('')
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { if (active) s.markThreadRead(active, 'clinic') }, [active, th?.messages.length]) // eslint-disable-line
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [th?.messages.length, active])
  const send = (txt = text) => {
    if (!txt.trim() || !th) return
    s.sendMessage(th.id, 'clinic', txt.trim(), undefined, 'Dr. Katrin Lehmann')
    setText('')
  }
  const templates = [
    t('Thanks for your message, we’ll get back to you today.', 'Danke für Ihre Nachricht, wir melden uns heute noch.'),
    t('Please book a check-up so we can take a look.', 'Bitte buchen Sie eine Untersuchung, damit wir es uns ansehen können.'),
    t('This sounds urgent. Please call us right away: +49 30 4402 1180.', 'Das klingt dringend. Bitte rufen Sie uns sofort an: +49 30 4402 1180.'),
  ]
  return (
    <>
      <PageHeader title={t('Messages', 'Nachrichten')} sub={t('Owners see a permanent “not for emergencies” notice. Urgent cases are redirected to the phone.', 'Halter:innen sehen einen dauerhaften „Kein Notfall-Chat“-Hinweis. Dringende Fälle werden ans Telefon verwiesen.')} />
      <div className="card grid h-[calc(100vh-260px)] min-h-[520px] overflow-hidden md:grid-cols-[320px_1fr]">
        <div className="hidden overflow-y-auto border-r border-line md:block">
          {sorted.map((x) => {
            const o = owner(x.ownerId)
            const p = pet(x.petId)
            const last = x.messages.at(-1)
            const unread = x.messages.filter((m) => m.from === 'owner' && !m.read).length
            return (
              <button key={x.id} onClick={() => setActive(x.id)} className={cn('flex w-full items-start gap-3 border-b border-line/60 p-4 text-left transition', active === x.id ? 'bg-brand-soft/50' : 'hover:bg-muted/50')}>
                <div className="relative"><Initials name={o?.name ?? '?'} hue={p?.hue} size={40} />{p && <PetAvatar species={p.species} hue={p.hue} size={20} className="absolute -bottom-1 -right-1 ring-2 ring-surface" />}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2"><span className="truncate text-sm font-semibold">{o?.name}</span><span className="shrink-0 text-[11px] text-ink-3">{last && relTime(last.at)}</span></div>
                  <div className="truncate text-xs font-medium text-ink-2">{x.subject}</div>
                  <div className={cn('truncate text-xs', unread ? 'font-semibold text-ink' : 'text-ink-3')}>{last?.attachment && '📎 '}{last?.text}</div>
                </div>
                {unread > 0 && <span className="mt-1 grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">{unread}</span>}
              </button>
            )
          })}
        </div>
        {th ? (
          <div className="flex min-h-0 flex-col">
            <div className="flex items-center gap-3 border-b border-line px-5 py-3">
              <Initials name={owner(th.ownerId)?.name ?? ''} size={36} hue={pet(th.petId)?.hue} />
              <div className="flex-1"><div className="text-sm font-semibold">{owner(th.ownerId)?.name}</div><div className="text-xs text-ink-3">{th.subject}</div></div>
              <select className="input w-auto md:hidden" value={active} onChange={(e) => setActive(e.target.value)}>{sorted.map((x) => <option key={x.id} value={x.id}>{owner(x.ownerId)?.name}</option>)}</select>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-5">
              {th.messages.map((m) => {
                const mine = m.from === 'clinic'
                return (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[70%] rounded-2xl px-4 py-2.5 shadow-soft', mine ? 'rounded-br-md bg-brand text-brand-fg' : 'rounded-bl-md bg-surface ring-1 ring-line/60')}>
                      {mine && m.author && <div className="mb-0.5 text-[11px] font-semibold opacity-75">{m.author}</div>}
                      {m.attachment && (m.attachment.kind === 'image' && m.attachment.dataUrl ? <img src={m.attachment.dataUrl} className="mb-1.5 max-h-48 rounded-xl" alt="" /> : <div className={cn('mb-1.5 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold', mine ? 'bg-white/15' : 'bg-muted')}><Paperclip size={14} />{m.attachment.name}</div>)}
                      <div className="text-sm">{m.text}</div>
                      <div className={cn('mt-1 flex items-center justify-end gap-1 text-[10px]', mine ? 'opacity-70' : 'text-ink-3')}>{fmtTime(m.at)}{mine && <CheckCheck size={12} />}</div>
                    </div>
                  </motion.div>
                )
              })}
              <div ref={end} />
            </div>
            <div className="border-t border-line p-3">
              <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto">
                {templates.map((x) => <button key={x} onClick={() => setText(x)} className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs text-ink-2 hover:bg-brand-soft hover:text-brand">{x.slice(0, 42)}…</button>)}
              </div>
              <div className="flex gap-2">
                <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-ink-2"><Paperclip size={18} /></button>
                <input className="input h-11" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder={t('Reply…', 'Antworten…')} />
                <Button onClick={() => send()} icon={<SendHorizonal size={16} />}>{t('Send', 'Senden')}</Button>
              </div>
            </div>
          </div>
        ) : <div className="grid place-items-center text-ink-3">—</div>}
      </div>
    </>
  )
}

/* ================================================================ reminders */
function Reminders() {
  const { t, fmtDate } = useI18n()
  const { patients, consentFor, owner, s } = useClinicData()
  const shared = patients.filter((p) => consentFor(p.id)?.active)
  const pre = new URLSearchParams(window.location.search).get('pet')
  const [petId, setPetId] = useState(pre && shared.some((p) => p.id === pre) ? pre : shared[0]?.id)
  const templates = [
    { id: 'vacc', title: t('Vaccination due', 'Impfung fällig'), body: t('{pet}’s booster is due soon. Book directly in the app, we have slots this week.', 'Bei {pet} steht bald die Auffrischungsimpfung an. Buchen Sie direkt in der App, wir haben diese Woche Termine frei.') },
    { id: 'annual', title: t('Annual health check', 'Jährlicher Gesundheitscheck'), body: t('It’s been almost a year since {pet}’s last check-up. Prevention is the best medicine!', 'Der letzte Check-up von {pet} ist fast ein Jahr her. Vorsorge ist die beste Medizin!') },
    { id: 'dental', title: t('Dental check', 'Zahnkontrolle'), body: t('Dental health matters: time for {pet}’s dental check.', 'Zahngesundheit ist wichtig: Zeit für die Zahnkontrolle von {pet}.') },
    { id: 'follow', title: t('Follow-up', 'Nachkontrolle'), body: t('How is {pet} doing? Please book a short follow-up visit.', 'Wie geht es {pet}? Bitte vereinbaren Sie eine kurze Nachkontrolle.') },
  ]
  const [tpl, setTpl] = useState(templates[0].id)
  const T = templates.find((x) => x.id === tpl)!
  const pet = s.pets.find((p) => p.id === petId)
  const [body, setBody] = useState(T.body)
  const [due, setDue] = useState(isoDay(14))
  useEffect(() => setBody(T.body), [tpl, t]) // eslint-disable-line
  const rendered = body.replace(/\{pet\}/g, pet?.name ?? '')
  const [rules, setRules] = useState({ vacc: true, appt: true, follow: true, birthday: false })
  return (
    <>
      <PageHeader title={t('Reminders', 'Erinnerungen')} sub={t('Send a reminder straight into the owner’s app, or let Vetly automate them.', 'Senden Sie Erinnerungen direkt in die App der Halter:innen oder lassen Sie Vetly automatisieren.')} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold">{t('New reminder', 'Neue Erinnerung')}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">{t('Patient (shared records only)', 'Patient (nur freigegebene)')}</label>
              <select className="input" value={petId} onChange={(e) => setPetId(e.target.value)}>
                {shared.map((p) => <option key={p.id} value={p.id}>{p.name} · {owner(p.ownerId)?.name}</option>)}
              </select>
            </div>
            <div><label className="label">{t('Due date (added to record)', 'Fällig am (in Akte)')}</label><input type="date" className="input" value={due} onChange={(e) => setDue(e.target.value)} /></div>
          </div>
          <label className="label mt-4">{t('Template', 'Vorlage')}</label>
          <div className="flex flex-wrap gap-2">{templates.map((x) => <button key={x.id} onClick={() => setTpl(x.id)} className={cn('rounded-xl px-3 py-2 text-sm font-medium', tpl === x.id ? 'bg-brand text-brand-fg' : 'bg-muted text-ink-2')}>{x.title}</button>)}</div>
          <label className="label mt-4">{t('Message', 'Nachricht')}</label>
          <textarea className="input min-h-[110px]" value={body} onChange={(e) => setBody(e.target.value)} />
          <div className="mt-5 flex justify-end">
            <Button icon={<SendHorizonal size={16} />} onClick={() => { if (petId) { s.clinicSendReminder(petId, T.title, rendered, due); s.toast({ title: t('Reminder delivered ✓', 'Erinnerung zugestellt ✓'), body: `${pet?.name} · ${owner(pet?.ownerId ?? '')?.name}` }) } }}>{t('Send to owner’s app', 'An die App senden')}</Button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="card grid place-items-center bg-gradient-to-br from-brand-soft to-muted/40 p-6">
            <div className="eyebrow mb-3">{t('Preview on the owner’s phone', 'Vorschau am Handy')}</div>
            <div className="w-full max-w-sm rounded-[22px] bg-surface/90 p-3.5 shadow-float ring-1 ring-black/5 backdrop-blur">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-brand text-sm font-bold text-brand-fg">V</span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-[11px] text-ink-3"><span className="font-semibold uppercase">Vetly</span>{t('now', 'jetzt')}</div>
                  <div className="text-[13.5px] font-semibold">Praxis Lehmann: {T.title}</div>
                  <div className="text-[12.5px] text-ink-2">{rendered}</div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-ink-3">{t('Due', 'Fällig')} {fmtDate(due)} · {t('respects owner’s quiet hours', 'beachtet Ruhezeiten')}</div>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold">{t('Automations', 'Automatisierungen')}</h3>
            <div className="mt-3 divide-y divide-line/70">
              {[
                ['vacc', t('Vaccination due', 'Impfung fällig'), t('14 days before, then 3 days before', '14 Tage vorher, dann 3 Tage vorher')],
                ['appt', t('Appointment reminder', 'Terminerinnerung'), t('24 h before, cuts no-shows', '24 Std. vorher, senkt No-Shows')],
                ['follow', t('Post-visit follow-up', 'Nachsorge nach Besuch'), t('3 days after treatment', '3 Tage nach Behandlung')],
                ['birthday', t('Pet birthday greeting 🎂', 'Geburtstagsgruß 🎂'), t('Builds loyalty', 'Stärkt die Bindung')],
              ].map(([k, l, d]) => (
                <div key={k} className="flex items-center gap-3 py-3">
                  <div className="flex-1"><div className="text-sm font-semibold">{l}</div><div className="text-xs text-ink-3">{d}</div></div>
                  <Switch checked={rules[k as keyof typeof rules]} onChange={(v) => setRules({ ...rules, [k]: v })} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ================================================================= settings */
function SettingsView() {
  const { t, tl, lang } = useI18n()
  const { clinic, s } = useClinicData()
  const days = lang === 'de' ? ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'] : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return (
    <>
      <PageHeader title={t('Hours & services', 'Zeiten & Leistungen')} sub={t('Changes are live in the owner app immediately: booking slots and the clinic profile update in real time.', 'Änderungen sind sofort in der Halter-App sichtbar: Buchungszeiten und Praxisprofil aktualisieren sich in Echtzeit.')} />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold">{t('Opening hours', 'Öffnungszeiten')}</h3>
          <div className="mt-4 space-y-2">
            {clinic.hours.map((h, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-2.5">
                <div className="w-28 text-sm font-medium">{days[i]}</div>
                <Switch size="sm" checked={!!h} onChange={(v) => s.setHours(clinic.id, i, v ? { open: '09:00', close: '17:00' } : null)} />
                {h ? (
                  <div className="flex flex-1 items-center gap-2">
                    <input type="time" className="input h-9 w-28 py-1" value={h.open} onChange={(e) => s.setHours(clinic.id, i, { ...h, open: e.target.value })} />
                    <span className="text-ink-3">–</span>
                    <input type="time" className="input h-9 w-28 py-1" value={h.close} onChange={(e) => s.setHours(clinic.id, i, { ...h, close: e.target.value })} />
                  </div>
                ) : <div className="flex-1 text-sm text-ink-3">{t('Closed', 'Geschlossen')}</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold">{t('Bookable services', 'Buchbare Leistungen')}</h3>
          <div className="mt-4 divide-y divide-line/70">
            {clinic.services.map((x) => {
              const Icon = SVC_ICON[x.icon] ?? Stethoscope
              return (
                <div key={x.id} className="flex items-center gap-3 py-3">
                  <span className={cn('grid h-10 w-10 place-items-center rounded-xl', x.enabled ? 'bg-brand-soft text-brand' : 'bg-muted text-ink-3')}><Icon size={18} /></span>
                  <div className="flex-1"><div className={cn('text-sm font-semibold', !x.enabled && 'text-ink-3')}>{tl(x.name)}</div><div className="text-xs text-ink-3">{x.durationMin} min · {t('from', 'ab')} {x.priceFrom} € (GOT)</div></div>
                  <Switch checked={x.enabled} onChange={() => s.toggleService(clinic.id, x.id)} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

/* ============================================================= integrations */
function Integrations() {
  const { t } = useI18n()
  const s = useDemo()
  const items = [
    { name: 'Provet Cloud', vendor: 'Nordhealth', status: 'api', note: t('Public REST API with an official partner program. Best first integration: appointments, patients and vaccinations sync.', 'Öffentliche REST-API mit offiziellem Partnerprogramm. Beste erste Integration: Termine, Patienten und Impfungen synchronisieren.') },
    { name: 'VETERA', vendor: 'VetZ GmbH', status: 'partner', note: t('Has a booking interface that third-party online booking tools already use. Requires a partner agreement with the vendor.', 'Besitzt eine Termin-Schnittstelle, die Online-Buchungstools bereits nutzen. Partnervertrag mit dem Hersteller nötig.') },
    { name: 'easyVET', vendor: 'IFS', status: 'inquiry', note: t('No public API documentation found. Vendor inquiry needed; interim: calendar (iCal) and CSV sync.', 'Keine öffentliche API-Dokumentation gefunden. Herstelleranfrage nötig; übergangsweise Kalender- (iCal) und CSV-Abgleich.') },
    { name: 'vetpraxis.de', vendor: 'vetpraxis', status: 'inquiry', note: t('Ships its own online booking; open API not confirmed. Check with vendor.', 'Hat eigene Online-Buchung; offene API nicht bestätigt. Beim Hersteller prüfen.') },
    { name: t('Any PMS: universal sync', 'Jedes PVS: Universal-Sync'), vendor: 'Vetly', status: 'live', note: t('Works today with every clinic: iCal feed into the PMS calendar + CSV patient import. No vendor dependency for launch.', 'Funktioniert heute mit jeder Praxis: iCal-Feed in den PVS-Kalender + CSV-Patientenimport. Keine Abhängigkeit vom Hersteller zum Start.') },
  ]
  const meta: Record<string, { tone: 'sage' | 'brand' | 'sun' | 'sky'; label: string }> = {
    api: { tone: 'sage', label: t('API available', 'API verfügbar') },
    partner: { tone: 'sky', label: t('Partner program', 'Partnerprogramm') },
    inquiry: { tone: 'sun', label: t('Vendor inquiry', 'Herstelleranfrage') },
    live: { tone: 'brand', label: t('Ready at launch', 'Ab Start verfügbar') },
  }
  return (
    <>
      <PageHeader title={t('Practice software integrations', 'Praxissoftware-Schnittstellen')} sub={t('Status based on our research (Nov 2026). Integrations are a Phase 2 item; the universal sync makes Vetly useful for every clinic from day one.', 'Stand unserer Recherche (Nov. 2026). Integrationen sind Teil von Phase 2; der Universal-Sync macht Vetly ab Tag 1 für jede Praxis nutzbar.')} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((x) => (
          <div key={x.name} className="card flex flex-col p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-muted font-display text-lg font-semibold">{x.name[0]}</span>
              <div className="flex-1"><div className="font-semibold">{x.name}</div><div className="text-xs text-ink-3">{x.vendor}</div></div>
              <Badge tone={meta[x.status].tone} dot>{meta[x.status].label}</Badge>
            </div>
            <p className="mt-3 flex-1 text-sm text-ink-2">{x.note}</p>
            <Button className="mt-4" size="sm" variant={x.status === 'live' ? 'primary' : 'outline'} onClick={() => s.toast({ title: x.status === 'live' ? t('iCal feed URL copied', 'iCal-Feed-URL kopiert') : t('Request noted for Phase 2', 'Für Phase 2 vorgemerkt') })}>
              {x.status === 'live' ? t('Copy iCal feed', 'iCal-Feed kopieren') : t('Request connection', 'Verbindung anfragen')}
            </Button>
          </div>
        ))}
      </div>
    </>
  )
}

/* ===================================================================== team */
function Team() {
  const { t } = useI18n()
  const team = [
    ['Dr. Katrin Lehmann', t('Owner · Vet', 'Inhaberin · Tierärztin'), 'Admin', true],
    ['Dr. Tobias Engel', t('Vet', 'Tierarzt'), t('Vet', 'Tierarzt'), true],
    ['Dr. Aylin Demir', t('Vet', 'Tierärztin'), t('Vet', 'Tierarzt'), true],
    ['Julia Werner', t('Front desk', 'Empfang'), t('Reception', 'Empfang'), false],
  ] as const
  return (
    <>
      <PageHeader title={t('Team & compliance', 'Team & Compliance')} actions={<Button icon={<Users size={16} />}>{t('Invite member', 'Mitglied einladen')}</Button>} />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-line text-left text-xs text-ink-3"><th className="px-5 py-3">{t('Member', 'Mitglied')}</th><th className="px-3 py-3">{t('Role', 'Rolle')}</th><th className="px-3 py-3">2FA</th></tr></thead>
            <tbody>
              {team.map(([n, r, role, mfa]) => (
                <tr key={n} className="border-b border-line/60 last:border-0">
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><Initials name={n} size={34} /><div><div className="font-semibold">{n}</div><div className="text-xs text-ink-3">{r}</div></div></div></td>
                  <td className="px-3 py-3"><Badge tone={role === 'Admin' ? 'plum' : 'neutral'}>{role}</Badge></td>
                  <td className="px-3 py-3">{mfa ? <Badge tone="sage" dot>{t('On', 'Aktiv')}</Badge> : <Badge tone="sun" dot>{t('Pending', 'Ausstehend')}</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          {[
            [FileSignature, t('Data processing agreement (AVV)', 'Auftragsverarbeitungsvertrag (AVV)'), t('Signed digitally on 12 Mar 2026 · v1.2', 'Digital unterzeichnet am 12.03.2026 · v1.2'), 'sage'],
            [ShieldCheck, t('Hosting region', 'Hosting-Region'), 'EU · Frankfurt am Main', 'brand'],
            [Lock, t('Access model', 'Zugriffsmodell'), t('Consent-based, row-level security, every view logged', 'Einwilligungsbasiert, Row-Level-Security, jeder Zugriff protokolliert'), 'plum'],
          ].map(([I, l, d, tone]) => {
            const Icon = I as typeof Lock
            return (
              <div key={l as string} className="card flex items-center gap-4 p-5">
                <span className={`grid h-11 w-11 place-items-center rounded-xl bg-${tone}-soft text-${tone}`}><Icon size={20} /></span>
                <div className="flex-1"><div className="text-sm font-semibold">{l as string}</div><div className="text-xs text-ink-3">{d as string}</div></div>
                <Check size={18} className="text-sage" />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
