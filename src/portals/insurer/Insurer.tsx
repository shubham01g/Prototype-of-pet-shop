import { motion } from 'framer-motion'
import {
  Building2, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Code2, Copy, Eye, EyeOff, FileSignature, KeyRound, LayoutDashboard, Lock, PawPrint, ShieldCheck,
  Sparkles, Users, Webhook,
} from 'lucide-react'
import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { PetAvatar, SPECIES_LABEL } from '@/components/illustrations'
import { DashboardShell, PageHeader } from '@/components/shell'
import { Badge, Button, StatCard } from '@/components/ui'
import { useI18n } from '@/i18n'
import { cn, daysUntil, num } from '@/lib/utils'
import { REPEAT_LABEL, useDemo } from '@/store/useDemoStore'
import { MY_INSURER } from '@/data/seed'
import { TYPE_META, dueTone } from '@/portals/owner/kit'

function useInsurer() {
  const s = useDemo()
  const ins = s.insurers.find((i) => i.id === MY_INSURER)!
  const consents = s.consents.filter((c) => c.partyType === 'insurer' && c.partyId === MY_INSURER)
  return { s, ins, consents }
}

export default function Insurer() {
  const { t } = useI18n()
  const { consents } = useInsurer()
  return (
    <DashboardShell
      portal="insurer"
      sub={t('Insurer', 'Versicherer')}
      accentHue={270}
      user={{ name: 'Pfotenschutz Versicherung', role: t('Partner · Claims team', 'Partner · Schadenteam'), hue: 200 }}
      nav={[{ items: [
        { to: '/insurer', label: t('Overview', 'Übersicht'), icon: LayoutDashboard, end: true },
        { to: '/insurer/policyholders', label: t('Shared records', 'Freigegebene Akten'), icon: PawPrint, badge: consents.filter((c) => c.active).length },
        { to: '/insurer/onboarding', label: t('Onboarding', 'Onboarding'), icon: CheckCircle2 },
        { to: '/insurer/api', label: t('API & webhooks', 'API & Webhooks'), icon: Code2 },
      ] }]}
      footer={<div className="rounded-2xl bg-plum-soft p-3.5 text-[12px] text-plum"><div className="flex items-center gap-1.5 font-semibold"><Lock size={14} />{t('Consent-scoped access', 'Einwilligungsbasierter Zugriff')}</div><div className="mt-0.5 opacity-80">{t('Data expires automatically.', 'Daten laufen automatisch ab.')}</div></div>}
    >
      <Routes>
        <Route index element={<Overview />} />
        <Route path="policyholders" element={<Policyholders />} />
        <Route path="policyholders/:id" element={<Record />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="api" element={<Api />} />
        <Route path="*" element={<Navigate to="/insurer" />} />
      </Routes>
    </DashboardShell>
  )
}

function Overview() {
  const { t, lang } = useI18n()
  const { consents } = useInsurer()
  const nav = useNavigate()
  const active = consents.filter((c) => c.active).length
  return (
    <>
      <PageHeader eyebrow="Pfotenschutz Versicherung" title={t('Partner overview', 'Partner-Übersicht')} sub={t('Verified vaccination & treatment history, shared by owners, for faster underwriting and claims.', 'Verifizierte Impf- & Behandlungshistorie, von Haltern geteilt, für schnellere Antrags- und Schadenprüfung.')} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('Linked policies', 'Verknüpfte Policen')} value={num(3412, lang)} delta={14} tone="plum" icon={<Users size={18} />} spark={[1200, 1600, 1900, 2300, 2700, 3100, 3412]} />
        <StatCard label={t('Active consents (demo)', 'Aktive Freigaben (Demo)')} value={active} tone="sage" icon={<ShieldCheck size={18} />} hint={t('updates live', 'aktualisiert live')} />
        <StatCard label={t('Claims pre-checked', 'Vorgeprüfte Schäden')} value="1,086" tone="sky" icon={<FileSignature size={18} />} hint={t('with verified records', 'mit verifizierten Akten')} />
        <StatCard label={t('Avg. claim decision', 'Ø Schadenentscheidung')} value={t('1.8 days', '1,8 Tage')} delta={-62} invert tone="coral" icon={<Clock3 size={18} />} hint={t('vs. paper records', 'ggü. Papierakten')} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold">{t('How data reaches you', 'So erreichen Sie die Daten')}</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {[[PawPrint, t('Owner links policy in app', 'Halter verknüpft Police in App')], [ShieldCheck, t('Chooses scope & duration', 'Wählt Umfang & Dauer')], [Webhook, t('Webhook: consent.granted', 'Webhook: consent.granted')], [Code2, t('You fetch via API', 'Abruf per API')]].map(([I, l], i) => {
              const Icon = I as typeof PawPrint
              return (
                <div key={i} className="relative rounded-2xl bg-muted/60 p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-plum-soft text-plum"><Icon size={18} /></span>
                  <div className="mt-3 text-sm font-semibold">{l as string}</div>
                  <div className="absolute right-3 top-3 text-xs font-bold text-ink-3">{i + 1}</div>
                </div>
              )
            })}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-sun-soft p-3 text-sm text-ink"><Sparkles size={16} className="text-sun" />{t('Revocation is instant: access ends and a consent.revoked webhook fires.', 'Widerruf wirkt sofort: Zugriff endet, ein consent.revoked-Webhook wird ausgelöst.')}</div>
        </div>
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold">{t('Latest shared records', 'Zuletzt geteilt')}</h3>
          <RecordList compact onOpen={(id) => nav(`/insurer/policyholders/${id}`)} />
        </div>
      </div>
    </>
  )
}

