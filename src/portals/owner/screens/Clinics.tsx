import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarCheck2, Check, ChevronRight, Clock3, ExternalLink, Globe2, HeartPulse, Leaf, MapPin, MessageCircle, Phone, Scan, Scissors, Search, Siren, Smile,
  Star, Stethoscope, Syringe, TestTube, X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { CityMap, PetAvatar } from '@/components/illustrations'
import { Badge, Button } from '@/components/ui'
import { useI18n } from '@/i18n'
import { cn, isoDay, parseIso, seeded } from '@/lib/utils'
import { useDemo } from '@/store/useDemoStore'
import { ME } from '@/data/seed'
import type { Clinic } from '@/data/types'
import { Chip, ScreenHeader } from '../kit'
import { useNav } from '../nav'

export const SVC_ICON: Record<string, React.ElementType> = {
  syringe: Syringe, stethoscope: Stethoscope, smile: Smile, 'test-tube': TestTube, leaf: Leaf, scissors: Scissors, 'heart-pulse': HeartPulse, siren: Siren, scan: Scan,
}

const dayIdx = (d: Date) => (d.getDay() + 6) % 7

export function openState(c: Clinic, lang: 'en' | 'de') {
  const now = new Date()
  const h = c.hours[dayIdx(now)]
  const hm = now.toTimeString().slice(0, 5)
  if (c.hours.every((x) => x?.open === '00:00' && x?.close === '24:00')) return { open: true, label: lang === 'de' ? 'Rund um die Uhr geöffnet' : 'Open 24/7' }
  if (h && hm >= h.open && hm < h.close) return { open: true, label: lang === 'de' ? `Geöffnet · bis ${h.close}` : `Open · closes ${h.close}` }
  for (let i = 1; i <= 7; i++) {
    const nx = c.hours[(dayIdx(now) + i) % 7]
    if (h && hm < h.open && i === 1) return { open: false, label: lang === 'de' ? `Geschlossen · öffnet ${h.open}` : `Closed · opens ${h.open}` }
    if (nx) return { open: false, label: lang === 'de' ? `Geschlossen · öffnet ${i === 1 ? 'morgen' : ''} ${nx.open}` : `Closed · opens ${i === 1 ? 'tomorrow' : ''} ${nx.open}` }
  }
  return { open: false, label: lang === 'de' ? 'Geschlossen' : 'Closed' }
}

