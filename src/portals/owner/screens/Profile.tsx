import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell, BellRing, Building2, CalendarDays, Check, ChevronRight, Download, FileText, Globe2, KeyRound, Lock, LogOut, MessageCircle, Moon, ScanFace, Scale, ServerCog,
  Share2, ShieldCheck, Smartphone, Trash2, Umbrella, User, X,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { LogoMark, PetAvatar, SPECIES_LABEL } from '@/components/illustrations'
import { Badge, Button, Segmented, Sheet, Switch } from '@/components/ui'
import { useI18n } from '@/i18n'
import { addDays, cn, daysUntil, isoDay } from '@/lib/utils'
import { useDemo } from '@/store/useDemoStore'
import { ME } from '@/data/seed'
import type { ConsentScope } from '@/data/types'
import { LEGAL } from '@/portals/legal/content'
import { Chip, FadeIn, Group, Row, ScreenHeader, TYPE_META } from '../kit'
import { useNav } from '../nav'

/* ================================================================== profile */
export function Profile() {
  const { t } = useI18n()
  const s = useDemo()
  const nav = useNav()
  const pets = s.pets.filter((p) => p.ownerId === ME)
  const upcoming = s.bookings.filter((b) => b.ownerId === ME && ['confirmed', 'pending', 'proposed'].includes(b.status)).length
  return (
    <div className="min-h-full px-5 pb-32">
      <h1 className="pt-3 font-display text-[30px] font-semibold">{t('Profile', 'Profil')}</h1>
      <FadeIn>
        <button onClick={() => nav.push({ name: 'account' })} className="mt-4 flex w-full items-center gap-4 rounded-3xl bg-surface p-4 text-left shadow-soft ring-1 ring-line/60">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-coral to-sun text-lg font-bold text-white">LH</div>
          <div className="flex-1">
            <div className="text-[16px] font-semibold">Lena Hoffmann</div>
            <div className="text-[12.5px] text-ink-3">lena.hoffmann@example.de</div>
            <div className="mt-1.5 flex -space-x-1.5">{pets.map((p) => <PetAvatar key={p.id} species={p.species} hue={p.hue} size={22} className="ring-2 ring-surface" />)}</div>
          </div>
          <ChevronRight size={18} className="text-ink-3" />
        </button>
      </FadeIn>

      {s.deletionRequested && (
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-berry-soft p-3.5 text-berry">
          <Trash2 size={18} />
          <div className="flex-1 text-[12.5px] font-medium">{t('Account scheduled for deletion in 30 days.', 'Konto wird in 30 Tagen gelöscht.')}</div>
          <button onClick={() => useDemo.setState((st) => ({ deletionRequested: false, owners: st.owners.map((o) => (o.id === ME ? { ...o, status: 'active' } : o)) }))} className="text-[12px] font-bold underline">{t('Undo', 'Rückgängig')}</button>
        </div>
      )}

      <Group title={t('App', 'App')}>
        <Row icon={<Globe2 size={18} />} iconTone="sky" title={t('Language', 'Sprache')} chevron={false} right={<Segmented size="sm" value={s.lang} onChange={s.setLang} options={[{ value: 'de', label: 'DE' }, { value: 'en', label: 'EN' }]} />} />
        <Row icon={<Moon size={18} />} iconTone="plum" title={t('Dark mode', 'Dunkelmodus')} chevron={false} right={<Switch checked={s.theme === 'dark'} onChange={s.toggleTheme} />} />
        <Row icon={<BellRing size={18} />} iconTone="coral" title={t('Reminders & notifications', 'Erinnerungen & Mitteilungen')} onClick={() => nav.push({ name: 'reminders' })} />
        <Row icon={<CalendarDays size={18} />} iconTone="brand" title={t('My appointments', 'Meine Termine')} right={upcoming ? <Badge tone="brand">{upcoming}</Badge> : undefined} onClick={() => nav.push({ name: 'appointments' })} />
      </Group>

      <Group title={t('Privacy & data', 'Datenschutz & Daten')}>
        <Row icon={<ShieldCheck size={18} />} iconTone="sage" title={t('Privacy & consent center', 'Datenschutz-Center')} sub={t('Who can see your pets’ records', 'Wer die Akten Ihrer Tiere sieht')} onClick={() => nav.push({ name: 'privacy' })} />
        <Row icon={<ServerCog size={18} />} iconTone="neutral" title={t('Data location', 'Datenstandort')} chevron={false} right={<span className="text-[12.5px] font-semibold text-ink-2">EU · Frankfurt</span>} />
      </Group>

      <Group title={t('Legal', 'Rechtliches')}>
        <Row icon={<FileText size={18} />} title="Impressum" onClick={() => nav.push({ name: 'legal', doc: 'impressum' })} />
        <Row icon={<Lock size={18} />} title={t('Privacy policy', 'Datenschutzerklärung')} onClick={() => nav.push({ name: 'legal', doc: 'privacy' })} />
        <Row icon={<FileText size={18} />} title={t('Terms of use', 'Nutzungsbedingungen')} onClick={() => nav.push({ name: 'legal', doc: 'terms' })} />
      </Group>

      <Group>
        <Row icon={<LogOut size={18} />} iconTone="berry" danger title={t('Sign out', 'Abmelden')} chevron={false} onClick={() => { s.setSignedIn(false); nav.reset() }} />
      </Group>
      <div className="mt-6 flex flex-col items-center gap-1 text-[11px] text-ink-3"><LogoMark size={22} /><span>Vetly 1.0.0 (prototype)</span></div>
    </div>
  )
}

