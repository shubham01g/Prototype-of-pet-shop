import { motion } from 'framer-motion'
import {
  Activity, ArrowUpRight, BadgeEuro, Ban, Building2, CalendarCheck2, Check, CheckCircle2, ChevronLeft, ChevronRight, Cpu, CreditCard, Database, Download, Eye, FileLock2, Gauge,
  HardDrive, KeyRound, LayoutDashboard, Lock, Megaphone, PawPrint, RotateCcw, Search, SendHorizonal, Server, ShieldCheck, Smartphone, Umbrella, UserCheck, Users, X, Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PetAvatar } from '@/components/illustrations'
import { DashboardShell, PageHeader } from '@/components/shell'
import { Badge, Button, Initials, Modal, Segmented, StatCard, type Tone } from '@/components/ui'
import { useI18n } from '@/i18n'
import { cn, euro, num, seeded } from '@/lib/utils'
import { useDemo } from '@/store/useDemoStore'
import type { AuditEntry, Owner } from '@/data/types'

const PLANS = [
  { id: 'Starter', price: 49, clinics: 62, hue: 'sage' as Tone, features: { en: ['Online booking', 'Chat', 'Up to 2 vets', 'Automatic reminders'], de: ['Online-Buchung', 'Chat', 'Bis 2 Tierärzt:innen', 'Automatische Erinnerungen'] } },
  { id: 'Pro', price: 129, clinics: 71, hue: 'brand' as Tone, features: { en: ['Everything in Starter', 'Unlimited vets', 'PMS integration', 'Reminder campaigns'], de: ['Alles aus Starter', 'Unbegrenzt Tierärzt:innen', 'PVS-Anbindung', 'Erinnerungs-Kampagnen'] } },
  { id: 'Group', price: 349, clinics: 15, hue: 'plum' as Tone, features: { en: ['Multi-location', 'Central reporting', 'SSO & roles', 'Priority support'], de: ['Mehrere Standorte', 'Zentrales Reporting', 'SSO & Rollen', 'Priorisierter Support'] } },
]
const PARTNER_MRR = 3200
const MRR = PLANS.reduce((a, p) => a + p.price * p.clinics, 0) + PARTNER_MRR

const months = (lang: 'en' | 'de') => Array.from({ length: 12 }, (_, i) => {
  const d = new Date()
  d.setMonth(d.getMonth() - 11 + i)
  return d.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { month: 'short' })
})

function useSeries(lang: 'en' | 'de') {
  return useMemo(() => {
    const m = months(lang)
    const r = seeded(7)
    let owners = 3100, pets = 4300
    const growth = m.map((mo, i) => {
      owners = Math.round(owners * (1.14 + r() * 0.05) + (i === 11 ? 0 : 0))
      pets = Math.round(owners * (1.42 + r() * 0.04))
      return { m: mo, owners: Math.min(owners, 18420 + i), pets: Math.min(pets, 26910) }
    })
    growth[11] = { m: m[11], owners: 18420, pets: 26910 }
    const revenue = m.map((mo, i) => {
      const f = 0.22 + (i / 11) * 0.78
      return { m: mo, Starter: Math.round(3038 * f * (0.9 + r() * 0.1)), Pro: Math.round(9159 * f * f), Group: Math.round(5235 * Math.max(0, f - 0.25) * 1.33), Partners: i > 6 ? Math.round(PARTNER_MRR * ((i - 6) / 5)) : 0 }
    })
    revenue[11] = { m: m[11], Starter: 3038, Pro: 9159, Group: 5235, Partners: PARTNER_MRR }
    return { growth, revenue }
  }, [lang])
}

const roleTone: Record<AuditEntry['actorRole'], Tone> = { owner: 'sky', clinic: 'brand', admin: 'plum', insurer: 'coral', system: 'neutral' }
const sevTone: Record<AuditEntry['severity'], Tone> = { info: 'neutral', success: 'sage', warning: 'sun', danger: 'berry' }