/* =================================================================== search */
export function ClinicSearch() {
  const { t, lang } = useI18n()
  const s = useDemo()
  const nav = useNav()
  const pet = s.pets.find((p) => p.id === s.activePetId)
  const [q, setQ] = useState('')
  const [f, setF] = useState({ open: false, emergency: false, species: false })
  const [active, setActive] = useState<string>('c1')
  const list = s.clinics
    .filter((c) => (q ? (c.name + c.district).toLowerCase().includes(q.toLowerCase()) : true))
    .filter((c) => (f.open ? openState(c, lang).open : true))
    .filter((c) => (f.emergency ? c.emergency : true))
    .filter((c) => (f.species && pet ? c.species.includes(pet.species) : true))
    .sort((a, b) => a.distanceKm - b.distanceKm)

  return (
    <div className="min-h-full pb-32">
      <div className="relative h-[300px]">
        <CityMap
          className="h-full w-full"
          me={{ x: 44, y: 22 + 46 * 0.74 }}
          pins={list.map((c) => ({ id: c.id, x: c.x, y: 24 + c.y * 0.72, label: c.short, hue: c.hue, emergency: c.emergency, muted: !c.onVetly }))}
          active={active}
          onPin={(id) => { setActive(id); document.getElementById(`cl-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}
        />
        <div className="absolute inset-x-4 top-3">
          <div className="flex items-center gap-2.5 rounded-2xl bg-surface/95 px-3.5 shadow-lift backdrop-blur">
            <Search size={17} className="text-ink-3" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Search clinics or districts', 'Praxis oder Bezirk suchen')} className="h-12 flex-1 bg-transparent text-[14.5px] outline-none placeholder:text-ink-3" />
            {q && <button onClick={() => setQ('')}><X size={16} className="text-ink-3" /></button>}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-canvas to-transparent" />
      </div>

      <div className="no-scrollbar -mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        <Chip active={f.open} onClick={() => setF({ ...f, open: !f.open })}><Clock3 size={13} />{t('Open now', 'Jetzt geöffnet')}</Chip>
        <Chip active={f.emergency} onClick={() => setF({ ...f, emergency: !f.emergency })}><Siren size={13} />{t('24/7 emergency', '24/7 Notdienst')}</Chip>
        {pet && <Chip active={f.species} onClick={() => setF({ ...f, species: !f.species })}><PetAvatar species={pet.species} hue={pet.hue} size={16} />{t(`Treats ${pet.name}`, `Für ${pet.name}`)}</Chip>}
      </div>

      <div className="mt-3 flex items-center justify-between px-5">
        <h2 className="font-display text-lg font-semibold">{t(`${list.length} clinics nearby`, `${list.length} Praxen in der Nähe`)}</h2>
        <span className="flex items-center gap-1 text-[12px] text-ink-3"><MapPin size={12} />Prenzlauer Berg</span>
      </div>

      <div className="mt-3 space-y-3 px-4">
        {list.map((c) => {
          const st = openState(c, lang)
          return (
            <motion.button
              id={`cl-${c.id}`} key={c.id} layout onClick={() => (c.id === active ? nav.push({ name: 'clinic', id: c.id }) : setActive(c.id))}
              className={cn('w-full rounded-3xl bg-surface p-4 text-left shadow-soft ring-1 transition', c.id === active ? 'ring-2 ring-brand' : 'ring-line/60')}
            >
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg font-bold text-white" style={{ background: c.emergency ? 'rgb(var(--c-berry))' : `linear-gradient(135deg, hsl(${c.hue} 50% 48%), hsl(${c.hue + 30} 50% 38%))` }}>
                  {c.emergency ? <Siren size={20} /> : c.short[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5"><span className="truncate text-[15px] font-semibold">{c.name}</span></div>
                  <div className="mt-0.5 flex items-center gap-2 text-[12.5px] text-ink-3">
                    <span className="flex items-center gap-0.5 font-semibold text-ink"><Star size={12} className="fill-sun text-sun" />{c.rating}</span>
                    <span>({c.reviews})</span>·<span>{c.distanceKm.toLocaleString(lang === 'de' ? 'de-DE' : 'en-GB')} km</span>·<span className="truncate">{c.district}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge tone={st.open ? 'sage' : 'neutral'} dot>{st.label}</Badge>
                    {c.emergency && <Badge tone="berry">{t('Emergency', 'Notdienst')}</Badge>}
                    {!c.onVetly && <Badge tone="neutral">{t('Phone booking only', 'Nur telefonisch')}</Badge>}
                  </div>
                </div>
                <ChevronRight size={18} className="mt-3 text-ink-3" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* =================================================================== detail */
export function ClinicDetail({ id }: { id: string }) {
  const { t, tl, lang } = useI18n()
  const s = useDemo()
  const nav = useNav()
  const c = s.clinics.find((x) => x.id === id)
  if (!c) return null
  const st = openState(c, lang)
  const days = lang === 'de' ? ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const today = dayIdx(new Date())
  const existing = s.threads.find((th) => th.clinicId === c.id && th.ownerId === ME)
  return (
    <div className="min-h-full pb-32">
      <div className="relative h-44 overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(${c.hue} 45% 42%), hsl(${c.hue + 40} 50% 30%))` }}>
        <div className="absolute inset-0 bg-grain opacity-30" />
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="relative text-white [&_button]:text-white"><ScreenHeader transparent /></div>
      </div>
      <div className="relative -mt-12 px-4">
        <div className="rounded-3xl bg-surface p-5 shadow-lift ring-1 ring-line/60">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h1 className="font-display text-[22px] font-semibold leading-tight">{c.name}</h1>
              <div className="mt-1 text-[13px] text-ink-3">{c.street}, {c.district}</div>
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-sun-soft px-2 py-1 text-[13px] font-bold text-sun"><Star size={13} className="fill-sun" />{c.rating}</div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge tone={st.open ? 'sage' : 'neutral'} dot>{st.label}</Badge>
            <Badge><MapPin size={11} />{c.distanceKm.toLocaleString(lang === 'de' ? 'de-DE' : 'en-GB')} km</Badge>
            <Badge><Globe2 size={11} />{c.languages.join(' · ')}</Badge>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: CalendarCheck2, l: t('Book', 'Buchen'), go: () => c.onVetly && nav.push({ name: 'booking', clinicId: c.id }), dis: !c.onVetly },
              { icon: MessageCircle, l: 'Chat', go: () => (existing ? nav.push({ name: 'thread', id: existing.id }) : nav.push({ name: 'newThread' })), dis: !c.onVetly },
              { icon: Phone, l: t('Call', 'Anrufen'), go: () => s.toast({ title: c.phone, body: t('Would open the phone dialer', 'Würde die Telefon-App öffnen') }) },
            ].map((a) => (
              <button key={a.l} disabled={a.dis} onClick={a.go} className="flex flex-col items-center gap-1.5 rounded-2xl bg-muted/70 py-3 text-[12px] font-semibold disabled:opacity-40 active:scale-95">
                <a.icon size={19} className="text-brand" />{a.l}
              </button>
            ))}
          </div>
        </div>

        {!c.onVetly && (
          <div className="mt-3 rounded-2xl bg-sky-soft p-3.5 text-[13px] text-sky">
            {t('This clinic isn’t on Vetly yet. Tap “Invite” and we’ll reach out, since owner demand is our best clinic acquisition channel.', 'Diese Praxis ist noch nicht bei Vetly. Tippen Sie „Einladen“, dann melden wir uns. Nachfrage von Haltern ist unser bester Akquise-Kanal.')}
            <Button size="sm" variant="outline" className="mt-2.5" onClick={() => s.toast({ title: t('Thanks! We’ll invite this clinic.', 'Danke! Wir laden die Praxis ein.') })}>{t('Invite clinic', 'Praxis einladen')}</Button>
          </div>
        )}

        <h3 className="mb-2 mt-6 px-1 font-display text-lg font-semibold">{t('Services', 'Leistungen')}</h3>
        <div className="overflow-hidden rounded-2xl bg-surface shadow-soft ring-1 ring-line/60">
          {c.services.filter((x) => x.enabled).map((x) => {
            const Icon = SVC_ICON[x.icon] ?? Stethoscope
            return (
              <button key={x.id} disabled={!c.onVetly} onClick={() => nav.push({ name: 'booking', clinicId: c.id, serviceId: x.id })} className="flex w-full items-center gap-3 px-4 py-3 text-left [&+&]:border-t [&+&]:border-line/60">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand"><Icon size={17} /></span>
                <span className="flex-1"><span className="block text-[14px] font-medium">{tl(x.name)}</span><span className="text-[12px] text-ink-3">{x.durationMin} min · {t('from', 'ab')} {x.priceFrom} €</span></span>
                {c.onVetly && <ChevronRight size={17} className="text-ink-3" />}
              </button>
            )
          })}
        </div>
        <p className="mt-2 px-1 text-[11px] text-ink-3">{t('Prices per GOT (German vet fee schedule), single rate. Paid at the clinic.', 'Preise nach GOT, einfacher Satz. Bezahlung in der Praxis.')}</p>

        <h3 className="mb-2 mt-6 px-1 font-display text-lg font-semibold">{t('Opening hours', 'Öffnungszeiten')}</h3>
        <div className="rounded-2xl bg-surface p-2 shadow-soft ring-1 ring-line/60">
          {c.hours.map((h, i) => (
            <div key={i} className={cn('flex items-center justify-between rounded-xl px-3 py-2 text-[13.5px]', i === today && 'bg-brand-soft font-semibold text-brand')}>
              <span>{days[i]}</span>
              <span className={cn(!h && 'text-ink-3')}>{h ? (h.open === '00:00' && h.close === '24:00' ? '24 h' : `${h.open} – ${h.close}`) : t('Closed', 'Geschlossen')}</span>
            </div>
          ))}
        </div>

        <h3 className="mb-2 mt-6 px-1 font-display text-lg font-semibold">{t('Team', 'Team')}</h3>
        <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4">
          {c.vets.map((v, i) => (
            <div key={v} className="w-32 shrink-0 rounded-2xl bg-surface p-3 text-center shadow-soft ring-1 ring-line/60">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full text-sm font-bold text-white" style={{ background: `hsl(${(c.hue + i * 50) % 360} 45% 50%)` }}>{v.replace('Dr. ', '').split(' ').map((p) => p[0]).join('')}</div>
              <div className="mt-2 text-[12px] font-semibold leading-tight">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ================================================================== booking */
function slotsFor(c: Clinic, iso: string) {
  const h = c.hours[dayIdx(parseIso(iso))]
  if (!h) return []
  const [oh, om] = h.open.split(':').map(Number)
  let [ch, cm] = h.close.split(':').map(Number)
  if (ch === 24) { ch = 20; cm = 0 }
  const start = Math.max(oh * 60 + om, 8 * 60)
  const end = ch * 60 + cm - 30
  const rnd = seeded(parseInt(iso.replace(/-/g, '')) + c.hue)
  const out: { time: string; free: boolean }[] = []
  for (let m = start; m <= end; m += 30) {
    const time = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
    out.push({ time, free: rnd() > 0.38 })
  }
  if (iso === isoDay(0)) {
    const nowM = new Date().getHours() * 60 + new Date().getMinutes() + 60
    return out.map((x) => ({ ...x, free: x.free && parseInt(x.time) * 60 + parseInt(x.time.slice(3)) > nowM }))
  }
  return out
}

export function BookingFlow({ clinicId, serviceId }: { clinicId: string; serviceId?: string }) {
  const { t, tl, lang, fmtDate } = useI18n()
  const s = useDemo()
  const nav = useNav()
  const c = s.clinics.find((x) => x.id === clinicId)!
  const pets = s.pets.filter((p) => p.ownerId === ME)
  const [step, setStep] = useState(serviceId ? 1 : 0)
  const [petId, setPetId] = useState(s.activePetId)
  const [svc, setSvc] = useState(serviceId)
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => isoDay(i + 1)), [])
  const service = c.services.find((x) => x.id === svc)
  const pet = pets.find((p) => p.id === petId)
  const slots = date ? slotsFor(c, date) : []

  const steps = [t('Pet', 'Tier'), t('Service', 'Leistung'), t('Time', 'Termin'), t('Review', 'Prüfen')]
  const canNext = [!!petId, !!svc, !!date && !!time, true][step]

  const send = () => {
    s.createBooking({ petId, clinicId, serviceId: svc!, date: date!, time: time!, note })
    setSent(true)
  }

  if (sent) return <BookingSent clinic={c} date={date!} time={time!} />

  return (
    <div className="flex flex-1 flex-col pb-8">
      <ScreenHeader title={c.short} onBack={step > 0 && !(serviceId && step === 1) ? () => setStep(step - 1) : undefined} />
      <div className="px-5">
        <div className="flex gap-1.5">
          {steps.map((l, i) => (
            <div key={l} className="flex-1">
              <div className="h-1 overflow-hidden rounded-full bg-line"><motion.div className="h-full bg-brand" animate={{ width: i <= step ? '100%' : '0%' }} /></div>
              <div className={cn('mt-1.5 text-[11px] font-semibold', i <= step ? 'text-brand' : 'text-ink-3')}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }} className="flex-1 px-5 pt-5">
          {step === 0 && (
            <>
              <h2 className="font-display text-2xl font-semibold">{t('Who is the appointment for?', 'Für wen ist der Termin?')}</h2>
              <div className="mt-4 space-y-2.5">
                {pets.map((p) => (
                  <button key={p.id} onClick={() => setPetId(p.id)} className={cn('flex w-full items-center gap-3 rounded-2xl border-2 bg-surface p-3 text-left transition', petId === p.id ? 'border-brand' : 'border-transparent ring-1 ring-line')}>
                    <PetAvatar species={p.species} hue={p.hue} size={48} />
                    <span className="flex-1"><span className="block text-[15px] font-semibold">{p.name}</span><span className="text-[12.5px] text-ink-3">{p.breed}</span></span>
                    <Radio on={petId === p.id} />
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="font-display text-2xl font-semibold">{t('What do you need?', 'Was wird benötigt?')}</h2>
              <div className="mt-4 space-y-2.5">
                {c.services.filter((x) => x.enabled).map((x) => {
                  const Icon = SVC_ICON[x.icon] ?? Stethoscope
                  return (
                    <button key={x.id} onClick={() => setSvc(x.id)} className={cn('flex w-full items-center gap-3 rounded-2xl border-2 bg-surface p-3 text-left transition', svc === x.id ? 'border-brand' : 'border-transparent ring-1 ring-line')}>
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand"><Icon size={18} /></span>
                      <span className="flex-1"><span className="block text-[14.5px] font-semibold">{tl(x.name)}</span><span className="text-[12px] text-ink-3">{x.durationMin} min · {t('from', 'ab')} {x.priceFrom} €</span></span>
                      <Radio on={svc === x.id} />
                    </button>
                  )
                })}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="font-display text-2xl font-semibold">{t('Pick a time', 'Zeit wählen')}</h2>
              <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
                {days.map((d) => {
                  const closed = !c.hours[dayIdx(parseIso(d))]
                  const dt = parseIso(d)
                  return (
                    <button key={d} disabled={closed} onClick={() => { setDate(d); setTime(undefined) }} className={cn('flex w-[58px] shrink-0 flex-col items-center rounded-2xl py-2.5 transition disabled:opacity-30', date === d ? 'bg-brand text-brand-fg shadow-lift' : 'bg-surface ring-1 ring-line')}>
                      <span className="text-[11px] font-semibold uppercase opacity-70">{dt.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { weekday: 'short' })}</span>
                      <span className="font-display text-xl font-semibold">{dt.getDate()}</span>
                      <span className="text-[10px] opacity-60">{dt.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { month: 'short' })}</span>
                    </button>
                  )
                })}
              </div>
              {!date && <div className="mt-8 text-center text-[13px] text-ink-3">{t('Choose a day to see free slots', 'Tag wählen, um freie Zeiten zu sehen')}</div>}
              {date && (
                <>
                  <div className="mb-2 mt-5 text-[13px] font-semibold text-ink-2">{fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((x) => (
                      <button key={x.time} disabled={!x.free} onClick={() => setTime(x.time)} className={cn('rounded-xl py-2.5 text-[13.5px] font-semibold transition disabled:text-ink-3/50 disabled:line-through', time === x.time ? 'bg-brand text-brand-fg' : 'bg-surface ring-1 ring-line disabled:bg-muted/50 disabled:ring-0')}>
                        {x.time}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          {step === 3 && service && pet && date && time && (
            <>
              <h2 className="font-display text-2xl font-semibold">{t('Almost done', 'Fast geschafft')}</h2>
              <div className="mt-4 overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-line/60">
                <div className="flex items-center gap-3 border-b border-dashed border-line p-4">
                  <PetAvatar species={pet.species} hue={pet.hue} size={46} />
                  <div className="flex-1"><div className="text-[15px] font-semibold">{pet.name}</div><div className="text-[12.5px] text-ink-3">{tl(service.name)} · {service.durationMin} min</div></div>
                </div>
                <div className="space-y-2.5 p-4 text-[13.5px]">
                  <div className="flex justify-between"><span className="text-ink-3">{t('Clinic', 'Praxis')}</span><span className="font-semibold">{c.short}</span></div>
                  <div className="flex justify-between"><span className="text-ink-3">{t('Date', 'Datum')}</span><span className="font-semibold">{fmtDate(date, { weekday: 'short', day: 'numeric', month: 'long' })}</span></div>
                  <div className="flex justify-between"><span className="text-ink-3">{t('Time', 'Uhrzeit')}</span><span className="font-semibold">{time}</span></div>
                  <div className="flex justify-between"><span className="text-ink-3">{t('Est. price', 'Preis ca.')}</span><span className="font-semibold">{t('from', 'ab')} {service.priceFrom} €</span></div>
                </div>
              </div>
              <label className="label mt-5">{t('Note for the clinic (optional)', 'Notiz an die Praxis (optional)')}</label>
              <textarea className="input min-h-[88px] resize-none" placeholder={t('e.g. symptoms, questions…', 'z. B. Symptome, Fragen…')} value={note} onChange={(e) => setNote(e.target.value)} />
              <div className="mt-3 flex items-start gap-2 rounded-2xl bg-sky-soft p-3 text-[12px] text-sky">
                <Check size={15} className="mt-0.5 shrink-0" />
                {t(`${pet.name}’s vaccination record is shared with this clinic (consent given). You can change this anytime.`, `${pet.name}s Impfdaten sind für diese Praxis freigegeben. Jederzeit änderbar.`)}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="sticky bottom-0 bg-gradient-to-t from-canvas via-canvas to-transparent px-5 pb-2 pt-5">
        {step < 3 ? (
          <Button block size="lg" disabled={!canNext} onClick={() => setStep(step + 1)}>{t('Continue', 'Weiter')}</Button>
        ) : (
          <Button block size="lg" onClick={send} icon={<CalendarCheck2 size={18} />}>{t('Send request', 'Anfrage senden')}</Button>
        )}
      </div>
    </div>
  )
}

function Radio({ on }: { on: boolean }) {
  return <span className={cn('grid h-6 w-6 place-items-center rounded-full border-2 transition', on ? 'border-brand bg-brand text-brand-fg' : 'border-line')}>{on && <Check size={13} strokeWidth={3} />}</span>
}

function BookingSent({ clinic, date, time }: { clinic: Clinic; date: string; time: string }) {
  const { t, fmtDate } = useI18n()
  const nav = useNav()
  const embed = new URLSearchParams(window.location.search).has('embed')
  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-10 pt-20 text-center">
      <div className="relative">
        <motion.span className="absolute inset-0 rounded-full bg-brand/20" initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 1.2, repeat: 2 }} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} className="relative grid h-24 w-24 place-items-center rounded-full bg-brand text-brand-fg shadow-lift">
          <motion.svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.5 }} />
          </motion.svg>
        </motion.div>
      </div>
      <h2 className="mt-8 font-display text-[28px] font-semibold leading-tight">{t('Request sent!', 'Anfrage gesendet!')}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
        {t(`${clinic.short} will confirm your appointment on ${fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long' })} at ${time}. You’ll get a push notification.`,
          `${clinic.short} bestätigt Ihren Termin am ${fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long' })} um ${time} Uhr. Sie erhalten eine Push-Nachricht.`)}
      </p>
      <div className="mt-6 w-full rounded-2xl bg-sun-soft p-4 text-left">
        <div className="text-[11px] font-bold uppercase tracking-wider text-sun">{t('Demo', 'Demo')}</div>
        <div className="mt-1 text-[13px] text-ink">{embed ? t('Now accept it in the clinic dashboard on the right →', 'Jetzt rechts im Praxis-Dashboard annehmen →') : t('Open the clinic dashboard to accept this request. The phone will get the push instantly.', 'Öffnen Sie das Praxis-Dashboard und nehmen Sie die Anfrage an. Das Handy erhält sofort die Push-Nachricht.')}</div>
        {!embed && <a href="/clinic/requests" target="_blank" rel="noreferrer" className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand">{t('Open clinic dashboard', 'Praxis-Dashboard öffnen')}<ExternalLink size={13} /></a>}
      </div>
      <div className="flex-1" />
      <div className="mt-8 grid w-full gap-2.5">
        <Button size="lg" block onClick={() => { nav.setTab('home') }}>{t('Done', 'Fertig')}</Button>
        <Button size="lg" variant="ghost" block onClick={() => { nav.setTab('profile'); nav.push({ name: 'appointments' }) }}>{t('View my appointments', 'Meine Termine')}</Button>
      </div>
    </div>
  )
}