/* ================================================================== account */
export function Account() {
  const { t } = useI18n()
  return (
    <div className="min-h-full px-5 pb-16">
      <ScreenHeader title={t('Account', 'Konto')} />
      <Group title={t('Personal data', 'Persönliche Daten')}>
        <Row icon={<User size={18} />} title="Lena Hoffmann" sub={t('Name', 'Name')} chevron={false} />
        <Row icon={<MessageCircle size={18} />} title="lena.hoffmann@example.de" sub={t('E-mail · verified', 'E-Mail · bestätigt')} chevron={false} right={<Check size={16} className="text-sage" />} />
      </Group>
      <Group title={t('Security', 'Sicherheit')}>
        <Row icon={<ScanFace size={18} />} iconTone="brand" title="Face ID" chevron={false} right={<Switch checked onChange={() => {}} />} />
        <Row icon={<KeyRound size={18} />} iconTone="neutral" title={t('Sign-in methods', 'Login-Methoden')} sub="Apple · Magic Link" chevron={false} />
      </Group>
      <Group title={t('Devices', 'Geräte')}>
        <Row icon={<Smartphone size={18} />} title="iPhone 16 · iOS 26" sub={t('This device · Berlin', 'Dieses Gerät · Berlin')} chevron={false} right={<Badge tone="sage" dot>{t('Active', 'Aktiv')}</Badge>} />
        <Row icon={<Smartphone size={18} />} title="iPad Air" sub={t('Last used 3 days ago', 'Zuletzt vor 3 Tagen')} chevron={false} right={<button className="text-[12px] font-semibold text-berry">{t('Remove', 'Entfernen')}</button>} />
      </Group>
    </div>
  )
}