/* ===================================================================== root */
export default function Admin() {
  const { t } = useI18n()
  const s = useDemo()
  const nav = useNavigate()
  const gdprOpen = s.gdpr.filter((g) => g.status !== 'completed').length
  return (
    <DashboardShell
      portal="admin"
      sub="Admin"
      accentHue={14}
      user={{ name: 'Admin Team', role: 'admin@vetly.de · Super-Admin', hue: 14 }}
      bellCount={gdprOpen}
      onBell={() => nav('/admin/compliance')}
      nav={[
        { items: [
          { to: '/admin', label: t('Overview', 'Übersicht'), icon: LayoutDashboard, end: true },
          { to: '/admin/users', label: t('Users & pets', 'Nutzer & Tiere'), icon: Users },
          { to: '/admin/clinics', label: t('Clinics', 'Praxen'), icon: Building2, badge: 4 },
          { to: '/admin/plans', label: t('Plans & revenue', 'Tarife & Umsatz'), icon: BadgeEuro },
          { to: '/admin/insurers', label: t('Insurers', 'Versicherer'), icon: Umbrella },
          { to: '/admin/bookings', label: t('Bookings', 'Buchungen'), icon: CalendarCheck2 },
          { to: '/admin/campaigns', label: t('Notifications', 'Mitteilungen'), icon: Megaphone },
        ] },
        { section: t('Trust & operations', 'Vertrauen & Betrieb'), items: [
          { to: '/admin/compliance', label: t('GDPR & audit log', 'DSGVO & Audit-Log'), icon: FileLock2, badge: gdprOpen },
          { to: '/admin/roles', label: t('Roles & permissions', 'Rollen & Rechte'), icon: KeyRound },
          { to: '/admin/system', label: t('System health', 'Systemstatus'), icon: Activity },
        ] },
      ]}
      footer={
        <div className="rounded-2xl bg-sage-soft p-3.5 text-[12px] text-sage">
          <div className="flex items-center gap-1.5 font-semibold"><span className="h-2 w-2 animate-pulse rounded-full bg-sage" />{t('All systems operational', 'Alle Systeme betriebsbereit')}</div>
          <div className="mt-0.5 opacity-80">eu-central-1 · Frankfurt</div>
        </div>
      }
    >
      <Routes>
        <Route index element={<Overview />} />
        <Route path="users" element={<UsersView />} />
        <Route path="clinics" element={<Clinics />} />
        <Route path="plans" element={<Plans />} />
        <Route path="insurers" element={<Insurers />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="compliance" element={<Compliance />} />
        <Route path="roles" element={<Roles />} />
        <Route path="system" element={<SystemHealth />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </DashboardShell>
  )
}

const tip = { contentStyle: { borderRadius: 12, border: '1px solid rgb(var(--c-line))', background: 'rgb(var(--c-surface))', fontSize: 12 }, cursor: { fill: 'rgb(var(--c-muted))' } }
const axis = { tickLine: false, axisLine: false, tick: { fontSize: 11, fill: 'rgb(var(--c-ink-3))' } }

/* ================================================================= overview */
function Overview() {
  const { t, lang, relTime, tl } = useI18n()
  const s = useDemo()
  const nav = useNavigate()
  const { growth, revenue } = useSeries(lang)
  const liveBookings = s.bookings.length
  const plansPie = PLANS.map((p) => ({ name: p.id, value: p.clinics }))
  const pieColors = ['rgb(var(--c-sage))', 'rgb(var(--c-brand))', 'rgb(var(--c-plum))']
  const cities = [['Berlin', 5120], ['München', 3010], ['Hamburg', 2480], ['Köln', 1730], ['Frankfurt', 1290], ['Leipzig', 960]] as const

  return (
    <>
      <PageHeader
        eyebrow={t('Control room', 'Kommandozentrale')}
        title={t('Everything about Vetly, in one place', 'Alles über Vetly an einem Ort')}
        sub={t('Live platform metrics across owners, clinics, insurers and revenue. Demo figures; the activity feed is live.', 'Live-Kennzahlen zu Haltern, Praxen, Versicherern und Umsatz. Demo-Zahlen; der Aktivitäts-Feed ist live.')}
        actions={<><Segmented size="sm" value="30d" onChange={() => {}} options={[{ value: '7d', label: '7T' }, { value: '30d', label: '30T' }, { value: '12m', label: '12M' }]} /><Button variant="outline" size="sm" icon={<Download size={15} />}>{t('Export', 'Export')}</Button></>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('Registered owners', 'Registrierte Halter')} value={num(18420, lang)} delta={18} tone="sky" icon={<Users size={18} />} hint={t('vs. last month', 'ggü. Vormonat')} spark={growth.map((g) => g.owners)} />
        <StatCard label={t('Active pets', 'Aktive Tiere')} value={num(26910, lang)} delta={16} tone="coral" icon={<PawPrint size={18} />} hint={t('1.46 per owner', '1,46 pro Halter')} spark={growth.map((g) => g.pets)} />
        <StatCard label={t('Clinics live', 'Aktive Praxen')} value="148" delta={9} tone="brand" icon={<Building2 size={18} />} hint={t('+4 in onboarding', '+4 im Onboarding')} spark={[60, 72, 81, 90, 98, 104, 112, 120, 128, 135, 141, 148]} />
        <StatCard label="MRR" value={euro(MRR, lang)} delta={21} tone="plum" icon={<BadgeEuro size={18} />} hint={`ARR ${euro(MRR * 12, lang)}`} spark={revenue.map((r) => r.Starter + r.Pro + r.Group + r.Partners)} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [t('Monthly active users', 'Monatlich aktive Nutzer'), num(11240, lang), '61% ' + t('of owners', 'der Halter'), Smartphone, 'sky'],
          [t('Active plans', 'Aktive Tarife'), '148', `62 Starter · 71 Pro · 15 Group`, CreditCard, 'plum'],
          [t('Bookings (30 d)', 'Buchungen (30 T)'), num(8730 + liveBookings, lang), t('92% confirmed < 2 h', '92% bestätigt < 2 Std.'), CalendarCheck2, 'brand'],
          [t('Reminder delivery', 'Erinnerungs-Zustellung'), '99.2%', t('214k pushes sent', '214k Pushes gesendet'), Zap, 'sun'],
        ].map(([l, v, h, I, tone]) => {
          const Icon = I as typeof Users
          return (
            <div key={l as string} className="card flex items-center gap-4 p-4">
              <span className={`grid h-11 w-11 place-items-center rounded-xl bg-${tone}-soft text-${tone}`}><Icon size={20} /></span>
              <div><div className="text-xs text-ink-3">{l as string}</div><div className="font-display text-xl font-semibold">{v as string}</div><div className="text-[11px] text-ink-3">{h as string}</div></div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between"><h3 className="font-display text-lg font-semibold">{t('Growth', 'Wachstum')}</h3><div className="flex gap-3 text-xs text-ink-3"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky" />{t('Owners', 'Halter')}</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-coral" />{t('Pets', 'Tiere')}</span></div></div>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={growth} margin={{ left: -10, right: 8 }}>
                <defs>
                  <linearGradient id="go" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgb(var(--c-sky))" stopOpacity={0.3} /><stop offset="100%" stopColor="rgb(var(--c-sky))" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gp" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgb(var(--c-coral))" stopOpacity={0.25} /><stop offset="100%" stopColor="rgb(var(--c-coral))" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgb(var(--c-line))" strokeDasharray="3 3" />
                <XAxis dataKey="m" {...axis} />
                <YAxis {...axis} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <Tooltip {...tip} formatter={(v: number) => num(v, lang)} />
                <Area type="monotone" dataKey="pets" name={t('Pets', 'Tiere')} stroke="rgb(var(--c-coral))" strokeWidth={2.5} fill="url(#gp)" />
                <Area type="monotone" dataKey="owners" name={t('Owners', 'Halter')} stroke="rgb(var(--c-sky))" strokeWidth={2.5} fill="url(#go)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card flex flex-col p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">{t('Live activity', 'Live-Aktivität')}</h3>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-sage"><span className="h-2 w-2 animate-pulse rounded-full bg-sage" />Live</span>
          </div>
          <div className="mt-3 max-h-72 flex-1 space-y-1 overflow-y-auto pr-1">
            {s.audit.slice(0, 14).map((a) => (
              <motion.div key={a.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-3 rounded-xl p-2 hover:bg-muted/50">
                <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', a.severity === 'danger' ? 'bg-berry' : a.severity === 'warning' ? 'bg-sun' : a.severity === 'success' ? 'bg-sage' : 'bg-sky')} />
                <div className="min-w-0 flex-1 text-[13px]">
                  <span className="font-semibold">{a.actor}</span> <span className="text-ink-2">{tl(a.action).toLowerCase()}</span>
                  <div className="truncate text-xs text-ink-3">{a.target} · {relTime(a.at)}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <button onClick={() => nav('/admin/compliance')} className="mt-3 text-left text-sm font-semibold text-brand">{t('Open full audit log →', 'Vollständiges Audit-Log →')}</button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between"><h3 className="font-display text-lg font-semibold">{t('Recurring revenue by plan', 'Wiederkehrender Umsatz nach Tarif')}</h3><Badge tone="sage">+21% MoM</Badge></div>
          <div className="mt-4 h-[360px]">
            <ResponsiveContainer>
              <BarChart data={revenue} margin={{ left: -6 }}>
                <CartesianGrid vertical={false} stroke="rgb(var(--c-line))" strokeDasharray="3 3" />
                <XAxis dataKey="m" {...axis} />
                <YAxis {...axis} tickFormatter={(v) => `€${Math.round(v / 1000)}k`} />
                <Tooltip {...tip} formatter={(v: number) => euro(v, lang)} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Starter" stackId="a" fill="rgb(var(--c-sage))" />
                <Bar dataKey="Pro" stackId="a" fill="rgb(var(--c-brand))" />
                <Bar dataKey="Group" stackId="a" fill="rgb(var(--c-plum))" />
                <Bar dataKey="Partners" name={t('Insurer partners', 'Versicherungspartner')} stackId="a" fill="rgb(var(--c-coral))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold">{t('Active plans', 'Aktive Tarife')}</h3>
          <div className="relative mx-auto h-44 w-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={plansPie} dataKey="value" innerRadius={52} outerRadius={78} paddingAngle={3} stroke="none">
                  {plansPie.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center text-center"><div><div className="font-display text-2xl font-semibold">148</div><div className="text-[11px] text-ink-3">{t('clinics', 'Praxen')}</div></div></div>
          </div>
          <div className="mt-2 space-y-2">
            {PLANS.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full" style={{ background: pieColors[i] }} /><span className="flex-1">{p.id}</span><span className="text-ink-3">{p.clinics}</span><span className="w-20 text-right font-semibold">{euro(p.price * p.clinics, lang)}</span></div>
            ))}
          </div>
          <div className="mt-5 border-t border-line pt-4">
            <div className="mb-2 text-xs font-semibold text-ink-3">{t('Top cities (owners)', 'Top-Städte (Halter)')}</div>
            {cities.map(([c, n]) => (
              <div key={c} className="mb-1.5 flex items-center gap-2 text-xs"><span className="w-20">{c}</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-sky" style={{ width: `${(n / 5120) * 100}%` }} /></div><span className="w-10 text-right text-ink-3">{num(n, lang)}</span></div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* =================================================================== users */
function UsersView() {
  const { t, fmtDate, relTime } = useI18n()
  const s = useDemo()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'all' | Owner['status']>('all')
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState<Owner | null>(null)
  const per = 10
  const list = s.owners.filter((o) => (status === 'all' || o.status === status) && (o.name + o.email + o.city).toLowerCase().includes(q.toLowerCase()))
  const pages = Math.max(1, Math.ceil(list.length / per))
  const shown = list.slice(page * per, page * per + per)
  const stBadge = (st: Owner['status']) => st === 'active' ? <Badge tone="sage" dot>{t('Active', 'Aktiv')}</Badge> : st === 'suspended' ? <Badge tone="berry" dot>{t('Suspended', 'Gesperrt')}</Badge> : <Badge tone="sun" dot>{t('Deletion pending', 'Löschung läuft')}</Badge>
  return (
    <>
      <PageHeader title={t('Users & pets', 'Nutzer & Tiere')} sub={t('18,420 owners · showing a sample of 60 demo accounts', '18.420 Halter · Ausschnitt mit 60 Demo-Konten')} actions={<Button variant="outline" size="sm" icon={<Download size={15} />}>CSV</Button>} />
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="relative min-w-[240px] flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" /><input className="input pl-9" placeholder={t('Search name, e-mail, city…', 'Name, E-Mail, Stadt suchen…')} value={q} onChange={(e) => { setQ(e.target.value); setPage(0) }} /></div>
          <Segmented size="sm" value={status} onChange={(v) => { setStatus(v); setPage(0) }} options={[{ value: 'all', label: t('All', 'Alle') }, { value: 'active', label: t('Active', 'Aktiv') }, { value: 'suspended', label: t('Suspended', 'Gesperrt') }, { value: 'pending_deletion', label: t('Deletion', 'Löschung') }]} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead><tr className="border-b border-line text-left text-xs text-ink-3"><th className="px-5 py-3">{t('User', 'Nutzer')}</th><th className="px-3 py-3">{t('City', 'Stadt')}</th><th className="px-3 py-3">{t('Pets', 'Tiere')}</th><th className="px-3 py-3">{t('Platform', 'Plattform')}</th><th className="px-3 py-3">{t('Joined', 'Seit')}</th><th className="px-3 py-3">{t('Last active', 'Zuletzt aktiv')}</th><th className="px-3 py-3">Status</th><th /></tr></thead>
            <tbody>
              {shown.map((o) => (
                <tr key={o.id} className="border-b border-line/60 last:border-0 hover:bg-muted/40">
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><Initials name={o.name} hue={(o.name.charCodeAt(0) * 37) % 360} size={34} /><div><div className="font-semibold">{o.name}</div><div className="text-xs text-ink-3">{o.email}</div></div></div></td>
                  <td className="px-3 py-3 text-ink-2">{o.city}</td>
                  <td className="px-3 py-3">{o.pets}</td>
                  <td className="px-3 py-3"><Badge>{o.platform} · {o.lang.toUpperCase()}</Badge></td>
                  <td className="px-3 py-3 text-ink-2">{fmtDate(o.joined)}</td>
                  <td className="px-3 py-3 text-ink-2">{relTime(o.lastActive)}</td>
                  <td className="px-3 py-3">{stBadge(o.status)}</td>
                  <td className="px-5 py-3 text-right"><Button size="xs" variant="ghost" icon={<Eye size={14} />} onClick={() => setOpen(o)}>{t('View', 'Ansehen')}</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-ink-3">
          <span>{list.length} {t('results', 'Ergebnisse')}</span>
          <div className="flex items-center gap-2"><Button size="xs" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft size={14} /></Button><span>{page + 1} / {pages}</span><Button size="xs" variant="outline" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}><ChevronRight size={14} /></Button></div>
        </div>
      </div>
      <UserModal owner={open} onClose={() => setOpen(null)} />
    </>
  )
}

function UserModal({ owner, onClose }: { owner: Owner | null; onClose: () => void }) {
  const { t, fmtDate } = useI18n()
  const s = useDemo()
  const o = owner ? s.owners.find((x) => x.id === owner.id) ?? owner : null
  const pets = o ? s.pets.filter((p) => p.ownerId === o.id) : []
  const consents = s.consents.filter((c) => pets.some((p) => p.id === c.petId))
  return (
    <Modal open={!!owner} onClose={onClose} title={o?.name} width="max-w-xl"
      footer={o && <>{o.status === 'suspended' ? <Button variant="secondary" icon={<RotateCcw size={15} />} onClick={() => s.setOwnerStatus(o.id, 'active')}>{t('Reactivate', 'Reaktivieren')}</Button> : <Button variant="outline" className="!text-berry" icon={<Ban size={15} />} onClick={() => s.setOwnerStatus(o.id, 'suspended')}>{t('Suspend', 'Sperren')}</Button>}<Button onClick={onClose}>{t('Close', 'Schließen')}</Button></>}
    >
      {o && (
        <>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[[t('E-mail', 'E-Mail'), o.email], [t('City', 'Stadt'), o.city], [t('Joined', 'Seit'), fmtDate(o.joined)], [t('Platform', 'Plattform'), `${o.platform} · ${o.lang.toUpperCase()}`]].map(([l, v]) => <div key={l} className="rounded-xl bg-muted/60 p-3"><div className="text-xs text-ink-3">{l}</div><div className="truncate font-medium">{v}</div></div>)}
          </div>
          <div className="mt-5 text-sm font-semibold">{t('Pets', 'Tiere')}</div>
          {pets.length === 0 ? <div className="mt-2 text-sm text-ink-3">{t(`${o.pets} pets (details hidden in demo)`, `${o.pets} Tiere (Details in Demo ausgeblendet)`)}</div> : (
            <div className="mt-2 flex flex-wrap gap-2">{pets.map((p) => <div key={p.id} className="flex items-center gap-2 rounded-xl bg-muted/60 py-1.5 pl-1.5 pr-3 text-sm"><PetAvatar species={p.species} hue={p.hue} size={28} />{p.name}</div>)}</div>
          )}
          {consents.length > 0 && (
            <>
              <div className="mt-5 text-sm font-semibold">{t('Active sharing consents', 'Aktive Freigaben')}</div>
              <div className="mt-2 space-y-1.5">{consents.map((c) => <div key={c.id} className="flex items-center gap-2 text-sm">{c.active ? <Check size={15} className="text-sage" /> : <X size={15} className="text-ink-3" />}{pets.find((p) => p.id === c.petId)?.name} → {c.partyType === 'clinic' ? s.clinics.find((x) => x.id === c.partyId)?.short : s.insurers.find((x) => x.id === c.partyId)?.name}<span className="text-xs text-ink-3">({c.scope.length} {t('scopes', 'Bereiche')})</span></div>)}</div>
            </>
          )}
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-sky-soft p-3 text-xs text-sky"><Lock size={14} />{t('Admins see account metadata only. Health records stay private unless shared by the owner.', 'Admins sehen nur Konto-Metadaten. Gesundheitsakten bleiben privat, außer der Halter teilt sie.')}</div>
        </>
      )}
    </Modal>
  )
}

/* ================================================================= clinics */
function Clinics() {
  const { t, lang } = useI18n()
  const s = useDemo()
  const stages = [t('Invited', 'Eingeladen'), t('Verified', 'Verifiziert'), t('AVV signed', 'AVV unterzeichnet'), t('Live', 'Live')]
  const [cards, setCards] = useState([
    { n: 'Tierarztpraxis Sonnenallee', c: 'Berlin', st: 0, v: 3 }, { n: 'Kleintierpraxis Elbufer', c: 'Hamburg', st: 0, v: 2 }, { n: 'Tierklinik Isartal', c: 'München', st: 1, v: 8 },
    { n: 'Praxis Dr. Vogel', c: 'Köln', st: 1, v: 1 }, { n: 'Tierärzte am Rhein', c: 'Düsseldorf', st: 2, v: 4 }, { n: 'Vogel- & Exotenpraxis', c: 'Berlin', st: 0, v: 1 },
  ])
  const live = s.clinics.filter((c) => c.onVetly)
  return (
    <>
      <PageHeader title={t('Clinics', 'Praxen')} sub={t('Onboarding pipeline and live practices. Advance a clinic once verification (Approbation) and the AVV are complete.', 'Onboarding-Pipeline und aktive Praxen. Freigabe nach Prüfung der Approbation und unterzeichnetem AVV.')} actions={<Button icon={<SendHorizonal size={15} />}>{t('Invite clinic', 'Praxis einladen')}</Button>} />
      <div className="grid gap-4 lg:grid-cols-4">
        {stages.map((stg, si) => (
          <div key={stg} className="rounded-3xl bg-muted/50 p-3">
            <div className="mb-3 flex items-center justify-between px-2 pt-1"><span className="text-sm font-semibold">{stg}</span><Badge tone={si === 3 ? 'sage' : 'neutral'}>{si === 3 ? 148 : cards.filter((c) => c.st === si).length}</Badge></div>
            <div className="space-y-2.5">
              {(si === 3 ? live.map((c) => ({ n: c.name, c: c.city, st: 3, v: c.vets.length })) : cards.filter((c) => c.st === si)).map((c) => (
                <motion.div layout key={c.n} className="rounded-2xl bg-surface p-3.5 shadow-soft ring-1 ring-line/60">
                  <div className="text-sm font-semibold">{c.n}</div>
                  <div className="text-xs text-ink-3">{c.c} · {c.v} {t('vets', 'TÄ')}</div>
                  {si < 3 && <Button size="xs" variant="secondary" className="mt-2.5" iconRight={<ArrowUpRight size={13} />} onClick={() => { setCards(cards.map((x) => (x.n === c.n ? { ...x, st: x.st + 1 } : x))); s.toast({ title: `${c.n} → ${stages[si + 1]}` }) }}>{si === 2 ? t('Go live', 'Live schalten') : t('Advance', 'Weiter')}</Button>}
                  {si === 3 && <Badge tone="sage" dot className="mt-2">{t('Live', 'Live')}</Badge>}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="border-b border-line text-left text-xs text-ink-3"><th className="px-5 py-3">{t('Clinic', 'Praxis')}</th><th className="px-3 py-3">{t('Plan', 'Tarif')}</th><th className="px-3 py-3">PMS</th><th className="px-3 py-3">{t('Bookings / mo', 'Buchungen / Mon.')}</th><th className="px-3 py-3">{t('Rating', 'Bewertung')}</th><th className="px-3 py-3">{t('Response time', 'Antwortzeit')}</th></tr></thead>
          <tbody>
            {live.map((c, i) => (
              <tr key={c.id} className="border-b border-line/60 last:border-0">
                <td className="px-5 py-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: `hsl(${c.hue} 50% 45%)` }}>{c.short[0]}</span><div><div className="font-semibold">{c.name}</div><div className="text-xs text-ink-3">{c.district}, {c.city}</div></div></div></td>
                <td className="px-3 py-3"><Badge tone={c.plan === 'Group' ? 'plum' : c.plan === 'Pro' ? 'brand' : 'sage'}>{c.plan}</Badge></td>
                <td className="px-3 py-3 text-ink-2">{c.pms}</td>
                <td className="px-3 py-3 font-medium">{num([312, 1204, 189, 241][i] ?? 120, lang)}</td>
                <td className="px-3 py-3">★ {c.rating}</td>
                <td className="px-3 py-3 text-ink-2">{['38 min', '12 min', '1 h 10', '52 min'][i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* =================================================================== plans */
function Plans() {
  const { t, lang, fmtDate } = useI18n()
  const { revenue } = useSeries(lang)
  return (
    <>
      <PageHeader title={t('Plans & revenue', 'Tarife & Umsatz')} sub={t('The owner app is free. Clinics pay a monthly SaaS subscription; insurers pay a partner fee. Treatment payments are out of scope.', 'Die Halter-App ist kostenlos. Praxen zahlen ein monatliches SaaS-Abo, Versicherer eine Partnergebühr. Behandlungszahlungen sind nicht Teil des Umfangs.')} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="MRR" value={euro(MRR, lang)} delta={21} tone="plum" icon={<BadgeEuro size={18} />} />
        <StatCard label="ARR" value={euro(MRR * 12, lang)} delta={21} tone="brand" icon={<ArrowUpRight size={18} />} />
        <StatCard label={t('ARPA (clinic)', 'ARPA (Praxis)')} value={euro((MRR - PARTNER_MRR) / 148, lang)} delta={4} tone="sky" icon={<Building2 size={18} />} />
        <StatCard label={t('Logo churn (30 d)', 'Kündigungsrate (30 T)')} value="0.7%" delta={-0.3} invert tone="sage" icon={<Users size={18} />} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.id} className={cn('card relative overflow-hidden p-6', p.id === 'Pro' && 'ring-2 ring-brand')}>
            {p.id === 'Pro' && <span className="absolute right-4 top-4"><Badge tone="brand">{t('Most popular', 'Beliebteste')}</Badge></span>}
            <div className={`inline-grid h-11 w-11 place-items-center rounded-xl bg-${p.hue}-soft text-${p.hue}`}><CreditCard size={20} /></div>
            <div className="mt-3 font-display text-2xl font-semibold">{p.id}</div>
            <div className="mt-1"><span className="font-display text-3xl font-semibold">{euro(p.price, lang)}</span><span className="text-sm text-ink-3"> / {t('month', 'Monat')}</span></div>
            <ul className="mt-4 space-y-2">{p.features[lang].map((f) => <li key={f} className="flex items-center gap-2 text-sm text-ink-2"><Check size={15} className="text-brand" />{f}</li>)}</ul>
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-muted/60 p-3 text-sm"><span>{p.clinics} {t('clinics', 'Praxen')}</span><span className="font-semibold">{euro(p.price * p.clinics, lang)} MRR</span></div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold">{t('MRR trend', 'MRR-Verlauf')}</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <AreaChart data={revenue.map((r) => ({ m: r.m, mrr: r.Starter + r.Pro + r.Group + r.Partners }))}>
                <defs><linearGradient id="mrr" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgb(var(--c-plum))" stopOpacity={0.3} /><stop offset="100%" stopColor="rgb(var(--c-plum))" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid vertical={false} stroke="rgb(var(--c-line))" strokeDasharray="3 3" />
                <XAxis dataKey="m" {...axis} /><YAxis {...axis} tickFormatter={(v) => `€${Math.round(v / 1000)}k`} />
                <Tooltip {...tip} formatter={(v: number) => euro(v, lang)} />
                <Area type="monotone" dataKey="mrr" name="MRR" stroke="rgb(var(--c-plum))" strokeWidth={2.5} fill="url(#mrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold">{t('Recent invoices', 'Letzte Rechnungen')}</h3>
          <div className="mt-3 divide-y divide-line/70">
            {[['Kleintierklinik an der Spree', 'Group', 349, 'paid'], ['Tierarztpraxis Dr. Lehmann', 'Pro', 129, 'paid'], ['Tierarzt am Mauerpark', 'Starter', 49, 'paid'], ['Praxis Pfötchen Kreuzberg', 'Starter', 49, 'open'], ['Pfotenschutz Versicherung', 'Partner', 3200, 'paid']].map(([n, p, a, st], i) => (
              <div key={n as string} className="flex items-center gap-3 py-3 text-sm">
                <div className="min-w-0 flex-1"><div className="truncate font-medium">{n}</div><div className="text-xs text-ink-3">VET-2026-{String(1180 - i)} · {p} · {fmtDate(new Date(Date.now() - i * 86400000 * 2).toISOString().slice(0, 10))}</div></div>
                <span className="font-semibold">{euro(a as number, lang)}</span>
                {st === 'paid' ? <Badge tone="sage">{t('Paid', 'Bezahlt')}</Badge> : <Badge tone="sun">{t('Open', 'Offen')}</Badge>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ================================================================ insurers */
function Insurers() {
  const { t, fmtDate, lang } = useI18n()
  const s = useDemo()
  const steps = [t('Invited', 'Eingeladen'), t('Company verified', 'Firma verifiziert'), t('AVV & data contract', 'AVV & Datenvertrag'), t('Sandbox API', 'Sandbox-API'), t('Production', 'Produktion')]
  const consentCount = (id: string) => s.consents.filter((c) => c.partyType === 'insurer' && c.partyId === id && c.active).length
  return (
    <>
      <PageHeader title={t('Insurance partners', 'Versicherungspartner')} sub={t('Insurers are onboarded like clinics and only receive data that owners explicitly share, scoped and time-limited.', 'Versicherer werden wie Praxen ongeboardet und erhalten nur Daten, die Halter:innen ausdrücklich, begrenzt und befristet teilen.')} actions={<Button icon={<SendHorizonal size={15} />}>{t('Invite insurer', 'Versicherer einladen')}</Button>} />
      <div className="space-y-4">
        {s.insurers.map((i) => (
          <div key={i.id} className="card p-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: `hsl(${i.hue} 50% 45%)` }}><Umbrella size={22} /></span>
              <div className="flex-1"><div className="font-display text-lg font-semibold">{i.name}</div><div className="text-xs text-ink-3">{t('since', 'seit')} {fmtDate(i.since)} · {num(i.policies, lang)} {t('linked policies', 'verknüpfte Policen')} · {consentCount(i.id)} {t('consented pets (demo)', 'freigegebene Tiere (Demo)')}</div></div>
              <Badge tone={i.status === 'live' ? 'sage' : i.status === 'onboarding' ? 'sun' : 'neutral'} dot>{i.status === 'live' ? 'Live' : i.status === 'onboarding' ? 'Onboarding' : t('Invited', 'Eingeladen')}</Badge>
              {i.step < 5 && <Button size="sm" variant="secondary" onClick={() => s.advanceInsurer(i.id)}>{t('Advance step', 'Nächster Schritt')}</Button>}
            </div>
            <div className="mt-5 grid grid-cols-5 gap-2">
              {steps.map((st, k) => (
                <div key={st}>
                  <div className={cn('h-1.5 rounded-full', k < i.step ? 'bg-brand' : 'bg-line')} />
                  <div className={cn('mt-2 flex items-center gap-1 text-xs', k < i.step ? 'font-semibold text-ink' : 'text-ink-3')}>{k < i.step && <CheckCircle2 size={13} className="text-brand" />}{st}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ================================================================ bookings */
function Bookings() {
  const { t, tl, fmtDate, relTime, lang } = useI18n()
  const s = useDemo()
  const list = [...s.bookings].sort((a, b) => b.createdAt - a.createdAt)
  const funnel = [[t('Requested', 'Angefragt'), 9120], [t('Confirmed', 'Bestätigt'), 8730], [t('Attended', 'Wahrgenommen'), 8460], [t('No-show', 'No-Show'), 270]] as const
  return (
    <>
      <PageHeader title={t('Bookings', 'Buchungen')} sub={t('Platform-wide booking flow (30 days) and the live request stream.', 'Plattformweiter Buchungsfluss (30 Tage) und Live-Anfragen.')} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {funnel.map(([l, v], i) => (
          <div key={l} className="card p-5">
            <div className="text-sm text-ink-2">{l}</div>
            <div className="mt-1 font-display text-3xl font-semibold">{num(v, lang)}</div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><motion.div initial={{ width: 0 }} animate={{ width: `${(v / 9120) * 100}%` }} transition={{ duration: 1, delay: i * 0.1 }} className={cn('h-full rounded-full', i === 3 ? 'bg-berry' : 'bg-brand')} /></div>
            <div className="mt-1.5 text-xs text-ink-3">{((v / 9120) * 100).toFixed(1)}%</div>
          </div>
        ))}
      </div>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="border-b border-line text-left text-xs text-ink-3"><th className="px-5 py-3">{t('Pet', 'Tier')}</th><th className="px-3 py-3">{t('Clinic', 'Praxis')}</th><th className="px-3 py-3">{t('Service', 'Leistung')}</th><th className="px-3 py-3">{t('Slot', 'Termin')}</th><th className="px-3 py-3">{t('Created', 'Erstellt')}</th><th className="px-3 py-3">Status</th></tr></thead>
          <tbody>
            {list.map((b) => {
              const p = s.pets.find((x) => x.id === b.petId)!
              const c = s.clinics.find((x) => x.id === b.clinicId)!
              const sv = c.services.find((x) => x.id === b.serviceId)
              const tone: Tone = b.status === 'confirmed' ? 'sage' : b.status === 'pending' ? 'coral' : b.status === 'proposed' ? 'sun' : b.status === 'noshow' || b.status === 'declined' ? 'berry' : 'neutral'
              return (
                <tr key={b.id} className="border-b border-line/60 last:border-0">
                  <td className="px-5 py-3"><div className="flex items-center gap-2.5"><PetAvatar species={p.species} hue={p.hue} size={30} /><span className="font-medium">{p.name}</span></div></td>
                  <td className="px-3 py-3 text-ink-2">{c.short}</td>
                  <td className="px-3 py-3 text-ink-2">{sv ? tl(sv.name) : ''}</td>
                  <td className="px-3 py-3">{fmtDate(b.date, { day: 'numeric', month: 'short' })} · {b.time}</td>
                  <td className="px-3 py-3 text-ink-3">{relTime(b.createdAt)}</td>
                  <td className="px-3 py-3"><Badge tone={tone} dot>{b.status}</Badge></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* =============================================================== campaigns */
function Campaigns() {
  const { t, lang } = useI18n()
  const s = useDemo()
  const [seg, setSeg] = useState('dogs')
  const [title, setTitle] = useState(t('Tick season is here 🕷️', 'Die Zeckensaison ist da 🕷️'))
  const [body, setBody] = useState(t('Check your dog’s flea & tick protection, set a reminder in 10 seconds.', 'Prüfen Sie den Floh- & Zeckenschutz Ihres Hundes. Erinnerung in 10 Sekunden einrichten.'))
  const segments = [['all', t('All owners', 'Alle Halter'), 18420], ['dogs', t('Dog owners', 'Hundehalter'), 11030], ['cats', t('Cat owners', 'Katzenhalter'), 7210], ['inactive', t('Inactive 30 d+', 'Inaktiv 30 T+'), 3190]] as const
  const reach = segments.find((x) => x[0] === seg)?.[2] ?? 0
  return (
    <>
      <PageHeader title={t('Notifications & campaigns', 'Mitteilungen & Kampagnen')} sub={t('Educational pushes bring owners back. Respects opt-ins and quiet hours. Never advertising.', 'Informative Pushes holen Halter zurück. Beachtet Opt-ins und Ruhezeiten. Niemals Werbung.')} />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="card p-6">
          <label className="label">{t('Audience', 'Zielgruppe')}</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {segments.map(([k, l, n]) => (
              <button key={k} onClick={() => setSeg(k)} className={cn('rounded-2xl border-2 p-3 text-left', seg === k ? 'border-brand bg-brand-soft/40' : 'border-line')}>
                <div className="text-sm font-semibold">{l}</div><div className="text-xs text-ink-3">{num(n, lang)}</div>
              </button>
            ))}
          </div>
          <label className="label mt-4">{t('Title', 'Titel')}</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="label mt-4">{t('Message', 'Nachricht')}</label>
          <textarea className="input min-h-[90px]" value={body} onChange={(e) => setBody(e.target.value)} />
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-ink-2">{t('Estimated reach', 'Geschätzte Reichweite')}: <b>{num(Math.round(reach * 0.82), lang)}</b> ({t('opted in', 'mit Opt-in')})</span>
            <div className="flex gap-2"><Button variant="outline">{t('Schedule', 'Planen')}</Button><Button icon={<SendHorizonal size={15} />} onClick={() => s.toast({ title: t('Campaign scheduled ✓', 'Kampagne geplant ✓'), body: t('Delivered in waves respecting quiet hours.', 'Zustellung in Wellen unter Beachtung der Ruhezeiten.') })}>{t('Send', 'Senden')}</Button></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="card grid place-items-center bg-gradient-to-br from-coral-soft to-muted/40 p-6">
            <div className="w-full max-w-sm rounded-[22px] bg-surface/90 p-3.5 shadow-float ring-1 ring-black/5">
              <div className="flex items-start gap-3"><span className="grid h-9 w-9 place-items-center rounded-[10px] bg-brand text-sm font-bold text-brand-fg">V</span><div className="flex-1"><div className="flex justify-between text-[11px] text-ink-3"><span className="font-semibold">VETLY</span>{t('now', 'jetzt')}</div><div className="text-[13.5px] font-semibold">{title}</div><div className="text-[12.5px] text-ink-2">{body}</div></div></div>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold">{t('Recent campaigns', 'Letzte Kampagnen')}</h3>
            {[[t('Spring vaccination check', 'Frühjahrs-Impfcheck'), '41%', '12.4k'], [t('Hot weather warning ☀️', 'Hitzewarnung ☀️'), '38%', '17.9k'], [t('New: share with a new vet', 'Neu: Akte mit neuer Praxis teilen'), '29%', '18.1k']].map(([n, o, r]) => (
              <div key={n} className="flex items-center justify-between border-b border-line/60 py-3 text-sm last:border-0"><span className="font-medium">{n}</span><span className="text-ink-3">{r} · <b className="text-sage">{o} {t('opened', 'geöffnet')}</b></span></div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ============================================================== compliance */
function Compliance() {
  const { t, tl, relTime, fmtTime } = useI18n()
  const s = useDemo()
  const [filter, setFilter] = useState<'all' | AuditEntry['actorRole']>('all')
  const log = s.audit.filter((a) => filter === 'all' || a.actorRole === filter)
  return (
    <>
      <PageHeader title={t('GDPR & audit log', 'DSGVO & Audit-Log')} sub={t('Every data subject request and every record access, traceable. Requests from the owner app appear here instantly.', 'Jede Betroffenenanfrage und jeder Aktenzugriff nachvollziehbar. Anfragen aus der Halter-App erscheinen hier sofort.')} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('Open GDPR requests', 'Offene DSGVO-Anfragen')} value={s.gdpr.filter((g) => g.status !== 'completed').length} tone="sun" icon={<FileLock2 size={18} />} hint={t('SLA: 30 days · avg 1.4 d', 'Frist: 30 Tage · Ø 1,4 T')} />
        <StatCard label={t('Active consents', 'Aktive Einwilligungen')} value={num(31470)} tone="sage" icon={<UserCheck size={18} />} hint={t('clinic & insurer sharing', 'Praxis- & Versicherer-Freigaben')} />
        <StatCard label={t('Data region', 'Datenregion')} value="EU" tone="brand" icon={<Server size={18} />} hint="eu-central-1 · Frankfurt" />
        <StatCard label={t('Encryption', 'Verschlüsselung')} value="AES-256" tone="plum" icon={<Lock size={18} />} hint="TLS 1.3 in transit" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.5fr]">
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold">{t('Data subject requests', 'Betroffenenanfragen')}</h3>
          <div className="mt-3 space-y-2.5">
            {s.gdpr.map((g) => (
              <motion.div layout key={g.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 rounded-2xl border border-line/70 p-3">
                <span className={cn('grid h-10 w-10 place-items-center rounded-xl', g.type === 'delete' ? 'bg-berry-soft text-berry' : 'bg-sky-soft text-sky')}>{g.type === 'delete' ? <X size={18} /> : <Download size={18} />}</span>
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{g.ownerName}</div><div className="text-xs text-ink-3">{g.type === 'delete' ? t('Erasure · Art. 17', 'Löschung · Art. 17') : t('Export · Art. 20', 'Export · Art. 20')} · {relTime(g.at)}</div></div>
                {g.status === 'completed' ? <Badge tone="sage">{t('Done', 'Erledigt')}</Badge> : <Button size="xs" variant={g.status === 'received' ? 'primary' : 'secondary'} onClick={() => s.processGdpr(g.id)}>{g.status === 'received' ? t('Start', 'Starten') : t('Complete', 'Abschließen')}</Button>}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
            <h3 className="font-display text-lg font-semibold">{t('Audit log', 'Audit-Log')}</h3>
            <Segmented size="sm" value={filter} onChange={setFilter} options={[{ value: 'all', label: t('All', 'Alle') }, { value: 'owner', label: t('Owners', 'Halter') }, { value: 'clinic', label: t('Clinics', 'Praxen') }, { value: 'insurer', label: t('Insurers', 'Versicherer') }, { value: 'system', label: 'System' }]} />
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            <table className="w-full text-sm">
              <tbody>
                {log.map((a) => (
                  <motion.tr layout key={a.id} initial={{ backgroundColor: 'rgb(var(--c-sun-soft))' }} animate={{ backgroundColor: 'rgba(0,0,0,0)' }} transition={{ duration: 2 }} className="border-b border-line/60 last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-3">{fmtTime(a.at)}<div>{relTime(a.at)}</div></td>
                    <td className="px-3 py-3"><Badge tone={roleTone[a.actorRole]}>{a.actorRole}</Badge></td>
                    <td className="px-3 py-3"><div className="font-medium">{a.actor}</div><div className="text-xs text-ink-2">{tl(a.action)} · <span className="text-ink-3">{a.target}</span></div></td>
                    <td className="px-4 py-3 text-right"><Badge tone={sevTone[a.severity]} dot>{a.severity}</Badge></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

/* =================================================================== roles */
function Roles() {
  const { t } = useI18n()
  const roles = [t('Super admin', 'Super-Admin'), t('Support', 'Support'), t('Clinic admin', 'Praxis-Admin'), t('Vet', 'Tierarzt'), t('Reception', 'Empfang'), t('Insurer', 'Versicherer'), t('Owner', 'Halter')]
  const perms: [string, number[]][] = [
    [t('View own pets & records', 'Eigene Tiere & Akten sehen'), [0, 0, 0, 0, 0, 0, 1]],
    [t('View shared patient records', 'Freigegebene Patientenakten sehen'), [0, 0, 1, 1, 2, 2, 0]],
    [t('Accept / reschedule bookings', 'Buchungen annehmen / verschieben'), [0, 0, 1, 1, 1, 0, 0]],
    [t('Chat with owners', 'Mit Haltern chatten'), [0, 2, 1, 1, 1, 0, 1]],
    [t('Manage clinic hours & services', 'Zeiten & Leistungen verwalten'), [0, 0, 1, 0, 0, 0, 0]],
    [t('Manage users & suspend accounts', 'Nutzer verwalten & sperren'), [1, 2, 0, 0, 0, 0, 0]],
    [t('Process GDPR requests', 'DSGVO-Anfragen bearbeiten'), [1, 1, 0, 0, 0, 0, 0]],
    [t('View revenue & plans', 'Umsatz & Tarife sehen'), [1, 0, 2, 0, 0, 0, 0]],
    [t('Access insurer API', 'Versicherer-API nutzen'), [0, 0, 0, 0, 0, 1, 0]],
  ]
  return (
    <>
      <PageHeader title={t('Roles & permissions', 'Rollen & Rechte')} sub={t('Enforced in the database with row-level security, not just in the UI. Admins never see health records by default.', 'In der Datenbank per Row-Level-Security durchgesetzt, nicht nur in der Oberfläche. Admins sehen standardmäßig keine Gesundheitsakten.')} />
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead><tr className="border-b border-line"><th className="px-5 py-4 text-left text-xs text-ink-3">{t('Permission', 'Berechtigung')}</th>{roles.map((r) => <th key={r} className="px-2 py-4 text-center text-xs font-semibold">{r}</th>)}</tr></thead>
          <tbody>
            {perms.map(([p, v]) => (
              <tr key={p} className="border-b border-line/60 last:border-0">
                <td className="px-5 py-3 font-medium">{p}</td>
                {v.map((x, i) => <td key={i} className="px-2 py-3 text-center">{x === 1 ? <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-brand text-brand-fg"><Check size={13} strokeWidth={3} /></span> : x === 2 ? <span title={t('With owner consent / scoped', 'Mit Einwilligung / begrenzt')} className="inline-grid h-6 w-6 place-items-center rounded-full bg-sun-soft text-sun"><Lock size={12} /></span> : <span className="text-ink-3/50">—</span>}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-5 border-t border-line px-5 py-3 text-xs text-ink-3">
          <span className="flex items-center gap-1.5"><span className="inline-grid h-4 w-4 place-items-center rounded-full bg-brand text-brand-fg"><Check size={9} strokeWidth={3} /></span>{t('Allowed', 'Erlaubt')}</span>
          <span className="flex items-center gap-1.5"><span className="inline-grid h-4 w-4 place-items-center rounded-full bg-sun-soft text-sun"><Lock size={9} /></span>{t('Only with consent / limited scope', 'Nur mit Einwilligung / begrenzt')}</span>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[[ShieldCheck, t('2FA enforced', '2FA verpflichtend'), t('for admins, clinic and insurer accounts', 'für Admin-, Praxis- und Versichererkonten')], [KeyRound, 'SSO', t('Google Workspace / Microsoft for Group clinics', 'Google Workspace / Microsoft für Group-Praxen')], [Eye, t('Break-glass access', 'Notfallzugriff'), t('time-boxed, dual approval, fully logged', 'befristet, Vier-Augen-Prinzip, protokolliert')]].map(([I, l, d]) => {
          const Icon = I as typeof Eye
          return <div key={l as string} className="card flex items-start gap-3 p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-plum-soft text-plum"><Icon size={18} /></span><div><div className="font-semibold">{l as string}</div><div className="text-sm text-ink-3">{d as string}</div></div></div>
        })}
      </div>
    </>
  )
}

/* ================================================================== system */
function SystemHealth() {
  const { t } = useI18n()
  const r = seeded(3)
  const latency = Array.from({ length: 48 }, (_, i) => ({ h: i, p50: 38 + Math.round(r() * 12), p95: 110 + Math.round(r() * 60) + (i === 31 ? 140 : 0) }))
  const services = [[Database, 'Postgres (Supabase)', '99.99%', 'eu-central-1'], [KeyRound, t('Auth', 'Authentifizierung'), '100%', 'eu-central-1'], [HardDrive, t('Storage (documents)', 'Speicher (Dokumente)'), '99.99%', 'eu-central-1'], [Zap, 'Push (APNs / FCM)', '99.2%', 'global'], [Cpu, 'Edge functions', '99.97%', 'eu-central-1'], [Gauge, t('Realtime', 'Echtzeit'), '99.98%', 'eu-central-1']] as const
  return (
    <>
      <PageHeader title={t('System health', 'Systemstatus')} sub={t('Uptime, latency and delivery across the EU-hosted stack.', 'Verfügbarkeit, Latenz und Zustellung im EU-gehosteten Stack.')} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('Uptime (90 d)', 'Verfügbarkeit (90 T)')} value="99.98%" tone="sage" icon={<Activity size={18} />} />
        <StatCard label="API p95" value="142 ms" tone="sky" icon={<Gauge size={18} />} delta={-8} invert />
        <StatCard label={t('Error rate', 'Fehlerrate')} value="0.04%" tone="brand" icon={<Cpu size={18} />} />
        <StatCard label={t('Last backup', 'Letztes Backup')} value="02:00" tone="plum" icon={<Database size={18} />} hint={t('encrypted · PITR 30 d', 'verschlüsselt · PITR 30 T')} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold">{t('API latency (48 h)', 'API-Latenz (48 Std.)')}</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <AreaChart data={latency}>
                <CartesianGrid vertical={false} stroke="rgb(var(--c-line))" strokeDasharray="3 3" />
                <XAxis dataKey="h" {...axis} tickFormatter={(v) => `${v}h`} interval={7} /><YAxis {...axis} unit="ms" />
                <Tooltip {...tip} />
                <Area type="monotone" dataKey="p95" stroke="rgb(var(--c-coral))" fill="rgb(var(--c-coral) / 0.12)" strokeWidth={2} />
                <Area type="monotone" dataKey="p50" stroke="rgb(var(--c-brand))" fill="rgb(var(--c-brand) / 0.12)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold">{t('Services', 'Dienste')}</h3>
          <div className="mt-3 divide-y divide-line/70">
            {services.map(([I, n, u, reg]) => (
              <div key={n} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-ink-2"><I size={17} /></span>
                <div className="flex-1"><div className="text-sm font-semibold">{n}</div><div className="text-xs text-ink-3">{reg}</div></div>
                <span className="text-xs text-ink-3">{u}</span>
                <span className="h-2.5 w-2.5 rounded-full bg-sage" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card mt-6 p-6">
        <h3 className="font-display text-lg font-semibold">{t('Uptime, last 90 days', 'Verfügbarkeit, letzte 90 Tage')}</h3>
        <div className="mt-4 flex gap-[3px]">{Array.from({ length: 90 }, (_, i) => <div key={i} title={`Day ${i + 1}`} className={cn('h-9 flex-1 rounded-sm', i === 61 ? 'bg-sun' : 'bg-sage/80')} />)}</div>
        <div className="mt-2 flex justify-between text-xs text-ink-3"><span>90 {t('days ago', 'Tage')}</span><span>{t('1 minor incident: push delay (18 min)', '1 kleiner Vorfall: Push-Verzögerung (18 Min.)')}</span><span>{t('Today', 'Heute')}</span></div>
      </div>
    </>
  )
}