function RecordList({ compact, onOpen }: { compact?: boolean; onOpen: (petId: string) => void }) {
  const { t, fmtDate } = useI18n()
  const { s, consents } = useInsurer()
  return (
    <div className={cn('divide-y divide-line/70', !compact && 'card')}>
      {consents.map((c) => {
        const p = s.pets.find((x) => x.id === c.petId)!
        const o = s.owners.find((x) => x.id === p.ownerId)
        return (
          <button key={c.id} disabled={!c.active} onClick={() => onOpen(p.id)} className={cn('flex w-full items-center gap-3 py-3 text-left', !compact && 'px-5', c.active ? 'hover:bg-muted/40' : 'opacity-60')}>
            <div className="relative"><PetAvatar species={p.species} hue={p.hue} size={40} className={cn(!c.active && 'grayscale')} />{!c.active && <Lock size={13} className="absolute -bottom-1 -right-1 rounded-full bg-surface p-0.5" />}</div>
            <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{p.name} <span className="font-normal text-ink-3">· {p.breed}</span></div><div className="text-xs text-ink-3">{o?.name} · POL-{p.chip.slice(-4)}</div></div>
            {c.active ? <Badge tone="sage" dot>{c.expiresAt ? t(`until ${fmtDate(c.expiresAt)}`, `bis ${fmtDate(c.expiresAt)}`) : t('Active', 'Aktiv')}</Badge> : <Badge>{t('Revoked', 'Widerrufen')}</Badge>}
            {c.active && <ChevronRight size={16} className="text-ink-3" />}
          </button>
        )
      })}
    </div>
  )
}

function Policyholders() {
  const { t } = useI18n()
  const nav = useNavigate()
  return (
    <>
      <PageHeader title={t('Shared records', 'Freigegebene Akten')} sub={t('Only pets whose owners actively share with Pfotenschutz appear here. Read-only, scoped and audit-logged.', 'Hier erscheinen nur Tiere, deren Halter aktiv mit Pfotenschutz teilen. Nur lesend, begrenzt und protokolliert.')} />
      <RecordList onOpen={(id) => nav(`/insurer/policyholders/${id}`)} />
    </>
  )
}

