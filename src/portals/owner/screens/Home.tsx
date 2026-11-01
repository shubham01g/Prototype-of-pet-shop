import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CalendarPlus, Check, ChevronRight, Clock3, FilePlus2, Flame, Lightbulb, MapPin, Plus, QrCode, Syringe } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PetAvatar, SPECIES_LABEL } from '@/components/illustrations'
import { Badge, Button, Ring, Sheet } from '@/components/ui'
import { useI18n } from '@/i18n'
import { ageFrom, cn, daysUntil } from '@/lib/utils'
import { REPEAT_LABEL, useDemo } from '@/store/useDemoStore'
import { ME } from '@/data/seed'
import type { Treatment } from '@/data/types'
import { FadeIn, TYPE_META, dueTone, healthScore } from '../kit'
import { useNav } from '../nav'
import { AddTreatmentSheet, UploadSheet } from './Pets'

export default function HomeScreen() {
  const { t, tl, relDays, fmtWeekday, fmtShort, lang } = useI18n()
  const s = useDemo()
  const nav = useNav()
  const pets = s.pets.filter((p) => p.ownerId === ME)
  const pet = pets.find((p) => p.id === s.activePetId) ?? pets[0]
  const ts = s.treatments.filter((x) => x.petId === pet?.id)
  const score = healthScore(ts)
  const due = useMemo(() => ts.filter((x) => daysUntil(x.dueDate) <= 30).sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [ts])
  const unread = s.notifications.filter((n) => n.ownerId === ME && !n.read).length
  const nextAppt = s.bookings
    .filter((b) => b.ownerId === ME && ['confirmed', 'pending', 'proposed'].includes(b.status) && daysUntil(b.proposedDate ?? b.date) >= 0)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0]
  const apptClinic = s.clinics.find((c) => c.id === nextAppt?.clinicId)
  const apptPet = s.pets.find((p) => p.id === nextAppt?.petId)
  const apptSvc = apptClinic?.services.find((x) => x.id === nextAppt?.serviceId)
  const [sel, setSel] = useState<Treatment | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [upOpen, setUpOpen] = useState(false)
  const hour = new Date().getHours()
  const greet = hour < 11 ? t('Good morning', 'Guten Morgen') : hour < 18 ? t('Hello', 'Hallo') : t('Good evening', 'Guten Abend')

  if (!pet) return null
  const age = ageFrom(pet.birthDate)

  return (
    <div className="min-h-full pb-32">
      {/* header */}
      <div className="flex items-center justify-between px-5 pt-2">
        <div>
          <div className="text-[13px] text-ink-3">{new Date().toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <div className="font-display text-[26px] font-semibold leading-tight">{greet}, Lena</div>
        </div>
        <button onClick={() => nav.push({ name: 'notifications' })} className="relative grid h-11 w-11 place-items-center rounded-full bg-surface shadow-soft ring-1 ring-line/60 active:scale-95">
          <Bell size={20} />
          {unread > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-coral ring-2 ring-surface" />}
        </button>
      </div>

      {/* pet switcher */}
      <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto px-5 pb-1">
        {pets.map((p) => (
          <button key={p.id} onClick={() => s.setActivePet(p.id)} className="flex shrink-0 flex-col items-center gap-1.5">
            <div className={cn('rounded-[30%] p-[3px] transition', p.id === pet.id ? 'bg-gradient-to-br from-brand to-coral' : 'bg-transparent')}>
              <PetAvatar species={p.species} hue={p.hue} size={54} className="ring-2 ring-canvas" />
            </div>
            <span className={cn('text-xs font-semibold', p.id === pet.id ? 'text-ink' : 'text-ink-3')}>{p.name}</span>
          </button>
        ))}
        <button onClick={() => nav.push({ name: 'addPet' })} className="flex shrink-0 flex-col items-center gap-1.5">
          <div className="grid h-[60px] w-[60px] place-items-center rounded-[30%] border-2 border-dashed border-line text-ink-3"><Plus size={22} /></div>
          <span className="text-xs font-semibold text-ink-3">{t('Add', 'Neu')}</span>
        </button>
      </div>

      {/* hero card */}
      <AnimatePresence mode="wait">
        <motion.div key={pet.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-5 pt-4">
          <button onClick={() => nav.push({ name: 'pet', id: pet.id })} className="relative w-full overflow-hidden rounded-[28px] bg-brand p-5 text-left text-brand-fg shadow-[0_20px_40px_-18px_rgb(var(--c-brand)/0.7)] active:scale-[0.99]">
            <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-coral/30 blur-xl" />
            <div className="relative flex items-center gap-4">
              <PetAvatar species={pet.species} hue={pet.hue} size={64} className="ring-4 ring-white/20" />
              <div className="min-w-0 flex-1">
                <div className="font-display text-2xl font-semibold">{pet.name}</div>
                <div className="truncate text-[13px] opacity-75">{pet.breed}</div>
                <div className="mt-1.5 flex flex-wrap gap-1 whitespace-nowrap text-[11px] font-semibold">
                  <span className="rounded-full bg-white/15 px-2 py-0.5">{age.years > 0 ? t(`${age.years} yrs`, `${age.years} J.`) : t(`${age.months} mo`, `${age.months} Mon.`)}</span>
                  <span className="rounded-full bg-white/15 px-2 py-0.5">{pet.weightKg.toLocaleString(lang === 'de' ? 'de-DE' : 'en-GB')} kg</span>
                  <span className="rounded-full bg-white/15 px-2 py-0.5">{tl(SPECIES_LABEL[pet.species])}</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <Ring value={score} size={64} stroke={6} color="#fff" track="rgba(255,255,255,.18)">
                  <span className="font-display text-lg font-semibold">{score}</span>
                </Ring>
                <span className="mt-1 text-[10px] font-semibold opacity-75">{t('Health score', 'Gesundheit')}</span>
              </div>
            </div>
          </button>
        </motion.div>
      </AnimatePresence>

      {/* streak */}
      <FadeIn delay={0.05} className="px-5 pt-3">
        <div className="flex items-center gap-3 rounded-3xl bg-surface p-3.5 shadow-soft ring-1 ring-line/60">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-coral-soft text-coral"><Flame size={22} /></span>
          <div className="flex-1">
            <div className="text-[14px] font-semibold">{t(`${s.streakWeeks}-week care streak`, `${s.streakWeeks} Wochen Pflege-Serie`)}</div>
            <div className="text-[12px] text-ink-3">{t('Everything on time. Keep it going!', 'Alles pünktlich. Weiter so!')}</div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => <span key={i} className={cn('h-6 w-2 rounded-full', i < 6 ? 'bg-coral' : 'bg-coral/25')} />)}
          </div>
        </div>
      </FadeIn>

      {/* appointment */}
      {nextAppt && apptClinic && (
        <FadeIn delay={0.08} className="px-5 pt-3">
          <button onClick={() => nav.push({ name: 'appointments' })} className="flex w-full items-center gap-3.5 rounded-3xl bg-surface p-3.5 text-left shadow-soft ring-1 ring-line/60">
            <div className="grid w-14 shrink-0 place-items-center rounded-2xl bg-sky-soft py-2 text-sky">
              <div className="text-[10px] font-bold uppercase">{fmtWeekday(nextAppt.proposedDate ?? nextAppt.date)}</div>
              <div className="font-display text-xl font-semibold leading-none">{(nextAppt.proposedDate ?? nextAppt.date).slice(8)}</div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[14px] font-semibold">{apptSvc ? tl(apptSvc.name) : ''} · {apptPet?.name}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink-3"><Clock3 size={12} />{nextAppt.proposedTime ?? nextAppt.time} · {apptClinic.short}</div>
              <div className="mt-1.5">
                {nextAppt.status === 'confirmed' && <Badge tone="sage" dot>{t('Confirmed', 'Bestätigt')}</Badge>}
                {nextAppt.status === 'pending' && <Badge tone="sun" dot>{t('Waiting for clinic', 'Wartet auf Praxis')}</Badge>}
                {nextAppt.status === 'proposed' && <Badge tone="coral" dot>{t('New time proposed, tap to respond', 'Neue Zeit vorgeschlagen, antippen')}</Badge>}
              </div>
            </div>
            <ChevronRight size={18} className="text-ink-3" />
          </button>
        </FadeIn>
      )}

      {/* due soon */}
      <FadeIn delay={0.1} className="px-5 pt-6">
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{t('Coming up', 'Demnächst')}</h3>
          <button onClick={() => nav.push({ name: 'pet', id: pet.id })} className="text-[13px] font-semibold text-brand">{t('See all', 'Alle')}</button>
        </div>
        {due.length === 0 && (
          <div className="flex items-center gap-3 rounded-3xl bg-sage-soft p-4 text-sage">
            <Check size={20} /> <span className="text-sm font-medium">{t(`All caught up for ${pet.name}!`, `Für ${pet.name} ist alles erledigt!`)}</span>
          </div>
        )}
        <div className="space-y-2">
          {due.map((x, i) => {
            const m = TYPE_META[x.type]
            const tone = dueTone(x.dueDate)
            return (
              <motion.button
                key={x.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}
                onClick={() => setSel(x)}
                className="flex w-full items-center gap-3 rounded-2xl bg-surface p-3 text-left shadow-soft ring-1 ring-line/60 active:scale-[0.99]"
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-${m.tone}-soft text-${m.tone}`}><m.icon size={18} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{x.name}</span>
                  <span className="block text-[12px] text-ink-3">{t(m.en, m.de)} · {tl(REPEAT_LABEL[x.repeat])}</span>
                </span>
                <span className={`rounded-full bg-${tone}-soft px-2.5 py-1 text-[11px] font-bold text-${tone}`}>{relDays(x.dueDate)}</span>
              </motion.button>
            )
          })}
        </div>
      </FadeIn>

      {/* quick actions */}
      <FadeIn delay={0.14} className="px-5 pt-6">
        <h3 className="mb-2.5 font-display text-lg font-semibold">{t('Quick actions', 'Schnellzugriff')}</h3>
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { icon: CalendarPlus, l: t('Book vet', 'Termin'), tone: 'brand', go: () => nav.setTab('book') },
            { icon: Syringe, l: t('Add entry', 'Eintrag'), tone: 'plum', go: () => setAddOpen(true) },
            { icon: FilePlus2, l: t('Upload', 'Upload'), tone: 'sun', go: () => setUpOpen(true) },
            { icon: QrCode, l: t('Passport', 'Tierpass'), tone: 'coral', go: () => nav.push({ name: 'passport', petId: pet.id }) },
          ].map((a) => (
            <motion.button key={a.l} whileTap={{ scale: 0.94 }} onClick={a.go} className="flex flex-col items-center gap-2 rounded-2xl bg-surface py-3.5 shadow-soft ring-1 ring-line/60">
              <span className={`grid h-10 w-10 place-items-center rounded-xl bg-${a.tone}-soft text-${a.tone}`}><a.icon size={19} /></span>
              <span className="text-[11.5px] font-semibold">{a.l}</span>
            </motion.button>
          ))}
        </div>
      </FadeIn>

      {/* tip */}
      <FadeIn delay={0.18} className="px-5 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-sun-soft p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface text-sun"><Lightbulb size={18} /></span>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-sun">{t('Tip of the week', 'Tipp der Woche')}</div>
              <div className="mt-1 text-[13.5px] font-medium leading-snug text-ink">
                {pet.species === 'rabbit'
                  ? t('Rabbits need a yearly RHD-2 vaccination, even indoor rabbits. The virus travels on shoes and hay.', 'Kaninchen brauchen jährlich die RHD-2-Impfung, auch Wohnungskaninchen. Das Virus kommt über Schuhe und Heu.')
                  : pet.species === 'cat'
                    ? t('Indoor cats still need worming 1–4× a year, depending on hunting and contact.', 'Auch Wohnungskatzen brauchen 1–4× jährlich eine Entwurmung, je nach Jagd und Kontakt.')
                    : t('Tick season in Germany runs March to November. Keep protection active.', 'Zeckensaison in Deutschland: März bis November. Schutz aktiv halten.')}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.2} className="px-5 pt-3">
        <button onClick={() => nav.setTab('book')} className="flex w-full items-center gap-3 rounded-3xl bg-surface p-3.5 text-left shadow-soft ring-1 ring-line/60">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-berry-soft text-berry"><MapPin size={18} /></span>
          <span className="flex-1"><span className="block text-[14px] font-semibold">{t('24/7 emergency clinic nearby', '24/7-Notdienst in der Nähe')}</span><span className="text-[12px] text-ink-3">Kleintierklinik an der Spree · 2,4 km</span></span>
          <ChevronRight size={18} className="text-ink-3" />
        </button>
      </FadeIn>

      <DueSheet item={sel} onClose={() => setSel(null)} />
      <AddTreatmentSheet open={addOpen} onClose={() => setAddOpen(false)} petId={pet.id} />
      <UploadSheet open={upOpen} onClose={() => setUpOpen(false)} petId={pet.id} />
    </div>
  )
}

export function DueSheet({ item, onClose }: { item: Treatment | null; onClose: () => void }) {
  const { t, tl, fmtDate, relDays } = useI18n()
  const s = useDemo()
  const nav = useNav()
  const live = item ? s.treatments.find((x) => x.id === item.id) ?? item : null
  if (!live) return <Sheet open={false} onClose={onClose}>{null}</Sheet>
  const m = TYPE_META[live.type]
  const clinic = s.clinics.find((c) => c.id === live.fromClinic)
  return (
    <Sheet open={!!item} onClose={onClose}>
      <div className="flex items-center gap-3 pt-2">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-${m.tone}-soft text-${m.tone}`}><m.icon size={22} /></span>
        <div className="flex-1">
          <div className="font-display text-xl font-semibold">{live.name}</div>
          <div className="text-[13px] text-ink-3">{t(m.en, m.de)} · {tl(REPEAT_LABEL[live.repeat])}</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-muted/70 p-3"><div className="text-[11px] text-ink-3">{t('Due', 'Fällig')}</div><div className="mt-0.5 text-[14px] font-semibold">{fmtDate(live.dueDate)}</div><div className={`text-[12px] font-semibold text-${dueTone(live.dueDate)}`}>{relDays(live.dueDate)}</div></div>
        <div className="rounded-2xl bg-muted/70 p-3"><div className="text-[11px] text-ink-3">{t('Last done', 'Zuletzt')}</div><div className="mt-0.5 text-[14px] font-semibold">{live.lastDone ? fmtDate(live.lastDone) : '—'}</div>{clinic && <div className="text-[12px] text-ink-3">{clinic.short}</div>}</div>
      </div>
      {live.notes && <div className="mt-2.5 rounded-2xl bg-muted/70 p-3 text-[13px] text-ink-2">📝 {live.notes}</div>}
      <div className="mt-2.5 flex items-center justify-between rounded-2xl bg-muted/70 p-3">
        <div><div className="text-[14px] font-semibold">{t('Reminder', 'Erinnerung')}</div><div className="text-[12px] text-ink-3">{live.remindDaysBefore ? t(`${live.remindDaysBefore} days before`, `${live.remindDaysBefore} Tage vorher`) : t('On the day, 08:00', 'Am Tag, 08:00')}</div></div>
        <button onClick={() => s.toggleReminder(live.id)} className={cn('rounded-full px-3 py-1.5 text-xs font-semibold', live.reminder ? 'bg-brand text-brand-fg' : 'bg-line text-ink-2')}>{live.reminder ? t('On', 'An') : t('Off', 'Aus')}</button>
      </div>
      {live.history.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-[13px] font-semibold text-ink-2">{t('History', 'Verlauf')}</div>
          <div className="space-y-1.5">
            {live.history.slice(0, 4).map((h) => <div key={h} className="flex items-center gap-2 text-[13px] text-ink-2"><Check size={14} className="text-sage" />{fmtDate(h)}</div>)}
          </div>
        </div>
      )}
      <div className="mt-6 grid gap-2.5">
        <Button size="lg" icon={<Check size={18} />} onClick={() => { s.markDone(live.id); s.toast({ title: t('Marked as done ✓', 'Als erledigt markiert ✓'), body: live.repeat !== 'none' ? t('Next date calculated automatically.', 'Nächster Termin automatisch berechnet.') : undefined }); onClose() }}>
          {t('Mark as done today', 'Heute erledigt')}
        </Button>
        {['vaccination', 'checkup'].includes(live.type) && (
          <Button size="lg" variant="secondary" icon={<CalendarPlus size={18} />} onClick={() => { onClose(); nav.push({ name: 'booking', clinicId: 'c1', serviceId: live.type === 'vaccination' ? 's-vacc' : 's-check' }) }}>
            {t('Book at the vet', 'Beim Tierarzt buchen')}
          </Button>
        )}
      </div>
    </Sheet>
  )
}