/* ================================================================ reminders */
export function Reminders() {
  const { t } = useI18n()
  const s = useDemo()
  const pets = s.pets.filter((p) => p.ownerId === ME)
  const P = s.reminderPrefs
  return (
    <div className="min-h-full px-5 pb-16">
      <ScreenHeader title={t('Reminders', 'Erinnerungen')} />
      <Group title={t('Channels', 'Kanäle')}>
        <Row icon={<Bell size={18} />} iconTone="coral" title={t('Push notifications', 'Push-Benachrichtigungen')} chevron={false} right={<Switch checked={P.push} onChange={(v) => s.setReminderPref('push', v)} />} />
        <Row icon={<MessageCircle size={18} />} iconTone="sky" title={t('E-mail copy', 'Kopie per E-Mail')} chevron={false} right={<Switch checked={P.email} onChange={(v) => s.setReminderPref('email', v)} />} />
      </Group>
      <Group title={t('Preferences', 'Einstellungen')}>
        <Row icon={<Moon size={18} />} iconTone="plum" title={t('Quiet hours', 'Ruhezeiten')} sub="22:00 – 07:00" chevron={false} right={<Switch checked={P.quietHours} onChange={(v) => s.setReminderPref('quietHours', v)} />} />
        <Row icon={<CalendarDays size={18} />} iconTone="brand" title={t('Weekly summary', 'Wochenübersicht')} sub={t('Sundays, 18:00', 'Sonntags, 18:00')} chevron={false} right={<Switch checked={P.weekly} onChange={(v) => s.setReminderPref('weekly', v)} />} />
        <Row icon={<Building2 size={18} />} iconTone="sage" title={t('Reminders from my clinic', 'Erinnerungen meiner Praxis')} chevron={false} right={<Switch checked={P.clinicMessages} onChange={(v) => s.setReminderPref('clinicMessages', v)} />} />
        <Row icon={<Scale size={18} />} iconTone="sun" title={t('Care tips', 'Pflegetipps')} chevron={false} right={<Switch checked={P.tips} onChange={(v) => s.setReminderPref('tips', v)} />} />
      </Group>
      {pets.map((p) => {
        const ts = s.treatments.filter((x) => x.petId === p.id)
        if (!ts.length) return null
        return (
          <Group key={p.id} title={p.name}>
            {ts.map((x) => {
              const m = TYPE_META[x.type]
              return <Row key={x.id} icon={<m.icon size={17} />} iconTone={m.tone} title={x.name} sub={x.remindDaysBefore ? t(`${x.remindDaysBefore} days before`, `${x.remindDaysBefore} Tage vorher`) : t('On the day', 'Am Tag')} chevron={false} right={<Switch size="sm" checked={x.reminder && P.push} onChange={() => s.toggleReminder(x.id)} />} />
            })}
          </Group>
        )
      })}
    </div>
  )
}

/* ================================================================== privacy */
const SCOPES: { id: ConsentScope; en: string; de: string }[] = [
  { id: 'profile', en: 'Profile', de: 'Profil' },
  { id: 'vaccinations', en: 'Vaccinations', de: 'Impfungen' },
  { id: 'treatments', en: 'Treatments', de: 'Behandlungen' },
  { id: 'documents', en: 'Documents', de: 'Dokumente' },
  { id: 'weight', en: 'Weight', de: 'Gewicht' },
]