function Record() {
  const { id } = useParams()
  const { t, tl, fmtDate, relDays } = useI18n()
  const { s, consents } = useInsurer()
  const nav = useNavigate()
  const p = s.pets.find((x) => x.id === id)
  const c = consents.find((x) => x.petId === id)
  if (!p || !c?.active) return <Navigate to="/insurer/policyholders" />
  const ts = s.treatments.filter((x) => x.petId === p.id && (x.type === 'vaccination' ? c.scope.includes('vaccinations') : c.scope.includes('treatments')))
  const vaccOk = ts.filter((x) => x.type === 'vaccination').every((x) => daysUntil(x.dueDate) >= 0)
  return (
    <>
      <button onClick={() => nav('/insurer/policyholders')} className="mb-4 flex items-center gap-1 text-sm font-medium text-ink-3 hover:text-ink"><ChevronLeft size={16} />{t('Shared records', 'Freigegebene Akten')}</button>
      <div className="card flex flex-wrap items-center gap-5 p-6">
        <PetAvatar species={p.species} hue={p.hue} size={76} />
        <div className="flex-1">
          <h1 className="font-display text-3xl font-semibold">{p.name}</h1>
          <div className="text-sm text-ink-2">{tl(SPECIES_LABEL[p.species])} · {p.breed} · {t('born', 'geb.')} {fmtDate(p.birthDate)}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">{c.scope.map((x) => <Badge key={x} tone="plum">{x}</Badge>)}</div>
        </div>
        <div className="rounded-2xl bg-muted/60 p-4 text-sm">
          <div className="text-xs text-ink-3">{t('Consent', 'Einwilligung')}</div>
          <div className="font-semibold">{fmtDate(c.grantedAt)} → {c.expiresAt ? fmtDate(c.expiresAt) : '∞'}</div>
          <div className="mt-1 text-xs text-ink-3">{t('Read-only · every view logged', 'Nur lesend · jeder Zugriff protokolliert')}</div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className={cn('card p-5', vaccOk ? 'bg-sage-soft/50' : 'bg-sun-soft/60')}>
          <div className="text-sm text-ink-2">{t('Vaccination status', 'Impfstatus')}</div>
          <div className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold">{vaccOk ? <><Check className="text-sage" />{t('Up to date', 'Aktuell')}</> : t('Booster due', 'Auffrischung fällig')}</div>
        </div>
        <div className="card p-5"><div className="text-sm text-ink-2">{t('Microchip', 'Chip')}</div><div className="mt-1 font-mono text-lg font-semibold">{c.scope.includes('profile') ? p.chip : '•••'}</div></div>
        <div className="card p-5"><div className="text-sm text-ink-2">{t('Primary vet', 'Haustierarzt')}</div><div className="mt-1 font-display text-lg font-semibold">{s.clinics.find((x) => x.id === p.clinicId)?.short ?? '—'}</div></div>
      </div>
      <div className="card mt-6 p-6">
        <h3 className="font-display text-lg font-semibold">{t('Shared history', 'Geteilte Historie')}</h3>
        <div className="mt-4 space-y-2">
          {ts.map((x) => {
            const m = TYPE_META[x.type]
            return (
              <div key={x.id} className="flex items-center gap-3 rounded-2xl border border-line/70 p-3">
                <span className={`grid h-10 w-10 place-items-center rounded-xl bg-${m.tone}-soft text-${m.tone}`}><m.icon size={18} /></span>
                <div className="flex-1"><div className="text-sm font-semibold">{x.name}</div><div className="text-xs text-ink-3">{t(m.en, m.de)} · {tl(REPEAT_LABEL[x.repeat])}{x.fromClinic ? ` · ${t('verified by clinic', 'von Praxis bestätigt')} ✓` : ''}</div></div>
                <div className="text-right text-sm"><div>{fmtDate(x.dueDate)}</div><div className={`text-xs font-semibold text-${dueTone(x.dueDate)}`}>{relDays(x.dueDate)}</div></div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-ink-3"><Lock size={13} />{t('Documents and weight are not in this consent’s scope and stay hidden.', 'Dokumente und Gewicht sind nicht im Freigabe-Umfang und bleiben verborgen.')}</div>
      </div>
    </>
  )
}

function Onboarding() {
  const { t } = useI18n()
  const { s, ins } = useInsurer()
  const steps = [
    [Building2, t('Company verification', 'Unternehmensprüfung'), t('BaFin registration & company documents checked', 'BaFin-Registrierung & Firmenunterlagen geprüft')],
    [FileSignature, t('Data processing & sharing agreement', 'AVV & Datennutzungsvertrag'), t('Purpose limitation: underwriting and claims only', 'Zweckbindung: nur Antrags- und Schadenprüfung')],
    [KeyRound, t('Sandbox API keys', 'Sandbox-API-Schlüssel'), t('Test with synthetic pets and consents', 'Test mit synthetischen Tieren und Freigaben')],
    [Webhook, t('Webhooks & security review', 'Webhooks & Sicherheitsprüfung'), t('Signed webhooks, IP allow-list, mTLS optional', 'Signierte Webhooks, IP-Allowlist, mTLS optional')],
    [ShieldCheck, t('Production go-live', 'Produktivstart'), t('Owners can link policies in the app', 'Halter können Policen in der App verknüpfen')],
  ] as const
  return (
    <>
      <PageHeader title={t('Partner onboarding', 'Partner-Onboarding')} sub={t('The same structured path for every insurer. The partner is decided by the client; the platform is ready.', 'Derselbe strukturierte Weg für jeden Versicherer. Die Partnerwahl trifft der Auftraggeber; die Plattform ist vorbereitet.')} />
      <div className="card p-6">
        {steps.map(([I, l, d], i) => {
          const done = i < ins.step
          return (
            <motion.div key={l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="relative flex gap-4 pb-7 last:pb-0">
              {i < steps.length - 1 && <div className={cn('absolute left-5 top-11 h-[calc(100%-36px)] w-0.5', done ? 'bg-plum' : 'bg-line')} />}
              <span className={cn('relative grid h-10 w-10 shrink-0 place-items-center rounded-xl', done ? 'bg-plum text-white' : 'bg-muted text-ink-3')}>{done ? <Check size={18} strokeWidth={3} /> : <I size={18} />}</span>
              <div className="flex-1 pt-1"><div className="font-semibold">{l}</div><div className="text-sm text-ink-3">{d}</div></div>
              {done ? <Badge tone="plum">{t('Done', 'Erledigt')}</Badge> : i === ins.step ? <Button size="sm" onClick={() => s.advanceInsurer(ins.id)}>{t('Complete', 'Abschließen')}</Button> : null}
            </motion.div>
          )
        })}
      </div>
    </>
  )
}

function Api() {
  const { t } = useI18n()
  const toast = useDemo((s) => s.toast)
  const [show, setShow] = useState(false)
  const key = 'vtly_live_8f3K29xQmA7cPz1Lr0'
  return (
    <>
      <PageHeader title={t('API & webhooks', 'API & Webhooks')} sub={t('REST + webhooks, OAuth 2.0 client credentials, EU endpoints only.', 'REST + Webhooks, OAuth-2.0-Client-Credentials, ausschließlich EU-Endpunkte.')} />
      <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold">{t('Credentials', 'Zugangsdaten')}</h3>
            <label className="label mt-4">Client ID</label>
            <div className="input font-mono text-xs">pfotenschutz-prod</div>
            <label className="label mt-3">Client secret</label>
            <div className="flex gap-2">
              <div className="input flex-1 font-mono text-xs">{show ? key : '•'.repeat(28)}</div>
              <Button variant="outline" size="sm" className="h-auto" onClick={() => setShow(!show)}>{show ? <EyeOff size={15} /> : <Eye size={15} />}</Button>
              <Button variant="outline" size="sm" className="h-auto" onClick={() => toast({ title: t('Copied', 'Kopiert') })}><Copy size={15} /></Button>
            </div>
            <div className="mt-3 text-xs text-ink-3">{t('Rotated every 90 days · demo key, not real', 'Rotation alle 90 Tage · Demo-Schlüssel, nicht echt')}</div>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold">Webhooks</h3>
            {['consent.granted', 'consent.revoked', 'consent.expired', 'record.updated'].map((e) => (
              <div key={e} className="flex items-center justify-between border-b border-line/60 py-2.5 text-sm last:border-0"><code className="font-mono text-xs">{e}</code><Badge tone="sage" dot>{t('Subscribed', 'Abonniert')}</Badge></div>
            ))}
          </div>
        </div>
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-5 py-3 text-sm font-semibold"><Code2 size={16} />GET /v1/pets/{'{id}'}/record</div>
          <pre className="overflow-x-auto bg-[#0f1714] p-5 text-[12px] leading-relaxed text-[#cfe3dc]">{`curl https://api.eu.vetly.de/v1/pets/pet_p1/record \\
  -H "Authorization: Bearer <token>"

{
  "pet": {
    "id": "pet_p1",
    "species": "dog",
    "breed": "Labrador Retriever",
    "birth_date": "2021-04-12",
    "chip": "276098106543217"
  },
  "consent": {
    "scope": ["profile", "vaccinations", "treatments"],
    "expires_at": "2027-08-04T00:00:00Z"
  },
  "vaccinations": [
    { "name": "SHPPi + L4", "last": "2025-11-11",
      "next_due": "2026-11-11", "verified_by": "clinic" },
    { "name": "Tollwut", "last": "2024-12-19",
      "next_due": "2027-12-19", "verified_by": "clinic" }
  ],
  "status": { "vaccinations_up_to_date": true }
}`}</pre>
        </div>
      </div>
    </>
  )
}