export function Privacy() {
  const { t, fmtDate } = useI18n()
  const s = useDemo()
  const nav = useNav()
  const pets = s.pets.filter((p) => p.ownerId === ME)
  const [del, setDel] = useState(false)
  const [exporting, setExporting] = useState(false)

  const doExport = () => {
    setExporting(true)
    s.requestExport()
    setTimeout(() => {
      const data = {
        exportedAt: new Date().toISOString(), controller: 'Vetly (prototype)', subject: s.owners.find((o) => o.id === ME),
        pets: pets.map((p) => ({ ...p, treatments: s.treatments.filter((x) => x.petId === p.id), documents: s.documents.filter((d) => d.petId === p.id).map(({ dataUrl, ...d }) => d), consents: s.consents.filter((c) => c.petId === p.id) })),
        appointments: s.bookings.filter((b) => b.ownerId === ME), messages: s.threads.filter((th) => th.ownerId === ME),
      }
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'vetly-export-lena-hoffmann.json'
      a.click()
      URL.revokeObjectURL(url)
      setExporting(false)
      s.toast({ title: t('Export ready ✓', 'Export bereit ✓'), body: t('JSON file downloaded (Art. 20 GDPR).', 'JSON-Datei heruntergeladen (Art. 20 DSGVO).') })
    }, 1200)
  }

  return (
    <div className="min-h-full px-5 pb-16">
      <ScreenHeader title={t('Privacy center', 'Datenschutz-Center')} />
      <div className="relative mt-1 overflow-hidden rounded-3xl bg-brand p-5 text-brand-fg">
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
        <ShieldCheck size={26} />
        <div className="mt-2 font-display text-xl font-semibold leading-snug">{t('You decide who sees your pets’ records.', 'Sie entscheiden, wer die Akten Ihrer Tiere sieht.')}</div>
        <div className="mt-1 text-[12.5px] opacity-80">{t('Changes take effect immediately and are logged.', 'Änderungen wirken sofort und werden protokolliert.')}</div>
      </div>

      {pets.map((p) => {
        const cs = s.consents.filter((c) => c.petId === p.id)
        const partners = [
          ...s.clinics.filter((c) => c.onVetly && (cs.some((x) => x.partyType === 'clinic' && x.partyId === c.id) || c.id === 'c1')).map((c) => ({ type: 'clinic' as const, id: c.id, name: c.short, icon: Building2 })),
          ...(p.insurerId || cs.some((x) => x.partyType === 'insurer') ? [{ type: 'insurer' as const, id: 'i1', name: 'Pfotenschutz', icon: Umbrella }] : []),
        ]
        return (
          <div key={p.id} className="mt-5">
            <div className="mb-2 flex items-center gap-2 px-1"><PetAvatar species={p.species} hue={p.hue} size={24} /><span className="text-[14px] font-semibold">{p.name}</span></div>
            <div className="overflow-hidden rounded-2xl bg-surface shadow-soft ring-1 ring-line/60">
              {partners.map((pt) => {
                const c = cs.find((x) => x.partyType === pt.type && x.partyId === pt.id)
                const on = !!c?.active
                return (
                  <div key={pt.id} className="px-4 py-3 [&+&]:border-t [&+&]:border-line/60">
                    <div className="flex items-center gap-3">
                      <span className={cn('grid h-9 w-9 place-items-center rounded-xl', on ? 'bg-brand-soft text-brand' : 'bg-muted text-ink-3')}><pt.icon size={17} /></span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-medium">{pt.name}</div>
                        <div className="truncate text-[11.5px] text-ink-3">
                          {on ? (c?.expiresAt ? t(`Until ${fmtDate(c.expiresAt)}`, `Bis ${fmtDate(c.expiresAt)}`) : t('Until revoked', 'Bis auf Widerruf')) : t('No access', 'Kein Zugriff')}
                        </div>
                      </div>
                      <Switch
                        checked={on}
                        onChange={(v) => {
                          s.setConsent(p.id, pt.type, pt.id, v, c?.scope ?? ['profile', 'vaccinations', 'treatments'])
                          s.toast({ title: v ? t(`${pt.name} can see ${p.name}’s record`, `${pt.name} sieht ${p.name}s Akte`) : t(`Access revoked for ${pt.name}`, `Zugriff für ${pt.name} widerrufen`), tone: v ? 'brand' : 'coral' })
                        }}
                      />
                    </div>
                    {on && c && (
                      <div className="mt-2 flex flex-wrap gap-1 pl-12">
                        {SCOPES.filter((sc) => c.scope.includes(sc.id)).map((sc) => <span key={sc.id} className="rounded-md bg-muted px-1.5 py-0.5 text-[10.5px] font-semibold text-ink-2">{t(sc.en, sc.de)}</span>)}
                      </div>
                    )}
                  </div>
                )
              })}
              <button onClick={() => nav.push({ name: 'passport', petId: p.id })} className="flex w-full items-center gap-3 border-t border-line/60 px-4 py-3 text-left text-[13.5px] font-semibold text-brand">
                <Share2 size={16} />{t('Share with a new vet…', 'Mit neuer Praxis teilen…')}
              </button>
            </div>
          </div>
        )
      })}

      <Group title={t('Your rights (GDPR)', 'Ihre Rechte (DSGVO)')}>
        <Row icon={<Download size={18} />} iconTone="sky" title={t('Export my data', 'Meine Daten exportieren')} sub={t('All data as JSON · Art. 15 & 20', 'Alle Daten als JSON · Art. 15 & 20')} chevron={false} right={exporting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" /> : <ChevronRight size={17} className="text-ink-3" />} onClick={doExport} />
        <Row icon={<Trash2 size={18} />} iconTone="berry" danger title={t('Delete my data', 'Meine Daten löschen')} sub={t('Account & all records · Art. 17', 'Konto & alle Daten · Art. 17')} onClick={() => setDel(true)} />
      </Group>
      <p className="mt-3 px-1 text-[11.5px] leading-relaxed text-ink-3">{t('Data is stored encrypted in Frankfurt (EU). We never sell data or use advertising trackers.', 'Daten werden verschlüsselt in Frankfurt (EU) gespeichert. Wir verkaufen keine Daten und nutzen keine Werbe-Tracker.')}</p>
      <DeleteSheet open={del} onClose={() => setDel(false)} />
    </div>
  )
}

function DeleteSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useI18n()
  const s = useDemo()
  const [step, setStep] = useState(0)
  const [txt, setTxt] = useState('')
  const word = lang === 'de' ? 'LÖSCHEN' : 'DELETE'
  useEffect(() => { if (open) { setStep(0); setTxt('') } }, [open])
  return (
    <Sheet open={open} onClose={onClose}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-berry-soft text-berry"><Trash2 size={26} /></div>
            <h3 className="mt-4 font-display text-2xl font-semibold">{t('Delete all your data?', 'Alle Daten löschen?')}</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-ink-2">
              {[t('Your account and login', 'Ihr Konto und Login'), t('All pets, health records and documents', 'Alle Tiere, Gesundheitsdaten und Dokumente'), t('Messages and appointment history', 'Nachrichten und Terminverlauf'), t('All sharing with clinics and insurers is revoked', 'Alle Freigaben an Praxen und Versicherer werden widerrufen')].map((x) => (
                <li key={x} className="flex gap-2"><X size={15} className="mt-0.5 shrink-0 text-berry" />{x}</li>
              ))}
            </ul>
            <div className="mt-4 rounded-2xl bg-sun-soft p-3 text-[12.5px] text-ink">{t('Tip: export your data first. You have 30 days to change your mind.', 'Tipp: Exportieren Sie Ihre Daten vorher. Sie haben 30 Tage Bedenkzeit.')}</div>
            <div className="mt-5 grid gap-2"><Button variant="danger" size="lg" onClick={() => setStep(1)}>{t('Continue', 'Weiter')}</Button><Button variant="ghost" size="lg" onClick={onClose}>{t('Cancel', 'Abbrechen')}</Button></div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="font-display text-2xl font-semibold">{t('Confirm deletion', 'Löschung bestätigen')}</h3>
            <p className="mt-2 text-[13.5px] text-ink-2">{t(`Type ${word} to confirm.`, `Geben Sie ${word} ein, um zu bestätigen.`)}</p>
            <input className="input mt-4 h-12 text-center font-mono text-lg tracking-widest" value={txt} onChange={(e) => setTxt(e.target.value.toUpperCase())} placeholder={word} />
            <Button block variant="danger" size="lg" className="mt-4" disabled={txt !== word} onClick={() => { s.requestDeletion(); setStep(2) }}>{t('Delete my data', 'Meine Daten löschen')}</Button>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="c" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-4 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-soft text-sage"><Check size={30} /></div>
            <h3 className="mt-4 font-display text-2xl font-semibold">{t('Deletion requested', 'Löschung beantragt')}</h3>
            <p className="mt-2 text-[13.5px] text-ink-2">{t('Your data will be permanently erased in 30 days. You’ll receive a confirmation e-mail. (Visible in the Admin console → Compliance.)', 'Ihre Daten werden in 30 Tagen endgültig gelöscht. Sie erhalten eine Bestätigung per E-Mail. (Sichtbar in der Admin-Konsole → Compliance.)')}</p>
            <Button block size="lg" className="mt-5" onClick={onClose}>{t('Close', 'Schließen')}</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Sheet>
  )
}

/* ============================================================= appointments */
export function Appointments() {
  const { t, tl, fmtDate } = useI18n()
  const s = useDemo()
  const [tab, setTab] = useState<'up' | 'past'>('up')
  const mine = s.bookings.filter((b) => b.ownerId === ME)
  const list = mine
    .filter((b) => (tab === 'up' ? ['confirmed', 'pending', 'proposed'].includes(b.status) && daysUntil(b.proposedDate ?? b.date) >= 0 : !['confirmed', 'pending', 'proposed'].includes(b.status) || daysUntil(b.date) < 0))
    .sort((a, b) => (tab === 'up' ? 1 : -1) * (a.date + a.time).localeCompare(b.date + b.time))
  const statusBadge: Record<string, React.ReactNode> = {
    confirmed: <Badge tone="sage" dot>{t('Confirmed', 'Bestätigt')}</Badge>,
    pending: <Badge tone="sun" dot>{t('Requested', 'Angefragt')}</Badge>,
    proposed: <Badge tone="coral" dot>{t('New time proposed', 'Neue Zeit vorgeschlagen')}</Badge>,
    declined: <Badge tone="berry">{t('Declined', 'Abgelehnt')}</Badge>,
    completed: <Badge>{t('Completed', 'Erledigt')}</Badge>,
    cancelled: <Badge>{t('Cancelled', 'Storniert')}</Badge>,
    noshow: <Badge tone="berry">{t('Missed', 'Verpasst')}</Badge>,
  }
  return (
    <div className="min-h-full px-5 pb-16">
      <ScreenHeader title={t('Appointments', 'Termine')} />
      <Segmented className="mt-1 w-full" value={tab} onChange={setTab} options={[{ value: 'up', label: t('Upcoming', 'Anstehend') }, { value: 'past', label: t('Past', 'Vergangen') }]} />
      <div className="mt-4 space-y-3">
        {list.length === 0 && <div className="py-10 text-center text-[13px] text-ink-3">{t('Nothing here yet', 'Noch nichts hier')}</div>}
        {list.map((b) => {
          const c = s.clinics.find((x) => x.id === b.clinicId)!
          const p = s.pets.find((x) => x.id === b.petId)!
          const svc = c.services.find((x) => x.id === b.serviceId)
          return (
            <motion.div layout key={b.id} className="rounded-3xl bg-surface p-4 shadow-soft ring-1 ring-line/60">
              <div className="flex items-center gap-3">
                <PetAvatar species={p.species} hue={p.hue} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14.5px] font-semibold">{svc ? tl(svc.name) : ''} · {p.name}</div>
                  <div className="text-[12.5px] text-ink-3">{c.short}{b.vet ? ` · ${b.vet}` : ''}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-muted/60 px-3 py-2.5">
                <div className="text-[13px] font-semibold">{fmtDate(b.date, { weekday: 'short', day: 'numeric', month: 'short' })} · {b.time}</div>
                {statusBadge[b.status]}
              </div>
              {b.status === 'proposed' && b.proposedDate && (
                <div className="mt-2.5 rounded-2xl border-2 border-dashed border-coral/40 p-3">
                  <div className="text-[12px] text-ink-3">{t('Clinic suggests', 'Praxis schlägt vor')}</div>
                  <div className="text-[15px] font-semibold">{fmtDate(b.proposedDate, { weekday: 'long', day: 'numeric', month: 'long' })} · {b.proposedTime}</div>
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    <Button size="sm" onClick={() => { s.ownerRespondProposal(b.id, true); s.toast({ title: t('New time accepted ✓', 'Neuer Termin angenommen ✓') }) }}>{t('Accept', 'Annehmen')}</Button>
                    <Button size="sm" variant="outline" onClick={() => s.ownerRespondProposal(b.id, false)}>{t('Decline', 'Ablehnen')}</Button>
                  </div>
                </div>
              )}
              {['pending', 'confirmed'].includes(b.status) && daysUntil(b.date) >= 0 && (
                <div className="mt-2.5 flex gap-2">
                  <Button size="sm" variant="ghost" className="flex-1" onClick={() => s.toast({ title: t('Added to calendar', 'Zum Kalender hinzugefügt') })}>{t('Add to calendar', 'In Kalender')}</Button>
                  <Button size="sm" variant="ghost" className="flex-1 !text-berry" onClick={() => s.cancelBooking(b.id)}>{t('Cancel', 'Absagen')}</Button>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ============================================================ notifications */
export function Notifications() {
  const { t, tl, relTime } = useI18n()
  const s = useDemo()
  const list = s.notifications.filter((n) => n.ownerId === ME)
  useEffect(() => {
    const tm = setTimeout(() => s.markNotificationsRead(), 1500)
    return () => clearTimeout(tm)
  }, []) // eslint-disable-line
  const meta = {
    reminder: { icon: BellRing, tone: 'bg-coral-soft text-coral' },
    booking: { icon: CalendarDays, tone: 'bg-brand-soft text-brand' },
    chat: { icon: MessageCircle, tone: 'bg-sky-soft text-sky' },
    clinic: { icon: Building2, tone: 'bg-plum-soft text-plum' },
    system: { icon: ShieldCheck, tone: 'bg-sage-soft text-sage' },
  }
  return (
    <div className="min-h-full px-5 pb-16">
      <ScreenHeader title={t('Notifications', 'Mitteilungen')} />
      <div className="mt-1 space-y-2">
        {list.map((n, i) => {
          const m = meta[n.kind]
          return (
            <motion.div key={n.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={cn('flex gap-3 rounded-2xl p-3.5 ring-1 ring-line/60', n.read ? 'bg-surface' : 'bg-brand-soft/50')}>
              <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', m.tone)}><m.icon size={18} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2"><span className="text-[14px] font-semibold leading-snug">{tl(n.title)}</span>{!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-coral" />}</div>
                <div className="mt-0.5 text-[12.5px] text-ink-2">{tl(n.body)}</div>
                <div className="mt-1 text-[11px] text-ink-3">{relTime(n.at)}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ================================================================= passport */
export function Passport({ petId }: { petId: string }) {
  const { t, tl, fmtDate } = useI18n()
  const s = useDemo()
  const pet = s.pets.find((p) => p.id === petId)
  const [share, setShare] = useState(false)
  if (!pet) return null
  const vacc = s.treatments.filter((x) => x.petId === petId && x.type === 'vaccination')
  const upToDate = vacc.every((v) => daysUntil(v.dueDate) >= 0)
  return (
    <div className="min-h-full px-5 pb-16">
      <ScreenHeader title={t('Pet passport', 'Tierpass')} />
      <motion.div initial={{ rotateX: 20, opacity: 0, y: 20 }} animate={{ rotateX: 0, opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 18 }} style={{ perspective: 800 }}>
        <div className="relative overflow-hidden rounded-[28px] p-5 text-white shadow-float" style={{ background: `linear-gradient(140deg, rgb(var(--c-brand)), hsl(${pet.hue} 45% 35%))` }}>
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-coral/30 blur-2xl" />
          <div className="relative flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] opacity-80"><span>Vetly · {t('Pet ID', 'Tierausweis')}</span><span>EU</span></div>
          <div className="relative mt-4 flex items-center gap-4">
            <PetAvatar species={pet.species} hue={pet.hue} size={72} className="ring-4 ring-white/25" />
            <div>
              <div className="font-display text-[28px] font-semibold leading-none">{pet.name}</div>
              <div className="mt-1 text-[13px] opacity-80">{tl(SPECIES_LABEL[pet.species])} · {pet.breed}</div>
            </div>
          </div>
          <div className="relative mt-5 grid grid-cols-2 gap-3 text-[12px]">
            <div><div className="opacity-60">{t('Born', 'Geboren')}</div><div className="font-semibold">{fmtDate(pet.birthDate)}</div></div>
            <div><div className="opacity-60">{t('Microchip', 'Chip')}</div><div className="font-mono font-semibold">{pet.chip}</div></div>
            <div><div className="opacity-60">{t('Owner', 'Halterin')}</div><div className="font-semibold">Lena Hoffmann</div></div>
            <div><div className="opacity-60">{t('Vaccinations', 'Impfungen')}</div><div className="font-semibold">{upToDate ? `✓ ${t('Up to date', 'Aktuell')}` : `! ${t('Check', 'Prüfen')}`}</div></div>
          </div>
        </div>
      </motion.div>
      <div className="mt-4 flex flex-col items-center rounded-[28px] bg-surface p-5 shadow-soft ring-1 ring-line/60">
        <div className="rounded-2xl bg-white p-3"><QRCodeSVG value={`https://vetly.de/p/${pet.name.toLowerCase()}-7F3K`} size={150} fgColor="#0F5C55" level="M" /></div>
        <div className="mt-3 text-center text-[12.5px] text-ink-3">{t('Show this code at a new vet or pet sitter. They only see what you allow.', 'Code bei neuer Praxis oder Tiersitter zeigen. Sichtbar ist nur, was Sie freigeben.')}</div>
      </div>
      <Button block size="lg" className="mt-4" icon={<Share2 size={18} />} onClick={() => setShare(true)}>{t('Share with a new vet', 'Mit neuer Praxis teilen')}</Button>
      <ShareSheet open={share} onClose={() => setShare(false)} petId={petId} />
    </div>
  )
}

function ShareSheet({ open, onClose, petId }: { open: boolean; onClose: () => void; petId: string }) {
  const { t } = useI18n()
  const s = useDemo()
  const pet = s.pets.find((p) => p.id === petId)!
  const clinics = s.clinics.filter((c) => c.onVetly && c.id !== 'c1')
  const [clinic, setClinic] = useState(clinics[0]?.id)
  const [scope, setScope] = useState<ConsentScope[]>(['profile', 'vaccinations', 'treatments'])
  const [dur, setDur] = useState<number>(30)
  const [done, setDone] = useState(false)
  useEffect(() => { if (open) setDone(false) }, [open])
  const grant = () => {
    s.setConsent(petId, 'clinic', clinic!, true, scope, dur ? addDays(isoDay(0), dur) : undefined)
    setDone(true)
  }
  const cname = s.clinics.find((c) => c.id === clinic)?.short
  return (
    <Sheet open={open} onClose={onClose} title={done ? undefined : t(`Share ${pet.name}’s record`, `${pet.name}s Akte teilen`)}>
      {done ? (
        <div className="py-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand text-brand-fg"><Check size={30} /></motion.div>
          <h3 className="mt-4 font-display text-2xl font-semibold">{t('Shared securely', 'Sicher geteilt')}</h3>
          <p className="mt-2 text-[13.5px] text-ink-2">{t(`${cname} can now see the selected data${dur ? ` for ${dur} days` : ''}. You can revoke this anytime in the Privacy center.`, `${cname} sieht jetzt die ausgewählten Daten${dur ? ` für ${dur} Tage` : ''}. Jederzeit im Datenschutz-Center widerrufbar.`)}</p>
          <Button block size="lg" className="mt-5" onClick={onClose}>{t('Done', 'Fertig')}</Button>
        </div>
      ) : (
        <>
          <label className="label">{t('New clinic', 'Neue Praxis')}</label>
          <div className="space-y-2">
            {clinics.map((c) => (
              <button key={c.id} onClick={() => setClinic(c.id)} className={cn('flex w-full items-center gap-3 rounded-2xl border-2 p-2.5 text-left', clinic === c.id ? 'border-brand bg-brand-soft/40' : 'border-transparent bg-muted/60')}>
                <span className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: `hsl(${c.hue} 50% 45%)` }}>{c.short[0]}</span>
                <span className="flex-1 text-[14px] font-semibold">{c.name}</span>
              </button>
            ))}
          </div>
          <label className="label mt-4">{t('What to share', 'Was wird geteilt')}</label>
          <div className="flex flex-wrap gap-2">
            {SCOPES.map((sc) => (
              <Chip key={sc.id} active={scope.includes(sc.id)} onClick={() => setScope(scope.includes(sc.id) ? scope.filter((x) => x !== sc.id) : [...scope, sc.id])}>
                {scope.includes(sc.id) && <Check size={13} />}{t(sc.en, sc.de)}
              </Chip>
            ))}
          </div>
          <label className="label mt-4">{t('For how long', 'Wie lange')}</label>
          <div className="grid grid-cols-4 gap-2">
            {[7, 30, 90, 0].map((d) => (
              <button key={d} onClick={() => setDur(d)} className={cn('rounded-xl py-2 text-[12.5px] font-semibold', dur === d ? 'bg-brand text-brand-fg' : 'bg-muted text-ink-2')}>
                {d ? t(`${d} days`, `${d} Tage`) : t('Always', 'Immer')}
              </button>
            ))}
          </div>
          <Button block size="lg" className="mt-5" disabled={!scope.length} onClick={grant} icon={<ShieldCheck size={18} />}>{t('Grant access', 'Zugriff erteilen')}</Button>
        </>
      )}
    </Sheet>
  )
}

/* ==================================================================== legal */
export function LegalScreen({ doc }: { doc: 'impressum' | 'privacy' | 'terms' }) {
  const { t, tl, fmtDate } = useI18n()
  const d = LEGAL[doc]
  return (
    <div className="min-h-full px-5 pb-16">
      <ScreenHeader title={tl(d.title)} />
      <div className="mt-1 rounded-2xl bg-sun-soft px-3.5 py-2.5 text-[12px] font-medium text-ink">⚖️ {t('Draft, pending lawyer review', 'Entwurf, anwaltliche Prüfung ausstehend')}</div>
      <p className="mt-3 text-[13px] text-ink-3">{tl(d.sub)} · {t('Updated', 'Stand')} {fmtDate(d.updated)}</p>
      {d.sections.map((sec) => (
        <div key={sec.h.en} className="mt-5">
          <h3 className="text-[15px] font-semibold">{tl(sec.h)}</h3>
          {sec.p.map((p, i) => <p key={i} className="mt-1.5 whitespace-pre-line text-[13.5px] leading-relaxed text-ink-2">{tl(p)}</p>)}
          {sec.list && <ul className="mt-2 space-y-1.5">{sec.list.map((li, i) => <li key={i} className="flex gap-2 text-[13.5px] text-ink-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-3" />{tl(li)}</li>)}</ul>}
        </div>
      ))}
    </div>
  )
}
